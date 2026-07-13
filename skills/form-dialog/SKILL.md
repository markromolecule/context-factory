---
name: form-dialog
description: Design, implement, or review a data-entry modal, dialog, drawer, or sheet with efficient forms, accessible focus, safe mutations, and complete recovery states.
---

# Form Dialog

## Workflow

1. Read the dialogs/overlays, forms/validation, interaction-feedback, mutation-hook, code-organization, naming, code-quality, and security rules that apply.
2. Define the user outcome, triggering context, required data, authorization, success destination, destructive impact, and likely failure modes.
3. Choose the surface before designing fields:
   - inline for a local change that benefits from visible context;
   - popover for brief non-blocking choices;
   - modal for a short focused blocking task;
   - sheet for spatial continuity or mobile edge interaction;
   - route for long, multi-step, resumable, linkable, or reference-heavy work.
4. Remove unnecessary fields, select defaults and semantic inputs, order fields by user intent, and define client/server validation mapping.
5. Model explicit states: closed, pristine, editing, invalid, submitting, failed, succeeded, and discard-confirmation when meaningful.
6. Implement focus entry, containment, close behavior, restoration, accessible names/descriptions, error association, status announcements, and reduced motion using established primitives.
7. Connect the mutation with duplicate-submit prevention, retained values on failure, narrow cache updates, and success focus/navigation.
8. Verify keyboard, screen reader, 375px/mobile keyboard, desktop, zoom, long content, failure/retry, unsaved dismissal, and destructive behavior.

## Decision gate

Do not ship a form dialog when the task requires comparing substantial background information, navigating between steps, saving a draft for later, sharing a URL, or displaying content too dense for a constrained viewport. Move that workflow to a route.

## Completion evidence

Report the chosen surface and why, fields removed or defaulted, focus lifecycle, validation/error behavior, mutation lifecycle, responsive behavior, and tests performed.
