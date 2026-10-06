---
title: "Reserve repo-wide plan IDs and scaffold named plans"
type: unit
parent: "phase-02-architecture-and-contracts"
unit: "02.01"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
checkout_mode: worktree
checkout_path: ".worktrees/PLN-0003-skill-lifecycle-handoffs"
status: verified
created: "2026-10-06"
tags: [task, unit]
depends_on: ["01.02"]
parallelizable_with: []
---

# Unit 02.01: Reserve repo-wide plan IDs and scaffold named plans

> Task branch: feat/PLN-0003-skill-lifecycle-handoffs · Depends on: 01.02 · Parallelizable: no

## Objective

Allocate PLN-NNNN once across worktrees and make new task plans and branches discoverable without losing legacy plans.

## Context packet

scripts/task-workflow.mjs findNextTaskId scans only one date directory; scaffoldTask emits task/<id> phase/unit branches and README.md; listTasks recognizes only README.md. evals/task-scaffold.test.mjs asserts those shapes.

Accepted policy: one task branch by default; preserve unrelated Git state; the human approves the plan; plan-review is the only downstream reader of full plan artifacts; execute consumes reviewed packets. This unit serves AC-03. Newly named paths in scope are to be created; existing paths were inspected during planning.

## Preconditions

Dependency units are verified and their phase checkpoints accepted. Recheck target branch and working-tree status. Use the planned task worktree because the primary checkout holds another task. If Git state changes enough to remove that need, obtain a revised plan-review checkout decision before execution.

## Scope

**In scope:**
- `scripts/task-workflow.mjs`
- `scripts/plan-id-reservation.mjs`
- `evals/task-scaffold.test.mjs`
- `evals/plan-id-reservation.test.mjs`
- `context-manifest.json`
- `context-lock.json`
- `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/README.md`
- `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-02-architecture-and-contracts/phase.md`
- `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-02-architecture-and-contracts/unit-01-architecture-and-contracts.md`

`context-manifest.json` inventories the new script and evaluation, and `context-lock.json` must be regenerated because canonical tooling changes. The task and phase artifacts record this scope correction and execution evidence.

**Out of scope:** Do not revise plan skills/templates or existing task directories in this unit.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
</language_rules>

Applicable language and architecture rules take precedence over conflicting procedural steps. Refresh source hashes through preflight before coding.

## Steps

1. Create an atomic, shared-Git reservation of the next four-digit PLN ID; retry when another worktree wins, and define recovery of an unused reservation after scaffold failure.
2. Generate branch <type>/PLN-NNNN-<slug> and a master filename matching it with slash replaced by hyphen; enforce allowed types and slug rules.
3. Update task listing to discover named master files and historical README.md plans without duplicate results.
4. Add independent-worktree collision, failed-scaffold recovery, slug rejection, and legacy-listing cases.

## Verification

- **Test type and rationale:** Integration tests cross the filesystem/Git-ref boundary and catch race or discoverability failures.
- **Cases:**
- Two concurrent reservations return distinct IDs.
- A historical README.md plan and a new named plan both appear once in task:list.
- **Commands:**
- node --test evals/task-scaffold.test.mjs evals/plan-id-reservation.test.mjs
- git diff --check
- **Conformance gate:** Run context-cli preflight for exact modified scope, then context-cli conform; record PASS report ID, diff hash, and binding hash. If unavailable or blocked, leave the unit incomplete.

### Execution evidence

- **Red:** `node --test evals/plan-id-reservation.test.mjs` failed because `scripts/plan-id-reservation.mjs` did not exist.
- **Green:** `node --test evals/task-scaffold.test.mjs evals/plan-id-reservation.test.mjs` passed 8/8. It covers concurrent unique reservations, owner-checked release, failed-scaffold recovery, allowed branch/slug validation, named-plan scaffolding, and legacy plus named plan listing.
- **Commands:** `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy` (PASS); `node scripts/context.mjs doctor` (PASS, 31/31 evaluations); `git diff --check` (PASS).
- **Preflight:** `binding-adhoc-00-00-95d3441ac4de`; binding hash `sha256:95d3441ac4dea053261c6829252078da97adc9562203a4eb76037e40945dc028`.
- **Conformance:** `report-binding-adhoc-00-00-2975aa149146-1791303732549` (PASS); binding hash `sha256:2975aa149146e4c705523f236b9e2a007455c3943d653ada51ce519ad625c5e4`; diff hash `sha256:cbefcd955cfb9cf66f1d04c2d69ee1ffcf9711b7a7fff5c6e0a8153fcba25859`.
- **Scope correction:** Added the manifest and lock because this unit creates a canonical script and evaluation; the task artifacts record that synchronization requirement.

## Rollback

Revert new allocation/listing for new plans only; do not recycle already reserved IDs or rename existing plans.

## Definition of done

- [x] AC-03 maps to this unit's passing evidence.
- [x] New IDs are unique and old/new plans remain findable.
- [x] Scope review finds no unallocated files.
- [x] Required test/conformance results are recorded; no passing result is inferred from an unrun command.
- [x] Commit message records PLN-0003 and 02.01; stop at the required checkpoint.
