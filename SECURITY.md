# Security Policy

This document provides the high-level security policy for projects that use the `profile-template` as their base. It is intended to be a canonical, easy-to-find security statement that repository owners can adapt per-repo where necessary.

## Supported Versions

Security support depends on the project's branch or release strategy. Repository maintainers should keep their project's dependencies and CI/CD configurations up to date.

| Version | Supported |
| ------- | --------- |
| `main` (or `master`) branch | :white_check_mark: |
| Releases (Tags) | :white_check_mark: |
| Older commits | :x: |

Users are responsible for pulling the latest changes and rebuilding any artifacts (for example container images) to receive security updates.

## Reporting a Vulnerability

We take security vulnerabilities seriously and prefer coordinated disclosure. Please do not file security reports as public issues.

Preferred reporting methods:

1. Use GitHub's private vulnerability reporting feature (the "Security" tab) when available.
2. Email the primary maintainer. (Update the email address in the repository's README to a monitored address.)

What to expect from us:

1. Acknowledge receipt within 72 hours.
2. Provide an initial assessment of impact and validity.
3. Work on a fix and provide updates until a patch is released.
4. Coordinate public disclosure after a fix is published.

## Security responsibilities

Maintainers should:

- Keep CI workflows (tests, linting, and security scanners) up to date.
- Regularly update base images and dependencies.
- Use secret scanning and dependency vulnerability scanning where available.
- Provide clear instructions for reproducing and verifying fixes.

If you are a contributor or user with security questions, please consult this document and contact the maintainers using the reporting methods above.

## Repository

Repository: `profile-template`

Primary contacts / maintainers: kalvinparker1+github@gmail.com
