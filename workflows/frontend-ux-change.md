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

Load relevant frontend, security, naming, and code-quality rules. Use grill-with-docs first when a new product experience or unresolved workflow is being created. Use `design-pattern` with task-relevant `taste/` guidance for end-to-end experience, interface-system, component-pattern design, and review; use form-dialog for data-entry overlays.

## Phases

1. Grill unresolved product intent, actors, workflows, scenarios, and terminology before committing to an interface direction.
2. Inspect the current component, surrounding task, design system, states, responsive behavior, and tests.
3. Map the complete journey, information hierarchy, friction, accessibility requirements, recovery paths, and measurable success.
4. Choose the correct interaction surfaces and resolve material UX decisions before styling.
5. Reuse established primitives/tokens and define contracts for every new or materially changed reusable component.
6. Compose representative pages and flows with realistic loading, empty, error, disabled, success, retry, stale, permission, and unsaved states.
7. Implement semantic structure, keyboard/focus behavior, mobile-first layout, safe mutations, and reduced motion.
8. Verify at 375px and desktop, keyboard-only, zoom, light/dark themes, reduced motion, slow/error states, and assistive-technology announcements.
9. Apply the taste quality bar, compare the resulting flow to the original outcome, and record follow-up usability evidence needed in production.

## Quality gates

- The change reduces or clearly justifies user effort and does not hide required context.
- Every interactive state is designed; failures preserve user work and provide recovery.
- Focus, labels, errors, status, contrast, target sizes, and motion meet applicable accessibility rules.
- New primitives are not introduced when an established component can satisfy the contract.
- Reusable components have explicit contracts and are verified in representative page or flow compositions.

## Stop and escalation conditions

Stop when the product outcome is ambiguous, a design-system change would affect unrelated consumers, destructive behavior lacks product policy, required copy/legal content is missing, or usability tradeoffs materially change scope.

## Artifacts and completion

Record durable surface/system decisions in an ADR. Report the chosen flow, removed friction, complete states, accessibility behavior, responsive evidence, tests, and production metrics recommended for review.
