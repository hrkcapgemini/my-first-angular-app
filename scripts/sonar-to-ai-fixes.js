const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');

async function fetchSonarIssues(host, token, projectKey) {
  const issues = [];
  try {
    const url = `${host.replace(/\/$/, '')}/api/issues/search`;
    const resp = await axios.get(url, {
      params: {
        componentKeys: projectKey,
        resolved: false,
        ps: 500
      },
      headers: {
        Authorization: `Basic ${Buffer.from(token + ':').toString('base64')}`
      }
    });
    if (resp.data && resp.data.issues) {
      return resp.data.issues;
    }
  } catch (err) {
    console.error('Failed to fetch SonarQube issues:', err.message);
  }
  return issues;
}

async function callOpenAI(apiKey, prompt) {
  const url = 'https://api.openai.com/v1/chat/completions';
  try {
    const resp = await axios.post(url, {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an assistant that outputs a git unified diff patch only. Do not include any explanation.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 3000
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (resp.data && resp.data.choices && resp.data.choices[0]) {
      return resp.data.choices[0].message.content;
    }
  } catch (err) {
    console.error('OpenAI call failed:', err.response ? err.response.data : err.message);
  }
  return null;
}

function extractPatch(text) {
  if (!text) return null;
  // Attempt to find triple-backtick fenced diff first
  const fenceMatch = text.match(/```(?:diff)?\n([\s\S]*?)\n```/);
  if (fenceMatch) return fenceMatch[1];
  // Otherwise, try to find a unified diff starting with "diff --git"
  const diffStart = text.indexOf('diff --git');
  if (diffStart !== -1) {
    return text.slice(diffStart);
  }
  // Or a patch starting with @@ or --- a/ style
  if (text.trim().startsWith('@@') || text.trim().startsWith('---')) return text;
  return null;
}

async function main() {
  const SONAR_HOST_URL = process.env.SONAR_HOST_URL;
  const SONAR_TOKEN = process.env.SONAR_TOKEN;
  const SONAR_PROJECT_KEY = process.env.SONAR_PROJECT_KEY || process.env.GITHUB_REPOSITORY;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!SONAR_HOST_URL || !SONAR_TOKEN || !OPENAI_API_KEY) {
    console.error('Required envs: SONAR_HOST_URL, SONAR_TOKEN, OPENAI_API_KEY');
    fs.writeFileSync('.ai-fixer-result', 'false');
    process.exit(0);
  }

  const issues = await fetchSonarIssues(SONAR_HOST_URL, SONAR_TOKEN, SONAR_PROJECT_KEY);
  if (!issues || issues.length === 0) {
    console.log('No open SonarQube issues found.');
    fs.writeFileSync('.ai-fixer-result', 'false');
    return;
  }

  const limited = issues.slice(0, 20);
  const summary = limited.map((it, i) => `#${i+1} file:${it.component} line:${it.line || 'N/A'} type:${it.type} rule:${it.rule} msg:${it.message}`).join('\n');

  const prompt = `Repository files available. SonarQube reported the following issues:\n\n${summary}\n\nFor each issue, generate concrete code changes to fix the problem. Output ONLY a single unified diff patch suitable for applying with \`git apply\` (do not include explanations). Keep changes minimal and safe. If an issue cannot be fixed automatically, do not change that file. Limit to modifications to existing files, not adding new dependencies. Ensure patch is valid unified diff.`;

  console.log('Calling OpenAI to generate patch...');
  const aiResp = await callOpenAI(OPENAI_API_KEY, prompt);
  const patch = extractPatch(aiResp);
  if (!patch) {
    console.error('No patch produced by AI.');
    fs.writeFileSync('.ai-fixer-result', 'false');
    return;
  }

  fs.writeFileSync('ai-fix.patch', patch);
  try {
    const branch = `ai/sonar-fixes-${Date.now()}`;
    execSync('git config user.email "action@github.com"');
    execSync('git config user.name "GitHub Action"');
    execSync(`git checkout -b ${branch}`);
    // Try applying the patch
    execSync('git apply --index ai-fix.patch');
    execSync('git add -A');
    execSync('git commit -m "chore: AI fixes for SonarQube issues"');
    execSync(`git push origin ${branch}`);
    console.log('Patch applied and pushed to branch', branch);
    fs.writeFileSync('.ai-fixer-result', 'true');
  } catch (err) {
    console.error('Failed to apply or push patch:', err.message);
    fs.writeFileSync('.ai-fixer-result', 'false');
  }
}

main();
