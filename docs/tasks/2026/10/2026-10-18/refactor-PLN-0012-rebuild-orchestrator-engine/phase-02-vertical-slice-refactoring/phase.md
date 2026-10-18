---
title: "Phase 2 — Vertical Slice Refactoring"
type: phase
parent: "refactor-PLN-0012-rebuild-orchestrator-engine"
phase: "02"
task_branch: "refactor/PLN-0012-rebuild-orchestrator-engine"
base_commit: "6c438fe680f30ff876188e056618ee058f57abc9"
status: complete
created: "2026-10-18"
tags: [task, phase, orchestrator, rebuild]
---

# Phase 2 — Vertical Slice Refactoring

## Objective

Clean, streamline, and rebuild the orchestrator modules (`validator.mjs`, `orchestrator/rules/`, and `runner.mjs`) in dependency order. Eliminate redundant logic, simplify parsing and validation routines, improve error reporting, and preserve 100% contract fidelity.

## Dependencies & Prerequisites

- Phase 1 completed (baseline contracts and test fixtures verified).
- Branch `refactor/PLN-0012-rebuild-orchestrator-engine` active.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 02.01** | Rebuild Pure ESM JSON Schema Validator | `unit-01-validator-rebuild.md` | `refactor/PLN-0012-rebuild-orchestrator-engine` | `none` | `planned` |
| **Unit 02.02** | Rebuild Rule Compiler & Parser Suite | `unit-02-rules-compiler-rebuild.md` | `refactor/PLN-0012-rebuild-orchestrator-engine` | `02.01` | `planned` |
| **Unit 02.03** | Rebuild AI Execution Runner & Providers | `unit-03-runner-rebuild.md` | `refactor/PLN-0012-rebuild-orchestrator-engine` | `02.02` | `planned` |

## Impacted Files & Components

- `orchestrator/validator.mjs` (Unit 02.01)
- `orchestrator/rules/descriptor-parser.mjs` (Unit 02.02)
- `orchestrator/rules/binding-compiler.mjs` (Unit 02.02)
- `orchestrator/rules/prompt-compiler.mjs` (Unit 02.02)
- `orchestrator/runner.mjs` (Unit 02.03)

## Implementation Tasks

- [ ] Unit 02.01 — Rebuild `orchestrator/validator.mjs` with modular validation functions and Draft-07 support.
- [ ] Unit 02.02 — Rebuild `orchestrator/rules/` (`descriptor-parser.mjs`, `binding-compiler.mjs`, `prompt-compiler.mjs`).
- [ ] Unit 02.03 — Rebuild `orchestrator/runner.mjs` with clean 3-stage lifecycle, native fetch providers, and error boundaries.

## Verification & Testing

- Unit tests:
  ```bash
  node --test evals/tests/rules/rule-contract-schema.test.mjs
  node --test evals/tests/rules/rule-descriptor-parser.test.mjs
  node --test evals/tests/rules/rule-binding.test.mjs
  node --test evals/tests/rules/prompt-compiler.test.mjs
  node --test evals/tests/rules/code-generation-evaluation.test.mjs
  ```

## Risks & Rollback

- Revert individual files with `git checkout HEAD -- <file>` if any regression arises.
