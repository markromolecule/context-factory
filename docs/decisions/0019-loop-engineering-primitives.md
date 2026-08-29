---
title: "Loop Engineering Primitives Integration"
type: decision
status: accepted
created: "2026-08-29"
tags: [adr, loop-engineering, automations, worktrees, connectors, mcp, triage, inbox, devops]
---

# 0019 — Loop Engineering Primitives Integration

## Context

While `context-factory` establishes strong multi-agent personas (`agents/`), modular procedural skills (`skills/`), and historical task ledgers (`docs/tasks/YYYY/MM/DD/`), analysis of Addy Osmani's "Loop Engineering" framework reveals four architectural gaps preventing fully autonomous execution loops:

1. **Automations:** Repository health checks in CI (`.github/workflows/context-factory.yml`) validate static configuration but perform no scheduled background discovery or proactive repository triage without human initiation.
2. **Worktree Isolation:** Concurrent lifecycle agents running simultaneously share a single working tree, risking merge conflicts, dirty git states, and race conditions on touched files.
3. **Connectors:** Agents lack standardized, project-scoped Model Context Protocol (MCP) tool integration to interact natively with external GitHub repositories, pull requests, issue trackers, and environments.
4. **State Spine:** While `docs/tasks/` preserves formalized, approved multi-phase task folders, no lightweight live inbox exists to capture newly discovered anomalies or triage candidates before a PM Agent formally scaffolds a task.

## Options considered

1. **Option 1 (Ad-hoc IDE-Specific Tooling & Monolithic Working Directory):** Rely on proprietary IDE-specific background tasks (e.g. Cursor background indexing), continue running all subagents in the root workspace directory, and manage issue tracking solely via browser tabs.  
   *Rejected:* Non-model-neutral, causes concurrency conflicts between parallel agents, and introduces undocumented manual friction.
2. **Option 2 (Heavyweight External Agent Orchestrator):** Introduce complex external multi-agent frameworks (e.g. LangGraph, AutoGen) requiring Python runtimes, external daemon processes, and heavy database infrastructure.  
   *Rejected:* Violates Context Factory's zero-dependency standard, introduces operational overhead, and duplicates the existing ES module harness.
3. **Option 3 (Native Loop Engineering Primitives via Scheduled Triage, Git Worktree Management, Project-Scoped MCP, and Live Inbox Ledger - Selected):**
   - **Automations & Discovery:** Implement `skills/triage/SKILL.md` and `.github/workflows/discovery.yml` running scheduled cron scans (`0 6 * * *`) and `workflow_dispatch` to discover anomalies and append structured findings to the state spine.
   - **Worktree Isolation:** Build `scripts/worktree.mjs` providing deterministic git worktree lifecycle management (`create`, `remove`, `list`, `cleanup`) targeting `.worktrees/<agent-id>`, and mandate worktree isolation in `orchestrator/SHARED.md` for concurrent agent dispatches.
   - **MCP Connectors:** Standardize project-scoped MCP tools in `.mcp.json` (starting with GitHub) and document capabilities in `docs/Connectors.md`, governed by `agents/devops-agent`.
   - **State Spine:** Introduce `docs/tasks/INBOX.md` as the authoritative live ledger tracking raw findings (`new` $\rightarrow$ `triaged` $\rightarrow$ `promoted` / `dismissed`) prior to PM Agent task folder creation.

## Decision

Adopt **Option 3**. The four missing loop engineering primitives are integrated natively into `context-factory`:

| Loop Primitive | Implementation | Responsibility & Governance |
| :--- | :--- | :--- |
| **1. Automations** | `skills/triage/SKILL.md` & `.github/workflows/discovery.yml` | Scheduled discovery & triage execution |
| **2. Worktrees** | `scripts/worktree.mjs` & `orchestrator/SHARED.md` | Concurrency isolation for dispatched agents |
| **3. Connectors** | `.mcp.json` & `docs/Connectors.md` | Standard MCP tool integration owned by `devops-agent` |
| **4. State Spine** | `docs/tasks/INBOX.md` | Live triage ledger consumed by `pm-agent` |

### Architectural Ledger

- **D-01 (Triage Skill Contract):** `skills/triage/SKILL.md` coordinates `explore` and `grounding` across commits, test failures, and issue trackers, logging structured entries into `docs/tasks/INBOX.md`.
- **D-02 (Worktree Isolation Mandate):** Any execution involving more than one concurrent agent from `agents/` must isolate workspaces using `scripts/worktree.mjs create <agent-id>`.
- **D-03 (DevOps Connector Ownership):** `agents/devops-agent` maintains `.mcp.json`, environment variable mapping, and MCP tool health.
- **D-04 (Zero External Dependencies):** All automation scripts and worktree handlers are written as native Node.js ES modules using built-in standard libraries.

## Consequences

- **Positive:** Enables true autonomous background loops (discovery $\rightarrow$ triage $\rightarrow$ inbox $\rightarrow$ worktree isolation $\rightarrow$ execution $\rightarrow$ verification).
- **Positive:** Eliminates workspace collisions when running multiple agents in parallel.
- **Positive:** Standardizes MCP tool connectivity for GitHub and external workflows while staying strictly model-neutral.
- **Positive:** Preserves clean separation between raw incoming findings (`docs/tasks/INBOX.md`) and approved execution tasks (`docs/tasks/YYYY/MM/DD/...`).
- **Neutral:** Dispatched agents must remember to invoke `scripts/worktree.mjs remove` or `cleanup` to avoid dangling `.worktrees/` directories.

## Validation and review date

Review after 30 days or following 20 automated discovery runs (target: 2026-09-29). Verify worktree cleanup reliability, discovery signal-to-noise ratio, and doctor diagnostic health.
