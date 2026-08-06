# Guide to Avoiding Generic LLM Styling Clichés

Generative AI models are trained on public datasets that contain thousands of similar templates (often Tailwind CSS landing pages or generic bootstrap templates). Consequently, they tend to generate predictable, oversaturated, and generic styles unless they are constrained by explicit, project-defined boundaries.

This guide defines typical LLM styling clichés and provides techniques to write custom skills and prompts that bypass them.

## Typical LLM Styling Clichés

1. **The Oversaturated Indigo/Blue Hero**: LLMs default to using deep indigo or blue (`bg-indigo-600`, `bg-blue-600`) for primary buttons, heroes, and headers.
2. **Neon Card Gradients and Glows**: Adding `from-purple-500 to-indigo-500` gradients or semi-transparent rings around buttons and cards to make them "pop."
3. **Severe Pitch-Black Dark Modes**: Implementing dark modes with pure black background (`#000000`) and pure white text (`#ffffff`), which causes high eye strain.
4. **Excessive Spacing and Huge Typography**: Enormous h1 sizes (e.g. `text-6xl`) and padding (`py-24`) for simple elements, resulting in sparse, low-density views.
5. **Over-designed Shadow Effects**: Placing heavy, blurry drop-shadows on every list item or card component (`shadow-2xl`), making layouts look heavy and unaligned.
6. **Excessive Decorative Animations**: Adding slow page fades, sliding headers, or continuous loops on icon hovers that delay task completion.

## Techniques for Custom Craft

To enforce unique craftsmanship and eliminate LLM default patterns:

### 1. Feed the LLM Specific Primitives and Semantics
Never let the model choose hex codes or Tailwind shades. Instead, provide a narrow set of CSS variables and enforce their use:
```css
:root {
  --color-bg-base: #f9f9fb;
  --color-bg-surface: #ffffff;
  --color-text-body: #1c1b1f;
  --color-text-muted: #605d68;
  --color-border-subtle: #e2e1e6;
  --color-accent-primary: #8a3c00; /* Custom ochre/rust instead of default blue */
}
```

### 2. Define High-Density Layout Rules
Enforce clean tables, concise margins, and strict layouts. Rather than cards with deep shadows, use flat containers with thin borders (`1px solid var(--color-border-subtle)`).

### 3. Require Prefers-Reduced-Motion Wrapping
Force the model to wrap hover transitions and transforms in reduced-motion queries, which forces it to design transition paths cleanly.

### 4. Code Exercise: The Clean Typographic Layout
Try building a layout containing only:
- Semantic heading hierarchy.
- Standard sans-serif or serif fonts.
- Multi-column readable text (limit width to `65ch`).
- Zero background gradients, zero drop shadows.
Verify that it looks elegant and premium based purely on white space, typography, and contrast.
