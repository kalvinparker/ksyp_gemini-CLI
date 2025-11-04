<#
Sets up pre-commit and detect-secrets in a repository-local Python venv.
Requires Python 3.8+ available on PATH.
#>
param(
    [switch]$Install
)

if (-not $Install) {
    Write-Host "Run this script with -Install to create a repo-local venv and install pre-commit and detect-secrets:`n  .\scripts\setup-pre-commit.ps1 -Install"
    exit 0
}

$venvPath = ".venv-pre-commit"
if (-not (Test-Path $venvPath)) {
    python -m venv $venvPath
}

& "$venvPath\\Scripts\\pip.exe" install --upgrade pip
& "$venvPath\\Scripts\\pip.exe" install pre-commit detect-secrets

Write-Host "Installing pre-commit hooks (using the repo-local pre-commit)"
$precommitExe = "$venvPath\\Scripts\\pre-commit.exe"
if (git config --get core.hooksPath) {
    Write-Host "Note: core.hooksPath is set; pre-commit install may refuse. To let pre-commit manage hooks you can unset it with:`n  git config --unset-all core.hooksPath"
}
try {
    & $precommitExe install
} catch {
    Write-Warning "pre-commit install failed (see message above). You can still run pre-commit via the venv: $precommitExe run"
}

Write-Host "Generating detect-secrets baseline (scan may take a bit)"
# Use detect-secrets CLI if available; otherwise attempt detect-secrets-hook
$detectExe = "$venvPath\\Scripts\\detect-secrets"  # CLI entrypoint
if (Test-Path $detectExe) {
    & $detectExe scan --update .secrets.baseline . | Out-Null
} else {
    # fallback to detect-secrets-hook behavior (may error if args differ)
    & "$venvPath\\Scripts\\detect-secrets-hook" --update --baseline .secrets.baseline
}

Write-Host "Done. The repo should now have a .secrets.baseline and pre-commit available in the repo-local venv. To run: $precommitExe run --all-files"
