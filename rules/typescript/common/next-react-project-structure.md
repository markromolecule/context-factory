---
name: next-react-project-structure
description: Structure React, Next.js, Vite, and Astro applications using feature slices, standardized subfolder conventions, and strict rendering boundaries.
scope: Frontend application directories, feature modules, hooks organization, routes, and framework configuration.
alwaysApply: false
---

# React and Next.js Project Structure

Start with the chosen framework's native layout; do not impose Next.js folders on Vite or Astro.

## Shared Baseline & Root Structure

```text
src/
├── components/       # shared composed components and ui primitives
│   ├── ui/           # pure design system primitives (buttons, inputs, dialogs)
│   └── layout/       # global shell layouts (navbar, sidebar, footer)
├── features/         # vertical feature slices with domain ownership
├── hooks/            # cross-feature domain and utility hooks grouped by subfolder
│   ├── <domain>/     # cross-cutting domain hooks (e.g. auth/, navigation/)
│   └── common/       # pure headless utilities (e.g. use-debounce.ts, use-media-query.ts)
├── lib/              # configured third-party clients (queryClient, analytics)
├── services/         # cross-cutting business workflows or global api clients
├── stores/           # cross-route client state stores (Zustand)
├── types/            # globally shared contracts and ambient declarations
└── utils/            # pure reusable helpers
```

## Feature Slice Anatomy (`src/features/<feature>/`)

Each vertical feature module encapsulates its own UI, data fetching, mutations, local state, and transport:

```text
src/features/<feature>/
├── components/                  # Feature-scoped UI components
│   ├── <feature>-card.tsx
│   └── <feature>-dialog.tsx
├── hooks/                       # Feature-scoped hooks subfolder
│   ├── use-<feature>-query.ts           # Data fetching (TanStack Query)
│   ├── use-<action>-<feature>-mutation.ts # Mutations & optimistic UI
│   └── use-<feature>-<purpose>.ts       # Local UI/interaction state machine
├── api/ (or services/)          # Feature API transport & DTO fetchers
│   └── <feature>-api.ts
├── types/                       # Feature DTOs, schemas, and view models
│   └── <feature>.types.ts
└── index.ts                     # Strict public export barrier (no deep imports)
```

## Hook Organization & Naming Conventions

Within `hooks/` directories (both in `src/features/<feature>/hooks/` and `src/hooks/<domain>/`), adhere to descriptive naming suffixes based on lifecycle responsibility:

| Hook Type | File Name Pattern | Function Identifier | Purpose / Lifecycle |
| :--- | :--- | :--- | :--- |
| **Query Hook** | `use-<feature>-query.ts` / `use-<feature>-list-query.ts` | `use<Feature>Query` | Server data fetching, caching, pagination |
| **Mutation Hook** | `use-<action>-<feature>-mutation.ts` | `use<Action><Feature>Mutation` | Data mutation, optimistic patch, cache invalidation |
| **Interaction / Logic Hook** | `use-<feature>-<purpose>.ts` | `use<Feature><Purpose>` | Encapsulated UI state machine, steps, filters |
| **Shared Utility Hook** | `src/hooks/common/use-<utility>.ts` | `use<Utility>` | Headless generic utility (DOM, sensors, timers) |

## Framework Boundaries

- **Next.js:**
  - Route-private modules live under `app/**/_components`, `_actions`, or `_lib`.
  - Default to React Server Components (RSC); push `'use client'` down to the smallest leaf interactive boundary.
  - Colocate server actions (`*.actions.ts`) with clear Zod boundary validation.
- **Vite React:**
  - Compose routes and pages through the chosen router (`pages/` or `routes/`).
  - Keep browser bootstrapping isolated in `main.tsx` / `App.tsx`.
- **Astro:**
  - Prefer `.astro` server-rendered composition; hydrate client framework islands (`client:load`, `client:visible`) only when interaction requires it.

Avoid pinning architecture rules to exact library versions. Follow the repository lockfile and migration plan. Verify route loading, server/client boundaries, and production builds after structural changes.
