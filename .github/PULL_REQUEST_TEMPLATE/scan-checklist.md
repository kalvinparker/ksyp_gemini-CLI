- [ ] CI build and Trivy scan passed
- [ ] No CRITICAL or HIGH vulnerabilities reported in Trivy artifact (check `trivy-report.json`)
- [ ] If vulnerabilities exist, describe mitigation plan in PR body (package bump, patch, or suppression rationale)
- [ ] Tag security owner for review if findings are non-trivial

Note: The workflow uploads `trivy-report.json` as an artifact on each run. Use that JSON for automated parsing or manual triage.