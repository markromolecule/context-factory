---
ruleId: cf-rule-ts-interaction-feedback
name: interaction-feedback
description: Make asynchronous UI state visible, local, recoverable, and proportionate to the user's action.
scope: Loading, empty, success, error, optimistic, disabled, and retry states in interactive components.
stack: typescript
appliesTo: ["src/**/components/**/*.tsx", "src/**/ui/**/*.tsx", "app/**/*.tsx"]
layers: ["ui", "components"]
alwaysApply: false
---

# Interaction Feedback

- [directive:ts.feedback.local-feedback-placement][mode:evidence-blocking][verifier:human-evidence] Put feedback next to the action or content it explains; use global toasts only for cross-page or non-local outcomes.
- [directive:ts.feedback.immediate-input-response][mode:evidence-blocking][verifier:human-evidence] Respond immediately to input. Use a pending state when work exceeds the perception threshold, and avoid flashing loaders for very fast work.
- [directive:ts.feedback.representative-skeletons][mode:advisory][verifier:none] Preserve layout with representative skeletons only when structure is known; otherwise use concise progress text or an indeterminate indicator.
- [directive:ts.feedback.preserve-data-during-refresh][mode:evidence-blocking][verifier:human-evidence] Keep existing usable data visible during background refresh and distinguish refreshing from first load.
- [directive:ts.feedback.actionable-error-recovery][mode:automated-blocking][verifier:test] Every blocking error must explain what happened in user language and offer the next safe action: correct, retry, reconnect, return, or contact support.
- [directive:ts.feedback.programmatic-status-announcement][mode:automated-blocking][verifier:test] Announce important status changes programmatically without stealing focus for routine updates.
- [directive:ts.feedback.conservative-optimistic-updates][mode:evidence-blocking][verifier:human-evidence] Use optimistic updates only for low-risk, reversible outcomes with reliable rollback. Never imply irreversible success before server confirmation.
- [directive:ts.feedback.undo-over-confirmation][mode:advisory][verifier:none] Prefer undo for quick reversible actions; use confirmation for irreversible, costly, security-sensitive, or broad-impact actions.
- [directive:ts.feedback.actionable-empty-states][mode:evidence-blocking][verifier:human-evidence] Empty states should explain why the area is empty and offer the most relevant permitted next action.
- [directive:ts.feedback.visible-disabled-reasons][mode:evidence-blocking][verifier:human-evidence] Disabled controls must remain understandable; when the reason is not obvious, expose it in nearby text rather than only a tooltip.

Verify slow, offline, timeout, partial, retry, background-refresh, duplicate-action, reduced-motion, and assistive-technology announcement behavior.
