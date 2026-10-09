---
title: "{{title}}"
type: phase
parent: "{{parent_task}}"
phase: "{{phase_number}}"
task_branch: "{{task_branch}}"
base_commit: "{{base_commit}}"
status: planned
created: "{{date}}"
tags: [task, phase]
---

# {{title}}

## Objective

Summarize the specific goal and desired outcome of this phase.

## Dependencies & Prerequisites

- Prior phases or external blockers required before starting this phase.

## Unit Index & Branch Allocation

| Unit ID | Title | Artifact File | Task Branch | Depends On | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit {{phase_number}}.01** | {{unit_title}} | `{{unit_filename}}` | `{{task_branch}}` | `none` | `planned` |

## Impacted Files & Components

- List modified, created, or deleted files/modules and their responsibilities.

## Implementation Tasks

- [ ] Unit {{phase_number}}.01 — detailed description of change

## Verification & Testing

- Specific commands, automated test suites, or manual verification steps for this phase.

## Risks & Rollback

- Specific risks, backward compatibility notes, or rollback strategy.
- Verify the active branch matches `{{task_branch}}` before changes. Execute units serially on this branch.
