# Start from the official, minimal base image
FROM node:22-alpine

# Remediate known base-image vulnerabilities (CR-20251013-04)
RUN apk update && apk upgrade busybox

# Update tooling to secure versions (CR-20251013-06)
RUN npm install -g npm@latest

# Create a non-root user for improved security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set up the project and install the tool
WORKDIR /home/appuser/gemini-project
COPY --chown=appuser:appgroup package.json .
RUN npm install

# SECURITY GATE - Run the audit.
RUN npm audit

# Set the final entrypoint for the CLI
ENTRYPOINT ["npx", "gemini"]
