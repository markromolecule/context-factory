---
title: "Phase 1 — Rule Catalog and Shared Rules Cleanup"
type: phase
parent: "refactor-PLN-0006-decommission-laravel-and-php-stack"
phase: "01"
task_branch: "refactor/PLN-0006-decommission-laravel-and-php-stack"
base_commit: "d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6"
status: planned
created: "2026-10-09"
tags: [task, phase]
---

# Phase 1 — Rule Catalog and Shared Rules Cleanup

## Objective

Purge all 23 active rule files under `rules/laravel/` and scrub PHP syntax, language extensions, and dual-language snippets from shared rules under `rules/solid/` and `rules/global/` to dedicate the rules catalog 100% to TypeScript.

## Dependencies & Prerequisites

- ADR 0036 accepted on `master`.
- Discovery brief `docs/discovery/decommission-laravel-php/brief.md` released.
- Working tree on task branch `refactor/PLN-0006-decommission-laravel-and-php-stack`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | Purge Laravel Rules and Scrub Shared SOLID/Global Rules | `unit-01-rules-catalog-and-shared-cleanup.md` | `refactor/PLN-0006-decommission-laravel-and-php-stack` | `none` | `planned` |

## Impacted Files & Components

- `rules/laravel/`: All 23 files deleted.
- `rules/solid/single-responsibility.md`: Remove PHP `appliesTo` and replace PHP snippet with TypeScript.
- `rules/solid/open-closed.md`: Remove PHP `appliesTo` and replace PHP snippet with TypeScript.
- `rules/solid/liskov-substitution.md`: Remove PHP `appliesTo` and replace PHP snippet with TypeScript.
- `rules/solid/interface-segregation.md`: Remove PHP `appliesTo` and replace PHP snippet with TypeScript.
- `rules/solid/dependency-inversion.md`: Remove PHP `appliesTo` and replace PHP snippet with TypeScript.
- `rules/global/architecture-conformance.md`: Remove `.php` from `appliesTo`.
- `rules/global/evidence-and-claims.md`: Remove `.php` from `appliesTo`.
- `rules/global/naming-conventions.md`: Remove `.php` from `appliesTo`.
- `rules/global/security-guardrails.md`: Remove `.php` from `appliesTo`.
- `rules/global/code-quality.md`: Remove `.php` from `appliesTo`.
- `orchestrator/rules/descriptor-parser.mjs`: Verify rule descriptors parser operates cleanly on cleaned rule tree.

## Implementation Tasks

- [ ] Unit 01.01 — Purge all 23 Laravel rule files and update shared SOLID and global rules.

## Verification & Testing

- `node scripts/context.mjs lint`
- Conformance report verifying syntax and descriptor integrity.

## Risks & Rollback

- Revert commit on task branch `refactor/PLN-0006-decommission-laravel-and-php-stack`.
