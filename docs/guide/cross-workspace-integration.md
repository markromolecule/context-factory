---
title: Cross-Workspace Integration Guide
type: guide
tags: [guide, integration, submodule, workspace, multi-repo, cli, antigravity, symlinks]
---

# Cross-Workspace Integration Guide

This guide covers how to integrate and use **Context Factory** across multiple projects and repositories. It explains how to bridge host projects so AI agents (especially **Antigravity**) natively discover skills, rules, and workflows via `.agents/` symlinks, how to use `context-cli init` and `context-cli bridge`, how to scope generated documentation to the host repository, and how to maintain health synchronization across workspaces.

---

## 1. Quick Start: Submodule-First Onboarding

Context Factory connects to host repositories through a clean 3-step flow:

### Step 1: Add as a Git Submodule
In your host repository root, add Context Factory as a submodule pointing to `.context-factory`:
```sh
git submodule add <context-factory-git-url> .context-factory
```
*(Tip: Running `node path/to/context-factory/app/cli/bin/context-cli.mjs init` before submoduling will detect the host and offer a hybrid assistant to run or display the command!)*

### Step 2: Launch the Onboarding Wizard
Run the CLI `init` wizard from within the submodule (it automatically detects the host repository root):
```sh
node .context-factory/app/cli/bin/context-cli.mjs init
```

### Step 3: Select Your Preferred AI Code Editor(s)
The wizard scans your repository for existing editor directories (`.vscode/`, `.cursor/`, `.trae/`, `.agents/`) and presents a numbered multi-select prompt:
- `[1] VS Code` — Scaffolds `.github/copilot-instructions.md`, non-destructive `.vscode/settings.json`, and `.vscode/extensions.json`.
- `[2] Antigravity` — Scaffolds `.agents/` live symlinks (`skills/`, `rules/`, `agents/`, `workflows/`, `AGENTS.md`, `GEMINI.md`) and `.agents/skills.json`.
- `[3] Cursor` — Scaffolds modern `.cursor/rules/context-factory.mdc` (with `alwaysApply: true`) and `.cursorrules`.
- `[4] Trae` — Scaffolds `.trae/rules/project_rules.md` referencing Context Factory orchestrator contracts and rules.
- `[5] All IDEs` — Bridges all supported editors for mixed-editor teams.

Input numbers (e.g. `1, 4` or `All`) to configure one or more editors without conflicts.

```sh
# Or bridge non-interactively with CLI flags:
context-cli bridge --target ./my-app --ide vscode,trae --method submodule
```

---

## 2. Editor Support & Configuration Details

### Trae IDE (`.trae/rules/project_rules.md`)
ByteDance's Trae AI IDE uses `.trae/rules/project_rules.md` to define project-level agent rules. Context Factory scaffolds this file with direct directives pointing to the shared orchestrator contract, universal rules, workflows, and task scaffolds.

### VS Code & GitHub Copilot
Context Factory creates:
- `.github/copilot-instructions.md` containing core directives and context resolution guides.
- `.vscode/extensions.json` recommending Copilot and Copilot Chat.
- `.vscode/settings.json` configuring markdown associations for `.mdc` rule files using **safe JSON merging** (existing user themes, fonts, and preferences are strictly preserved).

### Cursor IDE
Context Factory provisions:
- Modern `.cursor/rules/context-factory.mdc` with frontmatter `alwaysApply: true`, ensuring agents automatically index Context Factory rules.
- Legacy `.cursorrules` in the root directory for backward compatibility.

### Antigravity & Gemini
Context Factory establishes native `.agents/` symlinks linking rules, workflows, agents, and individual skills directly into the Antigravity discovery root, alongside `GEMINI.md`.

---

## 3. Integration Methods Comparison

| Method | Best For | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **1. Git Submodule (`--method submodule`)** *(Recommended for teams)* | Shared team repos & CI/CD | Strict version pinning, clean commit history, easy remote updates | Requires `git submodule update --init` on clone |
| **2. Shared Local Link (`--method linked`)** *(Recommended for local dev)* | Local workstation multi-project setup (e.g. `htdocs/` or `~/projects/`) | Instant real-time live updates across all local repos without commits | Works on local machine paths |
| **3. Git Subtree** | Repositories needing zero submodule friction | Single-command clone, no external submodule dependencies | Heavier host repository git history |

---

## 4. Host Project Architecture & Scoping

When skills like `plan`, `context`, or `adr` run in a bridged setup, generated artifacts always land in the **host repository**:

```
HOST_REPO_ROOT/
├── .agents/                    <-- Symlinks for Antigravity (skills, rules, workflows)
├── .trae/rules/                <-- Trae AI rules (project_rules.md)
├── .cursor/rules/              <-- Cursor modern rules (context-factory.mdc)
├── .github/                    <-- VS Code Copilot instructions
├── .vscode/                    <-- Merged VS Code settings and extensions
├── .context-factory/           <-- Git Submodule (Framework / Rules / Engine / Templates)
├── .context-bridge.json        <-- Bridge configuration metadata
├── docs/                       <-- TARGET: Host repo artifacts
│   ├── context/                <-- Context specifications for this project
│   ├── decisions/              <-- Accepted ADRs for THIS project
│   └── tasks/                  <-- Phased implementation plans
├── rules/                      <-- Project-specific local rules and overrides
├── src/                        <-- Host source code
└── AGENTS.md                   <-- Universal orchestrator entry point
```

### Key Working Rules:
1. **Always open the Host Repository Root in your IDE**: Open the project root in VS Code, Antigravity, Cursor, or Trae.
2. **Native AI rule discovery**: Each editor's AI agent immediately detects its tailored configuration folder.
3. **Artifacts are written to the host root**: `./docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/`, `./docs/context/`, and `./docs/decisions/`.

---

## 5. Diagnostics & Self-Healing Maintenance

### Checking Health (`doctor`)
Run `doctor` inside any bridged project to verify manifest synchronization, lock integrity, symlink validity, and editor artifact integrity:

```sh
# Run doctor diagnostic
npm run context:doctor
# Or via CLI:
context-cli doctor

# Automatically repair broken/missing symlinks and regenerate missing editor rules:
context-cli doctor --repair
```

### Pulling Updates (`pull`)
In a host project with a Git submodule, pull latest upstream updates and auto-heal symlinks:

```sh
# Run pull via npm script or CLI:
npm run context:update
# Or:
context-cli pull
```

`context-cli pull` automatically:
1. Updates the submodule to the latest remote commit.
2. Re-verifies and auto-heals `.agents/` symlinks.
3. Executes `context-cli doctor` diagnostics.

---

## 5. Team Onboarding

When other team members or CI runners clone a bridged repository:

```sh
# Clone with submodules
git clone --recurse-submodules <host-repo-url>

# Verify health
npm run context:doctor
```
