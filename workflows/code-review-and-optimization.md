---
name: code-review-and-optimization
description: Audit, suggest improvements for, and optimize code generated from implementation plans to ensure high performance, type safety, modularity, and clean architecture.
scope: Post-implementation review, code optimization guardrails, performance auditing, and modular refactoring assessments.
---

# Code Review and Optimization

## Triggers

Use after executing an implementation plan phase, before declaring release readiness, or upon explicit requests (`/optimize`, `/review-code`, `[OPTIMIZE]`, `[CODE_REVIEW]`). Acts as an extra guardrail to verify that generated code is clean, efficient, well-structured, and strictly adheres to architectural standards.

## Required inputs

- Change set or diffs from recent implementation tasks/phases.
- Affected source files, tests, and database models.
- Acceptance criteria and performance benchmarks (if specified).

## Applicable rules and skills

- Global rules: `rules/global/code-quality.md`, `rules/global/evidence-and-claims.md`, `rules/global/1-3-1-rule.md`.
- Domain rules matching touched files:
  - Database: `rules/database/query-optimization-and-pagination.md`, `rules/database/data-access-via-db.md`.
  - Backend: `rules/backend/module-architecture.md`, `rules/backend/service-layer.md`.
  - TypeScript: `rules/typescript/type-safety.md`, `rules/typescript/async-discipline.md`, `rules/typescript/runtime-validation.md`.
  - UI: `rules/ui/code-organization.md`, `rules/ui/interaction-feedback.md`.
- Skills: `refactor` (for modular decomposition of oversized files), `verify` (for regression validation).

## Phases

1. **Diff & Contract Analysis:** Enumerate all files, endpoints, components, and queries modified or introduced during implementation.
2. **Quality & Performance Audit:**
   - Database: Audit for N+1 queries, verify indexing support (ESR rule), and ensure deterministic keyset/cursor pagination.
   - Backend & TypeScript: Verify strict type narrowing (no `any`), explicit error handling, and clean async/await discipline.
   - UI / Frontend: Check for unnecessary re-renders, optimize React hook dependency arrays, and verify accessible interaction states.
   - Hygiene: Clean up debug logs, commented-out dead code, and unused imports.
3. **Modularity & Single-Responsibility Check:**
   - Detect files that are overly lengthy (>200 lines) or handle multiple mixed concerns.
   - Identify candidate boundaries for helper utilities, sub-components, or custom hooks.
4. **Targeted Optimization & Refactoring:**
   - Present concrete 1-3-1 optimization suggestions.
   - If modular decomposition is warranted, invoke or recommend `skills/refactor/SKILL.md` to split files safely while keeping imports in sync.
5. **Regression Verification:**
   - Re-run test suites, linter, and typechecker to guarantee optimizations maintain exact behavioral equivalence.

## Quality gates

- All optimizations preserve existing public API contracts and type signatures.
- Database queries adhere to ESR indexing and avoid full-table scans.
- Code complexity and file lengths conform to modular architecture standards.
- Verification tests pass with zero regressions.

## Stop and escalation conditions

- Stop and report if an optimization requires a breaking schema migration or alters external public contracts without prior ADR approval.
- Do not apply destructive code changes without verified automated test coverage.

## Artifacts and completion

Produce a structured code review & optimization report detailing:
- Files audited and optimizations applied.
- Modularity improvements or refactoring suggestions.
- Test evidence demonstrating zero functional regression.
