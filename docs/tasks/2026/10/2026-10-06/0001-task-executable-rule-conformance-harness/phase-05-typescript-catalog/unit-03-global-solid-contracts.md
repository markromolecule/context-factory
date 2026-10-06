---
title: "Global and SOLID Directive Migration"
type: unit
parent: "phase-05-typescript-catalog"
unit: "05.03"
branch: "task/0001/phase-05/global-solid-contracts"
worktree: ".worktrees/0001/phase-05/global-solid-contracts"
status: planned
created: "2026-10-06"
tags: [task, unit, global, solid, rules]
depends_on: ["04.03"]
parallelizable_with: ["05.01", "05.02"]
---

# Unit 05.03: Global and SOLID Directive Migration

## Objective

Classify global and SOLID rules as cross-stack contracts with precise applicability and evidence requirements, avoiding universal prompt bloat.

## Context packet

- Current `alwaysApply` behavior is a documented source of broad over-selection.
- Cross-stack does not mean every rule applies to every touched file or lifecycle action.
- Architecture/SOLID checks are commonly evidence-blocking unless a concrete dependency check exists.
- AC-02 and AC-11.

<language_rules>
- `rules/global/architecture-conformance.md`: Preserve authority hierarchy and require accepted decisions for boundary changes.
- `rules/global/evidence-and-claims.md`: Architecture compliance requires named evidence rather than model assertion.
- `rules/solid/single-responsibility.md`: Split directives by cohesive invariant; do not create omnibus markers.
- `rules/global/naming-conventions.md`: Use stable global/solid namespaces.
</language_rules>

## Preconditions

- Phase 4 resolver/evidence behavior is merged.

## Scope

**In scope:** all rule Markdown files under `rules/global/` and `rules/solid/` only.

**Out of scope:** TypeScript/Laravel rules, resolver code, skills/workflows, and generated maps.

## Steps

1. Replace broad implicit applicability with explicit lifecycle/artifact/layer conditions where possible.
2. Assign directive IDs/modes/verifiers while preserving authority semantics.
3. Mark judgment-based constraints evidence-blocking and document required evidence kinds.
4. Test that direct questions/docs-only tasks do not receive code-generation-only directives.

## Verification

- **Migration tests:** unique IDs and complete mode/evidence metadata.
- **Resolver contract tests:** action, documentation, and code scopes demonstrate narrow selection.
- Commands: scoped catalog audit; focused binding tests; `npm run lint`.

## Rollback

Revert metadata only; legacy alwaysApply selection returns but must be reported as compatibility behavior.

## Definition of done

- [ ] AC-02 over-selection regression is covered.
- [ ] Global/SOLID AC-11 coverage is honest.
- [ ] No cross-stack directive is universally bound without scope evidence.
- [ ] Unit passes `/review`.
