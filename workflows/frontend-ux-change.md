---
name: frontend-ux-change
description: Improve an interactive user experience from task analysis through accessible responsive implementation and usability verification.
scope: New or affected pages, components, forms, dialogs, navigation, feedback states, and visual interaction changes.
---

# Frontend UX Change

## Triggers

Use when UI behavior, task flow, information hierarchy, accessibility, or responsive interaction changes—not for invisible refactors with identical experience.

## Required inputs

- Primary user outcome, affected personas, current flow, constraints, and success measure.
- Existing design tokens/components, framework boundaries, data/mutation contracts, and accessibility baseline.

## Applicable rules and skills

Load relevant frontend, security, naming, and code-quality rules. Use `design-pattern` for interface design and review; use `form-dialog` for data-entry overlays.

## Phases

1. Inspect the current component, surrounding task, design system, states, responsive behavior, and tests.
2. Define the user goal, information hierarchy, friction, accessibility requirements, and measurable success.
3. Choose the correct interaction surface and resolve material UX decisions before styling.
4. Reuse established primitives/tokens and model loading, empty, error, disabled, success, retry, and unsaved states.
5. Implement semantic structure, keyboard/focus behavior, mobile-first layout, safe mutations, and reduced motion.
6. Verify at 375px and desktop, keyboard-only, zoom, light/dark themes, reduced motion, slow/error states, and assistive-technology announcements.
7. Compare the resulting flow to the original outcome and record follow-up usability evidence needed in production.

## Quality gates

- The change reduces or clearly justifies user effort and does not hide required context.
- Every interactive state is designed; failures preserve user work and provide recovery.
- Focus, labels, errors, status, contrast, target sizes, and motion meet applicable accessibility rules.
- New primitives are not introduced when an established component can satisfy the contract.

## Stop and escalation conditions

Stop when the product outcome is ambiguous, a design-system change would affect unrelated consumers, destructive behavior lacks product policy, required copy/legal content is missing, or usability tradeoffs materially change scope.

## Artifacts and completion

Record durable surface/system decisions in an ADR. Report the chosen flow, removed friction, complete states, accessibility behavior, responsive evidence, tests, and production metrics recommended for review.
