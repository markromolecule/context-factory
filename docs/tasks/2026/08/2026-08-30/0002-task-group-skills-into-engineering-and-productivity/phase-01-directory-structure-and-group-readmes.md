---
title: "Phase 1: Skill Reorganization and Group READMEs"
type: phase
parent: "0002-task-group-skills-into-engineering-and-productivity"
phase: "1"
status: completed
created: "2026-08-30"
tags: [task, phase, skills, groups, readme]
---

# Phase 1: Skill Reorganization and Group READMEs

## Objective

Create `skills/engineering/` and `skills/productivity/` directories, migrate existing skills and resources into them, and author index `README.md` notes for `skills/`, `skills/engineering/`, and `skills/productivity/`.

## Dependencies & Prerequisites

- Master Task Plan in `docs/tasks/2026/08/2026-08-30/0002-task-group-skills-into-engineering-and-productivity/README.md`.

## Impacted Files & Components

- `skills/engineering/` (NEW DIR): `execute/`, `explore/`, `refactor/`, `security/`, `verify/`, `README.md`.
- `skills/productivity/` (NEW DIR): `adr/`, `context/`, `docs/`, `grill/`, `grounding/`, `plan/`, `triage/`, `README.md`.
- `skills/README.md` (NEW): Top-level skills directory taxonomy map.

## Implementation Tasks

- [x] Create `skills/engineering/` and `skills/productivity/` directories.
- [x] Move `execute`, `explore`, `refactor`, `security`, `verify` to `skills/engineering/`.
- [x] Move `adr`, `context`, `docs`, `grill`, `grounding`, `plan`, `triage` to `skills/productivity/`.
- [x] Author `skills/README.md` master directory index.
- [x] Author `skills/engineering/README.md` with skill index table and synchronization contract.
- [x] Author `skills/productivity/README.md` with skill index table and synchronization contract.

## Verification & Testing

- Inspect directory layout on disk.

## Risks & Rollback

- Revert file moves if path conflicts occur.
