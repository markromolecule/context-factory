---
name: design-quality-bar
description: Review whether a product interface is coherent, purposeful, distinctive, accessible, resilient, and ready for implementation or release.
scope: Design critique, UI review, system conformance, component acceptance, responsive QA, and experience completion.
---

# Design Quality Bar

Judge the work against the user's goal and the governing system, not personal novelty preferences.

## Review lenses

1. **Purpose** — The primary actor, task, next action, and success state are evident.
2. **Hierarchy** — Content and controls have intentional priority; not everything competes equally.
3. **Coherence** — Vocabulary, layout, tokens, components, motion, and feedback behave as one system.
4. **Character** — The interface expresses the chosen personality through observable decisions rather than decoration.
5. **Resilience** — Real content, long text, missing data, errors, latency, permissions, and interruptions remain usable.
6. **Accessibility** — Semantics, keyboard operation, focus, contrast, targets, zoom, motion, and announcements are complete.
7. **Responsiveness** — Each viewport preserves task priority and continuity instead of merely fitting.
8. **Economy** — Every element earns its presence; abstraction and visual effects solve recurring needs.
9. **Craft** — Alignment, rhythm, typography, iconography, states, and transitions are deliberate at detail level.
10. **Traceability** — Design decisions map to user intent, evidence, tokens, component contracts, and verification.

## Acceptance method

For each lens, record `pass`, `finding`, or `not applicable`, with evidence. A design is not complete while:

- a primary journey has an undefined state or recovery path;
- a reusable component lacks a contract or representative composition;
- an exception has no rationale or owner;
- accessibility or responsive behavior is inferred rather than checked;
- placeholder content conceals realistic density or localization risk;
- visual polish contradicts an unresolved product decision.

Prefer a small number of high-impact findings with concrete corrections over a long list of subjective preferences.
