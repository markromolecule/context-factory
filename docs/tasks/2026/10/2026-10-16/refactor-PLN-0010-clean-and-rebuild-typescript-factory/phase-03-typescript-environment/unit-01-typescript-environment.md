---
title: "Phase 3 — Streamline CLI and Doctor to Dedicated TypeScript Stack"
type: unit
parent: "phase-03-typescript-environment"
unit: "03.01"
task_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
base_commit: "a37f557a2fde8e30b6ae23a941d74d8e87a5677f"
status: completed
created: "2026-10-16"
tags: [task, unit, typescript, cli, doctor, resolver]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 03.01: Streamline CLI and Doctor to Dedicated TypeScript Stack

> Phase: phase-03-typescript-environment · Depends on: 02.01 · Parallelizable with: none  
> Task branch: refactor/PLN-0010-clean-and-rebuild-typescript-factory · Base commit: a37f557a2fde8e30b6ae23a941d74d8e87a5677f

## Objective

Remove `--stack` and `--stacks` flags and interactive language prompts from CLI commands (`conform.mjs`, `preflight.mjs`, `resolve.mjs`, `init.mjs`), clean up lingering `flutter` unsupported-stack checks in `doctor.mjs` and schemas, and remove framework filtering in `scripts/context-core.mjs` so the factory operates natively and solely as a TypeScript environment.

## Context packet

- Previous multi-stack support left lingering checks for `flutter` in `doctor.mjs` and `--stack` flags throughout CLI commands.
- In accordance with Decision `D-03`, TypeScript is hardcoded as the sole native environment. Rules under `rules/typescript/` apply directly without requiring a separate selection step.
- Serves acceptance criterion `AC-03`.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 02.01 completed on `refactor/PLN-0010-clean-and-rebuild-typescript-factory`.
- Clean working directory on task branch.

## Scope

**In scope:**
- Modifying `app/cli/commands/conform.mjs`: hardcode stack to `typescript`; remove stack selection flags.
- Modifying `app/cli/commands/preflight.mjs`: default stack to `typescript`; streamline flags.
- Modifying `app/cli/commands/resolve.mjs`: remove stack selection flags and display.
- Modifying `app/cli/commands/init.mjs`: remove language/stack prompts.
- Modifying `app/cli/commands/doctor.mjs`: remove `knownStacks` containing `flutter`; report single-stack TypeScript readiness.
- Modifying `schemas/rule-descriptor.schema.json`: remove `flutter` and unused stack enums.
- Modifying `scripts/context-core.mjs`: remove framework-filtering branches and legacy stack keywords.
- Updating `evals/tests/bridge/bridge-conformance.test.mjs`: update assertions testing unsupported flutter checks.

**Out of scope:**
- Modifying `scripts/validate-context.mjs` or `app/cli/core/bridge-generator.mjs` (reserved for Unit 04.01).
- Modifying documentation MOCs or lockfile (reserved for Unit 04.01).

## Steps

1. In `app/cli/commands/conform.mjs`, remove `--stack` flag handling and hardcode stack to `"typescript"`.
2. In `app/cli/commands/preflight.mjs`, remove `--stack` flag handling and default to `"typescript"`.
3. In `app/cli/commands/resolve.mjs`, streamline resolver output to omit multi-stack notices.
4. In `app/cli/commands/doctor.mjs`, update `checkConformanceEnforcement`: remove `flutter` from `knownStacks` and report `Adapters: typescript (ready)`.
5. In `schemas/rule-descriptor.schema.json`, clean up stack enum definitions to reflect TypeScript exclusivity.
6. In `scripts/context-core.mjs`, simplify rule resolution: remove framework-filtering logic so `rules/typescript/` rules are included without separate framework flags.
7. In `evals/tests/bridge/bridge-conformance.test.mjs`, update tests expecting `flutter` unsupported stack diagnostics.
8. Run `npm test` and verify that all unit and bridge tests pass.

## Verification

- **Automated Tests:**
  - Test type: Integration / CLI regression tests.
  - Command: `npm test`
  - Expected: 100% of test suites pass without flutter or stack-selection assertions failing.
- **CLI Execution:**
  - Command: `node app/cli/bin/context-cli.mjs resolve "create react component"`
  - Expected: Clean resolution of TypeScript UI rules without prompt prompts or stack warnings.

## Rollback

Run `git checkout -- app/cli/ schemas/ scripts/context-core.mjs evals/`.

## Definition of done

- [x] Maps to acceptance criteria: AC-03
- [x] Executed on the recorded task branch
- [x] Changes committed cleanly to the task branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
