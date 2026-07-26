---
name: component-contracts
description: Define reusable component and page-pattern contracts that remain coherent across states, content, accessibility, responsiveness, and composition.
scope: Design-system primitives, controls, navigation, forms, overlays, feedback, data display, content, page patterns, and component APIs.
---

# Component Contracts

Define a component as a user-facing contract, not a styled rectangle.

## Contract template

For each new or materially changed reusable component, record:

```text
Name and purpose:
User need:
Known consumers:
Anatomy and required slots:
Variants and when each is valid:
Content rules and limits:
Interaction and keyboard model:
States and transitions:
Responsive behavior:
Accessibility semantics:
Tokens used:
Composition rules:
Misuse and anti-patterns:
Verification:
```

## Required state matrix

Evaluate applicable states explicitly:

| State | Content | Visual treatment | Interaction | Accessibility announcement | Recovery |
|---|---|---|---|---|---|
| Default | | | | | |
| Hover/focus/active | | | | | |
| Disabled/read-only | | | | | |
| Loading/pending | | | | | |
| Empty | | | | | |
| Invalid/error | | | | | |
| Success/complete | | | | | |
| Partial/stale/offline | | | | | |

## Component-family questions

- **Actions:** Is hierarchy based on consequence and frequency? Are destructive actions unmistakable?
- **Inputs:** Are labels, help, validation timing, formatting, persistence, and recovery defined?
- **Navigation:** Are current location, nesting, overflow, keyboard movement, and responsive transformation clear?
- **Overlays:** Is the surface appropriate to task complexity? Are focus, dismissal, stacking, and unsaved work safe?
- **Feedback:** Is status timely, persistent for the right duration, and paired with a recovery action?
- **Data display:** Are scanning, sorting, filtering, density, truncation, comparison, empty states, and small screens addressed?
- **Content:** Are hierarchy, line length, localization growth, media behavior, and source attribution handled?
- **Layout:** Does the pattern define regions, priority, constraints, breakpoints, and behavior under sparse or dense content?

## Composition rules

- Prefer established primitives and tokens before adding a variant.
- Add a variant only for a recurring semantic need, not a one-screen visual exception.
- Define ownership of spacing: parent layout controls relationships; components control internal anatomy.
- Keep business policy outside generic presentation primitives.
- Test components in representative page compositions with realistic short, long, missing, and localized content.
- Verify that repeated components preserve hierarchy instead of creating equal visual weight everywhere.
- Document intentional escape hatches and the evidence required to use them.
