---
title: "Unit 03.01: Align Validator, Doctor, Preflight, and Bridge Evaluations"
type: unit
parent: "phase-03-tooling-alignment"
unit: "03.01"
task_branch: "refactor/PLN-0011-clean-ephemeral-dirs-and-conformance"
base_commit: "c7524e96a0e97bacdb848bdee05abd9203ef5e96"
status: planned
created: "2026-10-17"
tags: [task, unit, tooling, validator, doctor]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 03.01: Align Validator, Doctor, Preflight, and Bridge Evaluations

> Phase: phase-03-tooling-alignment · Depends on: 02.01 · Parallelizable with: none
> Task branch: refactor/PLN-0011-clean-ephemeral-dirs-and-conformance · Base commit: c7524e96a0e97bacdb848bdee05abd9203ef5e96

## Objective

Update `scripts/validate-context.mjs`, `app/cli/commands/doctor.mjs`, `app/cli/commands/preflight.mjs`, and bridge evaluation tests so that Context Factory tooling does not assert deleted ephemeral directories or conformance adapters.

## Context packet

- `scripts/validate-context.mjs` lines 586-652 explicitly assert `.agents/`, `.agents/skills.json`, and `.agents/skills/*` symlinks exist.
- `app/cli/commands/doctor.mjs` registers the TypeScript adapter and runs a "Conformance Enforcement" diagnostic check.
- `evals/tests/bridge/workflow-entry-contract.test.mjs` asserts entries in `.agents/skills` and `.claude/skills`.
- `evals/tests/bridge/bridge-conformance.test.mjs` asserts `context-cli conform` directives.
- Serves Acceptance Criterion **AC-03**.

<language_rules>
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 02.01 completed.
- Git working branch is `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance`.

## Scope

**In scope:**
- Modify `scripts/validate-context.mjs` to remove validation of `.agents/` and its internal symlinks.
- Modify `app/cli/commands/doctor.mjs` to remove adapter registration imports and the "Conformance Enforcement" table row.
- Modify `app/cli/commands/preflight.mjs` to clean up any references to conform reports.
- Modify `evals/tests/bridge/workflow-entry-contract.test.mjs` to test canonical workflow skills (`skills/workflows/*`) directly.
- Modify `evals/tests/bridge/bridge-conformance.test.mjs` to remove assertions on `context-cli conform`.

**Out of scope:**
- Rewriting the host bridge generator logic in `bridge-generator.mjs`.

## Steps

1. In `scripts/validate-context.mjs`:
   - Remove lines 586-652 (validation of `.agents/`, `.agents/skills.json`, and `.agents/skills/`).
2. In `app/cli/commands/doctor.mjs`:
   - Remove imports of `listAdapters` and `registerTypeScriptAdapter`.
   - Remove `auditEnforcementCapabilities()` or simplify it to report standard lint/syntax capabilities.
   - Remove the "Conformance Enforcement" row from the diagnostic table.
   - In factory-native mode, ensure symlink check returns healthy without requiring `.agents`.
3. In `app/cli/commands/preflight.mjs`:
   - Remove references to conformance verification.
4. In `evals/tests/bridge/workflow-entry-contract.test.mjs`:
   - Update tests to assert that workflows in `skills/workflows/<slug>/SKILL.md` are valid first-class skills without requiring `.agents/skills` or `.claude/skills` in factory root.
5. In `evals/tests/bridge/bridge-conformance.test.mjs`:
   - Remove assertions expecting `conform` in bridge directives.
6. Run `node scripts/validate-context.mjs` and bridge tests to verify passing status.

## Verification

- **Automated Tests:**
  - Test type: Contract & Tooling tests — verifies validator and bridge tests execute without errors.
  - Commands:
    - `node scripts/validate-context.mjs`
    - `node --test evals/tests/bridge/workflow-entry-contract.test.mjs`
    - `node --test evals/tests/bridge/bridge-conformance.test.mjs`

## Rollback

- `git checkout HEAD -- scripts/validate-context.mjs app/cli/commands/doctor.mjs app/cli/commands/preflight.mjs evals/tests/bridge/`

## Definition of done

- [ ] Maps to acceptance criteria: AC-03
- [ ] Executed on recorded task branch `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance`
- [ ] Changes committed cleanly to task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] Validator and bridge tests pass (PASS)
