---
title: "Laravel Database, Security, Presentation, and Anti-Pattern Migration"
type: unit
parent: "phase-06-laravel-expansion"
unit: "06.03"
branch: "task/0001/phase-06/laravel-data-security"
worktree: ".worktrees/0001/phase-06/laravel-data-security"
status: planned
created: "2026-10-06"
tags: [task, unit, laravel, database, security, presentation]
depends_on: ["06.01"]
parallelizable_with: ["06.02"]
---

# Unit 06.03: Laravel Database, Security, Presentation, and Anti-Pattern Migration

## Objective

Classify remaining Laravel directives with strict trust/data boundaries and scoped evidence expectations.

## Context packet

- Security/authorization failures are blocking; evidence must come from trusted backend boundaries and negative tests where specified.
- Query/migration rules may require project-native analysis/tests; missing infrastructure is not PASS.
- AC-12.

<language_rules>
- `rules/laravel/security/authorization.md`: Authorization remains server-side and negative cases are required.
- `rules/laravel/database/migrations-and-seeders.md`: Migration directives include forward/rollback evidence where applicable.
- `rules/laravel/database/query-optimization.md`: Performance claims require query/index evidence, not stylistic assertion.
- `rules/global/evidence-and-claims.md`: Tool unavailable and not-automatable remain explicit.
</language_rules>

## Preconditions

- Unit 06.01 adapter/verifier registry is merged.

## Scope

**In scope:** all Markdown rules under `rules/laravel/database/`, `rules/laravel/security/`, `rules/laravel/presentation/`, and `rules/laravel/anti-patterns/`.

**Out of scope:** common/foundation/HTTP/application rules, adapter code, and sync artifacts.

## Steps

1. Assign stable IDs/applicability/modes/verifiers with security/data rules blocking by default unless explicitly advisory.
2. Require negative/abuse evidence for auth/input directives and migration/query evidence for data directives.
3. Keep presentation rules scoped away from backend-only units.
4. Run catalog and representative binding audits.

## Verification

- **Migration tests:** descriptor and verifier integrity across scoped directories.
- **Security/contract tests:** representative missing-auth and unsafe-input fixtures fail.
- **Selection tests:** presentation and data rules do not cross-bind.
- Commands: scoped audit; Laravel adapter fixtures; `npm run lint`.

## Rollback

Revert only scoped metadata; report partial Laravel coverage.

## Definition of done

- [ ] Scoped AC-12 coverage passes.
- [ ] Security/data blocking semantics are preserved.
- [ ] No cross-layer over-selection appears.
- [ ] Unit passes `/review`.
