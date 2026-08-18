# DevOps Agent Invocation Prompts & Triggers

Use these quick prompts and patterns to invoke or delegate to the **DevOps Agent** in your AI tools (Antigravity IDE, Cursor, Claude Code, Copilot).

---

## 1. Antigravity Subagent Invocation

```markdown
Act as the DevOps Agent (@agents/devops-agent/AGENT.md).
I need to set up a CI/CD pipeline for this repository:
1. Create a GitHub Actions workflow in `.github/workflows/ci.yml` that handles linting, typechecking, running unit tests, and building.
2. Ensure secrets and environment variables follow `.env.example` conventions.
3. Validate syntax and run local verification checks before concluding.
```

---

## 2. Cursor Composer / Chat Prompt

```markdown
@agents/devops-agent/AGENT.md
Help me containerize this application:
1. Create a production-ready `Dockerfile` with multi-stage builds and a non-root user.
2. Create a `docker-compose.yml` for local development.
3. Create a `.dockerignore` file excluding sensitive and build artifacts.
```

---

## 3. Claude Code Slash Command / Prompt

```markdown
/agent devops-agent
Perform a pre-flight release readiness check using `workflows/release-readiness.md`. Verify test suites pass, environment variables are documented, and deployment steps are verified.
```

---

## 4. Trigger Keywords Matrix

The DevOps Agent automatically responds to:
- `ci/cd`, `pipeline`, `github actions`, `gitlab-ci`, `workflow`
- `docker`, `dockerfile`, `docker-compose`, `container`, `containerize`
- `deploy`, `deployment`, `infrastructure`, `release readiness`, `production setup`
- `environment variables`, `.env.example`, `secrets management`, `ssl`, `nginx`
