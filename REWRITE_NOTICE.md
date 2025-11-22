IMPORTANT: Repository history has been rewritten to remove sensitive files

What happened
- We rewrote history for `kalvinparker/secure-gemini` to remove `node_modules/**` and the specific path `node_modules/@google/gemini-cli-core/dist/src/code_assist/oauth2.js`.
- This is a destructive operation: old commits were replaced and commit hashes changed.

What you must do (pick one)
1) Re-clone (recommended)
   - Delete your local copy, then clone fresh:
     git clone https://github.com/kalvinparker/secure-gemini.git

2) OR: Keep your local clone and hard-reset to the new remote history
   - From your existing local repo (careful: this will discard local uncommitted changes):
     git fetch origin
     git checkout main    # or the default branch you use
     git reset --hard origin/main
     # If you have local branches you want to preserve, rebase them onto origin/main.

Notes and caveats
- Any collaborators who have forked or cloned this repository will need to re-clone or reset as above.
- Pull request refs and certain GitHub internal refs were not overwritten (GitHub prevents updating refs/pull/*). You may need to re-open or re-create PRs if they reference old commits.
- If you maintain CI workflows that rely on old commit IDs, update them as needed.

If you need assistance
- If you want me to run follow-up checks (confirm object removal, check tags, run `git fsck`), tell me which checks to run and I will perform them.
- If you want a prepared message to send to collaborators (email/Slack/GitHub issue) I can draft it for you.

Rewriter:
- Rewritten by automated operation run on $(Get-Date -Format u) by the automation account on your workstation.
