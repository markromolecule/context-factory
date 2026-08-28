---
title: "Context Factory Synchronization & IDE Bridge Enhancements"
type: context
status: ready
created: "2026-08-28"
tags: [context, cli, bridge, sync, antigravity, ide]
feature: "ide-bridging-and-sync-enhancements"
---

# Context Factory Synchronization & IDE Bridge Enhancements Context Specification

## 1. Overview & Objective

- **Problem Statement:** Context Factory acts as the central source of truth for rules, skills, workflows, agents, and engineering standards. However, two key synchronization and ergonomics friction points exist:
  1. **IDE Bridge & `.agents` Symlink Scaffolding:** When bootstrapping a new host repository via `context-cli bridge`, it generates static markdown contracts (`AGENTS.md`, `GEMINI.md`, `.cursorrules`, etc.), but does not scaffold the `.agents/` root directory with symbolic links (pointing to `agents/`, `rules/`, `skills/`, `workflows/`) required by Antigravity and modern agentic IDEs to natively discover and index skills/rules.
  2. **Cross-System Sync & CLI Ergonomics:** Factory health commands (`sync`, `doctor`, `lock`, `lint`, `diff`, `pull`) must ensure 100% deterministic alignment across internal inventory, symlink validity, host submodule/linked dependencies, and CLI control surfaces without duplicate scripts or drift.
- **Business / User Value:** Developers can initialize or attach Context Factory to any new or existing project with a single command (`context-cli bridge` or `context-cli init`), immediately equipping Antigravity, Cursor, Windsurf, Claude Code, and Copilot with fully synced, live-linked rules, skills, and orchestrator workflows.
- **Success Criteria:**
  - `context-cli bridge` automatically detects or accepts IDE targets (including `--ide antigravity` / `--ide all`) and creates appropriate `.agents/` symlinks (`AGENTS.md`, `GEMINI.md`, `agents/`, `rules/`, `skills/`, `workflows/`) pointing to the factory relative path.
  - `context-cli doctor` checks and verifies symlink integrity (dangling links, relative vs absolute targets) in both the factory itself and bridged host repositories.
  - CLI commands (`context-cli` vs `scripts/context.mjs`) have a unified architecture and single source of truth for options, flags, and execution.
  - Full synchronization workflows (`sync`, `lock`, `doctor`, `pull`) are clearly defined, automated, and documented.

### Decision Ledger

| ID | Status | Decision | Rationale / Authority |
| --- | --- | --- | --- |
| D-01 | decided | Scaffolding for Antigravity creates a real host `./.agents/` directory containing individual relative symlinks to factory subdirectories (`skills`, `rules`, `agents`, `workflows`, `AGENTS.md`, `GEMINI.md`) with cross-platform fallback (junctions on Windows). | User-confirmed on 2026-08-28; provides zero-drift live sync while allowing host repository to add custom skills/rules without collisions. |
| D-02 | decided | Support dual integration methods with auto-detection & flags: `--method submodule` (for Git/CI teams) and `--method linked` (for shared local workspaces like `../context-factory`), with interactive prompt if neither is specified in TTY. Symlinks always resolve relatively. | User-confirmed on 2026-08-28; ensures flexibility across standalone team repos and local workspace environments. |
| D-03 | decided | Implement comprehensive health diagnostics in `context-cli doctor` (verifying manifest, lock, schema, evals, and symlink integrity in both factory and host repos) with `--repair` capability and auto-healing during `context-cli pull`. | User-confirmed on 2026-08-28; eliminates silent symlink/drift breakage across both central factory and consumer host repositories. |
| D-04 | decided | Provide `--ide` profile flags (`antigravity`, `cursor`, `windsurf`, `claude`, `copilot`, `all`), add `context-cli init` interactive scaffolding alias, support global execution via `npm link`, and unify CLI execution through modular handlers under `app/cli/commands/`. | User-confirmed on 2026-08-28; gives granular IDE artifact control and clean single-source CLI maintenance. |

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a developer starting a new project, I want to run `context-cli bridge --target ./my-new-app --ide antigravity`, so that `.agents/` symlinks and IDE contracts are created instantly.*
- *As a maintainer updating context rules or skills, I want `context-cli sync` and `doctor` to guarantee that all symlinks, manifests, lock checksums, and evaluation tests stay in sync.*
- *As an engineer on a host project with a git submodule, I want `npm run context:update` (or `context-cli pull`) to pull the latest factory commits, refresh symlinks if needed, and run health diagnostics automatically.*

### Scenario Coverage

| ID | Actor / Situation | Expected Outcome | Failure / Recovery |
| --- | --- | --- | --- |
| S-01 | Developer runs `context-cli bridge` on a fresh repository targeting Antigravity. | Scaffolds `.agents/` with relative symlinks to `agents`, `rules`, `skills`, `workflows`, plus `AGENTS.md` and `GEMINI.md`. | If symlink creation fails (e.g. Windows non-admin permissions), falls back to directory junction or copies with clear warning. |
| S-02 | Developer runs `context-cli doctor` inside host repository with broken symlink. | Detects dangling symlink or missing submodule directory, flags warning/error, and suggests remediation (`context-cli bridge --force` or `git submodule update --init`). | Non-zero exit code in CI/doctor mode. |
| S-03 | Maintainer adds a new skill or rule to `context-factory`. | Running `context-cli sync` automatically discovers files, updates `context-manifest.json`, regenerates `context-lock.json`, and verifies `.agents/` symlinks in the factory. | Stale lock or missing manifest entry fails `context-cli lint` and `doctor`. |
| S-04 | Host repository already has custom local rules in `./rules/` or local skills in `./.agents/skills/`. | Bridging overlays or links factory rules/skills without overwriting or destroying host-specific local rules. | Host-specific additions are preserved. |

### Functional Requirements

- [ ] Add `.agents/` directory scaffolding and symlink generation to `app/cli/core/bridge-generator.mjs`.
- [ ] Support `--ide` flag in `context-cli bridge` (values: `antigravity`, `cursor`, `windsurf`, `claude`, `copilot`, `all`; default: `all`).
- [ ] Add cross-platform symlink utility with fallback strategy (relative symlinks on Unix/macOS, junctions/copies on Windows where symlinks are restricted).
- [ ] Add symlink integrity check to `app/cli/commands/doctor.mjs` and `scripts/validate-context.mjs`.
- [ ] Add `context-cli init` as an intuitive alias / guided setup command for new projects.
- [ ] Ensure `context-cli pull` in host repository re-verifies and repairs symlinks if submodule path or structure changed.
- [ ] Unify `scripts/harness-cli.mjs` delegation through `app/cli/` to avoid code duplication across CLI entry points.
- [ ] Synchronize documentation (`docs/guide/cross-workspace-integration.md`, `README.md`, `app/cli/README.md`) with the new bridging and sync capabilities.

### Edge Cases & Failure Modes

- **OS / Filesystem Symlink Permissions:** On Windows without Developer Mode enabled, `fs.symlink` for directories may throw `EPERM`. The bridge generator must handle this gracefully (using junction type or copy fallback with notification).
- **Existing `.agents` Directory:** If the host repository already has an `.agents` folder, existing local contents must not be blindly deleted; individual links (`skills`, `rules`, etc.) should be linked inside or merged.
- **Submodule vs Mono-repo vs Sibling Repo:** Relative paths to `context-factory` vary (`.context-factory`, `../context-factory`, `./vendor/context-factory`). Symlinks must resolve accurately relative to the host root.

## 3. Technical & Architectural Context

- **Affected Domains / Layers:** `app/cli/core/bridge-generator.mjs`, `app/cli/commands/bridge.mjs`, `app/cli/commands/doctor.mjs`, `app/cli/commands/sync.mjs`, `app/cli/bin/context-cli.mjs`, `scripts/validate-context.mjs`.
- **Existing Files & Reference Symbols:**
  - `app/cli/core/bridge-generator.mjs` (`generateBridge`)
  - `app/cli/commands/bridge.mjs` (`handleBridgeCommand`)
  - `app/cli/commands/doctor.mjs` (`handleDoctorCommand`)
  - `app/cli/core/indexer.mjs` (`syncFactoryInventory`)
  - `context-factory/.agents/` (Factory's own reference symlinks)
- **Data Model & Schema Changes:** `.context-bridge.json` configuration schema to record configured IDE profiles (`ides: ["antigravity", "cursor", ...]`) and symlink status.
- **Security & Authorization:** Symlink creation must validate that target paths stay bounded and do not link to unauthorized arbitrary system root locations.

## 4. UI/UX & Interaction Guidelines

- **CLI Commands & Ergonomics:**

  ```bash
  # Quick bridge for Antigravity in current project
  context-cli bridge --ide antigravity --method submodule

  # Or guided init in a new project
  context-cli init --target ../my-app --ide all

  # Sync & check health
  context-cli doctor
  ```

- **CLI Output:** Color-coded status table showing created symlinks (`.agents/skills -> ../context-factory/skills`, `.agents/rules -> ...`, etc.) and IDE contract files.

## 5. Scope & Boundaries

- **In Scope:**
  - Enhancing `bridge-generator` with `.agents` folder and symlinks for Antigravity.
  - Adding `--ide` profile selector.
  - Adding symlink validation to `doctor` and `lint`.
  - Adding `init` command alias.
  - Unifying CLI sync and health workflows across factory and host repositories.
- **Out of Scope / Non-Goals:**
  - Modifying the internal logic of individual rules or skills.
  - Creating proprietary closed-source IDE binary extensions.

## 6. References & External Context

- [[orchestrator/SHARED|Shared Orchestration Contract]]
- [[docs/guide/cross-workspace-integration|Cross-Workspace Integration Guide]]
- [[app/cli/README|Context Factory CLI README]]
- [[docs/decisions/0004-deterministic-context-harness|ADR 0004: Deterministic Context Harness]]
