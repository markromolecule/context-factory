---
name: explore
description: Build a verified map of an unfamiliar repository's entry points, architecture, contracts, tests, conventions, and risks before planning material work (/explore, [EXPLORE]).
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
- existing patterns and representative examples;
- tests and executable checks;
- configuration, data, security, and rollout boundaries;
- unresolved unknowns and the safest next inspection.

Do not infer a convention from one file when broader evidence is readily available. Do not propose implementation until the affected boundary is understood.
