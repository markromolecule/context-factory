---
title: Task-Appropriate Form Surfaces
type: decision
status: accepted
created: 2026-07-13
tags: [adr, frontend, ux, accessibility]
---

# 0002 — Task-Appropriate Form Surfaces

## Context

Using modal dialogs for every data-entry task creates cramped layouts, weak navigation, lost input, nested overlays, and accessibility failures. A consistent decision is needed before affected components are designed or refactored.

## Options considered

1. Put every create/edit form in a modal for visual consistency.
2. Decide between inline, popover, modal, sheet, and route according to task interruption, length, context, and continuity.
3. Put every form on a dedicated route for maximum space and navigation.

## Decision

Choose the smallest surface that preserves the context required to complete the task. Use inline editing for local contextual changes, popovers for brief choices, modals for focused blocking tasks, sheets for spatial continuity or mobile ergonomics, and dedicated routes for long, multi-step, resumable, linkable, collaborative, or reference-heavy workflows.

All data-entry overlays preserve input on failure, protect unsaved changes, expose complete validation and mutation states, and follow the WAI-ARIA modal focus lifecycle.

## Consequences

- Users complete short tasks without unnecessary navigation while complex work receives enough space and continuity.
- Components need explicit pristine, editing, submitting, failed, succeeded, and discard states.
- Teams must maintain consistent dialog and form primitives rather than implementing focus and state behavior ad hoc.
- Some existing modal forms should move inline or to routes during affected-component work.

## Validation and review date

Review after the first three production form-dialog implementations or by 2027-01-13, whichever comes first. Validate task completion, abandonment, correction rate, support feedback, keyboard behavior, and mobile usability.
