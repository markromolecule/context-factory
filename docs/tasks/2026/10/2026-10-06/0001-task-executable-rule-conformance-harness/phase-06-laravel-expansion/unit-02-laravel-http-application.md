---
title: "Laravel Common, Foundation, HTTP, and Application Migration"
type: unit
parent: "phase-06-laravel-expansion"
unit: "06.02"
branch: "task/0001/phase-06/laravel-http-application"
worktree: ".worktrees/0001/phase-06/laravel-http-application"
status: planned
created: "2026-10-06"
tags: [task, unit, laravel, http, application, rules]
depends_on: ["06.01"]
parallelizable_with: ["06.03"]
---

# Unit 06.02: Laravel Common, Foundation, HTTP, and Application Migration

## Objective

Classify Laravel common/foundation/HTTP/application directives against registered verifier capabilities without altering their architectural intent.

## Context packet

- Applicability must separate controllers, middleware, requests, services/actions, events, transactions, and common tooling.
- Automated mode requires registered evidence; conventions that need review are evidence-blocking.
- AC-12.

<language_rules>
- `rules/laravel/foundation/conventions.md`: Preserve framework-native conventions and container boundaries.
- `rules/laravel/http/requests-and-validation.md`: Validation directives remain at FormRequest/input boundaries.
- `rules/laravel/application/business-logic-and-actions.md`: Business policy remains outside controllers.
- `rules/global/evidence-and-claims.md`: Classification matches actual adapter evidence.
</language_rules>

## Preconditions

- Unit 06.01 verifier registry is merged.

## Scope

**In scope:** all Markdown rules under `rules/laravel/common/`, `rules/laravel/foundation/`, `rules/laravel/http/`, and `rules/laravel/application/`.

**Out of scope:** database/security/presentation/anti-pattern rules, adapter code, and sync artifacts.

## Steps

1. Add stable IDs, applicability, modes, and registered verifier/evidence metadata.
2. Preserve existing rule prose and examples unless a conflicting directive is reported rather than silently rewritten.
3. Test representative controller, FormRequest, middleware, service/action, event, and transaction bindings.
4. Audit duplicates, missing verifier registrations, and false automated claims.

## Verification

- **Migration/contract tests:** parse and validate every scoped rule.
- **Selection tests:** representative Laravel paths bind the intended layers only.
- Commands: scoped catalog audit; Laravel binding fixtures; `npm run lint`.

## Rollback

Revert metadata in scoped Laravel directories; coverage reports partial.

## Definition of done

- [ ] Scoped Laravel AC-12 coverage passes.
- [ ] Controller/service/validation applicability remains separated.
- [ ] Unsupported guidance is explicit.
- [ ] Unit passes `/review`.
