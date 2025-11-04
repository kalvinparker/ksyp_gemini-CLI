Repository policy: secrets and vendored node_modules

Brief:
- Never commit secrets (API keys, client secrets, tokens) to the repository.
- Do not commit `node_modules/`. Use `package.json` and `package-lock.json` to record dependencies.

If a secret is accidentally committed:
1. Rotate/revoke the exposed credential immediately.
2. Remove the secret from history (use git-filter-repo or contact repo admins).
3. Notify collaborators and follow the repository incident response steps.

Prevention:
- Add `node_modules/` to `.gitignore`.
- Use the provided Git hook (`.githooks/pre-commit`) which performs lightweight checks on staged files and blocks commits that include `node_modules/` or simple secret patterns.
- Consider installing a stronger scanning tool (git-secrets, truffleHog, or detect-secrets) in CI for push-time scanning.

Contact:
If you find a secret in the repo, open an issue and ping the maintainers.
