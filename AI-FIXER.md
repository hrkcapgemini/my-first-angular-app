# AI Fixer for SonarQube Issues

This repository includes an automated GitHub Actions step that:

- Runs SonarQube analysis
- Fetches open issues from SonarQube
- Calls an AI model to generate a unified diff patch
- Applies the patch, pushes a branch, and opens a Pull Request

Required repository secrets:

- `SONAR_HOST_URL` - SonarQube server URL (e.g. https://sonarqube.example.com)
- `SONAR_TOKEN` - SonarQube user token with API access
- `OPENAI_API_KEY` - OpenAI API key (or compatible endpoint key)
- `GITHUB_TOKEN` - already provided by Actions by default
- `SONAR_PROJECT_KEY` (optional) - Sonar project key; defaults to `owner/repo`

Notes and safety:

- The AI is asked to return only a unified diff patch. Review PRs before merging.
- The script limits to the first 20 SonarQube issues to keep changes small.
- Adjust `scripts/sonar-to-ai-fixes.js` to change the AI prompt or limits.
