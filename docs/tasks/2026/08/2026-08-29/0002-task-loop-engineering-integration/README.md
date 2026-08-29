---
title: "Loop Engineering Integration"
type: task
status: completed
created: "2026-08-29"
tags: [task, loop-engineering, automations, worktrees, connectors, triage, inbox]
---

# Loop Engineering Integration

## Outcome

Successfully integrated the missing "loop engineering" primitives (Automations, Worktrees, Connectors, and State Spine) into Context Factory, enabling scheduled background discovery, concurrent subagent worktree isolation, project-scoped MCP connectivity, and a live triage inbox.

## Pre-planning record

### Actors and goals

- **Automated CI/CD:** Periodically scans repository activity, test results, and issues, logging findings to `docs/tasks/INBOX.md`.
- **PM Agent (`agents/pm-agent`):** Consumes triaged findings from `docs/tasks/INBOX.md` to scaffold formal multi-phase tasks in `docs/tasks/`.
- **Lifecycle Specialist Agents (`agents/*`):** Execute concurrent tasks within isolated git worktrees created and managed by `scripts/worktree.mjs`.
- **DevOps Agent (`agents/devops-agent`):** Governs `.mcp.json` and MCP tool connectors documented in `docs/Connectors.md`.

### Domain language

- **Loop Engineering:** Autonomous development loop consisting of 5 pieces (Automations, Worktrees, Skills, Connectors, Subagents) and 1 memory spine (State).
- **Triage Inbox:** Live markdown ledger (`docs/tasks/INBOX.md`) for newly discovered findings prior to formal task folder promotion.
- **Worktree Isolation:** Ephemeral git working directory allocated under `.worktrees/<agent-id>` allowing concurrent subagents to work without git conflicts.
- **MCP Connector:** Model Context Protocol server configuration allowing standardized tool access.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| S-01 | Scheduled CI runs discovery | Discovery workflow triggered via cron or dispatch | Scans repository state, runs triage skill, appends structured finding to `docs/tasks/INBOX.md` | Non-fatal logging, preserves inbox structure | Verified |
| S-02 | Concurrent subagent dispatch | Multiple agents dispatched simultaneously | Each agent runs in an isolated worktree via `scripts/worktree.mjs create <id>` | Worktree creation fails gracefully if path exists | Verified |
| S-03 | Subagent completes task | Worktree work committed or completed | `scripts/worktree.mjs remove <id> --delete-branch` tears down worktree and cleans up branch | Zero orphaned branches remaining | Verified |
| S-04 | Agent accesses GitHub tools | MCP runtime active | Uses `.mcp.json` configuration and `docs/Connectors.md` guidelines | Validates environment variable tokens | Verified |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | How should background discovery be automated? | Cron-scheduled GitHub Action `.github/workflows/discovery.yml` calling `skills/triage/SKILL.md` via `scripts/triage.mjs`. | Mirrors existing `context-factory.yml` structure; model-neutral. | Proprietary IDE background processes. | `docs/decisions/0019-loop-engineering-primitives.md` |
| D-02 | How should concurrent subagent collisions be prevented? | Native git worktree management script `scripts/worktree.mjs` and mandatory isolation in `SHARED.md`. | Standard git primitive; zero external dependencies. | Monolithic single checkout or container mounts. | `docs/decisions/0019-loop-engineering-primitives.md` |
| D-03 | Where should new un-promoted findings be logged? | `docs/tasks/INBOX.md` live ledger with status lifecycle. | Decouples raw discovery from heavy task folder scaffolding. | Polluting `docs/tasks/` with empty task folders. | `docs/decisions/0019-loop-engineering-primitives.md` |
| D-04 | How should MCP tools be organized and configured? | `docs/Connectors.md` Map of Content and `.mcp.json` owned by `devops-agent`. | Follows standard `.mcp.json` format and existing `docs/Skills.md` MOC style. | Hardcoding MCP configs inside prompt files. | `docs/decisions/0019-loop-engineering-primitives.md` |

### Unknowns and blockers

- *None. All architectural contracts and integration points are defined in [[docs/context/loop/loop-engineering-integration|Context Specification]] and [[docs/decisions/0019-loop-engineering-primitives|ADR 0019]].*

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | Phase 1 (Automations) | `skills/triage/SKILL.md` and `.github/workflows/discovery.yml` exist; dry-run produces structured inbox entry | `skills/triage/SKILL.md`, `.github/workflows/discovery.yml`, `scripts/triage.mjs` | `node scripts/triage.mjs --dry-run` | Verified |
| AC-02 | Phase 1 (State Spine) | `docs/tasks/INBOX.md` exists with live ledger table and guidelines | `docs/tasks/INBOX.md` | File verification & format check | Verified |
| AC-03 | Phase 2 (Worktrees) | `scripts/worktree.mjs` creates and removes worktrees with zero orphaned branches | `scripts/worktree.mjs` | `node scripts/worktree.mjs create test-wt && node scripts/worktree.mjs cleanup --force` | Verified |
| AC-04 | Phase 2 (Contract) | `orchestrator/SHARED.md` mandates worktree isolation for concurrent agent dispatches | `orchestrator/SHARED.md` | Grep assertion | Verified |
| AC-05 | Phase 3 (Connectors) | `docs/Connectors.md` and `.mcp.json` exist and are linked in `README.md` Start Here | `docs/Connectors.md`, `.mcp.json`, `README.md` | Doctor & link checks | Verified |
| AC-06 | Phase 4 (Sync) | Manifest, lockfile, and doctor diagnostics pass with 100% green evaluations | `context-manifest.json`, `context-lock.json` | `node scripts/context.mjs doctor` | Verified |

## Scope

- **In Scope:**
  - Phase 1: `skills/triage/SKILL.md`, `.github/workflows/discovery.yml`, `docs/tasks/INBOX.md`, `scripts/triage.mjs`.
  - Phase 2: `scripts/worktree.mjs`, `orchestrator/SHARED.md`, `.gitignore`.
  - Phase 3: `docs/Connectors.md`, `.mcp.json`, `agents/devops-agent/AGENT.md`, `README.md`, `docs/Home.md`.
  - Phase 4: Inventory sync, lockfile regeneration, health verification.
- **Non-goals:**
  - Modifying existing skills or rules unrelated to loop engineering primitives.
  - Adding external npm runtime dependencies.

## Constraints and decisions

- Zero external dependencies (pure Node.js ES modules).
- Strict model neutrality across all adapters and configs.
- Frontmatter compliance with `scripts/validate-context.mjs`.

## Phases

- [x] `phase-01-automations-and-state-spine.md` — Phase 1: Automations + state spine
- [x] `phase-02-worktrees.md` — Phase 2: Worktrees and isolation contract
- [x] `phase-03-connectors.md` — Phase 3: MCP Connectors and configuration
- [x] `phase-04-sync-and-verification.md` — Phase 4: Manifest sync and doctor verification

## Verification

- `node scripts/context.mjs doctor` — PASS
- `node evals/run-evals.mjs` — 20/20 PASS
- `node scripts/triage.mjs --dry-run` — PASS
- `node scripts/worktree.mjs create test-agent && node scripts/worktree.mjs remove test-agent --force --delete-branch` — PASS (0 orphaned branches)

## Deviations

- *None.*

## Result

- All 4 loop engineering primitives successfully built, integrated, documented, and verified.

