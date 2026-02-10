You have two secure methods for handling this. The first is the immediate, manual way (done correctly), and the second is the long-term, automated way.

### **Method 1: The Manual Pull Request (The Right Way for Immediate Updates)**

This process ensures your change is scanned and validated by the security pipeline before it becomes part of the main codebase.

**Step 1: Create a New Branch**
In your PowerShell terminal, from the `ksyp_gemini-cli` directory, create a dedicated branch for this update. This is a critical best practice.

```powershell
git checkout -b feat/update-gemini-cli-v0.9.0
```

**Step 2: Update `package.json`**
Open the `package.json` file in your editor. You will see this line:

```json
"dependencies": {
  "@google/gemini-cli": "^0.8.2"
}
```

Change the version number from `^0.8.2` to `^0.9.0`:

```json
"dependencies": {
  "@google/gemini-cli": "^0.9.0"
}
```
Save the file.

**Step 3: Commit and Push the Change**
Commit your change to the new branch and push it to your GitHub repository.

```powershell
git add package.json
git commit -m "feat: Update @google/gemini-cli to v0.9.0"
git push origin feat/update-gemini-cli-v0.9.0
```

**Step 4: Create a Pull Request on GitHub**
Go to your GitHub repository. You will see a prompt to create a new pull request from the branch you just pushed. Click it.

**Step 5: Review the Security Scan and Merge**
This is the most important step. When you create the pull request, our `build-and-scan.yml` workflow will automatically trigger. It will:
1.  Build a new Docker image with Gemini CLI `v0.9.0`.
2.  Run `npm audit` inside the build.
3.  Run `Trivy` to scan the final image for vulnerabilities.

Wait for the workflow to complete. If it passes (you see a green checkmark), you can confidently **merge the pull request**. Your `main` branch is now updated, secure, and ready for a new release.

### **Method 2: The Automated Way (Dependabot)**

If you have configured Dependabot, it will eventually detect this update and automatically create the exact same pull request for you.

The manual method above is simply for when you want to apply an update *immediately* instead of waiting for Dependabot's schedule. Both methods result in a secure, scanned pull request, ensuring the security posture is maintained.