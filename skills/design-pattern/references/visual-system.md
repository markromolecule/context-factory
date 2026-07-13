# Baseline Visual System

Use these as defaults, not brand requirements. Existing project tokens take precedence.

## Typography

- Body: system sans or the project's established sans, 16px base, 1.5 line height.
- Display: 36–60px, 1.05–1.15 line height, weight 600–700.
- Section headings: 24–36px, weight 600.
- Small text: 12–14px with WCAG-compliant contrast.
- Code/data: system monospace with tabular numerals when alignment matters.

## Space and layout

- Use a 4px scale with 8px as the primary rhythm: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Use 16px mobile gutters and 24px desktop gutters.
- Cap reading content at 65–75ch and application shells near 1280–1440px.
- Use 64px mobile and 96px desktop separation between major sections when content permits.

## Surfaces and controls

- Radii: 4px for compact controls, 8px for buttons/inputs, 12px for cards, 16px for dialogs.
- Controls: 32/40/48px small/medium/large heights; keep touch targets at least 44×44px when possible.
- Focus: visible 2px ring with 2px offset on every interactive element.
- Cards: choose either subtle border or shadow as the primary separator; avoid heavy combinations.
- Status: pair icon/text with color and use tinted backgrounds rather than saturated fills for small labels.

## Motion

- Color/opacity/short transforms: about 200ms.
- Larger spatial transitions: 250–420ms with a strong ease-out.
- Disable non-essential movement under `prefers-reduced-motion: reduce`.

## Accessibility checklist

- Use semantic landmarks and heading order.
- Provide labels, descriptions, and error association for fields.
- Keep keyboard focus visible and logical.
- Trap and restore focus for modal dialogs; support Escape and an explicit close control.
- Meet WCAG AA contrast for text and meaningful controls.
- Declare the correct `color-scheme` and verify native controls in both themes.
- Never rely on hover, color, or motion alone to communicate meaning.
