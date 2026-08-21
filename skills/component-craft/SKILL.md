---
name: component-craft
description: Engineer polished, accessible, responsive React/Next.js UI components with robust state handling, keyboard navigation, and zero layout shift (/component-craft, /component, [UI]).
---

# Frontend Component Craft & Accessibility

Use this skill when authoring production React/Next.js components, building complex interactive widgets (dialogs, drawers, dropdowns, data tables), implementing accessible ARIA primitives, and eliminating layout jitter.

## Workflow

1. **State & Interaction Modeling:**
   - Define discrete UI states: `idle`, `loading`, `empty`, `error`, `success`.
   - Separate server state (`useQuery`) from ephemeral interactive UI state (`useState`, `useReducer`, `zustand`).
   - Prevent UI layout shift (CLS) by reserving space with aspect ratio boxes and skeleton placeholders.
2. **Accessibility & Keyboard Navigation:**
   - Use semantic HTML tags (`<button>`, `<dialog>`, `<nav>`, `<main>`, `<article>`).
   - Implement ARIA attributes (`aria-expanded`, `aria-controls`, `aria-live`, `aria-describedby`).
   - Ensure complete keyboard operability (Tab order, Escape to close, Arrow navigation, Focus trapping).
3. **Responsive Layout & Design Tokens:**
   - Adhere to project design tokens (colors, typography scale, spacing units).
   - Ensure mobile-first responsive layout across mobile, tablet, and desktop viewports.
   - Avoid generic LLM visual clichés (unfocused neon borders, random floating cards, non-standard contrast).
4. **Resilient Feedback & Error Boundaries:**
   - Provide immediate visual feedback on user actions (active states, optimistic updates, loading spinners).
   - Catch rendering crashes with local error boundaries.

## Output

Report:
- Clean, accessible TypeScript React component code.
- Responsive CSS/styling integration.
- Accessibility verification notes (screen reader labels, keyboard test checklist).
