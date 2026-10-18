---
title: "Phase 1 — Consolidate Workflows into First-Class Skills"
type: phase
parent: "refactor-PLN-0010-clean-and-rebuild-typescript-factory"
phase: "01"
task_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
base_commit: "a37f557a2fde8e30b6ae23a941d74d8e87a5677f"
status: completed
created: "2026-10-16"
tags: [task, phase]
---

# Phase 1 — Consolidate Workflows into First-Class Skills

## Objective

Migrate all 12 workflows into unified first-class skill directories under `skills/workflows/<slug>/SKILL.md` (carrying YAML frontmatter `name` and `description` plus the complete lifecycle policy), and delete root `workflows/` and the wrapper layer `skills/workflow-entries/`.

## Dependencies & Prerequisites

- Fresh release brief `docs/discovery/typescript-factory-rebuild/brief.md` and active task branch `refactor/PLN-0010-clean-and-rebuild-typescript-factory`.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit 01.01** | Migrate Workflows to First-Class Skills and Remove Wrapper Indirection | `unit-01-workflow-consolidation.md` | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` | `none` | `completed` |

## Impacted Files & Components

- **Created:**
  - `skills/workflows/architecture-change/SKILL.md`
  - `skills/workflows/code-review-and-optimization/SKILL.md`
  - `skills/workflows/commit-push-release/SKILL.md`
  - `skills/workflows/context-maintenance/SKILL.md`
  - `skills/workflows/database-migration/SKILL.md`
  - `skills/workflows/defect-resolution/SKILL.md`
  - `skills/workflows/dependency-upgrade/SKILL.md`
  - `skills/workflows/docs/SKILL.md`
  - `skills/workflows/feature-delivery/SKILL.md`
  - `skills/workflows/new-project-delivery/SKILL.md`
  - `skills/workflows/release-readiness/SKILL.md`
  - `skills/workflows/security-sensitive-change/SKILL.md`
- **Deleted:**
  - `workflows/**` (12 files)
  - `skills/workflow-entries/**` (12 folders)

## Implementation Tasks

- [x] Unit 01.01 — Author `SKILL.md` files under `skills/workflows/<slug>/` combining YAML frontmatter and lifecycle policies, then remove old `workflows/` and `skills/workflow-entries/`.

## Verification & Testing

- `node scripts/context.mjs resolve "feature delivery"` selects `skills/workflows/feature-delivery/SKILL.md`.
- Automated test checks directory existence and YAML frontmatter validity.

## Risks & Rollback

- Revert changes via git restore targeting `workflows/` and `skills/`.
