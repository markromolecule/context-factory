---
title: "{{title}}"
type: phase
parent: "{{parent_task}}"
phase: "{{phase_number}}"
task_branch: "{{task_branch}}"
checkout_mode: "{{checkout_mode}}"
checkout_reason: "{{checkout_reason}}"
checkout_path: "{{checkout_path}}"
status: planned
created: "{{date}}"
tags: [task, phase]
---

# {{title}}

## Objective

Summarize the specific goal and desired outcome of this phase.

## Dependencies & Prerequisites

- Prior phases or external blockers required before starting this phase.

## Unit Index & Checkout Allocation

| Unit ID | Title | Artifact File | Task Branch | Checkout Mode | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit {{phase_number}}.01** | {{unit_title}} | `{{unit_filename}}` | `{{task_branch}}` | `{{checkout_mode}}` | `none` | `none` | `planned` |

## Impacted Files & Components

- List modified, created, or deleted files/modules and their responsibilities.

## Implementation Tasks

- [ ] Unit {{phase_number}}.01 — detailed description of change

## Verification & Testing

- Specific commands, automated test suites, or manual verification steps for this phase.

## Risks, Worktree Teardown & Rollback

- Specific risks, backward compatibility notes, or rollback strategy.
- Use the recorded task checkout. Concurrent units require explicit worktree paths, clean checks, and merge order. Never force-remove a worktree with residual files.
