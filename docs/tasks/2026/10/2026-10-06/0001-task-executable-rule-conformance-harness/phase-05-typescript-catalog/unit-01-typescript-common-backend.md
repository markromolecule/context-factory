---
title: "TypeScript Common and Backend Directive Migration"
type: unit
parent: "phase-05-typescript-catalog"
unit: "05.01"
branch: "task/0001/phase-05/typescript-common-backend"
worktree: ".worktrees/0001/phase-05/typescript-common-backend"
status: blocked
created: "2026-10-06"
tags: [task, unit, typescript, backend, rules]
depends_on: ["05.00"]
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
- Commands: catalog audit scoped to `rules/typescript/common` and `rules/typescript/backend`. Repository-wide `npm run lint` is deferred to Unit 05.04 because this unit intentionally does not own `context-lock.json`.
- **Execution evidence (2026-10-06):** `node --test evals/unit-05-01-typescript-common-backend.test.ts` passed 62/62 tests. Scope fence against `task/0001/phase-05-integration` passed with the focused test plus the modified common/backend rules only; `git diff --check` passed. Conformance receipt `report-binding-adhoc-00-00-810321786087-1791277567901` returned PASS (Binding Hash: `sha256:810321786087436d89138a3e967875fa0cf5b73d5ffe208bc89b7fddf970d350`; Diff Hash: `sha256:d5c56670a285b40719130ccf888970447a4ecef8bb7090c493bb398176e01cbb`).
- **Blocker (2026-10-06):** The full committed diff includes this verification record. Its documentation scope selects evidence-blocking directives, and full-scope receipt `report-binding-adhoc-00-00-d8ef00cfb652-1791277675365` is BLOCKED pending named human evidence. Do not merge this unit until that receipt is re-run with valid human evidence and returns PASS.

## Rollback

Revert markers/frontmatter in these two directories only; catalog coverage returns to partial.

## Definition of done

- [x] Scoped catalog passes AC-11 audit.
- [x] No unsupported directive is counted as enforced.
- [x] Policy meaning is unchanged.
- [ ] Unit passes `/review` (blocked pending named human evidence).
