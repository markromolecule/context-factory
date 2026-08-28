---
title: "Phase 2 — Workflow Frontmatter Contracts & Resolution Engine Upgrade"
type: phase
parent: "0001-task-synchronization-and-package-manager-modernization"
phase: "02"
status: completed
created: "2026-08-29"
tags: [task, phase, workflows, frontmatter, resolution]
---

# Phase 2 — Workflow Frontmatter Contracts & Resolution Engine Upgrade

## Objective

Standardize all 11 workflow markdown files in `workflows/` by adding explicit YAML frontmatter contracts (`rules`, `skills`, `primaryAgent`, `participatingAgents`). Upgrade `scripts/context-core.mjs` and `scripts/validate-context.mjs` to validate and consume these frontmatter arrays directly during context resolution while maintaining fallback regex scanning.

## Dependencies & Prerequisites

- Phase 1 completed.
- Existing 11 workflows in `workflows/*.md`.

## Impacted Files & Components

- [workflows/feature-delivery.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/feature-delivery.md)
- [workflows/architecture-change.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/architecture-change.md)
- [workflows/database-migration.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/database-migration.md)
- [workflows/defect-resolution.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/defect-resolution.md)
- [workflows/security-sensitive-change.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/security-sensitive-change.md)
- [workflows/code-review-and-optimization.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/code-review-and-optimization.md)
- [workflows/commit-push-release.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/commit-push-release.md)
- [workflows/context-maintenance.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/context-maintenance.md)
- [workflows/dependency-upgrade.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/dependency-upgrade.md)
- [workflows/new-project-delivery.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/new-project-delivery.md)
- [workflows/release-readiness.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/workflows/release-readiness.md)
- [scripts/context-core.mjs](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/scripts/context-core.mjs) — Update `resolveContext()` to read workflow frontmatter arrays.
- [scripts/validate-context.mjs](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/scripts/validate-context.mjs) — Add workflow frontmatter schema checks.

## Implementation Tasks

- [x] Task 2.1 — Enrich all 11 `workflows/*.md` files with typed `rules`, `skills`, `primaryAgent`, and `participatingAgents` YAML frontmatter.
- [x] Task 2.2 — Update `scripts/validate-context.mjs` to validate that declared workflow rules, skills, and agents exist in manifest.
- [x] Task 2.3 — Refactor `resolveContext()` in `scripts/context-core.mjs` to parse frontmatter arrays for selected workflows with regex fallback.
- [x] Task 2.4 — Add host repository rule discovery support in `resolveContext()` to score and include local host `./rules/*.md` when running in a bridged repository.

## Verification & Testing

- `node scripts/validate-context.mjs`: Validated all 11 workflows against frontmatter constraints (allowed keys, knownAgentNames, valid rule paths, and valid skill names).
- `node app/cli/bin/context-cli.mjs resolve "/plan feature user auth"`: Verified that `workflows/feature-delivery.md` frontmatter rules and skills (`skills/execute/SKILL.md`, `skills/explore/SKILL.md`, `skills/verify/SKILL.md`) were included in resolved paths.
- `pnpm run eval`: 19/19 unit and golden dataset evaluations passed in 62ms.
- `pnpm run doctor`: 100% PASS across Manifest Lint, Lock Integrity, Symlinks, and Evaluations.

## Risks & Rollback

- **Risk:** Existing workflows or test cases expecting regex parsing might miss rules if frontmatter is incomplete.
- **Mitigation:** Frontmatter rules are combined with regex body matches, ensuring strictly additive rule inclusion.
- **Rollback:** Frontmatter arrays can be adjusted or removed without breaking base resolution.


