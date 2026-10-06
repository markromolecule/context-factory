---
title: "Apply task-branch policy and plan done-check"
type: unit
parent: "phase-02-architecture-and-contracts"
unit: "02.02"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
checkout_mode: worktree
checkout_path: ".worktrees/PLN-0003-skill-lifecycle-handoffs"
status: verified
created: "2026-10-06"
tags: [task, unit]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 02.02: Apply task-branch policy and plan done-check

> Task branch: feat/PLN-0003-skill-lifecycle-handoffs · Depends on: 02.01 · Parallelizable: no

## Objective

Replace mandatory per-unit worktrees with a recorded task checkout decision and reject incomplete plans before review.

## Context packet

plan/SKILL.md and docs/templates/{Task,Phase,Unit}.md prescribe task/phase/unit branches and unit worktrees. plan-review/SKILL.md Gate 3 validates this topology. scripts/plan-check.mjs currently checks graph, overlap, and rule bindings but not all readiness fields.

Accepted policy: one task branch by default; preserve unrelated Git state; the human approves the plan; plan-review is the only downstream reader of full plan artifacts; execute consumes reviewed packets. This unit serves AC-04. Newly named paths in scope are to be created; existing paths were inspected during planning.

## Preconditions

Dependency units are verified and their phase checkpoints accepted. Recheck target branch and working-tree status. Use the planned task worktree because the primary checkout holds another task. If Git state changes enough to remove that need, obtain a revised plan-review checkout decision before execution.

## Scope

**In scope:**
- `skills/productivity/plan/SKILL.md`
- `docs/templates/Task.md`
- `docs/templates/Phase.md`
- `docs/templates/Unit.md`
- `scripts/task-workflow.mjs`
- `scripts/plan-check.mjs`
- `evals/task-scaffold.test.mjs`
- `evals/plan-check.test.mjs`
- `context-manifest.json`
- `context-lock.json`
- `context-manifest.json`
- `context-lock.json`
- `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/README.md`
- `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-02-architecture-and-contracts/phase.md`
- `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-02-architecture-and-contracts/unit-02-planning-contract.md`

The renderer is included because it populates the templates for newly scaffolded plans. `context-lock.json` must be regenerated for the canonical skill, templates, and scripts; task artifacts record the scope correction and execution evidence.

**Out of scope:** Do not edit plan-review or execute skill; their handoff behavior is assigned later.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
</language_rules>

Applicable language and architecture rules take precedence over conflicting procedural steps. Refresh source hashes through preflight before coding.

## Steps

1. Change plan and templates to default one task branch, with checkout_mode, reason, path, target branch, and optional concurrent-unit exceptions.
2. Define decision criteria for clean serial work, dirty unrelated work, parallel tasks/agents, and long-running isolation; keep concurrent-agent worktrees mandatory.
3. Add a done-check for AC-to-unit/test mapping, blockers, risks, dependency cycles, disjoint concurrent scope, and checkout justification.
4. Extend plan:check and fixtures to accept recorded legacy plans but validate the new format; preserve language-rule binding checks.

## Verification

- **Test type and rationale:** Contract tests must prove accepted serial/isolated plans and reject missing mapping, blocker, and invalid checkout mode.
- **Cases:**
- Clean serial plan passes with one branch and no unit worktree.
- A plan with a blocking unknown or invalid concurrent scope fails.
- **Commands:**
- node --test evals/plan-check.test.mjs
- node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy
- **Conformance gate:** Run context-cli preflight for exact modified scope, then context-cli conform; record PASS report ID, diff hash, and binding hash. If unavailable or blocked, leave the unit incomplete.

### Execution evidence

- **Red/green:** Added complete-plan and blocker/checkout rejection cases; focused plan-check and scaffold suites passed 19/19.
- **Conformance:** `report-binding-adhoc-00-00-b748f500e201-1791304996276` (PASS); binding hash `sha256:b748f500e201878993af55d82d77dc75a4e980c7e1feea1df1f66bab8ab9ff21`; diff hash `sha256:bf5db34d1fe5602c13e7ed8564960ac49d2c049b80bf2da22f816288f3806ecf`.

## Rollback

Restore the old parser/template/skill set together; leave created plan directories untouched.

## Definition of done

- [x] AC-04 maps to this unit's passing evidence.
- [x] The checker can distinguish a complete plan from a merely scaffolded one.
- [x] Scope review finds no unallocated files.
- [x] Required test/conformance results are recorded; no passing result is inferred from an unrun command.
- [x] Commit message records PLN-0003 and 02.02; stop at the required checkpoint.
