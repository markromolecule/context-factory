---
title: "{{title}}"
type: phase
parent: "{{parent_task}}"
phase: "{{phase_number}}"
phase_branch: "task/{{parent_task}}/phase-{{phase_number}}"
status: planned
created: "{{date}}"
tags: [task, phase]
---

# {{title}}

## Objective

Summarize the specific goal and desired outcome of this phase.

## Dependencies & Prerequisites

- Prior phases or external blockers required before starting this phase.

## Unit Index & Worktree Allocation

| Unit ID | Title | Artifact File | Branch | Worktree Directory | Depends On | Parallelizable With | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Unit {{phase_number}}.01** | [Unit Title] | `unit-01-[slug].md` | `task/{{parent_task}}/phase-{{phase_number}}/[slug]` | `.worktrees/{{parent_task}}/phase-{{phase_number}}/[slug]` | `none` | `none` | `planned` |

## Impacted Files & Components

- List modified, created, or deleted files/modules and their responsibilities.

## Implementation Tasks

- [ ] Unit {{phase_number}}.01 — detailed description of change

## Verification & Testing

- Specific commands, automated test suites, or manual verification steps for this phase.

## Risks, Worktree Teardown & Rollback

- Specific risks, backward compatibility notes, or rollback strategy.
- Teardown: after phase integration merge, remove unit worktrees with `git worktree remove --force`, prune worktrees, and clean empty parent directories under `.worktrees/`.
