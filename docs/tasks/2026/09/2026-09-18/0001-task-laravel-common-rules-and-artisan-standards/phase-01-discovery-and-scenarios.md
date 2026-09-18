---
title: "Phase 1 — Discovery, Scenarios, and Boundary Analysis"
type: phase
parent: "0001-task-laravel-common-rules-and-artisan-standards"
phase: "01"
status: completed
created: "2026-09-18"
tags: [task, phase, laravel, discovery]
---

# Phase 1 — Discovery, Scenarios, and Boundary Analysis

## Objective

Finalize the structural boundary between `rules/laravel/common/` and `rules/laravel/foundation/`, ensuring that cross-cutting conventions and Artisan standards are completely specified without duplicating or conflicting with existing rules.

## Dependencies & Prerequisites

- Context specification [[docs/context/rules/laravel-common-and-artisan-standards|laravel-common-and-artisan-standards.md]] in `status: ready`.
- Existing Laravel rule taxonomy from [[docs/decisions/0022-pragmatic-laravel-rule-taxonomy-and-standards|ADR 0022]].

## Impacted Files & Components

- `docs/context/rules/laravel-common-and-artisan-standards.md` — verified reference.
- `rules/laravel/foundation/conventions.md` — inspect to streamline and cross-reference.

## Implementation Tasks

- [x] Task 1.1 — Audit existing `rules/laravel/foundation/conventions.md` to identify lines to be superseded or cross-referenced with `rules/laravel/common/naming-conventions.md`.
- [x] Task 1.2 — Define the exact rule schema requirements (`name`, `description`, `scope`, `alwaysApply: true`) for all three new rule files.
- [x] Task 1.3 — Verify boundary alignment with `rules/solid/` to ensure naming conventions and action delegation preserve single-responsibility principles.

## Verification & Testing

- Inspected `rules/laravel/foundation/conventions.md`: lines 26-30 will maintain general casing summaries while deferring detailed component naming to `rules/laravel/common/naming-conventions.md`.
- Validated rule frontmatter requirements via `scripts/validate-context.mjs`: `name`, `description`, `scope`, `alwaysApply: boolean`.
- Confirmed SOLID alignment: Artisan commands act as CLI controllers delegating domain mutations to Invokable Actions; component suffixes enforce Single Responsibility.

## Risks & Rollback

- Risk: Overlapping advice between `foundation/conventions.md` and `common/naming-conventions.md`.
- Mitigation: Clear separation: `foundation/conventions.md` governs modern PHP 8.2+ language features (strict types, enums, match expressions, Pint, config vs env); `common/naming-conventions.md` governs Laravel component, database, route, and file naming.
