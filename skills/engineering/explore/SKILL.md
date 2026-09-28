---
name: explore
description: Build a verified map of an unfamiliar repository's entry points, architecture, contracts and their consumers, tests, conventions, and risks before planning material work (/explore, [EXPLORE]).
---

# Repository Discovery

## Procedure

1. Read repository instructions, manifests, and architecture decisions.
2. Inspect the directory tree with bounded searches; exclude dependencies and generated output.
3. Locate runtime entry points, public contracts, domain boundaries, persistence, configuration, and tests.
4. Trace the requested behavior from entry point to side effects and consumers.
5. Separate verified facts, assumptions, conflicts, and unknowns.
6. Produce a concise repository map containing only task-relevant boundaries.

## Output

Report:

- inspected paths and authoritative sources;
- relevant modules and dependency direction;
- public contracts and their known in-repo consumers;
- existing patterns and representative examples, including any architecture-boundary tooling already configured (lint rules, dependency-cruiser, layering ADRs);
- tests and executable checks;
- configuration, data, security, and rollout boundaries, and existing observability conventions (logging/metrics/alerts) in the touched area;
- unresolved unknowns and the safest next inspection.

Do not infer a convention from one file when broader evidence is readily available. Do not propose implementation until the affected boundary is understood. Do not report a contract as having no consumers just because none are visible in this repo — a single-repo search cannot confirm that; report it as unknown and let the calling skill decide whether it needs resolving.
