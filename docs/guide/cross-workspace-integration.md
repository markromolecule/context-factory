---
title: Cross-Workspace Integration Guide
type: guide
tags: [guide, integration, submodule, workspace, multi-repo]
---

# Cross-Workspace Integration Guide

This guide covers how to integrate and use **Context Factory** across multiple projects and repositories. It explains how to set it up as a Git submodule or via alternative methods, how to configure host projects so agents consume the factory properly, how to scope generated documentation to the host repository, and how to maintain and update the factory across workspaces.

---

## Integration Methods Comparison

| Method | Best For | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **1. Git Submodule** *(Recommended)* | Shared team repos & multi-repo setups | Strict version pinning, clean commit history, easy bidirectional updates | Requires `submodule update` on clone |
| **2. Git Subtree** | Repositories needing zero submodule friction | Single-command clone, no external submodule dependencies | Heavier host repository git history |
| **3. Symlink / Shared Path** | Local workstation / single developer multi-project setup | Instant real-time updates across all local repos with zero syncing | Local-only; doesn't commit factory to remote git |
| **4. Template / Fork** | Brand new projects starting from scratch | Fully standalone and independent | Difficult to pull upstream changes later |

---

## Method 1: Git Submodule (Recommended)

### 1. Add Context Factory as a Submodule
From the root of your consumer / host repository, run:

```sh
# Add the submodule into .context-factory (recommended hidden directory)
git submodule add https://github.com/markromolecule/context-factory.git <folder>
git commit -m "chore: add context-factory submodule"
	- create .gitignore # To ignore the tasks folder & context
```

> [!TIP]
> Placing the submodule inside `.context-factory` or `.agents/context-factory` keeps your host repository root clean while keeping the factory accessible to scripts and agent configurations.

---

### 2. Configure the Host Bridge (`AGENTS.md` / `CLAUDE.md` / `.cursorrules`)

AI agents (Antigravity, Cursor, Claude Code, Copilot) need an entry point in the host repo that instructs them to use the factory.

Create or update `AGENTS.md` at the **root of your host repository**:

```markdown
# Host Project AI Agent Instructions

This repository uses **Context Factory** (located at `.context-factory/`) for development rules, workflows, and skills.

## Agent Load Order & Execution Contract
1. **Contract**: Read the shared orchestration contract in `.context-factory/orchestrator/SHARED.md`.
2. **Context Resolution**: For multi-step tasks, resolve matching rules and skills:
   `node .context-factory/scripts/context.mjs resolve "<task description>"`
3. **Universal Standards**: Follow rules in `.context-factory/rules/` and skills in `.context-factory/skills/`.
4. **Host Specifics**: Combine universal rules with project-specific rules in `./rules/` or `./.agents/rules/`.

## Generated Documentation Scoping Contract
- **Task Plans**: All implementation plans and phase breakdowns generated via the `implementation-plan` skill MUST be written to `./docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/` in **this host repository**, NEVER inside `.context-factory/`.
- **Decisions (ADRs)**: All architecture decisions generated via `architecture-decision` MUST be saved in `./docs/decisions/` in **this host repository**.
- **Templates**: Always load templates from `.context-factory/docs/templates/Task.md`, `Phase.md`, and `Decision.md`.
```

---

### 3. Add Host `package.json` Scripts

Add convenience scripts to your host repository's `package.json`:

```json
{
  "scripts": {
    "context:resolve": "node .context-factory/scripts/context.mjs resolve",
    "context:bundle": "node .context-factory/scripts/context.mjs bundle",
    "context:doctor": "node .context-factory/scripts/context.mjs doctor",
    "context:update": "git submodule update --remote --merge .context-factory && npm run context:doctor"
  }
}
```

Now developers and agents in the host repo can simply run:
```sh
npm run context:resolve "implement auth service"
```

---

### 4. Developer & Team Onboarding

When other team members or CI environments clone your host repository, they should initialize the submodule:

```sh
# Option A: Clone with submodules
git clone --recurse-submodules <host-repo-url>

# Option B: Initialize in an existing clone
git submodule update --init --recursive
```

---

## Solving the "Spin-Up" & Document Scoping Problem

When skills like `implementation-plan` or `architecture-decision` run inside a nested submodule setup, follow these rules to ensure generated artifacts land in the parent workspace:

```
HOST_REPO_ROOT/
├── .context-factory/           <-- Submodule (Framework / Engine / Templates)
│   ├── docs/templates/         <-- SOURCE: Task.md, Phase.md, Decision.md
│   ├── rules/                  <-- SOURCE: Universal engineering rules
│   ├── skills/                 <-- SOURCE: Skill procedures
│   └── scripts/                <-- SOURCE: Context resolution tools
├── docs/                       <-- TARGET: Host repo artifacts
│   ├── decisions/              <-- OUTPUT: Accepted ADRs for THIS project
│   └── tasks/                  <-- OUTPUT: Phased implementation plans
├── src/                        <-- Host source code
└── AGENTS.md                   <-- Bridge configuration
```

### Key Working Rules:
1. **Always open the Host Repository Root in your IDE**: Never open `.context-factory/` directly unless you are developing the context factory itself.
2. **Templates are read from the submodule**: `.context-factory/docs/templates/Task.md`.
3. **Artifacts are written to the host root**: `./docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/` and `./docs/decisions/`.

---

## Method 2: Git Subtree (Submodule Alternative)

If your team prefers not to manage Git submodules, you can embed Context Factory directly into the repository using `git subtree`.

### Adding as a Subtree:
```sh
git subtree add --prefix .context-factory <context-factory-git-url> main --squash
```

### Pulling Updates:
```sh
git subtree pull --prefix .context-factory <context-factory-git-url> main --squash
```

### Benefits:
- Clones cleanly with standard `git clone` without requiring `--recurse-submodules`.
- Entire context engine is part of the host repo tree.

---

## Method 3: Local Shared Symlink (Local Development)

If you have multiple local repositories on your machine and want them all to immediately reflect edits to Context Factory without Git commits:

```sh
# Inside host project root
ln -s /path/to/local/context-factory .context-factory
```

> [!NOTE]
> Symlinks are local-only and not committed to remote git repositories. Use this for rapid local prototyping across multiple workspaces.

---

## Syncing & Maintenance Workflow

### Updating Context Factory in Host Repositories

#### 1. Fetch the Latest Factory Version
```sh
# Pull latest changes from context-factory remote
git submodule update --remote --merge .context-factory
```

#### 2. Run Diagnostics
Verify that the updated submodule is internally consistent and that its lockfile matches:
```sh
node .context-factory/scripts/context.mjs doctor
```

#### 3. Commit the Updated Submodule Pointer in Host Repo
```sh
git add .context-factory
git commit -m "chore(context): update context-factory submodule"
```

### Pushing Fixes from a Host Submodule back to Context Factory
If you improve a rule or skill while working inside a host repo:
```sh
cd .context-factory
git checkout main
git add .
git commit -m "feat(rules): refine mutation hook constraints"
git push origin main

# Return to host repo and commit the new pointer
cd ..
git add .context-factory
git commit -m "chore(context): bump context-factory to include mutation hook updates"
```
