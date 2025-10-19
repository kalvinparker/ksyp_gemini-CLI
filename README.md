# secure-gemini

This repository contains a minimal, security-conscious Docker image for running the Google Gemini CLI (`@google/gemini-cli`). The image is built on `node:22-alpine`, uses a non-root user, upgrades base packages, updates npm, and runs `npm audit` during the image build as a security gate.

## What is included

- `Dockerfile` — audited build that performs `apk` upgrades, updates `npm`, creates a non-root user, installs dependencies from `package.json`, runs `npm audit`, and sets the `ENTRYPOINT` to `npx gemini`.
- `package.json` — minimal file with a dependency on `@google/gemini-cli`.
- `.github/workflows/docker-build-scan.yml` — GitHub Actions workflow that builds the Docker image and scans it with Trivy on push to `main`.
```

- The Dockerfile runs `npm audit` during build. In CI you may want to tune the audit policy or run more advanced supply-chain scanning.
- The image runs as a non-root user. Confirm that any filesystem paths and environment variables used by `gemini` are writable by `appuser`.
```markdown
# secure-gemini

This repository contains a minimal, security-conscious Docker image for running the Google Gemini CLI (`@google/gemini-cli`). The image is built on `node:22-alpine`, uses a non-root user, upgrades base packages, updates npm, and runs `npm audit` during the image build as a security gate.

## What is included

- `Dockerfile` — audited build that performs `apk` upgrades, updates `npm`, creates a non-root user, installs dependencies from `package.json`, runs `npm audit`, and sets the `ENTRYPOINT` to `npx gemini`.
- `package.json` — minimal file with a dependency on `@google/gemini-cli`.
- `.github/workflows/docker-build-scan.yml` — GitHub Actions workflow that builds the Docker image and scans it with Trivy on push to `main`.

## Image summary (from last local scan)

- Image: `secure-gemini-cli:latest`
- OS: alpine 3.22.2
- Size: ~656.6 MB
- Trivy scan report (full JSON): `trivy-report.json` (saved in the project root)

Trivy findings (quick summary):

- I parsed and searched the saved `trivy-report.json` in this repository for vulnerability records. No vulnerability objects were found in the report.

Severity counts (from `trivy-report.json`):

- CRITICAL: 0
- HIGH: 0
- MEDIUM: 0
- LOW: 0
- UNKNOWN: 0

If you'd like a deeper supply-chain audit (for example, run `npm audit` locally and attempt auto-fixes, or re-run Trivy with a different policy), I can add step-by-step remediation guidance. Otherwise this image's saved scan contains no findings to triage.

## Build locally

Run the following from the `secure-gemini` directory:

```powershell
docker build -t secure-gemini-cli:latest .
```

If `npm audit` fails during the Docker build (it may, depending on transient vulnerabilities), you can temporarily allow the build to continue locally by changing the Dockerfile audit step to a non-blocking command (not recommended for CI):

```dockerfile
RUN npm audit --audit-level=moderate || true
```

I recommend addressing audit findings before publishing the image.

## Run

```powershell
docker run --rm secure-gemini-cli:latest --help
```

Because the image uses `npx` as the entrypoint it will run the `gemini` CLI.

## How to re-run Trivy locally

If you want to re-run the Trivy scan locally (recommended after changes):

```powershell
# using the Trivy container (no host install required)
docker run --rm -v "%CD%":/work aquasec/trivy:latest image --format json --output trivy-report.json secure-gemini-cli:latest
```

- The command above writes a JSON report to `trivy-report.json`. Open that file to review detailed findings.
- To show a human-readable summary in the terminal, run:

```powershell
docker run --rm aquasec/trivy:latest image secure-gemini-cli:latest
```

## Git / Commit

If you'd like to commit the approved configuration locally, run these PowerShell steps (replace `<your-username>` when adding the remote):

```powershell
cd "D:\My Documents\Docker Projects\secure-gemini"
# create .gitignore if you haven't already
@"
node_modules/
npm-debug.log
.DS_Store
.env
/dist
coverage/
*.tgz
"@ > .gitignore

git init
git add Dockerfile package.json .github .gitignore README.md
git commit -m "chore: add secure-gemini Dockerfile, package.json and CI scan workflow"

# Add remote and push (replace <your-username> with your GitHub username)
git remote add origin https://github.com/<your-username>/secure-gemini.git
git branch -M main
git push -u origin main
```

## CI: Build and scan

A GitHub Actions workflow (`.github/workflows/docker-build-scan.yml`) is included to build and scan the image with Trivy on push to `main`. This performs an automated check and can be adjusted to fail the build on specific severities.

To publish the image from CI (GHCR / Docker Hub), add the appropriate secrets to your repository and enable the `docker-build-scan-publish.yml` workflow. Required secrets for Docker Hub: `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` (or use GHCR with `GITHUB_TOKEN`).

## Notes

- The Dockerfile runs `npm audit` during build. In CI you may want to tune the audit policy or run more advanced supply-chain scanning.
- The image runs as a non-root user. Confirm that any filesystem paths and environment variables used by `gemini` are writable by `appuser`.

```
