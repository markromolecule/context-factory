---
title: "Phase 3 — System-Wide Integration and Verification"
type: unit
parent: "phase-03-integration-tests"
unit: "03.01"
task_branch: "refactor/PLN-0012-rebuild-orchestrator-engine"
base_commit: "6c438fe680f30ff876188e056618ee058f57abc9"
status: complete
created: "2026-10-18"
tags: [task, unit, orchestrator, integration]
depends_on: ["02.03"]
parallelizable_with: []
---

# Unit 03.01: System-Wide Integration and Verification

> Phase: phase-03-integration-tests · Depends on: 02.03 · Parallelizable with: none  
> Task branch: refactor/PLN-0012-rebuild-orchestrator-engine · Base commit: 6c438fe680f30ff876188e056618ee058f57abc9

## Objective

Run end-to-end integration verifications across all CLI commands, context resolution queries, session snapshot workflows, and the 27-suite evaluation harness to prove zero behavioral regression across the rebuilt orchestrator engine.

## Context packet

- **Key Consumers to Verify:**
  1. `node scripts/context.mjs resolve "<request>"` -> exercises `descriptor-parser.mjs` and `binding-compiler.mjs`.
  2. `context-cli validate` -> exercises `validator.mjs`.
  3. `context-cli preflight` -> exercises `validator.mjs` and `binding-compiler.mjs`.
  4. `context-cli session:save` / `session:resume` -> exercises `validator.mjs` against `session-state.schema.json`.
  5. `context-cli run` / `npm test` -> exercises `runner.mjs`, `prompt-compiler.mjs`, and `validator.mjs`.

<language_rules>
- [directive:cf.arch.solid][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Phase 2 complete (all rebuilt modules passing unit tests).
- Active branch is `refactor/PLN-0012-rebuild-orchestrator-engine`.

## Scope

**In scope:** End-to-end command execution, evaluation harness verification, lockfile and manifest integrity check.  
**Out of scope:** Modifying external host configurations.

## Steps

1. Execute `npm test` and verify that all 27 evaluation suites pass.
2. Execute `node scripts/context.mjs resolve "auth webhook"` and assert valid matched context.
3. Execute `node app/cli/bin/context-cli.mjs validate` and assert clean schema checks.
4. Run `npm run sync` to regenerate lockfile digest with the new file hashes.
5. Confirm `node scripts/context.mjs doctor` diagnostics.

## Verification

- **Automated Tests:**
  - `npm test` (all 27 eval suites pass)
  - `node scripts/context.mjs resolve "test query"` (valid JSON context selection)
  - `node app/cli/bin/context-cli.mjs validate` (all repository schemas valid)
- **Justification:** Ensures complete system-level backward compatibility for CLI commands and AI context workflows.

## Rollback

- Revert uncommitted changes on task branch with `git checkout HEAD -- .`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-05
- [ ] Executed on task branch `refactor/PLN-0012-rebuild-orchestrator-engine`
- [ ] Full evaluation suite green (27/27 PASS)
- [ ] Manifest and lockfile verified
