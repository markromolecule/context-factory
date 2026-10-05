---
title: "Submodule-First Flow & Multi-Editor Bridging Architecture (VS Code, Antigravity, Cursor, Trae)"
type: decision
status: accepted
created: "2026-10-05"
tags: [adr, cli, submodule, onboarding, bridge, ide, vscode, antigravity, cursor, trae]
---

# Submodule-First Flow & Multi-Editor Bridging Architecture (VS Code, Antigravity, Cursor, Trae)

## Context

Context Factory provides universal engineering rules, reusable skills, development workflows, and subagent orchestration contracts. In production practice, development teams integrate Context Factory into their existing host repositories primarily through Git Submodules (`.context-factory`).

Prior to this decision:
1. **Onboarding Friction:** Developers cloning or adding Context Factory as a submodule had to manually discover CLI binary paths and pass complex flags.
2. **Editor Coverage Gaps:** While Antigravity had granular symlink support, **Trae** (ByteDance AI IDE using `.trae/rules/`) was entirely unsupported, **VS Code** lacked workspace configuration and extension guidance, and **Cursor** only received legacy `.cursorrules` rather than modern `.cursor/rules/*.mdc` rule structures.
3. **Interactive Menu Usability:** The `context-cli init` menu lacked direct, numbered options for the user's primary editors: `[VS Code, Antigravity, Cursor, Trae]`, and lacked smart detection of installed editor folders (`.vscode/`, `.cursor/`, `.trae/`, `.agents/`) to streamline multi-editor team environments.

## Options Considered

### Option 1: Fragmented Manual Scripts & Per-Editor Commands
- Maintain separate manual commands for each editor (e.g. `context-cli bridge-vscode`, `context-cli bridge-trae`).
- Require developers to manually manage git submodules and run individual editor bridges.
- *Rejected:* Increases cognitive load, fragments documentation, and leads to configuration drift across mixed-editor teams.

### Option 2: Submodule-First Unified CLI Wizard with Smart Host Detection & Native Multi-Editor Bridging (Selected)
- **Submodule Flow:** Support both pre-submodule bootstrapping (guiding/running `git submodule add` into default `.context-factory`) and post-submodule execution (`node .context-factory/app/cli/bin/context-cli.mjs init`).
- **Smart Directory Detection:** The CLI automatically detects if executed from within the submodule or from the host root, resolving target directories and relative paths seamlessly.
- **First-Class Multi-Editor Selector with Smart Detection:**
  - Auto-detects existing `.vscode/`, `.cursor/`, `.trae/`, and `.agents/` directories.
  - Interactive wizard presents clear choices:
    1. **VS Code:** Scaffolds `.github/copilot-instructions.md`, non-destructive `.vscode/settings.json`, `.vscode/extensions.json`, and `AGENTS.md`.
    2. **Antigravity:** Scaffolds `.agents/` symlinks (`skills/`, `rules/`, `agents/`, `workflows/`, `AGENTS.md`, `GEMINI.md`) and `.agents/skills.json`.
    3. **Cursor:** Scaffolds `.cursor/rules/context-factory.mdc` alongside `.cursorrules` and `AGENTS.md`.
    4. **Trae:** Scaffolds `.trae/rules/project_rules.md` and `AGENTS.md`.
    5. **All IDEs / Multi-select:** Allows selecting multiple editors (e.g. `1, 4` or `All`) so mixed-editor teams are supported in a single repository without conflict.
- **Lifecycle Integration:** Injects host `package.json` scripts (`context:update` for `git submodule update --remote --merge`, `context:doctor`, `context:resolve`).
- *Selected:* Zero external dependencies, non-destructive, zero drift, and fully covers all 4 target editors.

### Option 3: Heavyweight Global CLI / Binary Daemon
- Build a global standalone binary or background daemon watching filesystem events across workspaces.
- *Rejected:* Violates the lightweight, zero-dependency pure Node.js ESM architecture of Context Factory; introduces unnecessary operational overhead.

## Decision

Adopt **Option 2**. We enhance `context-cli`, `init.mjs`, and `bridge-generator.mjs` to establish a clean 3-step onboarding flow:
1. `git submodule add <url> .context-factory`
2. Run `context-cli` wizard (`node .context-factory/app/cli/bin/context-cli.mjs init`)
3. Select preferred code editor(s) `[VS Code, Antigravity, Cursor, Trae]` to automatically generate tailored bridge configurations.

### Key Architectural Decisions:
- **D-01 (Default Submodule Path):** Standardize on `.context-factory` (hidden dot-folder) to preserve a clean host project root, while supporting visible `context-factory` or custom paths.
- **D-02 (Hybrid Submodule Assistant):** If `context-cli init` is run before submoduling, offer to run `git submodule add` or output the exact command.
- **D-03 (Trae IDE Integration):** Scaffold `.trae/rules/project_rules.md` referencing Context Factory's orchestrator contract, rules, and workflows.
- **D-04 (VS Code Integration):** Scaffold `.github/copilot-instructions.md`, `.vscode/settings.json`, and `.vscode/extensions.json` with safe JSON merge (never overwriting user settings).
- **D-05 (Modern Cursor Rules):** Scaffold `.cursor/rules/context-factory.mdc` with frontmatter `alwaysApply: true` while preserving root `.cursorrules` compatibility.
- **D-06 (Smart Host Auto-Detection):** If CLI is invoked from within a submodule, default target to `..` (host repository root) and compute relative paths accordingly.
- **D-07 (Multi-Select & Auto-Detection):** Scan host project for existing IDE folders to recommend pre-selections, and allow multi-selection (e.g., `1, 3, 4` or `All`).

## Consequences

- **Positive:** Intuitive, streamlined onboarding experience for developers adding Context Factory to any project via Git Submodule.
- **Positive:** Native, first-class support for all 4 leading AI coding editors: VS Code, Antigravity, Cursor, and Trae.
- **Positive:** Cross-functional teams can use different editors in the same repository without file conflicts or configuration drift.
- **Positive:** Safe merging ensures existing `.vscode/settings.json` and `.cursor/rules` are never destroyed.
- **Neutral:** Host repositories will maintain lightweight editor rule folders (`.trae/`, `.cursor/`, `.agents/`, `.vscode/`), which should be checked into version control.

## Validation and Review Date

- Verification via `node app/cli/bin/context-cli.mjs doctor` auditing all 4 editor artifacts.
- Review date: 2026-11-05.
