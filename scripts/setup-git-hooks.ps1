param(
    [switch]$Enable
)

if ($Enable) {
    git config core.hooksPath .githooks
    Write-Host "Enabled repository hooks: core.hooksPath set to .githooks"
    exit 0
}

Write-Host "To enable repo-local hooks, run:`n    .\scripts\setup-git-hooks.ps1 -Enable"
Write-Host "This will set git config core.hooksPath to .githooks for the current repository."
