---
title: "Submodule Environment Auto-Detection and Hybrid Assistant"
type: unit
parent: "phase-02-submodule-detection-and-cli-wizard"
unit: "02.01"
branch: "task/0001/phase-02/unit-01-submodule-detection"
worktree: ".worktrees/0001/phase-02/unit-01-submodule-detection"
status: planned
created: "2026-10-05"
tags: [task, unit, submodule, detection, cli, init]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 02.01: Submodule Environment Auto-Detection and Hybrid Assistant

> Phase: phase-02-submodule-detection-and-cli-wizard · Depends on: 01.01 · Parallelizable with: none
> Worktree: .worktrees/0001/phase-02/unit-01-submodule-detection · Branch: task/0001/phase-02/unit-01-submodule-detection

## Objective

Implement smart host/submodule detection and hybrid git submodule guidance in `app/cli/core/bridge-generator.mjs` and `app/cli/commands/init.mjs`.

## Context packet

- Current `init.mjs` target resolution: lines 31-35 defaults to `.`, without checking if CWD is the submodule itself.
- Acceptance criteria: AC-03 (submodule auto-detection & hybrid assistant).
- Decision ledger: D-01 (default submodule path `.context-factory`), D-02 (hybrid assistant).

## Preconditions

- Phase 1 completed (`01.01` merged).
- Dedicated git worktree and branch provisioned at `.worktrees/0001/phase-02/unit-01-submodule-detection`.

## Scope

- **In scope:**
  - `app/cli/core/bridge-generator.mjs`:
    - Add `detectSubmoduleContext(cwd)`: checks if `cwd` is named `.context-factory` or `context-factory`, or if `../.git` / `../.gitmodules` exists, returning `{ isInsideSubmodule: boolean, hostDir: string, relFactoryPath: string }`.
    - Add `checkHostSubmoduleStatus(hostDir)`: checks if `.gitmodules` in `hostDir` contains Context Factory.
  - `app/cli/commands/init.mjs`:
    - Apply `detectSubmoduleContext` to set default target to `..` if run inside the submodule.
    - If run in a Git repo lacking Context Factory submodule, prompt with hybrid assistant: offer to run `git submodule add` or output instructions.
- **Out of scope:**
  - Editor multi-select menu (handled in Unit 02.02).
  - Doctor diagnostics (handled in Phase 3).

## Steps

1. In `app/cli/core/bridge-generator.mjs`, implement `detectSubmoduleContext(cwd)`.
2. In `app/cli/core/bridge-generator.mjs`, implement `checkHostSubmoduleStatus(hostDir)`.
3. In `app/cli/commands/init.mjs`, integrate detection before prompts:
   - If `isInsideSubmodule`, display badge: `[SUBMODULE DETECTED] Host root: ..`.
   - If inside a host Git repo without submodule and method is `submodule`, prompt: "Add Context Factory as a git submodule now? [Y/n]".
   - If confirmed, execute `git submodule add <url> .context-factory` using `node:child_process.execFile`; if declined, print exact command for manual copy.
4. Export and test helper functions.

## Verification

- Test type: **Unit tests** — asserts path detection when executed from mock submodule directory vs mock host root.
- Cases:
  - Inside `.context-factory/`: `detectSubmoduleContext` returns `isInsideSubmodule: true` and `hostDir: '..'`.
  - Inside host repo with `.gitmodules`: `checkHostSubmoduleStatus` reports `alreadySubmoduled: true`.
  - Host repo without submodule: correctly triggers hybrid assistant branch.
- Command: `node --test tests/submodule-detection.test.mjs`

## Rollback

Revert additions to `app/cli/core/bridge-generator.mjs` and `app/cli/commands/init.mjs`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-03
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
