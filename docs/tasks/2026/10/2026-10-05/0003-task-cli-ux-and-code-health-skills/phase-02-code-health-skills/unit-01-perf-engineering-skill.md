---
title: "`perf` Performance Optimization Skill"
type: unit
parent: "0003/phase-02"
unit: "02.01"
branch: "task/0003/phase-02/perf-skill"
worktree: ".worktrees/0003/phase-02/perf-skill"
status: verified
created: "2026-10-05"
tags: [task, unit, skills, perf, performance, optimization]
depends_on: []
parallelizable_with: ["02.02"]
---

# Unit 02.01: `perf` Performance Optimization Skill

> Phase: 0003/phase-02 · Depends on: none · Parallelizable with: 02.02
> Worktree: .worktrees/0003/phase-02/perf-skill · Branch: task/0003/phase-02/perf-skill

## Objective

Author `skills/engineering/perf/SKILL.md` establishing a first-class engineering skill for profiling runtime bottlenecks, eliminating ORM N+1 query loops, enforcing ESR composite indexing, preventing async waterfalls, and conducting bundle/memory audits.

## Context packet

- Acceptance criteria: AC-04.
- Decision ledger: D-02 in ADR 0028; ADR 0010 (Query Optimization and Performance Architecture); ADR 0020 (Categorical Skill Grouping).
- Applicable rules:
  - `rules/typescript/database/query-optimization-and-pagination.md` (Kysely, keyset pagination, ESR indexing).
  - `rules/typescript/common/async-discipline.md` (concurrency limiters, unblocked waterfalls).

<language_rules>
- `rules/global/architecture-conformance.md`: Ensure skill conforms to skill schema and ADR 0020 invariants.
- `rules/global/evidence-and-claims.md`: Never report completion without fresh, verified command outputs.
- `rules/typescript/database/query-optimization-and-pagination.md`: Encode ESR rule and N+1 prevention as core skill directives.
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Dedicated git worktree and branch provisioned at declared path.
- Cut from `task/0003/phase-02-integration`.

## Scope

**In scope:** `skills/engineering/perf/SKILL.md`.
**Out of scope:** `skills/engineering/types/SKILL.md` (Unit 02.02), review gate modifications (Phase 3).

## Steps

1. Create directory `skills/engineering/perf/`.
2. Author `skills/engineering/perf/SKILL.md` with:
   - Frontmatter (`name: perf`, `description: Profile and optimize runtime bottlenecks, eliminate ORM N+1 queries, enforce ESR indexing, prevent async waterfalls, and audit memory and bundle sizes (/perf, [PERF]).`).
   - Core philosophy: Measurable optimization driven by profiling evidence, not premature guessing.
   - 5 Profiling Dimensions:
     1. Database Queries: Eliminate N+1 loops, enforce Kysely batch lookups, apply ESR composite indexing, mandate keyset pagination.
     2. Async Concurrency: Replace sequential awaits with bounded `Promise.all` (`p-limit` connection protection), propagate `AbortSignal`.
     3. Memory & Hydration: Prevent object hydration bloat, prune memory leaks, select explicit columns.
     4. Bundle Size: Tree-shaking audits, replace heavy monolith libraries with lean alternatives.
     5. Frontend Rendering: Memoize expensive computations (`useMemo`/`useCallback`), eliminate unnecessary re-renders.
   - Cross-Skill Integration:
     - Triggered by `/review` Gate 4 when query loops or waterfalls are flagged.
     - Hands off to `/refactor` for architectural modularization.
     - Hands off to `/test` for query-count and benchmark verification tests.
   - Concrete Bad vs. Good code patterns for each dimension.
3. Validate frontmatter and markdown syntax.

## Verification

- Test type: Contract & syntax schema test.
- Case 1: Verify `skills/engineering/perf/SKILL.md` exists and contains valid YAML frontmatter matching schema (PASS: frontmatter valid, name `perf`).
- Case 2: Verify all 5 profiling dimensions and cross-skill references are present (PASS: database/N+1, async/concurrency, memory/hydration, bundle, frontend memoization).
- Files modified: `skills/engineering/perf/SKILL.md`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Remove `skills/engineering/perf/SKILL.md` and directory.

## Definition of done

- [x] Maps to acceptance criteria: AC-04
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
