# Visual Design System Worksheet

Use this worksheet to turn brand intent into reusable interface rules. Complete it from inspected evidence when possible. Mark missing choices as `[Open]` and reversible working choices as `[Assumption]`; do not invent user preferences.

## Contents

1. Foundation and personality
2. Typography
3. Color
4. Spacing, layout, and responsiveness
5. Shape, elevation, and component styling
6. Imagery and iconography
7. Motion
8. Voice and interface copy
9. Tokens, documentation, and governance
10. Completion checklist

## 1. Foundation and personality

### Questions

- What does the product help whom accomplish?
- Which three to five mood words should the interface express?
- What should it explicitly avoid feeling like?
- Which reference brands or interfaces demonstrate relevant qualities, and which specific qualities matter?
- What content density, device context, accessibility baseline, and implementation stack constrain the system?

### Fill in

```text
Product and primary user:
Primary task:
Personality words:
Anti-personality words:
Reference / quality borrowed:
Content density: sparse / balanced / dense
Primary devices:
Accessibility target:
Implementation stack:
Existing assets or constraints:
```

Translate each mood word into observable decisions:

| Mood word | Typography | Color      | Shape/spacing | Imagery/motion | Voice      |
| --------- | ---------- | ---------- | ------------- | -------------- | ---------- |
| `[word]`  | `[choice]` | `[choice]` | `[choice]`    | `[choice]`     | `[choice]` |

### Example

| Mood word | Typography                       | Color                    | Shape/spacing                   | Imagery/motion                | Voice                   |
| --------- | -------------------------------- | ------------------------ | ------------------------------- | ----------------------------- | ----------------------- |
| Calm      | Humanist sans, moderate contrast | Muted blue/stone palette | Generous whitespace, 12px radii | Slow fades, quiet photography | Direct, reassuring      |
| Precise   | Tabular numerals, compact labels | Restrained accent use    | Aligned grid, crisp borders     | Minimal decorative motion     | Specific verbs, no hype |

## 2. Typography

### Questions

- Does the brand need one family, a display/body pairing, or a data/code face?
- Are the fonts licensed, performant, language-complete, and legible at small sizes?
- Which hierarchy levels are actually needed?
- How should size, weight, line height, and letter spacing change across breakpoints?
- Which styles are semantic rather than tied to an HTML element?

### Fill in

```text
Display/heading family:
Body/UI family:
Mono/data family:
Fallback stacks:
Available weights:
Base font size:
Body measure:
Font loading/fallback strategy:
```

| Role       | Mobile size/line | Desktop size/line | Weight | Tracking | Usage |
| ---------- | ---------------- | ----------------- | ------ | -------- | ----- |
| Display    |                  |                   |        |          |       |
| Heading 1  |                  |                   |        |          |       |
| Heading 2  |                  |                   |        |          |       |
| Heading 3  |                  |                   |        |          |       |
| Body       |                  |                   |        |          |       |
| Body small |                  |                   |        |          |       |
| Label      |                  |                   |        |          |       |
| Caption    |                  |                   |        |          |       |
| Code/data  |                  |                   |        |          |       |

Use semantic roles rather than forcing six visually distinct heading styles when the product does not need them. Preserve correct heading order independently of visual style.

### Example

```text
Heading: "Manrope", ui-sans-serif, system-ui, sans-serif
Body: "Inter", ui-sans-serif, system-ui, sans-serif
Body: 16px/24px, weight 400
H1: clamp(2.25rem, 1.75rem + 2vw, 4rem)/1.05, weight 700, -0.03em
H2: clamp(1.75rem, 1.5rem + 1vw, 2.5rem)/1.15, weight 650, -0.02em
Label: 14px/20px, weight 600, 0
Caption: 12px/16px, weight 500, 0.01em
Measure: 68ch
```

## 3. Color

### Questions

- What role does each color serve rather than merely what does it look like?
- Which surfaces and text colors work in light and dark themes?
- Which colors represent action, focus, success, warning, danger, and information?
- Are gradients structural, expressive, or unnecessary?
- Do text, icons, controls, focus indicators, and state distinctions meet the intended contrast target?

### Fill in

```text
Brand hue:
Secondary hue:
Accent hue:
Neutral family:
Light theme surface strategy:
Dark theme surface strategy:
Gradient purpose and limits:
Contrast target:
Color-blind/state redundancy:
```

Define three layers:

1. Primitive: raw ramps such as `color-blue-600`.
2. Semantic: roles such as `color-action-primary` and `color-text-muted`.
3. Component: rare local roles such as `button-primary-background`.

| Semantic role  | Light | Dark | Required pair/contrast | Notes |
| -------------- | ----- | ---- | ---------------------- | ----- |
| Canvas         |       |      |                        |       |
| Surface        |       |      |                        |       |
| Text           |       |      |                        |       |
| Text muted     |       |      |                        |       |
| Border         |       |      |                        |       |
| Action primary |       |      |                        |       |
| Focus          |       |      |                        |       |
| Success        |       |      |                        |       |
| Warning        |       |      |                        |       |
| Danger         |       |      |                        |       |

Target at least WCAG AA: 4.5:1 for normal text, 3:1 for large text, and 3:1 for meaningful non-text controls and indicators. Verify actual rendered pairs instead of assuming a palette step passes.

### Example

```css
:root {
  --color-canvas: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #172033;
  --color-text-muted: #536078;
  --color-action-primary: #3157d5;
  --color-action-primary-hover: #2748b8;
  --color-focus: #7c3aed;
  --color-border: #d7deea;
}

[data-theme="dark"] {
  --color-canvas: #0e1422;
  --color-surface: #161e2f;
  --color-text: #f4f7fb;
  --color-text-muted: #b4bed0;
  --color-action-primary: #8da4ff;
  --color-action-primary-hover: #aabaff;
  --color-focus: #c4b5fd;
  --color-border: #344057;
}
```

Example gradient rule: use the brand gradient only for non-text hero atmosphere and small emphasis surfaces; never place body copy over it without verifying the final contrast.

## 4. Spacing, layout, and responsiveness

### Questions

- What base unit creates the product's density?
- Which spacing steps cover inset, inline, stack, and section relationships?
- What are the content, reading, and application-shell maximum widths?
- Where does content require a breakpoint rather than where a device name suggests one?
- How do grids collapse, reorder, or scroll on narrow screens?

### Fill in

```text
Base unit:
Spacing scale:
Mobile gutter:
Desktop gutter:
Reading width:
Content width:
Application shell width:
Grid columns/gaps:
Content-driven breakpoints:
Density modes, if any:
```

Name layout tokens by role where reuse matters: `space-control-inline`, `space-card-inset`, `space-section-block`, `size-content-reading`, and `size-shell-max`.

### Example

```text
Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
Gutters: 16px mobile, 24px tablet, 32px desktop
Reading width: 70ch
Marketing content: 1200px
Application shell: 1440px
Grid: 4 columns mobile, 8 tablet, 12 desktop; 16/24px gaps
Breakpoints: 640px when nav wraps; 900px when the two-column form becomes cramped; 1200px for shell gutters
```

## 5. Shape, elevation, and component styling

### Questions

- What radius language supports the personality?
- Are surfaces separated by borders, tonal shifts, elevation, or a deliberate combination?
- Which control sizes and target sizes are supported?
- Which component states must be visually and behaviorally distinct?
- Which properties may vary by component and which must remain token-controlled?

### Fill in

```text
Radius scale:
Border widths/styles:
Elevation scale:
Control heights:
Minimum target size:
Focus treatment:
Disabled treatment:
Loading treatment:
Validation treatment:
```

Define at least these states where applicable: default, hover, focus-visible, active/pressed, selected, disabled, loading, error, success, and read-only. State changes must not depend on color alone.

| Component       | Anatomy/tokens | Required states | Responsive behavior |
| --------------- | -------------- | --------------- | ------------------- |
| Button          |                |                 |                     |
| Input/select    |                |                 |                     |
| Card            |                |                 |                     |
| Navigation      |                |                 |                     |
| Dialog/sheet    |                |                 |                     |
| Feedback/status |                |                 |                     |

### Example

```css
.button-primary {
  min-height: var(--size-control-md);
  padding-inline: var(--space-control-inline);
  border-radius: var(--radius-control);
  color: var(--color-on-action);
  background: var(--color-action-primary);
  box-shadow: var(--elevation-control);
}

.button-primary:hover {
  background: var(--color-action-primary-hover);
}
.button-primary:active {
  transform: translateY(1px);
}
.button-primary:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
.button-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
```

Example system: 8px control radius, 12px card radius, 16px dialog radius; borders separate routine cards, while shadows are reserved for floating overlays.

## 6. Imagery and iconography

### Questions

- Should the system use photography, illustration, diagrams, product captures, or a controlled mix?
- What subjects, composition, lighting, crop, texture, and color treatment fit the personality?
- What must never appear?
- Which icon family, grid, stroke/fill style, size, and optical rules apply?
- When does an icon require a visible label or accessible name?

### Fill in

```text
Primary imagery type:
Subject/composition rules:
Lighting/color treatment:
Aspect ratios/crops:
Illustration treatment:
Prohibited treatments:
Icon family/source:
Icon grid and stroke:
Default icon sizes:
Label/accessibility rules:
```

### Example

```text
Photography: candid people using the product, natural side light, quiet backgrounds, cool-neutral grade.
Crops: 4:3 editorial, 16:9 hero, 1:1 avatar; keep faces away from text-safe areas.
Avoid: staged handshakes, mixed duotone filters, decorative screenshots too small to read.
Icons: one 24px rounded-outline family, 1.75px stroke; use 16px only in compact data rows.
Meaningful standalone icons receive an accessible name; decorative icons are hidden from assistive technology.
```

## 7. Motion

### Questions

- What user understanding or continuity does each animation improve?
- Which duration and easing bands cover feedback, overlays, and larger spatial transitions?
- Which properties can animate without causing layout instability?
- What is removed or simplified under reduced motion?

### Fill in

```text
Motion personality:
Feedback duration/easing:
Overlay duration/easing:
Spatial duration/easing:
Allowed properties:
Reduced-motion behavior:
Prohibited motion:
```

### Example

```text
Feedback: 120–180ms ease-out for color and opacity.
Overlays: 220ms cubic-bezier(.2,.8,.2,1).
Large spatial transitions: 300ms maximum.
Animate transform and opacity; avoid routine height/position animation.
Reduced motion: remove parallax and travel; retain instant or short opacity feedback.
```

## 8. Voice and interface copy

### Questions

- How should the product sound during success, uncertainty, failure, and destructive actions?
- Which vocabulary, sentence length, capitalization, and punctuation conventions apply?
- Which phrases, jokes, or claims are prohibited?
- Do labels name the action and errors explain recovery?

### Fill in

```text
Voice attributes:
Tone under normal use:
Tone under failure:
Button-label convention:
Heading capitalization:
Terminology source:
Prohibited language:
Localization/content constraints:
```

### Example

```text
Voice: calm, concise, capable.
Buttons use verb + object: "Save profile", not "Submit".
Errors state event and recovery: "We couldn't save your profile. Check your connection and try again."
Use sentence case. Avoid exclamation marks in errors, blame language, and unsupported superlatives.
```

## 9. Tokens, documentation, and governance

### Questions

- Which values are primitive, semantic, or component-specific?
- What naming convention works across design and code?
- Where is the canonical source, and how are Figma/code outputs synchronized?
- Who may add a token or component variant?
- How are deprecation, theme changes, visual regression, and accessibility reviewed?

### Fill in

```text
Canonical source:
Token layers:
Naming convention:
Theme mechanism:
Figma/code synchronization:
Change owner/reviewer:
New-token criteria:
Deprecation process:
Visual regression method:
Documentation location:
```

### Example token model

```css
:root {
  /* Primitive */
  --palette-blue-600: #3157d5;
  --scale-4: 1rem;

  /* Semantic */
  --color-action-primary: var(--palette-blue-600);
  --space-card-inset: var(--scale-4);

  /* Component */
  --button-primary-background: var(--color-action-primary);
}
```

Stack mapping:

| Stack     | Recommended representation                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| Plain CSS | CSS custom properties grouped by primitive, semantic, and component layers                                    |
| Tailwind  | CSS variables as source values; semantic utility/theme aliases; avoid arbitrary values in repeated components |
| Figma     | Variables/collections matching semantic token names; component properties and documented states               |
| CSS-in-JS | Typed theme object generated from or aligned with the same semantic token source                              |

## 10. Completion checklist

- [ ] Personality words map to observable typography, color, shape, imagery/motion, and voice decisions.
- [ ] Typography roles cover real content and language requirements.
- [ ] Every rendered foreground/background pair meets the stated contrast target.
- [ ] Spacing and breakpoints respond to content rather than device labels alone.
- [ ] Components define complete interaction, validation, loading, and disabled states.
- [ ] Imagery and icons share one deliberate visual language and accessibility policy.
- [ ] Motion has a functional purpose and reduced-motion behavior.
- [ ] Copy rules cover normal, error, and destructive contexts.
- [ ] Components consume semantic tokens instead of repeated raw values.
- [ ] The canonical source, owner, review process, and conformance checks are named.
- [ ] Representative pages are verified at narrow and wide widths, light/dark themes where supported, keyboard-only input, zoom, and reduced motion.
