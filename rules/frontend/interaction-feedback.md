---
name: interaction-feedback
description: Make asynchronous UI state visible, local, recoverable, and proportionate to the user's action.
scope: Loading, empty, success, error, optimistic, disabled, and retry states in interactive components.
alwaysApply: false
---

# Interaction Feedback

- Put feedback next to the action or content it explains; use global toasts only for cross-page or non-local outcomes.
- Respond immediately to input. Use a pending state when work exceeds the perception threshold, and avoid flashing loaders for very fast work.
- Preserve layout with representative skeletons only when structure is known; otherwise use concise progress text or an indeterminate indicator.
- Keep existing usable data visible during background refresh and distinguish refreshing from first load.
- Every blocking error must explain what happened in user language and offer the next safe action: correct, retry, reconnect, return, or contact support.
- Announce important status changes programmatically without stealing focus for routine updates.
- Use optimistic updates only for low-risk, reversible outcomes with reliable rollback. Never imply irreversible success before server confirmation.
- Prefer undo for quick reversible actions; use confirmation for irreversible, costly, security-sensitive, or broad-impact actions.
- Empty states should explain why the area is empty and offer the most relevant permitted next action.
- Disabled controls must remain understandable; when the reason is not obvious, expose it in nearby text rather than only a tooltip.

Verify slow, offline, timeout, partial, retry, background-refresh, duplicate-action, reduced-motion, and assistive-technology announcement behavior.
