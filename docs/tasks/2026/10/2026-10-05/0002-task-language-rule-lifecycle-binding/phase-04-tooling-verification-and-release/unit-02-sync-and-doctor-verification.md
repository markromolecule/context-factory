---
title: "Full Lifecycle Synchronization & Doctor Verification"
type: unit
parent: "0002/phase-04"
unit: "04.02"
branch: "task/0002/phase-04/sync-and-doctor"
worktree: ".worktrees/0002/phase-04/sync-and-doctor"
status: planned
created: "2026-10-05"
tags: [task, unit, sync, doctor, release]
depends_on: ["04.01"]
parallelizable_with: []
---

# Unit 04.02: Full Lifecycle Synchronization & Doctor Verification

> Phase: 0002/phase-04 · Depends on: 04.01 · Parallelizable with: none
> Worktree: .worktrees/0002/phase-04/sync-and-doctor · Branch: task/0002/phase-04/sync-and-doctor

## Objective

Run full Context Factory synchronization (`npm run sync`) to refresh the manifest, lockfile digest, and Obsidian maps of content, and verify that `npm run doctor` passes with 100% HEALTHY across all diagnostics and evaluations.

## Context packet

- Current state: All units from phases 1 through 4 have executed and merged into `task/0002-language-rule-lifecycle-binding`.
- Acceptance criteria: AC-09.
- Decision ledger: D-01 through D-06 in ADR 0027.

<language_rules>
- `rules/global/evidence-and-claims.md`: Never report completion without fresh, verified command outputs.
- `rules/global/architecture-conformance.md`: Ensure lockfile and manifest remain synchronized with behavior.
</language_rules>

## Preconditions

- Unit 04.01 merged into `task/0002/phase-04`.
- Dedicated worktree provisioned at `.worktrees/0002/phase-04/sync-and-doctor`.

## Scope

**In scope:** `context-manifest.json`, `context-lock.json`, Obsidian MOCs (`docs/rules.md`, `docs/skills.md`, etc.).
**Out of scope:** Production code outside synchronization artifacts.

## Steps

1. Run `npm run sync` to update `context-manifest.json`, regenerate MOCs, and refresh `context-lock.json`.
2. Run `npm run doctor` to execute all diagnostic suites (manifest lint, lockfile integrity, symlinks, evaluations).
3. Confirm that all 23 evaluations pass and zero warnings or failures remain.
4. Log verification output in this unit's Verification section.

## Verification

- Test type: Full system diagnostic & Evaluation suite.
- Case: Context factory doctor returns HEALTHY exit code 0.
- Command: `npm run doctor`

## Rollback

Revert changes to `context-manifest.json` and `context-lock.json` with `git checkout context-manifest.json context-lock.json`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-09
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
