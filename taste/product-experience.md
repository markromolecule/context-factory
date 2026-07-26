---
name: product-experience
description: Shape an end-to-end product journey from actor intent through navigation, feedback, recovery, and measurable success.
scope: System concepts, information architecture, page families, user journeys, workflows, responsive continuity, and cross-channel experience.
---

# Product Experience

Design the experience as a continuous conversation between the user and the system.

## Experience map

For each primary actor, define:

| Stage | User intent | Required context | User action | System response | Failure/recovery | Success signal |
|---|---|---|---|---|---|---|

Cover entry, orientation, primary work, confirmation, interruption, return, and completion. Include administrative and support journeys when they affect the primary experience.

## Pattern rules

- Make the next meaningful action evident without hiding necessary context.
- Preserve orientation: users should know where they are, what changed, and how to recover.
- Match navigation boundaries to stable user concepts rather than implementation modules.
- Reveal complexity progressively, but never conceal consequences, cost, permissions, or destructive effects.
- Keep terminology, placement, interaction, feedback, and error recovery consistent across the journey.
- Preserve user input across validation, connectivity, authorization, and server failures whenever safe.
- Make system status proportional to latency and consequence; do not use indefinite spinners for operations with meaningful progress.
- Ensure every irreversible or high-impact action has clear intent, consequence, and recovery policy.
- Design mobile as a complete priority model, not a compressed desktop arrangement.
- Treat empty, first-use, loading, partial, stale, offline, denied, error, and success conditions as parts of the product.

## System-level deliverables

- actor and goal map;
- end-to-end journey and exceptional paths;
- information architecture and navigation model;
- page/flow inventory with ownership and entry points;
- shared feedback, confirmation, and recovery patterns;
- responsive continuity rules;
- cross-flow terminology and content rules;
- measurable usability and accessibility outcomes.
