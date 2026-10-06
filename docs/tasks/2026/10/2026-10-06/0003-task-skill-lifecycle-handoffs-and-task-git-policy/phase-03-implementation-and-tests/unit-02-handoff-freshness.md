---
title: "Verify discovery briefs and execution packets"
type: unit
parent: "phase-03-implementation-and-tests"
unit: "03.02"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
checkout_mode: worktree
checkout_path: ".worktrees/PLN-0003-skill-lifecycle-handoffs"
status: planned
created: "2026-10-06"
tags: [task, unit]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 03.02: Verify discovery briefs and execution packets

> Task branch: feat/PLN-0003-skill-lifecycle-handoffs · Depends on: 03.01 · Parallelizable: no

## Objective

Compute and verify source hashes so planning and execution stop when an approved handoff becomes stale.

## Context packet

Current skills pass paths directly. There is no discovery brief or packet freshness command; the current plan:check audits units but has no upstream source-hash comparison. Existing CLI routing is in scripts/harness-cli.mjs.

Accepted policy: one task branch by default; preserve unrelated Git state; the human approves the plan; plan-review is the only downstream reader of full plan artifacts; execute consumes reviewed packets. This unit serves AC-06. Newly named paths in scope are to be created; existing paths were inspected during planning.

## Preconditions

Dependency units are verified and their phase checkpoints accepted. Recheck target branch and working-tree status. Use the planned task worktree because the primary checkout holds another task. If Git state changes enough to remove that need, obtain a revised plan-review checkout decision before execution.

## Scope

**In scope:**
- scripts/handoff-contract.mjs
- scripts/harness-cli.mjs
- scripts/plan-check.mjs
- evals/handoff-contract.test.mjs

**Out of scope:** Do not implement per-skill ACLs, change Git topology, or create approval packets from an unreviewed plan.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
</language_rules>

Applicable language and architecture rules take precedence over conflicting procedural steps. Refresh source hashes through preflight before coding.

## Steps

1. Define tracked brief and packet metadata with source paths, SHA-256 hashes, owner, status, and exact review/approval references.
2. Add release/verify operations: grill releases brief, plan-check verifies brief; plan-review issues packets only after review and recorded human approval; execute verifies packets before work.
3. Fail closed with a mismatch diagnostic and reissue instruction; test changed context, changed brief, changed plan, missing approval, and valid unchanged inputs.

## Verification

- **Test type and rationale:** Contract tests cover artifact serialization and freshness across process boundaries.
- **Cases:**
- Editing the source spec after brief release blocks planning.
- Editing the plan or missing approval blocks packet use.
- **Commands:**
- node --test evals/handoff-contract.test.mjs
- git diff --check
- **Conformance gate:** Run context-cli preflight for exact modified scope, then context-cli conform; record PASS report ID, diff hash, and binding hash. If unavailable or blocked, leave the unit incomplete.

## Rollback

Stop issuing new packets and revert the handoff CLI/contract; retain existing artifacts for inspection rather than deleting them.

## Definition of done

- [ ] AC-06 maps to this unit's passing evidence.
- [ ] Every stale or unapproved handoff fails before execution.
- [ ] Scope review finds no unallocated files.
- [ ] Required test/conformance results are recorded; no passing result is inferred from an unrun command.
- [ ] Commit message records PLN-0003 and 03.02; stop at the required checkpoint.
