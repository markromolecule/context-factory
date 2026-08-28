---
title: Cross-Workspace Integration Guide
type: guide
tags: [guide, integration, submodule, workspace, multi-repo, cli, antigravity, symlinks]
---

# Cross-Workspace Integration Guide

This guide covers how to integrate and use **Context Factory** across multiple projects and repositories. It explains how to bridge host projects so AI agents (especially **Antigravity**) natively discover skills, rules, and workflows via `.agents/` symlinks, how to use `context-cli init` and `context-cli bridge`, how to scope generated documentation to the host repository, and how to maintain health synchronization across workspaces.

---

## 1. Quick Start: Scaffolding a Host Project

You can bridge Context Factory into any new or existing project with a single command:

```sh
# Option A: Interactive guided wizard (prompted for directory, method, and IDEs)
context-cli init

# Option B: Direct bridge targeting Antigravity using Git Submodule
context-cli bridge --target ./my-app --ide antigravity --method submodule

# Option C: Direct bridge for all IDEs in a shared local workspace
context-cli bridge --target ./my-app --ide all --method linked
```

### What `context-cli bridge` Generates:
1. **`.agents/` Directory & Symlinks (for Antigravity):**
   - `.agents/skills` $\rightarrow$ `<factoryPath>/skills`
   - `.agents/rules` $\rightarrow$ `<factoryPath>/rules`
   - `.agents/agents` $\rightarrow$ `<factoryPath>/agents`
   - `.agents/workflows` $\rightarrow$ `<factoryPath>/workflows`
   - `.agents/AGENTS.md` $\rightarrow$ `<factoryPath>/AGENTS.md`
   - `.agents/GEMINI.md` $\rightarrow$ `<factoryPath>/GEMINI.md`
2. **IDE Entry Point Contracts:** `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`.
3. **Scaffolding Directories:** `docs/tasks/README.md`, `docs/decisions/README.md`, `rules/README.md`.
4. **Bridge Configuration:** `.context-bridge.json`.
5. **Host `package.json` Scripts:** Helper scripts for context resolution, doctor diagnostics, updates, and task planning.

---

## 2. Integration Methods Comparison

| Method | Best For | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **1. Git Submodule (`--method submodule`)** *(Recommended for teams)* | Shared team repos & CI/CD | Strict version pinning, clean commit history, easy remote updates | Requires `git submodule update --init` on clone |
| **2. Shared Local Link (`--method linked`)** *(Recommended for local dev)* | Local workstation multi-project setup (e.g. `htdocs/` or `~/projects/`) | Instant real-time live updates across all local repos without commits | Works on local machine paths |
| **3. Git Subtree** | Repositories needing zero submodule friction | Single-command clone, no external submodule dependencies | Heavier host repository git history |

---

## 3. Host Project Architecture & Scoping

When skills like `plan` or `adr` run in a bridged setup, generated artifacts always land in the **host repository**:

```
HOST_REPO_ROOT/
├── .agents/                    <-- Real folder with relative symlinks to Context Factory
│   ├── skills                  --> .context-factory/skills (or ../context-factory/skills)
│   ├── rules                   --> .context-factory/rules (or ../context-factory/rules)
│   ├── agents                  --> .context-factory/agents
│   ├── workflows               --> .context-factory/workflows
│   ├── AGENTS.md               --> .context-factory/AGENTS.md
│   └── GEMINI.md               --> .context-factory/GEMINI.md
├── .context-factory/           <-- Submodule (Framework / Rules / Engine / Templates)
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
1. **Always open the Host Repository Root in your IDE**: Never open `.context-factory/` directly unless you are developing the context factory itself.
2. **Antigravity automatically discovers skills & rules**: Native scanning of `.agents/skills/` and `.agents/rules/` indexes all capabilities immediately.
3. **Artifacts are written to the host root**: `./docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/`, `./docs/context/`, and `./docs/decisions/`.

---

## 4. Diagnostics & Self-Healing Maintenance

### Checking Health (`doctor`)
Run `doctor` inside any bridged project to verify manifest synchronization, lock integrity, and symlink validity:

```sh
# Run doctor diagnostic
npm run context:doctor
# Or via CLI:
context-cli doctor

# Automatically repair any broken or missing symlinks:
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
