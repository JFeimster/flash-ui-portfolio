# Run from the unzipped project root in PowerShell after installing/authenticating GitHub CLI.
# This script performs an external state change; only run if you intend to create the repository.
$ErrorActionPreference = 'Stop'
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI (gh) not found. Install from https://cli.github.com/ and run gh auth login.' }
gh auth status
if ($LASTEXITCODE -ne 0) { throw 'Authenticate with gh auth login.' }
if (-not (Test-Path 'index.html')) { throw 'Open PowerShell in the funding-agency-blueprint folder first.' }
if (-not (Test-Path '.git')) { git init -b main; if ($LASTEXITCODE -ne 0) { throw 'git init failed' } }
git add .
git commit -m "feat: launch Funding Agency Blueprint editorial site and three design variations"
if ($LASTEXITCODE -ne 0) { throw 'git commit failed; inspect git status' }
# Visibility explicitly defaults to private; change to --public only when you intend to expose all content.
gh repo create JFeimster/funding-agency-blueprint --private --source . --remote origin --push
if ($LASTEXITCODE -ne 0) { throw 'GitHub repository create/push failed; inspect gh output and do not rerun blindly.' }
Write-Host 'Repository: https://github.com/JFeimster/funding-agency-blueprint'
