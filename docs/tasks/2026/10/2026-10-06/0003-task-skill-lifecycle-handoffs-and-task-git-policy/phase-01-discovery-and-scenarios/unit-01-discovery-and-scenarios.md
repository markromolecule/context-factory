---
title: "Record the superseding lifecycle decision"
type: unit
parent: "phase-01-discovery-and-scenarios"
unit: "01.01"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
checkout_mode: worktree
checkout_path: ".worktrees/PLN-0003-skill-lifecycle-handoffs"
status: planned
created: "2026-10-06"
tags: [task, unit]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Record the superseding lifecycle decision

> Task branch: feat/PLN-0003-skill-lifecycle-handoffs · Depends on: none · Parallelizable: no

## Objective

Record the accepted ownership, handoff, Git, and compatibility choices in one new ADR before changing canonical behavior.

## Context packet

ADRs 0014 and 0024 currently describe direct context-to-plan ingestion and unit-worktree execution. ADR 0015 preserves strict phase stops; those stops remain. The user accepted a review-issued packet, one grill brief, declared boundaries plus lint, and one task branch by default.

Accepted policy: one task branch by default; preserve unrelated Git state; the human approves the plan; plan-review is the only downstream reader of full plan artifacts; execute consumes reviewed packets. This unit serves AC-02. Newly named paths in scope are to be created; existing paths were inspected during planning.

## Preconditions

Dependency units are verified and their phase checkpoints accepted. Recheck target branch and working-tree status. Use the planned task worktree because the primary checkout holds another task. If Git state changes enough to remove that need, obtain a revised plan-review checkout decision before execution.

## Scope

**In scope:**
- docs/decisions/0031-skill-lifecycle-handoffs-and-task-git-policy.md

**Out of scope:** Do not edit prior accepted ADRs, skills, scripts, or production files.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431

</language_rules>

Applicable language and architecture rules take precedence over conflicting procedural steps. Refresh source hashes through preflight before coding.

## Steps

1. Use docs/templates/Decision.md to record context, options, decision, tradeoffs, migration, and validation.
2. State which clauses of ADRs 0014 and 0024 this decision supersedes; preserve the phase-stop choice in ADR 0015.
3. Define the context, brief, plan, packet, and execution-ledger owners and the branch/worktree decision in the ADR.

## Verification

- **Test type and rationale:** Documentation contract review: inspect the new ADR for explicit precedence, owner matrix, rejected alternatives, compatibility, and validation criteria. No unit test mirrors a prose-only decision.
- **Cases:**
- Existing ADR history remains intact.
- Reviewer can tell how an old plan differs from a plan created after this ADR.
- **Commands:**
- git diff --check
- node scripts/context.mjs doctor
- **Conformance gate:** Run context-cli preflight for exact modified scope, then context-cli conform; record PASS report ID, diff hash, and binding hash. If unavailable or blocked, leave the unit incomplete.

## Rollback

Remove the new ADR if no later unit depends on it; otherwise supersede it with a corrective decision.

## Definition of done

- [ ] AC-02 maps to this unit's passing evidence.
- [ ] A single accepted decision is reviewable and names the source of every new lifecycle contract.
- [ ] Scope review finds no unallocated files.
- [ ] Required test/conformance results are recorded; no passing result is inferred from an unrun command.
- [ ] Commit message records PLN-0003 and 01.01; stop at the required checkpoint.
