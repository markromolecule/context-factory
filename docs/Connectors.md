---
title: Connectors
type: moc
tags: [connectors, mcp, tools, devops]
---

# Connectors

The Context Factory defines and bridges Model Context Protocol (MCP) connectors to grant agents standardized, controlled access to external development tools, issue trackers, version control, and production environments.

MCP configurations are maintained at the repository root in `.mcp.json` and governed by the **DevOps Agent** (`agents/devops-agent`).

## Available & Supported MCP Connectors

### 1. GitHub Connector (`github`)
- **Package / Command:** `npx -y @modelcontextprotocol/server-github`
- **Scope & Purpose:** Querying and managing GitHub issues, pull requests, commits, branches, releases, CI workflow runs, and repository state.
- **Authentication:** `GITHUB_PERSONAL_ACCESS_TOKEN: ${GITHUB_TOKEN}` (strictly passed via environment variable per `rules/global/security-guardrails.md`).
- **Use Cases:**
  - Automated triage of newly opened issues or pull requests.
  - Creating release tags and generating changelogs.
  - Querying failed CI/CD workflow run logs.

### 2. Filesystem Connector (`filesystem`)
- **Scope & Purpose:** Sandboxed read/write access to project directories.
- **Use Cases:** Inspecting local workspace files, analyzing source code, and writing task plans.

### 3. Issue Trackers & Collaboration (Optional / Configurable)
- **Linear / Jira Connectors:** Interacting with project management boards, synchronizing task state with `docs/tasks/INBOX.md`.
- **Slack / Discord Connectors:** Automated notifications and release announcements.

## Governance & Security Rules

1. **Zero Secret Hardcoding:** Never hardcode personal access tokens, API keys, or credentials directly in `.mcp.json`. Always use environment variable expansion (e.g. `${GITHUB_TOKEN}`).
2. **DevOps Agent Ownership:** The DevOps Agent (`agents/devops-agent`) owns `.mcp.json` maintenance, server dependencies, and pre-flight validation.
3. **Model-Neutral Protocol:** Connectors adhere to open MCP specifications and function identically across Antigravity, Claude Code, Cursor, Windsurf, and custom client harnesses.
