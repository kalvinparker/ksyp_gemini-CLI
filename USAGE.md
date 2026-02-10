
## 🔑 Part I: Get Your Gemini API Key

You'll need a Gemini API key to provide to the container when you run it.

1.  **Go to Google AI Studio:** Navigate to the Google AI Studio website and sign in with your Google account.
2.  **Click the API Key Section:** Look for the "Get API Key" option on the left-hand panel or dashboard.
3.  **Create the Key:** Click "Create API key in new project" or "Create API key."
4.  **Copy and Save:** Your new API key will be auto-generated. Copy this string immediately and store it in a secure location, as you won't be able to see it again.

-----

## 📦 Part II: Pull and Run the Docker Container

### Step 1: Generate a Classic Personal Access Token (PAT)

GHCR requires a Classic PAT with the correct permissions to pull private packages.

1.  **Go to Your GitHub Settings:** Navigate to **Developer settings** $\rightarrow$ **Personal access tokens** $\rightarrow$ **Tokens (classic)**.
2.  **Generate a New Token:** Create a new token.
3.  **Assign Scope:** Ensure you check the **`read:packages`** scope under "Select scopes" to allow downloading packages from the registry.
4.  **Copy the PAT:** Copy the generated token and save it safely.

### Step 2: Login to GHCR

Use your GitHub username and the Classic PAT to authenticate Docker with GHCR.

1.  **Construct the Login Command:** Run this command in your terminal, replacing `kalvinparker` with your GitHub username if you have forked the repository:

    ```bash
    echo YOUR_CLASSIC_PAT | docker login ghcr.io -u kalvinparker --password-stdin
    ```

      * Replace `YOUR_CLASSIC_PAT` with the key you got in Part II, Step 1.
      * **Troubleshooting Tip:** If you see "denied" or "unauthorized," first run `docker logout ghcr.io`, then run the login command again. On Windows, you might need to clear any stored `ghcr.io` entries from the Windows Credential Manager.
      * **Alternatively:** You can try the following command, entering the `github classic pat token` after the first command. You might also need to replace `kalvinparker` with your Github username.

    ```bash
    $PAT = Read-Host -Prompt "YOUR_CLASSIC_PAT"
    ```
    ```bash
    Write-Output $PAT | docker login ghcr.io -u "kalvinparker" --password-stdin # login
    ```

### Step 3: Pull the Image

Now pull the specific package using the fully qualified name.

1.  **Run the Pull Command:**

    ```bash
    docker pull ghcr.io/kalvinparker/ksyp_gemini-cli:latest
    ```

      * **Troubleshooting Tip:** If you get a "manifest not found" error, double-check the image name and tag (`secure-gemini:latest`) for typos.
      * **Remember:** You might need to replace `kalvinparker` with your GitHub username if you have forked the repository.

### Step 4: Run the Container with the API Key

Use the `docker run` command and pass the Gemini API key as an environment variable (`GEMINI_API_KEY`).

1.  **Execute the Run Command:**

    ```bash
    docker run -it --rm -e GEMINI_API_KEY="YOUR-GEMINI-TOKEN" ghcr.io/kalvinparker/ksyp_gemini-cli:latest
    ```

      * Replace `YOUR-GEMINI-TOKEN` with the key you got in Part I.
      * `--rm` ensures the container is automatically removed when it exits.

-----