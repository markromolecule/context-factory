---
title: "Lint skill access declarations"
type: unit
parent: "phase-03-implementation-and-tests"
unit: "03.01"
task_branch: "feat/PLN-0003-skill-lifecycle-handoffs"
checkout_mode: worktree
checkout_path: ".worktrees/PLN-0003-skill-lifecycle-handoffs"
status: verified
created: "2026-10-06"
tags: [task, unit]
depends_on: ["02.02"]
parallelizable_with: []
---

# Unit 03.01: Lint skill access declarations

> Task branch: feat/PLN-0003-skill-lifecycle-handoffs · Depends on: 02.02 · Parallelizable: no

## Objective

Make the declared read/write/expose boundary testable while keeping it explicitly non-security enforcement.

## Context packet

The six skills currently have no machine-readable access declarations; positive direct reads of docs/context and docs/tasks appear in plan/execute. scripts/harness-cli.mjs exposes plan:check; no boundary lint exists.

Accepted policy: one task branch by default; preserve unrelated Git state; the human approves the plan; plan-review is the only downstream reader of full plan artifacts; execute consumes reviewed packets. This unit serves AC-05. Newly named paths in scope are to be created; existing paths were inspected during planning.

## Preconditions

Dependency units are verified and their phase checkpoints accepted. Recheck target branch and working-tree status. Use the planned task worktree because the primary checkout holds another task. If Git state changes enough to remove that need, obtain a revised plan-review checkout decision before execution.

## Scope

**In scope:**
- scripts/skill-access-check.mjs
- scripts/harness-cli.mjs
- evals/skill-access-check.test.mjs
- context-manifest.json
- context-lock.json
- docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-03-implementation-and-tests/phase.md
- docs/tasks/2026/10/2026-10-06/0003-task-skill-lifecycle-handoffs-and-task-git-policy/phase-03-implementation-and-tests/unit-01-implementation-and-tests.md

The manifest inventories the new checker and contract test; the lock pins those canonical paths after regeneration. The phase and unit artifacts record the scope correction and execution evidence.

**Out of scope:** Do not build runtime file ACLs or modify the six skill files in this unit.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
</language_rules>

Applicable language and architecture rules take precedence over conflicting procedural steps. Refresh source hashes through preflight before coding.

## Steps

1. Define and parse a small access declaration for each skill; validate it against the six-skill allowlist and artifact owner matrix.
2. Detect positive read instructions involving forbidden source paths, while allowing negative prohibitions and historical explanation.
3. Expose a nonzero lint command adjacent to `plan:check`, with skill/path/line diagnostics; add positive, forbidden, negated, and malformed-declaration cases.

## Verification

- **Test type and rationale:** Contract tests catch both underblocking and false positives at the documentation boundary.
- **Cases:**
- execute positively reading docs/tasks fails with a line-specific error.
- execute saying not to read docs/tasks passes.
- **Commands:**
- node --test evals/skill-access-check.test.mjs
- git diff --check
- **Conformance gate:** Run context-cli preflight for exact modified scope, then context-cli conform; record PASS report ID, diff hash, and binding hash. If unavailable or blocked, leave the unit incomplete.

### Execution evidence

- **Focused checks:** node --test evals/skill-access-check.test.mjs passed 3/3; node scripts/context.mjs skill:access-check skills/productivity/context/SKILL.md passed; an intentionally incomplete execute declaration returned a path-and-line diagnostic; node scripts/context.mjs doctor passed 31/31; the task plan:check passed; and git diff --check passed.
- **Conformance:** Preflight for the exact modified scope had no deterministic binding. With the repository user's explicit continuation authorization as human evidence, context-cli conform evaluated the fallback binding and returned PASS: report-binding-adhoc-00-00-b51a52ed5cf2-1791306234236; binding hash sha256:b51a52ed5cf2b732889fc357c54c640782f18b6d97617d4b408db6b7a1b33765; diff hash sha256:fb5d209444f3e4e565a2268e27e2e79bb3b783fa5a776948885ae6c5c268f83d.

## Rollback

Remove the checker/CLI route and focused test; declarations are not yet required until the later skill-sync unit.

## Definition of done

- [x] AC-05 maps to this unit's passing evidence.
- [x] The lint result is deterministic and does not claim runtime isolation.
- [x] Scope review finds no unallocated files.
- [x] Required test/conformance results are recorded; no passing result is inferred from an unrun command.
- [x] Commit message records PLN-0003 and 03.01; stop at the required checkpoint.
