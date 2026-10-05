---
title: "Skills Catalog Sync & Doctor Verification"
type: unit
parent: "0003/phase-03"
unit: "03.02"
branch: "task/0003/phase-03/sync-and-doctor"
worktree: ".worktrees/0003/phase-03/sync-and-doctor"
status: planned
created: "2026-10-05"
tags: [task, unit, skills, sync, doctor, release]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 03.02: Skills Catalog Sync & Doctor Verification

> Phase: 0003/phase-03 · Depends on: 03.01 · Parallelizable with: none
> Worktree: .worktrees/0003/phase-03/sync-and-doctor · Branch: task/0003/phase-03/sync-and-doctor

## Objective

Update `skills/engineering/README.md` and `skills/README.md` to document and wiki-link the new `perf` and `types` skills, run full repository synchronization via `npm run sync`, and verify Context Factory diagnostic health with `npm run doctor`.

## Context packet

- Acceptance criteria: AC-08, AC-09.
- Decision ledger: D-02 in ADR 0028; ADR 0020 (Categorical Skill Grouping and Group Index Invariants).
- Dependency outputs: `perf` and `types` skills authored and wired into `review`.

<language_rules>
- `rules/global/architecture-conformance.md`: Ensure lockfile and manifest remain synchronized with behavior.
- `rules/global/evidence-and-claims.md`: Never report completion without fresh, verified command outputs.
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 03.01 merged into `task/0003/phase-03-integration`.
- Dedicated git worktree and branch provisioned at declared path.

## Scope

**In scope:** `skills/engineering/README.md`, `skills/README.md`, `context-manifest.json`, `context-lock.json`, Obsidian MOCs (`docs/skills.md`).
**Out of scope:** Core skill implementation (covered in Phase 2).

## Steps

1. In `skills/engineering/README.md`:
   - Add `perf` and `types` to the member skills table with descriptions, primary triggers, and wiki-links per ADR 0020 invariants.
2. In `skills/README.md`:
   - Update total skill counts and categorical summaries to reflect the addition of `perf` and `types` (raising engineering skills to 9 and total skills to 18).
3. Run `npm run sync` to register `perf` and `types` in `context-manifest.json`, regenerate MOCs, and refresh `context-lock.json`.
4. Run `npm run doctor` to execute all diagnostic suites (manifest lint, lockfile integrity, symlinks, evaluations).
5. Run `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-05/0003-task-cli-ux-and-code-health-skills` to confirm valid plan structure.
6. Confirm 100% HEALTHY and zero errors.

## Verification

- Test type: Full system diagnostic & Evaluation suite.
- Case 1: `node scripts/context.mjs doctor` returns HEALTHY exit code 0.
- Case 2: `node scripts/context.mjs plan:check` against the current task directory passes cleanly.
- Command: `npm run doctor`

## Rollback

Revert index and synchronization changes via `git checkout`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-08, AC-09
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
