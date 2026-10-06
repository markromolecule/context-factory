---
title: "TypeScript Common and Backend Directive Migration"
type: unit
parent: "phase-05-typescript-catalog"
unit: "05.01"
branch: "task/0001/phase-05/typescript-common-backend"
worktree: ".worktrees/0001/phase-05/typescript-common-backend"
status: planned
created: "2026-10-06"
tags: [task, unit, typescript, backend, rules]
depends_on: ["04.03"]
parallelizable_with: ["05.02", "05.03"]
---

# Unit 05.01: TypeScript Common and Backend Directive Migration

## Objective

Add stable applicability and enforcement metadata to TypeScript common/backend rules without changing their policy meaning.

## Context packet

- Pilot syntax and verifier registry are stable from Phases 1–4.
- Every enforceable statement must be classified; genuinely descriptive text need not become a directive.
- Automated mode is allowed only when a registered verifier provides sound evidence; otherwise use evidence-blocking or advisory.
- AC-11.

<language_rules>
- `rules/global/evidence-and-claims.md`: Classifications name the actual verifier/evidence capability; do not claim automation that does not exist.
- `rules/global/architecture-conformance.md`: Preserve accepted TypeScript module/service/controller boundaries.
- `rules/global/naming-conventions.md`: Directive IDs remain stable and follow the catalog namespace.
</language_rules>

## Preconditions

- Phase 4 verifier IDs and catalog-audit semantics are merged.

## Scope

**In scope:** all Markdown rule files under `rules/typescript/common/` and `rules/typescript/backend/` only.

**Out of scope:** database/hooks/UI/global/SOLID/Laravel rules; parser/adapter code; maps/manifest/lock.

## Steps

1. Inventory enforceable statements and assign stable IDs, applicability, mode, and registered verifier/evidence requirements.
2. Preserve prose/examples unless a contradiction or ambiguity is documented as a separate finding.
3. Reject duplicate IDs, unregistered automated verifiers, and broad applicability unsupported by the rule scope.
4. Record unsupported statements explicitly rather than coercing them to advisory.

## Verification

- **Migration/contract tests:** parse every scoped rule and validate uniqueness, verifier existence, and no lost enforceable statement.
- **Review checklist:** diff contains metadata/markers only unless separately justified.
- Commands: catalog audit scoped to `rules/typescript/common` and `rules/typescript/backend`; `npm run lint`.

## Rollback

Revert markers/frontmatter in these two directories only; catalog coverage returns to partial.

## Definition of done

- [ ] Scoped catalog passes AC-11 audit.
- [ ] No unsupported directive is counted as enforced.
- [ ] Policy meaning is unchanged.
- [ ] Unit passes `/review`.
