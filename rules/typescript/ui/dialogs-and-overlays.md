---
ruleId: cf-rule-ts-dialogs-and-overlays
name: dialogs-and-overlays
description: Choose and implement dialogs, sheets, popovers, and confirmations without trapping users in unnecessary interruption.
scope: Modal and non-modal dialogs, drawers, sheets, popovers, confirmations, and forms rendered within overlays.
stack: typescript
appliesTo: ["**/src/**/components/**/*.tsx", "**/src/**/ui/**/*.tsx", "**/app/**/*.tsx"]
layers: ["ui", "components"]
alwaysApply: false
---

# Dialogs and Overlays

## Choose the right surface

- [directive:ts.overlay.prefer-inline-editing][mode:advisory][verifier:none] Prefer inline editing when the change belongs to visible content and surrounding context helps the task.
- [directive:ts.overlay.popover-for-brief-choices][mode:advisory][verifier:none] Use a popover for brief, non-blocking choices anchored to a control.
- [directive:ts.overlay.modal-for-focused-task][mode:advisory][verifier:none] Use a modal dialog for one focused task that must temporarily block the underlying workflow.
- [directive:ts.overlay.sheet-for-spatial-continuity][mode:advisory][verifier:none] Use a sheet when spatial continuity matters or mobile ergonomics benefit from an edge-attached surface.
- [directive:ts.overlay.dedicated-route-for-heavy-flow][mode:advisory][verifier:none] Use a dedicated route for long, multi-step, deep-linkable, resumable, collaborative, or reference-heavy work.
- [directive:ts.overlay.never-nest-modals][mode:evidence-blocking][verifier:human-evidence] Do not nest modal dialogs. Replace the current surface, use an inline disclosure, or move the workflow to a page.

## Dialog contract

- [directive:ts.overlay.visible-title-description][mode:evidence-blocking][verifier:human-evidence] Give every dialog a visible intent-based title and concise supporting description when needed.
- [directive:ts.overlay.semantic-dialog-inert-backdrop][mode:automated-blocking][verifier:test] Render a semantic dialog with a programmatic name and modal state. Make content outside a modal inert.
- [directive:ts.overlay.accessible-focus-containment][mode:automated-blocking][verifier:test] Move focus inside on open, contain the tab sequence, support `Escape` when dismissal is safe, provide a visible close action, and restore focus logically on close.
- [directive:ts.overlay.deliberate-initial-focus][mode:evidence-blocking][verifier:human-evidence] Choose initial focus deliberately: first useful field for simple entry, heading for dense content, or least destructive action for hard-to-reverse confirmation.
- [directive:ts.overlay.visible-dominant-actions][mode:advisory][verifier:none] Keep primary and secondary actions visible without obscuring fields. Use one visually dominant action.
- [directive:ts.overlay.responsive-viewport-ergonomics][mode:evidence-blocking][verifier:human-evidence] On small screens, allow the dialog or sheet to use available height, keep the title/actions reachable, respect safe areas and the virtual keyboard, and scroll the content region rather than the page behind it.

## Data-entry behavior

- [directive:ts.overlay.preserve-values-on-error][mode:automated-blocking][verifier:test] Preserve values and keep the dialog open when validation or mutation fails.
- [directive:ts.overlay.submission-progress-feedback][mode:evidence-blocking][verifier:human-evidence] During submission, prevent duplicate actions, retain context, and show progress in or beside the initiating action without replacing its meaning.
- [directive:ts.overlay.close-on-confirmed-success][mode:evidence-blocking][verifier:human-evidence] Close after confirmed success, announce the result, and update or focus the affected content.
- [directive:ts.overlay.unsaved-dismissal-warning][mode:evidence-blocking][verifier:human-evidence] If dismissal would discard meaningful changes, ask for confirmation that names the consequence and offers `Keep editing` as the safe action.
- [directive:ts.overlay.undo-over-confirmation][mode:advisory][verifier:none] Do not use a confirmation dialog for routine reversible actions when an immediate action with undo is safer and faster.
- [directive:ts.overlay.destructive-confirmation-naming][mode:evidence-blocking][verifier:human-evidence] For destructive confirmations, name the affected object and consequence. Require typed confirmation only for rare, irreversible, high-impact actions.

## Verification

Test open and close focus, tab containment, `Escape`, outside interaction, unsaved dismissal, long content, virtual-keyboard layout, mutation failure, success focus, nested-overlay prevention, reduced motion, and screen-reader naming.
