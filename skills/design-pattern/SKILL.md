---
name: design-pattern
description: Define, document, apply, or review coherent end-to-end product experiences, accessible visual systems, interaction flows, responsive pages, and reusable component patterns. Use for system design, experience architecture, visual-system worksheets, component families and states, design tokens, brand-to-interface translation, dashboards, landing pages, application flows, redesigns, and UI quality reviews in CSS, Tailwind, Figma, React, Next.js, Astro, or HTML projects.
---

# Design Product and Interface Patterns

## Workflow

1. Inspect the product goal, actors, end-to-end journey, content, existing brand/system, implementation stack, reference interfaces, and accessibility baseline.
2. Choose the task mode: define an experience and system, define a reusable component pattern, apply an established system, or review conformance.
3. If the product intent or behavior is unresolved, complete `grill-with-docs` before fixing visual or interaction decisions.
4. Read `../../taste/README.md` and load only the taste references routed for the task.
5. Establish the primary user goal, journey stages, information hierarchy, system feedback, and recovery paths before choosing visual treatments.
6. Inventory existing tokens, primitives, components, page patterns, and exceptions. Reuse them unless the user explicitly authorizes a system change.
7. When defining or materially extending a visual system, read `references/design-system-worksheet.md` and resolve its decisions. If inputs are missing, state reversible assumptions and leave brand-specific worksheet fields open.
8. When no visual system exists and a complete worksheet is unnecessary, read `references/visual-system.md` for safe baseline defaults.
9. For every new or changed reusable component, define its contract using `../../taste/component-contracts.md` before implementation.
10. Assemble components into coherent page and flow patterns; do not optimize an isolated component at the expense of the complete user journey.
11. Implement or specify mobile-first structure, semantic behavior, complete states, dark mode where required, and reduced motion.
12. Review the result using `../../taste/quality-bar.md` and verify responsive behavior, accessibility, content fit, token reuse, and journey continuity.

## Output contract

For a design-system definition, return or create:

- an experience map connecting actor goals, journey stages, information hierarchy, feedback, recovery, and success;
- a completed or fillable worksheet with decisions, assumptions, and unresolved fields clearly distinguished;
- primitive, semantic, and component token layers with stable names;
- typography, color, spacing/layout, shape/elevation, imagery/iconography, motion, and voice rules;
- a component inventory with reusable contracts for anatomy, variants, content, behavior, states, accessibility, responsiveness, composition, and verification;
- representative page or flow compositions proving that components work together;
- stack-specific implementation mapping only for the user's stack, or stack-neutral CSS custom properties when none is known;
- accessibility, responsive, interaction, and visual-regression verification criteria.

For application or review work, name the governing tokens and system rules, record justified exceptions, and do not redesign unrelated surfaces.

## Decision rules

- Design from the complete task journey inward, then validate each component both alone and in composition.
- Prefer one strong visual idea over many unrelated effects.
- Translate personality words into observable choices; never use mood labels as sufficient specifications.
- Use reference brands or sites as directional evidence, not as assets to copy.
- Preserve product conventions unless the task explicitly requests a redesign.
- Keep body copy near 65–75 characters per line.
- Use color to reinforce hierarchy, never as the only status signal.
- Define loading, empty, error, disabled, hover, focus, and active states where applicable.
- Prefer semantic tokens in components; do not scatter raw colors, spacing values, or shadows through implementation.
- Keep token names role-based (`color-action-primary`) rather than appearance-based (`blue-500`) at the semantic layer.
- Avoid decorative motion that obscures task completion or violates reduced-motion preferences.
- Do not add a UI library only to obtain one component.
- Do not introduce a reusable component until its intended consumers and variation pressure are known.
- Do not hide missing product decisions behind polished mockups or arbitrary defaults.
