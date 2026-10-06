---
title: "Skill Lifecycle Handoffs and Task Git Policy"
type: task
status: in_progress
created: "2026-10-06"
tags: [task, skills, workflow]
plan_id: "PLN-0003"
target_branch: master
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
checkout_mode: worktree
checkout_path: ".worktrees/PLN-0003-skill-lifecycle-handoffs"
---

# Skill Lifecycle Handoffs and Task Git Policy

## Outcome

Implement the accepted skill lifecycle in [the ready context specification](../../../../../context/skills/skill-lifecycle-handoffs-and-git-policy.md): evidenced discovery and grilling; one released brief from `grill`; a plan done-check; one task branch by default; conditional worktrees; repo-wide atomic plan IDs; declared access boundaries with lint; reviewed, freshness-checked execution packets; safe worktree cleanup. Preserve existing test-first, conformance, human approval, and phase checkpoint gates.

This is a **planning artifact, not execution approval**. `plan-review` must audit it cold before work begins. The directory and `README.md` are a bootstrap exception produced by the current `task:new` scaffold, which cannot yet create the proposed branch-mirrored filename. This plan also used the ready context specification directly because the released-brief mechanism does not yet exist; the new handoff rule applies after implementation. Before Unit 01.01, the approved bootstrap package below puts this plan and its context specification on the task branch so every later session can read them from its own checkout.

## Pre-planning record

### Actors and decisions

The developer has confirmed: declared boundaries plus automated lint (no orchestrator ACL now); one task branch by default; extra unit branches only for justified concurrency; a review-issued execution packet; `grill` as sole owner of the released brief; `grounding` supplying claims into that brief; a separate `grill` record; `PLN-NNNN` with atomic repo-wide reservation. Human plan approval remains required by `workflows/feature-delivery.md`.

### Current-state evidence

| Surface | Verified state | Impact |
|---|---|---|
| `skills/productivity/context/SKILL.md` | Directly hands context path to plan | Replace with `grill`/brief handoff |
| `skills/productivity/grill/SKILL.md` | Starts a record under `docs/tasks/` | Give discovery its own owner and location |
| `skills/productivity/plan/SKILL.md` | Requires three-tier branches and worktree per unit | Replace with task branch decision |
| `skills/productivity/plan-review/SKILL.md` | Assumes worktree per unit and reads full plan | Validate mode and issue bounded packet |
| `skills/engineering/execute/SKILL.md` | Reads/updates plan and uses force cleanup | Consume packet, write ledger, preserve residual files |
| `scripts/task-workflow.mjs` | Allocates IDs within a day, emits legacy topology, lists only `README.md` plans | Add repo-wide reservation, new scaffold and legacy discovery |
| `scripts/plan-check.mjs` | Checks unit graph, scopes and rule bindings | Extend to done-check, topology, and handoff freshness |
| `orchestrator/SHARED.md` | Requires worktrees for concurrent agents and describes worktree-based execution | Retain concurrency rule, change serial default |
| `docs/templates/{Context,Task,Phase,Unit}.md` | Reflect direct handoffs and per-unit worktrees | Update artifact contracts |
| ADRs 0014, 0015, 0024 | Preserve direct context-to-plan and/or unit-worktree rationale | Supersede the conflicting choices in a new ADR |

### Stack and rules

Markdown plus Node.js ESM and Git. `rules/global/evidence-and-claims.md` governs claims and verification; `rules/global/architecture-conformance.md` governs boundary changes; relevant TypeScript-common rules are candidates only where their applicability includes the touched file scope. Unit bindings below cite current rule source hashes; re-run preflight and refresh hashes when executing.

### Scenario coverage

| Scenario | Expected behavior | Unit(s) |
|---|---|---|
| S01 clean serial task | One task branch, no extra worktree | 02.01, 02.02 |
| S02 dirty unrelated checkout | Task worktree, original checkout preserved | 02.01, 02.02 |
| S03 concurrent agents/units | Mandatory isolation, disjoint scopes, explicit merge order | 02.02, 03.03 |
| S04 material context unknown | Context remains draft; no brief | 01.02 |
| S05 conflicting claim | Labeled conflict; no silent decision | 01.02 |
| S06 changed source after handoff | Downstream freshness check fails | 03.02 |
| S07 simultaneous ID claims | Exactly one reservation wins; loser retries | 02.01 |
| S08 negative boundary sentence | Lint accepts prohibition, rejects positive forbidden read | 03.01 |
| S09 residual worktree files | Cleanup stops without force deletion | 03.03 |
| S10 historical plan | Remains listable and follows recorded legacy metadata | 02.01, 02.02 |

## Acceptance criteria

| ID | Criterion and pass condition | Unit(s) | Verification |
|---|---|---|---|
| AC-01 | Context/grill/grounding contracts capture evidence, challenge assumptions, stop on blockers, and release exactly one `grill` brief | 01.02 | `node --test evals/discovery-handoff.test.mjs` and `git diff --check` exit 0 |
| AC-02 | New ADR names owners, handoffs, tradeoffs, and supersedes incompatible portions of ADRs 0014/0024 without rewriting them | 01.01 | ADR link/precedence inspection, `node scripts/context.mjs doctor`, and `git diff --check` exit 0 |
| AC-03 | Two concurrent ID requests cannot claim the same `PLN-NNNN`; new filename/branch mirror, old plans list | 02.01 | `node --test evals/task-scaffold.test.mjs evals/plan-id-reservation.test.mjs` and `git diff --check` exit 0 |
| AC-04 | Plan records one branch and justified checkout mode; done-check rejects missing AC mapping, blocker, risk, or invalid topology | 02.02 | `node --test evals/plan-check.test.mjs` and `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy` exit 0 |
| AC-05 | Access declarations and lint reject forbidden positive reads across lifecycle and downstream skills but accept negated examples | 03.01 | `node --test evals/skill-access-check.test.mjs` exits 0; the forbidden-read fixture exits nonzero with a skill/path/line diagnostic |
| AC-06 | Brief and packet hashes are computed/checked; stale or unapproved input blocks downstream action | 03.02 | `node --test evals/handoff-contract.test.mjs` exits 0; stale and unapproved fixtures exit nonzero |
| AC-07 | Reviewer issues packets after review and human approval; execute/test/review/verify/docs use bounded handoffs; executor uses ledger, stops at checkpoints, and preserves residual files | 03.03 | `node --test evals/execution-handoff.test.mjs` and `git diff --check` exit 0 |
| AC-08 | Shared contract, adapters, workflows, templates, maps, manifest, lock, and evaluations agree; doctor passes | 04.01 | Focused evals, `node evals/run-evals.mjs`, `node scripts/context.mjs doctor`, `git diff --check` |

## Scope

The six lifecycle skills and related test/review/verify/docs consumers, discovery/execution artifact contracts, task scaffold and checker, focused handoff/lint tooling, tests, shared guidance, templates, and one superseding ADR. New `docs/discovery/` and `docs/execution/` files are created by the implemented workflow, not fabricated as runtime output during planning.

## Non-goals

Orchestrator file ACLs; changes to application code; retroactive renaming of historical plans/branches; automatic GitHub publication; removal of human review, test-first, conformance, or phase stops.

## Risk and dependency register

| Risk | Likelihood / impact | Mitigation and owner |
|---|---|---|
| Current scaffold and accepted ADRs contradict the new policy | Certain / medium | ADR first; synchronize scaffold, templates, checker, skills, and maps; owner: unit 04.01 |
| Git ref reservation leaves an orphan after scaffold failure | Medium / low | Define retry/release or recoverable reservation state; test crash and rerun; owner: unit 02.01 |
| Filename change hides plans from `task:list` | High / medium | List named masters and legacy `README.md` plans; owner: unit 02.01 |
| Static lint gives false positives or misses indirect behavior | Medium / medium | Parse declarations and positive read instructions; test negation; document non-security limit; owner: unit 03.01 |
| Brief/packet hash drift strands active work | Medium / medium | Precise mismatch diagnostics and reissue path; owner: unit 03.02 |
| Execution change drops existing gates | Medium / high | Retain batch/phase stops, test-first and conformance; evaluate both new and legacy paths; owner: unit 03.03 |
| Bootstrap package is missing from the task checkout | Certain before setup / high | Create and commit the reviewed context and plan package before Unit 01.01; verify its exact paths and commit SHA; owner: bootstrap executor |

## Branch and worktree decision

| Field | Decision |
|---|---|
| Target branch | `master` (verified local branch; do not assume `main`) |
| Task branch | `feat/PLN-0003-skill-lifecycle-handoffs` (planned name; create during approved execution) |
| Checkout mode for this plan | `worktree`: primary checkout currently holds the separate session-checkpoint task branch |
| Worktree trigger | Another task/agent needs this checkout, unrelated uncommitted work prevents switching, or long-running task isolation is needed |
| Unit branches/worktrees | None in this plan; units execute sequentially on the task branch |
| Current planning checkout | `task/0002-session-checkpoint-reliability` was clean before these planning docs; preserve it and put approved implementation in a task worktree |
| Bootstrap package | Commit the reviewed context specification and complete task directory on the new task branch before Unit 01.01 |
| Finalization | Normal review/merge of task branch to `master`; no automatic merge by this plan |

The first execution session must inspect Git state again. Use the recorded task worktree while the session-checkpoint task occupies the primary checkout. If that condition has ended and a branch-only checkout is preferred, `plan-review` must record the change before issuing packets. No unit-specific worktrees are allocated.

## Bootstrap package and cold-start handoff

The context specification and task directory are untracked in the primary checkout at planning time. After this plan passes review and the developer approves execution, but before Unit 01.01, the bootstrap executor must:

1. Confirm `master` is the target branch, the planned task branch and worktree path do not already exist, and the source package consists only of `docs/context/skills/skill-lifecycle-handoffs-and-git-policy.md` and `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/`.
2. Create `.worktrees/PLN-0003-skill-lifecycle-handoffs` on `feat/PLN-0003-skill-lifecycle-handoffs` from `master`; copy that exact reviewed package into the new worktree without copying unrelated primary-checkout files.
3. Run `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy` and `git diff --check` in the new worktree. Stop if either fails.
4. Commit only the two package paths with a message containing `PLN-0003 bootstrap reviewed plan`; record the resulting commit SHA in the plan's finalization ledger before starting Unit 01.01.

This is a transitional, reviewed bootstrap exception while Unit 03.03 has not yet implemented execution packets. It preserves the primary checkout and gives each later task-worktree session an identical, tracked plan package.

## Phases and dependency graph

| Phase | Unit | Outcome | Depends on | Parallel? |
|---|---|---|---|---|
| 01 Discovery contract | 01.01 | Superseding ADR | none | no |
| 01 Discovery contract | 01.02 | Context/grill/grounding and brief contract | 01.01 | no |
| 02 Planning/Git | 02.01 | Atomic IDs, scaffold, task listing | 01.02 | no |
| 02 Planning/Git | 02.02 | Plan skill/templates/checker and branch decision | 02.01 | no |
| 03 Access/handoff | 03.01 | Boundary declaration lint | 02.02 | no |
| 03 Access/handoff | 03.02 | Brief/packet freshness tooling | 03.01 | no |
| 03 Access/handoff | 03.03 | Reviewer/executor packet and cleanup workflow | 03.02 | no |
| 04 Synchronization | 04.01 | Shared guidance, inventory, eval, doctor | 03.03 | no |

Each unit commits on the task branch with `PLN-0003` and its unit ID in the message. No parallel unit allocation is planned. Keep phase and developer checkpoints before advancing.

## Verification

Planning-only checks: `node scripts/context.mjs plan:check <this directory>` and `git diff --check`. These check structure and formatting, not approval or implemented behavior. During execution, each unit runs its focused tests and conformance gate; the final unit runs the broader evaluations and doctor.

## Deviations and blockers

- The current `task:new` scaffold created a legacy daily-ID directory and `README.md`. Renaming this bootstrap artifact before the new listing/scaffold code exists would make it undiscoverable to the current CLI. The new convention applies to plans created after unit 02.01.
- The proposed PLN-0003 label for this bootstrap plan follows its current scaffold ID; the future atomic reservation mechanism does not yet exist. Check for a conflicting reservation before creating the task branch.
- The reviewed bootstrap package is the only permitted direct plan/context handoff for this task before Unit 03.03. Execution still requires fresh `plan-review` and human plan approval.

## Finalization ledger

| Stage | Evidence | Status |
|---|---|---|
| Phase 01–04 checkpoints | Unit tests, conformance receipts, reviewer packet/ledger checks | pending |
| Bootstrap reviewed plan package | Context specification and complete task directory; `plan:check` and cached diff check passed | `0ac8b0f` (`docs(PLN-0003): bootstrap reviewed plan package`) |
| Task branch review and merge to `master` | AC-01–AC-08 evidence and diff review | pending |
| Worktree cleanup, if one was needed | Clean checkout and normal `git worktree remove` | pending |

## Result

Pending implementation and independent plan review.
