---
name: code-organization
description: Organize frontend code by ownership, dependency direction, and stable public boundaries.
scope: React, Next.js, Astro, and Vite source modules, features, components, hooks, and exports.
alwaysApply: false
---

# Frontend Code Organization

## Ownership

- Keep route-only code beside its route, feature-only code inside the feature, and truly reusable code in shared modules.
- Promote code to shared scope only after it has multiple real consumers.
- Keep UI primitives free of feature data access and business policy.
- Prevent shared modules from importing feature or route internals.

## Module shape

- Prefer cohesive modules over one-file-per-symbol ceremony.
- Co-locate tests, stories, and styles with their implementation when tooling supports it.
- Use a small `index.ts` only as a deliberate public API; avoid deep barrel chains and cycles.
- Separate types/constants only when reused, substantial, or clearer independently.
- Keep server-only code from client bundles and mark client boundaries as narrowly as possible.

## Dependency direction

`routes/features → services/hooks → data adapters → platform clients`

`routes/features → composed components → UI primitives`

Verify new imports respect this direction, no circular dependency is introduced, and the selected framework can tree-shake/server-render the module as intended.
