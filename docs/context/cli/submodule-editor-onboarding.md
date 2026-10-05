---
title: "Submodule-First Flow & Multi-Editor Bridging (VS Code, Antigravity, Cursor, Trae)"
type: context
status: ready
created: "2026-10-05"
tags: [context, cli, submodule, onboarding, bridge, ide, vscode, antigravity, cursor, trae]
feature: "submodule-editor-onboarding"
---

# Submodule-First Flow & Multi-Editor Bridging Context Specification

## 1. Overview & Objective

- **Problem Statement:** 
  Developers adopting Context Factory currently face a fragmented onboarding experience:
  1. Integrating via Git Submodule requires discovering the internal CLI path manually and passing custom flags.
  2. The interactive setup wizard (`init` / `bridge`) lacks first-class support for **VS Code** (GitHub Copilot, `.vscode/` settings/extensions) and **Trae** (ByteDance AI IDE with `.trae/rules/`), and only generates legacy `.cursorrules` for Cursor rather than modern `.cursor/rules/*.mdc`.
  3. When launching `context-cli` from inside a newly added submodule or the host root, relative paths and submodule locations must be manually configured rather than automatically detected.
- **Business / User Value:** 
  Provides a frictionless, unified 3-step onboarding workflow for host repositories:
  1. **Git Submodule:** Add Context Factory as a submodule (defaults to `.context-factory`, with auto-detection and hybrid assistant in CLI).
  2. **Launch Context CLI:** Run the interactive onboarding wizard (`context-cli init` or `node .context-factory/app/cli/bin/context-cli.mjs init`).
  3. **Select Code Editor(s):** Choose from `[VS Code, Antigravity, Cursor, Trae]`, with smart auto-detection of existing editor folders, multi-select capability, and non-destructive configuration bridging.
- **Success Criteria:**
  - `context-cli init` auto-detects if running inside or alongside a host repo, defaulting submodule destination to `.context-factory`.
  - If submodule is missing, CLI offers to run `git submodule add` or provides the exact command.
  - Interactive editor selection supports `[1] VS Code, [2] Antigravity, [3] Cursor, [4] Trae, [5] All IDEs`, with support for comma-separated multi-selection (e.g., `1, 3, 4`).
  - First-class bridge generation for:
    - **VS Code:** `.github/copilot-instructions.md`, non-destructive `.vscode/settings.json`, `.vscode/extensions.json`, `AGENTS.md`.
    - **Antigravity:** `.agents/` symlinks (`skills/`, `rules/`, `agents/`, `workflows/`, `AGENTS.md`, `GEMINI.md`) and `.agents/skills.json`.
    - **Cursor:** `.cursor/rules/context-factory.mdc` alongside `.cursorrules` and `AGENTS.md`.
    - **Trae:** `.trae/rules/project_rules.md` and `AGENTS.md`.
  - Host `package.json` is updated with helper scripts (`context:update`, `context:doctor`, `context:resolve`, `context:cli`).
  - `context-cli doctor` verifies health across all 4 editor artifacts.

### Decision Ledger

| ID | Status | Decision | Rationale / Authority |
| --- | --- | --- | --- |
| D-01 | decided | Default submodule path is `.context-factory` (hidden dot-folder) to preserve a clean host project root, with flexibility to specify custom locations. | User-confirmed on 2026-10-05. |
| D-02 | decided | Hybrid Submodule Assistant: Auto-detect existing submodule. If not yet added, prompt to run `git submodule add` or display copy-paste command. | User-confirmed on 2026-10-05. |
| D-03 | decided | Multi-select editor bridging with smart detection: Scan for `.vscode/`, `.cursor/`, `.trae/`, `.agents/`, pre-select detected editors, and allow multi-selection (`1, 4` or `All`) without cross-editor conflict. | User-confirmed on 2026-10-05. |
| D-04 | decided | Trae IDE Support: Generate `.trae/rules/project_rules.md` pointing to Context Factory rules, workflows, and `orchestrator/SHARED.md`. | User-confirmed on 2026-10-05. |
| D-05 | decided | VS Code Support: Generate `.github/copilot-instructions.md`, `.vscode/settings.json`, and `.vscode/extensions.json` with safe JSON merge. | User-confirmed on 2026-10-05. |
| D-06 | decided | Modern Cursor Rules: Generate `.cursor/rules/context-factory.mdc` with YAML frontmatter `alwaysApply: true` while keeping `.cursorrules` compatibility. | User-confirmed on 2026-10-05. |

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a developer in a new project, I want to run `git submodule add <url> .context-factory && node .context-factory/app/cli/bin/context-cli.mjs init`, so that I am guided through editor selection and bridge generation.*
- *As a developer in a team where teammates use Trae, Cursor, and VS Code, I want to select all three editors during `init`, so that the repository is immediately ready for everyone.*
- *As a Trae user, I want `.trae/rules/project_rules.md` generated with clear pointers to factory rules, so that Trae AI follows project architecture.*
- *As a VS Code user with existing `.vscode/settings.json`, I want context-factory settings merged without overwriting my custom editor settings.*
- *As a developer pulling updates, I want `npm run context:update` to pull submodule changes and auto-verify symlinks and rule health with `doctor`.*

### Scenario Coverage

| ID | Actor / Situation | Expected Outcome | Failure / Recovery |
| --- | --- | --- | --- |
| S-01 | Developer runs `context-cli init` in a Git repository without submodule. | CLI detects Git repo, notes missing submodule, prompts: "Add .context-factory submodule now? [Y/n]", executes command or prints fallback. | Gracefully continues with local linking if git command fails. |
| S-02 | Developer runs `context-cli init` from inside `./.context-factory`. | CLI recognizes it is inside a submodule, sets target to parent directory `..`, and configures relative paths correctly. | Falls back to prompt if parent cannot be determined. |
| S-03 | Repository has existing `.vscode/settings.json`. | CLI parses existing JSON and merges Context Factory properties without clobbering existing user keys. | If JSON is malformed, creates `.vscode/settings.context-factory.json` with warning. |
| S-04 | Developer selects multiple editors (e.g. `1, 4` for VS Code + Trae). | CLI generates artifacts for both VS Code and Trae without conflict. | Table reports status of all created/updated artifacts. |
| S-05 | Developer runs `context-cli doctor` on bridged host repository. | Validates symlinks for Antigravity, rules files for Trae, `.cursor/rules/` for Cursor, and `.github/` for VS Code. | Flags any missing or broken files with repair recommendations. |

### Functional Requirements

- [ ] Support `--ide vscode`, `--ide trae`, `--ide cursor`, `--ide antigravity`, `--ide all`, and comma-separated combinations in `bridge` and `init`.
- [ ] Add `.trae/rules/project_rules.md` scaffolding in `app/cli/core/bridge-generator.mjs`.
- [ ] Add `.github/copilot-instructions.md`, `.vscode/settings.json`, and `.vscode/extensions.json` in `bridge-generator.mjs`.
- [ ] Add `.cursor/rules/context-factory.mdc` alongside `.cursorrules`.
- [ ] Implement smart IDE folder scanning in `init.mjs` to auto-detect installed editor environments.
- [ ] Implement submodule detection: detect if current directory or parent directory contains `.context-factory` or `.gitmodules`.
- [ ] Update `context-cli doctor` to audit Trae, VS Code, and Cursor rule health.
- [ ] Update documentation (`README.md`, `app/cli/README.md`, `docs/guide/cross-workspace-integration.md`) with the 3-step submodule onboarding flow.

### Edge Cases & Failure Modes

- **Submodule Not Initialized After Git Clone:** When another developer clones the host repo without `--recursive`, `.context-factory` is empty. The CLI / doctor command should detect empty submodule directory and suggest `git submodule update --init --recursive`.
- **Read-Only / Protected Filesystem:** If `.vscode/settings.json` is read-only, handle EACCES with informative error message.
- **Windows Junctions Across Submodule:** Symlinks in `.agents/` targeting `./.context-factory/...` must maintain correct relative depth when using junctions.

## 3. Technical & Architectural Context

- **Affected Files:**
  - `app/cli/core/bridge-generator.mjs`: Core bridging logic for Trae, VS Code, Cursor, Antigravity.
  - `app/cli/commands/init.mjs`: Interactive onboarding wizard with submodule detection and editor menu.
  - `app/cli/commands/bridge.mjs`: Bridge command arguments and output formatting.
  - `app/cli/commands/doctor.mjs`: Health verification for all 4 editor artifacts.
  - `docs/guide/cross-workspace-integration.md`: Updated onboarding documentation.
- **Security & Permissions:**
  - Non-destructive writes: never overwrite existing `.vscode/settings.json` or `.cursor/rules` without merging.
  - Git submodule commands executed via standard `child_process` with proper argument sanitization.

## 4. UI/UX & Interaction Guidelines

- **Interactive CLI Experience:**
  ```text
  INIT Initialize Context Factory in Host Project

  1. Host Project Directory: . (Detected)
  2. Integration Method: Git Submodule (Path: .context-factory)
  3. Detected Editor Environments: [VS Code, Cursor]
  4. Select Target Code Editors:
     [1] VS Code        (Copilot instructions, .vscode settings & extensions, AGENTS.md)
     [2] Antigravity    (.agents/ live symlinks, AGENTS.md, GEMINI.md)
     [3] Cursor         (.cursor/rules/context-factory.mdc, .cursorrules, AGENTS.md)
     [4] Trae           (.trae/rules/project_rules.md, AGENTS.md)
     [5] All IDEs       (Bridge for all team editors)
  Enter choices (e.g. 1,4 or 5) [default: detected / 5]: 
  ```

## 5. Scope & Boundaries

- **In Scope:**
  - 3-step submodule onboarding flow (`submodule -> cli -> editor selection`).
  - Native bridging for VS Code, Antigravity, Cursor, Trae.
  - Multi-select and auto-detection in `init` wizard.
  - Health check and repair in `doctor`.
  - Non-destructive JSON merge for VS Code configuration.
- **Out of Scope:**
  - Binary editor extension packaging.
  - Direct modifications to internal rules/skills content.

## 6. References & External Context

- [[docs/decisions/0017-ide-bridging-and-symlink-synchronization-architecture|ADR 0017: IDE Bridging and Symlink Synchronization Architecture]]
- [[docs/decisions/0026-submodule-first-ide-onboarding-flow|ADR 0026: Submodule-First Multi-Editor Onboarding Flow]]
- [[app/cli/README|Context Factory CLI README]]
- [[docs/guide/cross-workspace-integration|Cross-Workspace Integration Guide]]
