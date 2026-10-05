---
title: "`types` Static Type Hardening Skill"
type: unit
parent: "0003/phase-02"
unit: "02.02"
branch: "task/0003/phase-02/types-skill"
worktree: ".worktrees/0003/phase-02/types-skill"
status: planned
created: "2026-10-05"
tags: [task, unit, skills, types, typescript, anti-slop, safety]
depends_on: []
parallelizable_with: ["02.01"]
---

# Unit 02.02: `types` Static Type Hardening Skill

> Phase: 0003/phase-02 · Depends on: none · Parallelizable with: 02.01
> Worktree: .worktrees/0003/phase-02/types-skill · Branch: task/0003/phase-02/types-skill

## Objective

Author `skills/engineering/types/SKILL.md` establishing a first-class engineering skill to harden static types, eliminate `any` and loose `as unknown as T` assertions ("Anti-Slop Safeguard"), model discriminated unions with `assertNever` exhaustiveness, extract utility types, and create branded nominal identifiers.

## Context packet

- Acceptance criteria: AC-05.
- Decision ledger: D-02 in ADR 0028; ADR 0020 (Categorical Skill Grouping).
- Applicable rules:
  - `rules/typescript/common/type-safety.md` (ban any, discriminated unions, branded types).
  - `rules/typescript/common/runtime-validation.md` (zod/valibot schema parsing).

<language_rules>
- `rules/global/architecture-conformance.md`: Ensure skill conforms to skill schema and ADR 0020 invariants.
- `rules/global/evidence-and-claims.md`: Never report completion without fresh, verified command outputs.
- `rules/typescript/common/type-safety.md`: Mandate zero-any policy and exhaustiveness checks.
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Dedicated git worktree and branch provisioned at declared path.
- Cut from `task/0003/phase-02-integration`.

## Scope

**In scope:** `skills/engineering/types/SKILL.md`.
**Out of scope:** `skills/engineering/perf/SKILL.md` (Unit 02.01), review gate modifications (Phase 3).

## Steps

1. Create directory `skills/engineering/types/`.
2. Author `skills/engineering/types/SKILL.md` with:
   - Frontmatter (`name: types`, `description: Harden static types, eliminate any and loose unknown casts, implement discriminated unions, extract utility types, and prevent LLM code slop (/types, [TYPES]).`).
   - Core philosophy: Type safety is an architectural invariant, not a cosmetic suggestion. Zero tolerance for `any` or loose `as` assertions.
   - 5 Type-Hardening Pillars:
     1. Elimination of `any`: Replace `any` with `unknown` and runtime schema validation (`zod`/`valibot`) or narrowing type guards (`val is T`).
     2. Discriminated Unions & Exhaustiveness: Model multi-state domain entities with explicit discriminator tags; enforce compiler-guaranteed exhaustive checks via `assertNever(x: never): never`.
     3. Branded / Nominal Identifiers: Protect entity IDs (`UserId`, `TenantId`) using branded intersection types (`type UserId = string & { readonly __brand: unique symbol }`).
     4. Generic Discipline & Constraints: Replace unconstrained `<T>` with bounded generics (`<T extends BaseRecord>`) and sensible defaults.
     5. Type Narrowing vs. Type Casting: Replace `obj as ExpectedType` with verifiable type predicates or parsed schemas.
   - Cross-Skill Integration:
     - Triggered by `/review` Gate 3 and Gate 4 when type shortcuts or `any` are found in diffs.
     - Hands off to `/refactor` for modular restructuring.
     - Hands off to `/test` for type-level tests (`tsc --noEmit`, `tsd`, `expect-type`).
   - Concrete Bad vs. Good anti-slop code refactoring examples.
3. Validate frontmatter and markdown syntax.

## Verification

- Test type: Contract & syntax schema test.
- Case 1: Verify `skills/engineering/types/SKILL.md` exists and contains valid YAML frontmatter matching schema.
- Case 2: Verify all 5 type-hardening pillars and cross-skill references are present.

## Rollback

Remove `skills/engineering/types/SKILL.md` and directory.

## Definition of done

- [ ] Maps to acceptance criteria: AC-05
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
