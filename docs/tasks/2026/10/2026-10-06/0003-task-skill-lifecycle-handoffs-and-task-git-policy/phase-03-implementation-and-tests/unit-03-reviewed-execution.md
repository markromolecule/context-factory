---
title: "Consume reviewed packets and preserve worktrees"
type: unit
parent: "phase-03-implementation-and-tests"
unit: "03.03"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
checkout_mode: worktree
checkout_path: ".worktrees/PLN-0003-skill-lifecycle-handoffs"
status: verified
created: "2026-10-06"
tags: [task, unit]
depends_on: ["03.02"]
parallelizable_with: []
---

# Unit 03.03: Consume reviewed packets and preserve worktrees

> Task branch: feat/PLN-0003-skill-lifecycle-handoffs · Depends on: 03.02 · Parallelizable: no

## Objective

Make plan-review the sole downstream plan reader and make execute use reviewed packets, one task branch, a separate ledger, and safe cleanup.

## Context packet

plan-review/SKILL.md reads full plans and assumes unit worktrees. execute/SKILL.md reads/updates README.md and unit files, creates per-unit worktrees, and routinely calls git worktree remove --force. test-first, conformance, and phase checkpoint gates must remain.

Accepted policy: one task branch by default; preserve unrelated Git state; the human approves the plan; plan-review is the only downstream reader of full plan artifacts; execute consumes reviewed packets. This unit serves AC-07. Newly named paths in scope are to be created; existing paths were inspected during planning.

## Preconditions

Dependency units are verified and their phase checkpoints accepted. Recheck target branch and working-tree status. Use the planned task worktree because the primary checkout holds another task. If Git state changes enough to remove that need, obtain a revised plan-review checkout decision before execution.

## Scope

**In scope:**
- skills/productivity/plan-review/SKILL.md
- skills/engineering/execute/SKILL.md
- skills/engineering/test/SKILL.md
- skills/engineering/review/SKILL.md
- skills/engineering/verify/SKILL.md
- skills/productivity/docs/SKILL.md
- docs/execution/README.md
- evals/execution-handoff.test.mjs
- context-manifest.json
- context-lock.json
- docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-03-implementation-and-tests/phase.md
- docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-03-implementation-and-tests/unit-03-reviewed-execution.md

The manifest inventories the execution-handoff evaluation and the lock pins canonical skill changes; task artifacts record execution evidence.

**Out of scope:** Do not modify production code, bypass approval, or rewrite historical execution logs.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
</language_rules>

Applicable language and architecture rules take precedence over conflicting procedural steps. Refresh source hashes through preflight before coding.

## Steps

1. Update plan-review to compare plan against the single grill brief, validate checkout mode/done-check, and issue one packet per ready unit after review and human approval.
2. Update execute and its test/review/verify/docs consumers to use the current packet, released brief, ledger, and code evidence rather than direct plan or context reads; recheck Git state, use the task worktree, and write docs/execution/PLN-NNNN/ledger.md.
3. Retain test-first, preflight/conformance receipts, independent review, batch and phase stops; use unit IDs in commits.
4. Replace force cleanup with clean-status inspection and normal worktree removal; report residual files and stop.
5. Add evaluations for packet-only inputs, old-plan compatibility, approval absence, phase stop, and dirty cleanup.

## Verification

- **Test type and rationale:** Contract evaluations guard cross-skill boundary and destructive cleanup behavior.
- **Cases:**
- Unapproved packet never starts code work.
- Untracked file blocks worktree cleanup and remains intact.
- **Commands:**
- node --test evals/execution-handoff.test.mjs
- git diff --check
- **Conformance gate:** Run context-cli preflight for exact modified scope, then context-cli conform; record PASS report ID, diff hash, and binding hash. If unavailable or blocked, leave the unit incomplete.

### Execution evidence

- **Focused checks:** `node --test evals/execution-handoff.test.mjs` passed 3/3. `git diff --check` passed.
- **Conformance:** PASS `report-binding-adhoc-00-00-2a362448af1a-1791307383663`; binding hash `sha256:2a362448af1a66bdaf3c1c589715d1a03d21e845cc511af20308167a2eae54e0`; diff hash `sha256:b760dcd8e6982483a00c12902b147a7f92327e11e7150cbec4dca08f79bc745b`.

## Rollback

Restore reviewer/executor skills together; preserve packet and ledger artifacts for audit.

## Definition of done

- [x] AC-07 maps to this unit's passing evidence.
- [x] No direct plan read remains in execute and all existing safety gates are retained.
- [x] Scope review finds no unallocated files.
- [x] Required test/conformance results are recorded; no passing result is inferred from an unrun command.
- [x] Commit message records PLN-0003 and 03.03; stop at the required checkpoint.
