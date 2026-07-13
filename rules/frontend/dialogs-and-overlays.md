---
name: dialogs-and-overlays
description: Choose and implement dialogs, sheets, popovers, and confirmations without trapping users in unnecessary interruption.
scope: Modal and non-modal dialogs, drawers, sheets, popovers, confirmations, and forms rendered within overlays.
alwaysApply: false
---

# Dialogs and Overlays

## Choose the right surface

- Prefer inline editing when the change belongs to visible content and surrounding context helps the task.
- Use a popover for brief, non-blocking choices anchored to a control.
- Use a modal dialog for one focused task that must temporarily block the underlying workflow.
- Use a sheet when spatial continuity matters or mobile ergonomics benefit from an edge-attached surface.
- Use a dedicated route for long, multi-step, deep-linkable, resumable, collaborative, or reference-heavy work.
- Do not nest modal dialogs. Replace the current surface, use an inline disclosure, or move the workflow to a page.

## Dialog contract

- Give every dialog a visible intent-based title and concise supporting description when needed.
- Render a semantic dialog with a programmatic name and modal state. Make content outside a modal inert.
- Move focus inside on open, contain the tab sequence, support `Escape` when dismissal is safe, provide a visible close action, and restore focus logically on close.
- Choose initial focus deliberately: first useful field for simple entry, heading for dense content, or least destructive action for hard-to-reverse confirmation.
- Keep primary and secondary actions visible without obscuring fields. Use one visually dominant action.
- On small screens, allow the dialog or sheet to use available height, keep the title/actions reachable, respect safe areas and the virtual keyboard, and scroll the content region rather than the page behind it.

## Data-entry behavior

- Preserve values and keep the dialog open when validation or mutation fails.
- During submission, prevent duplicate actions, retain context, and show progress in or beside the initiating action without replacing its meaning.
- Close after confirmed success, announce the result, and update or focus the affected content.
- If dismissal would discard meaningful changes, ask for confirmation that names the consequence and offers `Keep editing` as the safe action.
- Do not use a confirmation dialog for routine reversible actions when an immediate action with undo is safer and faster.
- For destructive confirmations, name the affected object and consequence. Require typed confirmation only for rare, irreversible, high-impact actions.

## Verification

Test open and close focus, tab containment, `Escape`, outside interaction, unsaved dismissal, long content, virtual-keyboard layout, mutation failure, success focus, nested-overlay prevention, reduced motion, and screen-reader naming.
