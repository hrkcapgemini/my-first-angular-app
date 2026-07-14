#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = process.cwd();
const sonarHost = process.env.SONAR_HOST_URL;
const sonarToken = process.env.SONAR_TOKEN;
const openaiApiKey = process.env.OPENAI_API_KEY;
const githubToken = process.env.GITHUB_TOKEN;
const projectKey = process.env.SONAR_PROJECT_KEY || getProjectKeyFromProperties();
const outputFile = path.join(repoRoot, 'ai-sonarqube-agent-output.json');
const branchName = `ai-sonarqube-fixes-${Date.now()}`;

function setActionOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${String(value)}\n`);
  }
}

function fatal(message) {
  console.error(message);
  setActionOutput('changed', false);
  setActionOutput('branch', '');
  setActionOutput('error', message);
  writeOutput({ changed: false, branch: null, error: message });
  process.exit(1);
}

function getProjectKeyFromProperties() {
  const propsPath = path.join(repoRoot, 'sonar-project.properties');
  if (!fs.existsSync(propsPath)) return null;
  const properties = fs.readFileSync(propsPath, 'utf8');
  const match = properties.match(/^sonar\.projectKey\s*=\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

function writeOutput(result) {
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    fatal(`SonarQube request failed (${response.status}): ${text}`);
  }
  return response.json();
}

function toRelativePath(component) {
  const parts = component.split(':');
  const pathPart = parts.length > 1 ? parts.slice(1).join(':') : component;
  return pathPart.replace(/^\//, '');
}

async function getSonarIssues() {
  const url = new URL('/api/issues/search', sonarHost.replace(/\/$/, ''));
  const params = {
    componentKeys: projectKey,
    resolved: 'false',
    ps: '100',
    severities: 'BLOCKER,CRITICAL,MAJOR,MINOR',
    types: 'BUG,VULNERABILITY,CODE_SMELL',
  };

  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const authHeader = `Basic ${Buffer.from(`${sonarToken}:`).toString('base64')}`;
  return fetchJson(url.toString(), {
    headers: {
      Authorization: authHeader,
      Accept: 'application/json',
    },
  });
}

function selectRelevantIssues(rawIssues) {
  return rawIssues
    .filter((issue) => issue.component)
    .map((issue) => ({
      key: issue.key,
      rule: issue.rule,
      severity: issue.severity,
      type: issue.type,
      message: issue.message,
      component: issue.component,
      line: issue.line || null,
      filePath: toRelativePath(issue.component),
    }))
    .filter((issue) => fs.existsSync(path.join(repoRoot, issue.filePath)));
}

function buildPrompt(issues, files) {
  const issueSummary = issues
    .map((issue) => {
      const line = issue.line ? ` line ${issue.line}` : '';
      return `- ${issue.filePath}${line}: [${issue.severity}] ${issue.type} ${issue.rule} — ${issue.message}`;
    })
    .join('\n');

  const fileBlocks = files
    .map((file) => {
      const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
      return `FILE: ${file}\n---\n${content}`;
    })
    .join('\n\n');

  return [
    {
      role: 'system',
      content: `You are an expert TypeScript and Angular code assistant. You will produce a unified diff patch that fixes the SonarQube issues listed below. Only modify the repository files listed in the issue set. Do not write explanations or analysis. If no automatic fixes are available, respond with exactly NO_CHANGES.`,
    },
    {
      role: 'user',
      content: `Repository root: ${repoRoot}\nSonarQube project: ${projectKey}\nIssues:\n${issueSummary}\n\nFiles and current contents:\n${fileBlocks}\n\nProduce one valid Git patch in unified diff format. Do not wrap the patch in markdown fences. If you cannot safely apply fixes, respond with NO_CHANGES.`,
    },
  ];
}

async function requestPatch(promptMessages) {
  const payload = {
    model: 'gpt-4.1-mini',
    messages: promptMessages,
    temperature: 0.1,
    max_tokens: 1400,
  };

  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!openaiResponse.ok) {
    const text = await openaiResponse.text();
    fatal(`OpenAI request failed (${openaiResponse.status}): ${text}`);
  }

  const json = await openaiResponse.json();
  const content = json.choices?.[0]?.message?.content ?? '';
  if (!content) {
    fatal('OpenAI returned an empty response.');
  }
  return content;
}

function extractPatch(text) {
  const cleaned = text.trim();
  if (cleaned === 'NO_CHANGES') return null;
  const diffIndex = cleaned.indexOf('diff --git');
  if (diffIndex >= 0) {
    return cleaned.slice(diffIndex).trim();
  }

  const unifiedMatch = cleaned.match(/^(---\s+.*?\+\+\+\s+.*?\n[\s\S]*)$/m);
  return unifiedMatch ? unifiedMatch[1].trim() : null;
}

function applyPatch(patch) {
  try {
    execSync('git apply --whitespace=fix --directory=. -', {
      stdio: ['pipe', 'inherit', 'inherit'],
      input: patch,
    });
  } catch (error) {
    fatal(`Failed to apply patch from AI: ${error.message}`);
  }
}

function ensureGitUser() {
  execSync('git config user.name "github-actions[bot]"');
  execSync('git config user.email "github-actions[bot]@users.noreply.github.com"');
}

function commitChanges() {
  execSync('git add -A', { stdio: 'inherit' });
  const status = execSync('git status --porcelain', { stdio: 'pipe', encoding: 'utf8' });
  if (!status.trim()) {
    return false;
  }
  execSync('git commit -m "chore: AI-generated SonarQube fixes"', { stdio: 'inherit' });
  return true;
}

async function main() {
  if (!sonarHost || !sonarToken || !openaiApiKey || !githubToken || !projectKey) {
    fatal('Missing required environment variables. Please set SONAR_HOST_URL, SONAR_TOKEN, OPENAI_API_KEY, GITHUB_TOKEN, and ensure sonar.projectKey is configured.');
  }

  console.log('Fetching SonarQube issues for project', projectKey);
  const issueResponse = await getSonarIssues();
  const issues = selectRelevantIssues(issueResponse.issues || []);

  if (!issues.length) {
    console.log('No applicable SonarQube issues found.');
    setActionOutput('changed', false);
    setActionOutput('branch', '');
    writeOutput({ changed: false, branch: null, issueCount: 0 });
    process.exit(0);
  }

  const uniqueFiles = [...new Set(issues.map((issue) => issue.filePath))];
  console.log(`Found ${issues.length} issue(s) in ${uniqueFiles.length} file(s).`);

  execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
  ensureGitUser();

  const prompt = buildPrompt(issues, uniqueFiles);
  const aiResponse = await requestPatch(prompt);
  const patch = extractPatch(aiResponse);

  if (!patch) {
    console.log('AI did not produce an automatic patch.');
    setActionOutput('changed', false);
    setActionOutput('branch', '');
    writeOutput({ changed: false, branch: null, issueCount: issues.length, aiResponse });
    process.exit(0);
  }

  console.log('Applying AI-generated patch...');
  applyPatch(patch);

  const committed = commitChanges();
  if (!committed) {
    console.log('No actual file changes were staged after applying patch.');
    setActionOutput('changed', false);
    setActionOutput('branch', '');
    writeOutput({ changed: false, branch: null, issueCount: issues.length, aiResponse, patchPreview: patch.slice(0, 300) });
    process.exit(0);
  }

  console.log(`Created new branch ${branchName} with AI fixes.`);
  setActionOutput('changed', true);
  setActionOutput('branch', branchName);
  writeOutput({ changed: true, branch: branchName, issueCount: issues.length, patchPreview: patch.slice(0, 300) });
}

main().catch((error) => fatal(error instanceof Error ? error.message : String(error)));
