---
title: "Phase 4 — Tooling Alignment, Bridge Symlinks, ADR 0039, and Lockfile Synchronization"
type: unit
parent: "phase-04-tooling-and-verification"
unit: "04.01"
task_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
base_commit: "a37f557a2fde8e30b6ae23a941d74d8e87a5677f"
status: completed
created: "2026-10-16"
tags: [task, unit, bridge, indexer, doctor, manifest]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 04.01: Tooling Alignment, Bridge Symlinks, ADR 0039, and Lockfile Synchronization

> Phase: phase-04-tooling-and-verification · Depends on: 03.01 · Parallelizable with: none  
> Task branch: refactor/PLN-0010-clean-and-rebuild-typescript-factory · Base commit: a37f557a2fde8e30b6ae23a941d74d8e87a5677f

## Objective

Update the validator, bridge generator, and indexer to support first-class workflow skills under `skills/workflows/` and clean `.agents/` symlinks, author ADR 0039 (superseding ADR 0038), regenerate Obsidian Maps of Content, synchronize `context-manifest.json` and `context-lock.json`, and verify full repository health via `doctor` and test suite.

## Context packet

- Units 01.01, 02.01, and 03.01 consolidated workflows, cleaned root adapter files, and dedicated CLI tools to TypeScript.
- This unit harmonizes the validation harness (`scripts/validate-context.mjs`), bridge generator (`app/cli/core/bridge-generator.mjs`), and indexer (`app/cli/core/indexer.mjs`), creates ADR 0039, and locks the final inventory.
- Serves acceptance criterion `AC-04`.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Units 01.01, 02.01, and 03.01 completed on `refactor/PLN-0010-clean-and-rebuild-typescript-factory`.
- Clean working directory on task branch.

## Scope

**In scope:**
- Modifying `scripts/validate-context.mjs`:
  - Update `validateWorkflowEntries` or replace with workflow validation targeting `skills/workflows/<slug>/SKILL.md`.
  - Update `expectedDotAgents` to remove `AGENTS.md` and `GEMINI.md`.
- Modifying `app/cli/core/bridge-generator.mjs`:
  - Update symlink generation for `.agents/skills/` to include `skills/workflows/*`.
  - Remove generation of root `AGENTS.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`.
- Modifying `app/cli/core/indexer.mjs`:
  - Index workflows from `skills/workflows/`.
  - Update generation of `docs/Skills.md` and `docs/Workflows.md`.
- Authoring `docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation.md`.
- Updating `docs/decisions/README.md`.
- Updating `context-manifest.json` (`orchestrators`, `skills`, `workflows`, `decisions`).
- Regenerating `context-lock.json` via `node scripts/context.mjs lock`.

**Out of scope:**
- Modifying historical task logs under `docs/tasks/2026/`.

## Steps

1. Update `scripts/validate-context.mjs` to validate `skills/workflows/<slug>/SKILL.md` directly and remove assertions requiring `AGENTS.md`/`GEMINI.md` in `.agents/`.
2. Update `app/cli/core/bridge-generator.mjs` to link `skills/workflows/*` into `.agents/skills/` and remove root model file generation.
3. Update `app/cli/core/indexer.mjs` to index workflows from `skills/workflows/`.
4. Author ADR 0039 (`docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation.md`) marking ADR 0038 as superseded.
5. Update `context-manifest.json` to inventory new files and deregister deleted ones.
6. Run `npm run sync` to regenerate MOCs (`docs/Skills.md`, `docs/Workflows.md`, `docs/decisions/README.md`).
7. Run `node scripts/context.mjs lock` to regenerate `context-lock.json`.
8. Re-scaffold local `.agents/` symlinks with updated bridge generator.
9. Run `node scripts/context.mjs doctor` and `npm test` to verify 100% HEALTHY status.

## Verification

- **Harness & Doctor Checks:**
  - Command: `node scripts/context.mjs doctor`
  - Expected: PASS across all checks (Manifest, Lockfile, Symlinks, Conformance, Evaluations) with status `HEALTHY`.
- **Test Suite:**
  - Command: `npm test`
  - Expected: 100% pass across all unit, bridge, and conformance evaluations.

## Rollback

Run `git checkout -- scripts/ app/ context-manifest.json context-lock.json docs/` and `rm -f docs/decisions/0039-*.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-04
- [x] Executed on the recorded task branch
- [x] Changes committed cleanly to the task branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
