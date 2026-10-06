---
title: "Strengthen context, grounding, and grill handoffs"
type: unit
parent: "phase-01-discovery-and-scenarios"
unit: "01.02"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
checkout_mode: worktree
checkout_path: ".worktrees/PLN-0003-skill-lifecycle-handoffs"
status: verified
created: "2026-10-06"
tags: [task, unit]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 01.02: Strengthen context, grounding, and grill handoffs

> Task branch: feat/PLN-0003-skill-lifecycle-handoffs · Depends on: 01.01 · Parallelizable: no

## Objective

Give discovery an evidenced readiness gate and one grill-owned release brief without allowing grill to write the context spec.

## Context packet

context/SKILL.md currently hands the context path directly to plan. grill/SKILL.md writes a task artifact in docs/tasks. grounding/SKILL.md has no explicit task-specific context handoff. The context template has no evidence inventory or blocker classification.

Accepted policy: one task branch by default; preserve unrelated Git state; the human approves the plan; plan-review is the only downstream reader of full plan artifacts; execute consumes reviewed packets. This unit serves AC-01. Newly named paths in scope are to be created; existing paths were inspected during planning.

## Preconditions

Dependency units are verified and their phase checkpoints accepted. Recheck target branch and working-tree status. Use the planned task worktree because the primary checkout holds another task. If Git state changes enough to remove that need, obtain a revised plan-review checkout decision before execution.

## Scope

**In scope:**
- `skills/productivity/context/SKILL.md`
- `skills/productivity/grill/SKILL.md`
- `skills/productivity/grounding/SKILL.md`
- `docs/templates/Context.md`
- `docs/discovery/README.md`
- `evals/discovery-handoff.test.mjs`
- `context-manifest.json`
- `context-lock.json`
- `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/README.md`
- `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-01-discovery-and-scenarios/phase.md`
- `docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-01-discovery-and-scenarios/unit-02-discovery-contract.md`

`context-manifest.json` inventories the added evaluation and `context-lock.json` must be regenerated because canonical skills and the template change. The task and phase artifacts record the accepted prior unit and this scope correction required by the doctor gate.

**Out of scope:** Do not edit plan, review, execute, CLI, or application code in this unit.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
</language_rules>

Applicable language and architecture rules take precedence over conflicting procedural steps. Refresh source hashes through preflight before coding.

## Steps

1. Add discovery inventory, scenario challenge, unknown classification, readiness, and read/write/expose declarations to the three skills.
2. Keep context sole writer of specs; make grill sole writer of docs/discovery/<feature>/record.md and brief.md; grounding contributes provenance-labeled claims to grill.
3. Define brief fields, conflict handling, source provenance, and draft/ready behavior in docs/discovery/README.md; update the context template.
4. Add contract evaluations for an unresolved authority question, conflicting grounding claim, and exactly one released brief.

## Verification

- **Test type and rationale:** Contract/architecture tests guard handoff ownership and blocking behavior that prose alone could drift on.
- **Cases:**
- Material unknown keeps context draft and prevents brief release.
- Conflicting claim is labeled and cannot become an accepted decision silently.
- **Commands:**
- node --test evals/discovery-handoff.test.mjs
- git diff --check
- **Conformance gate:** Run context-cli preflight for exact modified scope, then context-cli conform; record PASS report ID, diff hash, and binding hash. If unavailable or blocked, leave the unit incomplete.

### Execution evidence

- **Red:** `node --test evals/discovery-handoff.test.mjs` failed 3/3 because `docs/discovery/README.md` did not exist. The missing artifact and assertions covered the required unknown, conflict, and single-brief release contracts.
- **Green:** `node --test evals/discovery-handoff.test.mjs` passed 3/3 after the skill, template, discovery-contract, and manifest updates.
- **Commands:** `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy` (PASS); `node scripts/context.mjs doctor` (PASS, 31/31 evaluations); `git diff --check` (PASS).
- **Preflight:** `binding-adhoc-00-00-a89b69cc2d69`; binding hash `sha256:a89b69cc2d690842313465625057cbf2a6e9a9fb4760d6af623a94cea3e9a280`.
- **Conformance:** `report-binding-adhoc-00-00-05bbabdd2ea9-1791302540330` (PASS); binding hash `sha256:05bbabdd2ea9dcf94fbca1dc9436ef7b1c83a725fdf3b848586ed9cf383912db`; diff hash `sha256:6b78aa0b9aac6f647ee89310b685b1a81291a07afd741042682a6c308f773b1f`.
- **Scope correction:** Added the manifest and lock files before implementation because the factory doctor inventories the new evaluation and locks the changed canonical files. The task and phase artifacts record this correction and Unit 01.01 acceptance.

## Rollback

Revert the three skill/template changes and discovery record documentation together; retain the ADR as historical guidance until corrected.

## Definition of done

- [x] AC-01 maps to this unit's passing evidence.
- [x] The discovery contract is unambiguous and both negative cases fail release.
- [x] Scope review finds no unallocated files.
- [x] Required test/conformance results are recorded; no passing result is inferred from an unrun command.
- [x] Commit message records PLN-0003 and 01.02; stop at the required checkpoint.
