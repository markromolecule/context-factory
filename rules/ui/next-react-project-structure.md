---
name: next-react-project-structure
description: Structure React, Next.js, Vite, and Astro applications using framework conventions and clear feature boundaries.
scope: Frontend application directories, routes, rendering boundaries, and framework configuration.
alwaysApply: false
---

# React Application Structure

Start with the chosen framework's native layout; do not impose Next.js folders on Vite or Astro.

## Shared baseline

```text
src/
├── components/       # shared composed components and ui primitives
├── features/         # optional domain modules with multiple consumers
├── hooks/            # cross-feature hooks
├── lib/              # configured third-party clients
├── services/         # reusable business workflows when justified
├── stores/           # cross-route client state when justified
├── types/            # genuinely shared contracts
└── utils/            # pure reusable helpers
```

## Framework boundaries

- **Next.js:** keep route-private modules under `app/**/_components`, `_actions`, or `_lib`; default to Server Components and add `use client` at the smallest interactive boundary.
- **Vite React:** compose routes/pages through the selected router and keep browser-only bootstrapping in the app entry point.
- **Astro:** prefer `.astro` server-rendered composition and hydrate framework islands only when interactivity requires it.

Avoid pinning architecture rules to exact library versions. Follow the repository lockfile and migration plan. Verify route loading, server/client boundaries, and production builds after structural changes.
