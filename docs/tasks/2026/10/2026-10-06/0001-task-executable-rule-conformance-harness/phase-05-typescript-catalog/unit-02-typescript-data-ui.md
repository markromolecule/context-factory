---
title: "TypeScript Database, Hooks, and UI Directive Migration"
type: unit
parent: "phase-05-typescript-catalog"
unit: "05.02"
branch: "task/0001/phase-05/typescript-data-ui"
worktree: ".worktrees/0001/phase-05/typescript-data-ui"
status: planned
created: "2026-10-06"
tags: [task, unit, typescript, database, hooks, ui]
depends_on: ["04.03"]
parallelizable_with: ["05.01", "05.03"]
---

# Unit 05.02: TypeScript Database, Hooks, and UI Directive Migration

## Objective

Classify database, hooks, and UI directives with narrow layer/path applicability and honest automated versus evidence-based verification.

## Context packet

- UI judgment and architecture guidance often require evidence-blocking/manual review; do not invent brittle scanners to label them automated.
- Database/query rules may map to existing architecture/tests rather than runtime DB access in the harness.
- AC-11.

<language_rules>
- `rules/global/evidence-and-claims.md`: Verifier claims match available evidence and expose NOT_AUTOMATABLE where appropriate.
- `rules/solid/interface-segregation.md`: Applicability is narrow enough that UI units do not receive database directives and vice versa.
- `rules/global/naming-conventions.md`: IDs use stable database/hooks/ui namespaces.
</language_rules>

## Preconditions

- Phase 4 contracts/evaluations are merged.

## Scope

**In scope:** all Markdown rule files under `rules/typescript/database/`, `rules/typescript/hooks/`, and `rules/typescript/ui/` only.

**Out of scope:** common/backend/global/SOLID/Laravel rules and all JavaScript/tooling files.

## Steps

1. Assign directive IDs and narrow stack/layer/path/artifact applicability.
2. Map only sound checks to automated-blocking; use evidence-blocking for architecture/accessibility/interaction judgments requiring inspection.
3. Ensure exclusions prevent cross-layer over-selection.
4. Run catalog audit and inspect a representative database, hook, and UI binding.

## Verification

- **Migration tests:** every directory parses with unique IDs and registered verifiers.
- **Selection contract tests:** representative paths bind only their layer-relevant directives.
- Commands: scoped catalog audit; focused binding fixtures; `npm run lint`.

## Rollback

Revert metadata in these three directories; report partial coverage.

## Definition of done

- [ ] Scoped AC-11 coverage passes.
- [ ] Representative bindings show no database/UI cross-selection.
- [ ] Subjective guidance is not mislabeled automated.
- [ ] Unit passes `/review`.
