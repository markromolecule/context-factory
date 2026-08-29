---
title: "Loop Engineering Primitives Integration"
type: context
status: ready
created: "2026-08-29"
tags: [context, loop-engineering, automations, worktrees, connectors, mcp, triage, inbox]
feature: "loop-engineering-integration"
---

# Loop Engineering Primitives Integration Context Specification

## 1. Overview & Objective

- **Problem Statement:**  
  Per Addy Osmani's "Loop Engineering" framework, an autonomous development loop consists of 5 core pieces + 1 memory spine:
  1. **Automations:** Scheduled background discovery and triage without requiring human trigger.
  2. **Worktrees:** Isolated git checkouts ensuring concurrent subagents do not collide on files.
  3. **Skills:** Codified, triggered procedural repository knowledge (already mature in `skills/`).
  4. **Connectors:** Model Context Protocol (MCP) access to real-world tools, repositories, and issue trackers.
  5. **Sub-agents:** Explicit separation between maker and checker agents (already mature across `agents/`).
  6. **State:** Durable external ledger tracking ongoing and incoming work.

  While `context-factory` already possesses mature subagent personas (`agents/`), procedural skills (`skills/`), and historical task ledgers (`docs/tasks/YYYY/MM/DD/`), it lacks 4 critical primitives:
  1. No scheduled discovery/triage automation in CI/CD.
  2. No automated git worktree isolation mechanism for concurrent lifecycle agents.
  3. No standardized Model Context Protocol (MCP) connector definitions or repo-scoped configuration.
  4. No live triage inbox (`docs/tasks/INBOX.md`) to capture raw findings before PM Agent task promotion.

- **Business & Developer Value:**  
  Equips `context-factory` and bridged host repositories with true continuous autonomous loops: repositories can run background discovery, triage issues, spin up parallel agents in isolated worktrees without collisions, interact directly with GitHub via MCP, and maintain a live triage ledger.

- **Success Criteria:**
  - `skills/triage/SKILL.md` runs `explore` + `grounding` across commits, CI failures, and issue trackers to generate structured inbox findings.
  - `.github/workflows/discovery.yml` provides scheduled cron and `workflow_dispatch` discovery automation.
  - `docs/tasks/INBOX.md` serves as a live ledger for newly triaged findings before PM Agent task scaffolding.
  - `scripts/worktree.mjs` provides deterministic creation, listing, removal, and cleanup of git worktrees with zero orphaned branches.
  - `orchestrator/SHARED.md` mandates worktree isolation for concurrent agent dispatch.
  - `docs/Connectors.md` and `.mcp.json` document and configure MCP tool integration (GitHub at minimum) owned by `agents/devops-agent`.
  - `node scripts/context.mjs doctor` passes with all evaluations green and lockfile synchronized.

### Decision Ledger

| ID | Status | Decision | Rationale / Authority |
| --- | --- | --- | --- |
| D-01 | decided | Introduce `skills/triage/SKILL.md` as the official discovery & triage procedure that produces structured items for `docs/tasks/INBOX.md`. | Conforms to skill YAML schema and provides dedicated entry point for background discovery. |
| D-02 | decided | Implement `.github/workflows/discovery.yml` mirroring `context-factory.yml` structure with cron schedule (`0 6 * * *`) and `workflow_dispatch`. | Enables automated CI discovery without human initiation while supporting manual trigger. |
| D-03 | decided | Maintain `docs/tasks/INBOX.md` as a persistent ledger capturing un-promoted findings with states (`new`, `triaged`, `promoted`, `dismissed`). | Decouples raw anomaly discovery from formalized multi-phase task folders in `docs/tasks/`. |
| D-04 | decided | Build `scripts/worktree.mjs` as a zero-dependency ES module managing `.worktrees/<agent-id>` directories and branches. | Ensures concurrent lifecycle agents (`agents/`) operate in isolated workspaces without merge conflicts or state pollution. |
| D-05 | decided | Standardize MCP connectors via `docs/Connectors.md` Map of Content and `.mcp.json` repo configuration, assigned to `agents/devops-agent`. | Provides standard, model-neutral tool connectivity for GitHub and external services. |

---

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As an autonomous workflow, I want scheduled discovery to scan repository health and file findings into `docs/tasks/INBOX.md`, so that issues and maintenance needs are caught early.*
- *As a PM Agent, I want to read `docs/tasks/INBOX.md` before task creation, so that I can promote triaged findings into structured task plans.*
- *As an orchestrator dispatching parallel agents, I want each agent to execute in an isolated git worktree via `scripts/worktree.mjs`, so that file modifications do not collide.*
- *As a DevOps Agent, I want a repo-level `.mcp.json` and `docs/Connectors.md`, so that agents can interact with GitHub issues and PRs through standard MCP protocols.*

### Scenario Coverage

| ID | Situation / Actor | Expected Outcome | Failure / Recovery |
| --- | --- | --- | --- |
| S-01 | Scheduled CI runs `discovery.yml`. | Executes triage discovery, finds potential drift or check statuses, logs structured entry into `docs/tasks/INBOX.md`. | Graceful exit if no new anomalies; errors logged without breaking main CI. |
| S-02 | Multiple lifecycle agents dispatched simultaneously. | `scripts/worktree.mjs create <agent-id>` spins up an isolated worktree under `.worktrees/<agent-id>`. | If branch exists or directory is dirty, returns explicit error; cleanup command available. |
| S-03 | Agent finishes execution in worktree. | `scripts/worktree.mjs remove <agent-id> --delete-branch` tears down the worktree and cleans up branch with zero orphaned references. | Worktree prune and force flag handle uncommitted checkouts cleanly. |
| S-04 | Developer inspects MCP tooling capabilities. | Consults `docs/Connectors.md` linked from `README.md` and verifies server configs in `.mcp.json`. | Config validated via JSON schema and doctor diagnostic. |

### Functional Requirements

- [ ] Create `skills/triage/SKILL.md` with standard YAML frontmatter (`name`, `description`).
- [ ] Create `.github/workflows/discovery.yml` with scheduled cron and manual workflow_dispatch triggers.
- [ ] Create `scripts/triage.mjs` for executing triage discovery and generating inbox entries.
- [ ] Create `docs/tasks/INBOX.md` with structured finding table and status transitions.
- [ ] Create `scripts/worktree.mjs` supporting `create`, `remove`, `list`, and `cleanup` operations.
- [ ] Update `orchestrator/SHARED.md` to mandate worktree isolation for concurrent agent dispatches.
- [ ] Add `.worktrees/` to `.gitignore`.
- [ ] Create `docs/Connectors.md` Map of Content documenting MCP tools.
- [ ] Create `.mcp.json` containing GitHub MCP server configuration.
- [ ] Update `agents/devops-agent/AGENT.md` to establish ownership of `.mcp.json` and MCP configs.
- [ ] Update `README.md` and `docs/Home.md` to link `docs/Connectors.md` and `.mcp.json`.
- [ ] Update `context-manifest.json`, synchronize MOCs, and regenerate `context-lock.json`.
- [ ] Verify 100% pass rate in `node scripts/context.mjs doctor` and `node evals/run-evals.mjs`.

---

## 3. Technical & Architectural Context

- **Affected Layers & Components:**
  - `skills/triage/SKILL.md` (Skill inventory)
  - `.github/workflows/discovery.yml` (CI/CD automation)
  - `scripts/triage.mjs` & `scripts/worktree.mjs` (Zero-dependency CLI toolchain)
  - `docs/tasks/INBOX.md` (State spine)
  - `orchestrator/SHARED.md` (Authoritative orchestration contract)
  - `docs/Connectors.md` & `.mcp.json` (MCP tool mapping and configuration)
  - `agents/devops-agent/AGENT.md` (DevOps role scope)
  - `README.md` & `docs/Home.md` (Vault indexing & navigation)
  - `context-manifest.json` & `context-lock.json` (Inventory and integrity digest)

- **Security & Concurrency Guardrails:**
  - Worktrees are isolated in `.worktrees/` which is strictly gitignored to prevent accidental commits of nested repositories.
  - `.mcp.json` uses environment variable expansion (`${GITHUB_TOKEN}`) and contains zero raw secrets.
  - Triage scripts operate read-only during discovery scans and only append structured markdown to `docs/tasks/INBOX.md`.

---

## 4. Scope & Boundaries

- **In Scope:**
  - Adding the 4 missing loop engineering primitives (`Automations`, `Worktrees`, `Connectors`, `State/Inbox`).
  - Strict conformance with existing repo patterns (zero external npm packages, Node.js built-ins).
  - Synchronizing manifest, lockfile, and doctor diagnostics.
- **Out of Scope:**
  - Replacing or altering existing skills (`explore`, `grill`, `plan`, `execute`, `verify`, `refactor`).
  - Replacing the PM agent planning model or task folder structure.

---

## 5. References & External Context

- [[docs/Home|Home]]
- [[orchestrator/SHARED|Shared Orchestration Contract]]
- [[docs/Skills|Skills Map]]
- [[docs/Rules|Rules Map]]
- [[docs/Workflows|Workflows Map]]
- [[docs/decisions/0018-synchronization-and-package-manager-modernization|ADR 0018: Sync & PM Modernization]]
