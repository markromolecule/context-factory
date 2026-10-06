---
title: "TypeScript Database, Hooks, and UI Directive Migration"
type: unit
parent: "phase-05-typescript-catalog"
unit: "05.02"
branch: "task/0001/phase-05/typescript-data-ui"
worktree: ".worktrees/0001/phase-05/typescript-data-ui"
status: verified
created: "2026-10-06"
tags: [task, unit, typescript, database, hooks, ui]
depends_on: ["05.00"]
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
- Commands: scoped catalog audit; focused binding fixtures. Repository-wide `npm run lint` is deferred to Unit 05.04 because this unit intentionally does not own `context-lock.json`.
- **Execution evidence (2026-10-06):** `node --test evals/unit-05-02-typescript-data-ui.test.ts` passed 121/121 tests. Scope fence against `task/0001/phase-05-integration` passed with the focused test plus the modified database/hooks/UI rules only; `git diff --check` passed. Conformance receipt `report-binding-adhoc-00-00-32340ab608ea-1791277574057` returned PASS (Binding Hash: `sha256:32340ab608ea5c0308bce80c3b786c7faf29a8a2567f59a0c7b4efd61f798cbc`; Diff Hash: `sha256:a96dcee26265fea505ce1cd095d5cb8058131003dfb68829b65721ad7942ce28`).
- **Blocker (2026-10-06):** The full committed diff includes this verification record, whose documentation scope selects evidence-blocking directives. The same named-human-evidence requirement must be satisfied with a full-scope PASS receipt before this unit can be merged.
- **Final conformance (2026-10-06):** Mark Joseph supplied named review evidence for Units 05.01 and 05.02. Full-scope receipt `report-binding-adhoc-00-00-fa559f88341e-1791277834845` returned PASS (Binding Hash: `sha256:fa559f88341e0817782887d8cba762b53e671050af1c73feb6b3e8d3923c4c93`; Diff Hash: `sha256:535d8aebd67ab4f0e65385b294b362986f5d3b3c3adb2fa0155e3f9a3b643e7b`; 8/8 directives passed).

## Rollback

Revert metadata in these three directories; report partial coverage.

## Definition of done

- [x] Scoped AC-11 coverage passes.
- [x] Representative bindings show no database/UI cross-selection.
- [x] Subjective guidance is not mislabeled automated.
- [x] Unit passes `/review`.
