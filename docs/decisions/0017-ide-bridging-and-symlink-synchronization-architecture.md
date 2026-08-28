---
title: "IDE Bridging and Symlink Synchronization Architecture"
type: decision
status: accepted
created: "2026-08-28"
tags: [adr, cli, bridge, sync, antigravity, symlinks, doctor, init]
---

# IDE Bridging and Symlink Synchronization Architecture

## Context

Context Factory provides engineering rules, skills, workflows, subagent contracts, and orchestrator instructions. When bridging Context Factory into consumer host repositories:
1. Modern AI IDEs (particularly Antigravity) discover skills and agent contracts via a root `./.agents/` folder containing `skills/`, `rules/`, `agents/`, `workflows/`, `AGENTS.md`, and `GEMINI.md`.
2. Static file generation alone required manual copying or re-bridging, causing drift when rules or skills were updated in the central factory.
3. Host repositories operate across two primary environments:
   - **Git Submodule Repositories:** Standalone team projects with `.context-factory` embedded as a Git submodule.
   - **Shared Local Workspaces:** Multi-repo development machines where several projects share a sibling directory (`../context-factory`).
4. Broken symlinks or stale configurations could fail silently without diagnostic health checks and automated self-healing.

## Options Considered

1. **Option 1 (Static Copying Only):** Copy all skills, rules, and workflows directly into every host repository.  
   *Rejected:* Causes severe file duplication, git history clutter in host repos, and silent drift when the factory is updated.
2. **Option 2 (Single Top-Level Symlink):** Link the entire `./.agents` folder as a single symlink (`host/.agents -> factory/.agents`).  
   *Rejected:* Prevents the host project from adding project-specific skills, rules, or overrides inside its own `.agents/` folder.
3. **Option 3 (Granular Relative Symlink Architecture with Dual-Mode Integration & Auto-Repair - Selected):**
   - **Host `.agents/` Scaffolding:** Create a real directory `./.agents/` at host root containing granular relative symlinks to factory subdirectories (`skills`, `rules`, `agents`, `workflows`, `AGENTS.md`, `GEMINI.md`).
   - **Cross-Platform Resilience:** Relative paths resolve portably across directories; on Windows, directory links use junctions with graceful copy fallback.
   - **Dual-Mode Integration:** Support `--method submodule` (default for Git repos) and `--method linked` (for shared local workspaces), recorded in `.context-bridge.json`.
   - **Targeted IDE Profiles:** Filter generated files via `--ide` (`antigravity`, `cursor`, `windsurf`, `claude`, `copilot`, `all`).
   - **Comprehensive Diagnostics & Auto-Repair:** Add symlink audit checks to `context-cli doctor` and `lint`, support `--repair` to re-link missing/broken symlinks, and auto-heal symlinks during `context-cli pull`.
   - **Interactive Initialization:** Provide `context-cli init` for guided setup in new projects.

## Decision

Adopt **Option 3**. Context Factory and `context-cli` provide first-class, zero-drift IDE bridging with live symlinks, dual-mode integration, and self-healing diagnostics:

| Feature | Implementation | Purpose |
| :--- | :--- | :--- |
| **`.agents/` Symlinks** | Granular relative symlinks to `skills/`, `rules/`, `agents/`, `workflows/` | Antigravity native skill and rule discovery with live updates |
| **Dual Integration** | `--method submodule` & `--method linked` | Seamless support for both team Git repos and local multi-project workspaces |
| **IDE Profiles** | `--ide antigravity,cursor,windsurf,claude,copilot,all` | Granular control over which IDE contract artifacts are generated |
| **Health Diagnostics** | `context-cli doctor` audits symlinks and bridge config | Prevents silent failure; flags dangling links |
| **Auto-Repair** | `context-cli doctor --repair` & auto-healing in `pull` | Re-establishes broken or missing symlinks automatically |
| **Interactive Setup** | `context-cli init` | Guided TTY wizard for new project scaffolding |

### Key Architectural Decisions (Ledger):
- **D-01 (Granular Symlinks):** Host `.agents/` is a real folder with individual symlinks, allowing local customizations alongside factory links.
- **D-02 (Dual-Mode Integration):** Relative paths support both submodule (`.context-factory/`) and sibling (`../context-factory/`) layouts portably.
- **D-03 (Diagnostics & Repair):** `doctor` checks all 6 symlinks and repairs them with `--repair`; `pull` auto-heals after git updates.
- **D-04 (CLI Ergonomics & Unification):** Single unified engine under `app/cli/commands/` accessible via `context-cli` binary or `scripts/`.

## Consequences

- **Positive:** New and existing projects can be bridged with a single command (`context-cli init` or `context-cli bridge --ide antigravity`), immediately equipping Antigravity, Cursor, Windsurf, Claude Code, and Copilot with live-linked rules and skills.
- **Positive:** Symlinks eliminate duplicate files while ensuring that updates in `context-factory` are immediately live across all local projects.
- **Positive:** `doctor` and `pull` prevent silent symlink breakage and provide automated self-healing.
- **Neutral:** Windows systems without Developer Mode fall back gracefully to directory junctions or copied fallbacks.
