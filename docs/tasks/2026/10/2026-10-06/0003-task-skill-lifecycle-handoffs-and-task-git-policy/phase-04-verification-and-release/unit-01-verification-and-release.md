---
title: "Synchronize factory guidance and verify lifecycle"
type: unit
parent: "phase-04-verification-and-release"
unit: "04.01"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
checkout_mode: worktree
checkout_path: ".worktrees/PLN-0003-skill-lifecycle-handoffs"
status: planned
created: "2026-10-06"
tags: [task, unit]
depends_on: ["03.03"]
parallelizable_with: []
---

# Unit 04.01: Synchronize factory guidance and verify lifecycle

> Task branch: feat/PLN-0003-skill-lifecycle-handoffs · Depends on: 03.03 · Parallelizable: no

## Objective

Make shared guidance, catalog, maps, adapters, templates, tests, and lock agree with the new lifecycle before calling it complete.

## Context packet

orchestrator/SHARED.md describes worktree-based execution and mandatory concurrent-agent isolation. workflows/feature-delivery.md directly hands context to plan. The manifest/lock and skill maps inventory canonical files; context-maintenance requires synchronization and doctor.

Accepted policy: one task branch by default; preserve unrelated Git state; the human approves the plan; plan-review is the only downstream reader of full plan artifacts; execute consumes reviewed packets. This unit serves AC-08. Newly named paths in scope are to be created; existing paths were inspected during planning.

## Preconditions

Dependency units are verified and their phase checkpoints accepted. Recheck target branch and working-tree status. Use the planned task worktree because the primary checkout holds another task. If Git state changes enough to remove that need, obtain a revised plan-review checkout decision before execution.

## Scope

**In scope:**
- orchestrator/SHARED.md
- orchestrator/AGENTS.md
- orchestrator/CLAUDE.md
- orchestrator/CODEX.md
- orchestrator/GEMINI.md
- workflows/feature-delivery.md
- workflows/context-maintenance.md
- workflows/docs.md
- agents/ba-agent/AGENT.md
- agents/pm-agent/AGENT.md
- docs/Skills.md
- docs/Workflows.md
- docs/context/README.md
- docs/tasks/README.md
- docs/decisions/README.md
- docs/guide/skills.md
- skills/productivity/README.md
- skills/engineering/README.md
- context-manifest.json
- context-lock.json
- evals/lifecycle-conformance.test.mjs

**Out of scope:** Do not alter application code, historical task files, or old accepted ADR text.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
</language_rules>

Applicable language and architecture rules take precedence over conflicting procedural steps. Refresh source hashes through preflight before coding.

## Steps

1. Update the shared contract once and keep model adapters thin; retain the concurrent-agent worktree rule.
2. Update workflow and maps to the brief/plan/review/packet sequence, new plan naming, and legacy compatibility.
3. Register new canonical files in the manifest where required, regenerate context-lock, and run the relevant behavioral evaluations and doctor.
4. Inspect the complete diff for old per-unit-worktree instructions in active canonical guidance and report remaining historical references separately.

## Verification

- **Test type and rationale:** Integration/evaluation tests catch cross-file drift; doctor confirms manifest and lock consistency.
- **Cases:**
- New lifecycle resolves to the correct skills and artifacts.
- Historical plans remain readable without old guidance becoming the new default.
- **Commands:**
- node --test evals/lifecycle-conformance.test.mjs evals/task-scaffold.test.mjs evals/plan-check.test.mjs
- node evals/run-evals.mjs
- node scripts/context.mjs doctor
- git diff --check
- **Conformance gate:** Run context-cli preflight for exact modified scope, then context-cli conform; record PASS report ID, diff hash, and binding hash. If unavailable or blocked, leave the unit incomplete.

## Rollback

Revert synchronized guidance and catalog changes together; regenerate the lock after rollback.

## Definition of done

- [ ] AC-08 maps to this unit's passing evidence.
- [ ] All eight ACs have recorded evidence, canonical context is synchronized, and the task is ready for normal review/merge.
- [ ] Scope review finds no unallocated files.
- [ ] Required test/conformance results are recorded; no passing result is inferred from an unrun command.
- [ ] Commit message records PLN-0003 and 04.01; stop at the required checkpoint.
