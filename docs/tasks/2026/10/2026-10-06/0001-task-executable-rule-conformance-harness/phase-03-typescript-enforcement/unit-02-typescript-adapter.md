---
title: "TypeScript Conformance Adapter"
type: unit
parent: "phase-03-typescript-enforcement"
unit: "03.02"
branch: "task/0001/phase-03/typescript-adapter"
worktree: ".worktrees/0001/phase-03/typescript-adapter"
status: verified
created: "2026-10-06"
tags: [task, unit, typescript, adapter]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 03.02: TypeScript Conformance Adapter

## Objective

Implement a TypeScript adapter that maps verifier IDs to available project-native commands or focused checks and reports honest per-directive evidence.

## Context packet

- The adapter must discover host `package.json` scripts/configuration; it must not assume `tsc`, ESLint, or a package manager exists.
- Missing tools return TOOL_UNAVAILABLE, never PASS.
- Pilot directives cover type safety, runtime validation, module boundaries, and architecture conformance.
- AC-07 and SC-04.

<language_rules>
- `rules/typescript/common/type-safety.md`: Never parse tool/config output into `any`; validate and narrow unknown structures.
- `rules/typescript/common/async-discipline.md`: Await subprocess completion, handle timeouts/cancellation, and retain exit evidence.
- `rules/typescript/common/error-handling.md`: Distinguish tool unavailable, timeout, invalid configuration, and actual rule failure.
- `rules/solid/open-closed.md`: Verifier registry entries extend behavior without branching the core orchestrator by directive ID.
</language_rules>

## Preconditions

- Unit 03.01 adapter port/evidence gate is merged.

## Scope

**In scope:** new `orchestrator/conformance/adapters/typescript.mjs`; new `orchestrator/conformance/process-runner.mjs`; new `evals/typescript-adapter.test.mjs`; new fixtures under `evals/fixtures/typescript-conformance/`.

**Out of scope:** Laravel, full TypeScript catalog migration, CLI commands, and editor bridges.

## Steps

1. Discover package manager, relevant scripts, `tsconfig`/lint configuration, and focused-check capabilities from explicit host inputs.
2. Register pilot verifier IDs for typecheck/no-any, runtime-boundary validation evidence, import/layer boundaries, and architecture evidence.
3. Execute commands with explicit cwd, argv arrays, timeout, bounded output, and no shell interpolation.
4. Map command/focused-check outcomes into the shared result contract with source/diff evidence.
5. Add conforming and deliberately violating fixtures plus unavailable/timeout cases.

## Verification

- **Integration tests:** run deterministic fixture commands and verify deliberate violations are caught.
- **Security tests:** command injection strings remain arguments and cannot alter execution.
- **Architecture tests:** generic orchestrator imports no TypeScript adapter module directly; registration occurs at composition root.
- Command: `node --test evals/typescript-adapter.test.mjs`.

## Rollback

Unregister/remove the adapter and fixtures; generic contracts remain intact.

## Definition of done

- [x] AC-07 passes for all four violation classes.
- [x] TOOL_UNAVAILABLE/timeout cannot be counted as enforced.
- [x] Command execution is bounded and injection-safe.
- [x] Unit passes `/review`.
