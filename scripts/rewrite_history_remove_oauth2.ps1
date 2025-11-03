# Backup and history rewrite script
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)
# Move to repo root
Set-Location ..

$ts = Get-Date -Format yyyyMMddHHmmss
$backup = Join-Path '..' ("secure-gemini-backup-" + $ts)
Write-Host "Backing up working repository to: $backup"
Copy-Item -Path . -Destination $backup -Recurse -Force

Write-Host "Removing path from history using git filter-branch (this can be slow)..."
# Use index-filter to remove the specific file from every commit
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch 'node_modules/@google/gemini-cli-core/dist/src/code_assist/oauth2.js'" --prune-empty --tag-name-filter cat -- --all

Write-Host "Cleaning up refs and running garbage collection..."
# Remove original refs left by filter-branch
if (Test-Path .git\refs\original) { Remove-Item -Recurse -Force .git\refs\original }
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Verifying blob id no longer present (searching for blob prefix)..."
$found = git rev-list --objects --all | Select-String '23ef0d0af42e0a296096c22121ad99a52f00d237' -Quiet
if ($found) { Write-Host 'Blob still present in history' } else { Write-Host 'Blob not found (good)' }

Write-Host "Searching for client secret text in history (short match)..."
git log -S "GOCSPX-4uHg" --all --oneline | Select-Object -First 10 | ForEach-Object { Write-Host $_ }

Write-Host "Script complete. If output shows the blob and secret are gone, next step is to force-push the cleaned branches to origin with --force-with-lease."