# Security Policy

This document outlines the security policy for the `secure-gemini` project.

## Supported Versions

This project provides a configuration (`Dockerfile`) for building a secure container image. The security of the final image is dependent on the versions of the components at build time. I am committed to keeping the configuration in the `main` branch up-to-date with the latest secure practices.

| Version | Supported          |
| ------- | ------------------ |
| `master` branch | :white_check_mark: |
| Releases (Tags) | :white_check_mark: |
| Older commits | :x:                |

**User Responsibility:** Users are responsible for pulling the latest changes from the `master` branch and rebuilding their images to ensure they have the most recent security patches and dependency versions. Our CI/CD pipeline (`pr-scan.yml`) continuously validates the security of the `main` branch.

## Reporting a Vulnerability

I take all security vulnerabilities seriously. I believe in coordinated disclosure and appreciate the community's help in keeping our project secure.

**How to Report a Vulnerability:**

Please **DO NOT** report security vulnerabilities through public GitHub issues.

Instead, please report them directly via one of the following methods:
*   **Primary Method:** Use GitHub's private vulnerability reporting feature, available under the "Security" tab of this repository.

**What to Expect:**

When you report a vulnerability, I will make every effort to:
1.  Acknowledge receipt of your report within 48 hours.
2.  Provide an initial assessment of the vulnerability's validity and impact.
3.  If the vulnerability is accepted, I will work on a fix and aim to release a patch.
4.  Keep you informed of our progress. I will coordinate with you on the public disclosure of the vulnerability after a fix has been released.

I am committed to a transparent and timely response. Thank you for helping to keep this project secure.
