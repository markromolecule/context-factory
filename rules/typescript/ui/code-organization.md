---
ruleId: cf-rule-ts-ui-code-organization
name: code-organization
description: Organize frontend code by ownership, dependency direction, and stable public boundaries.
scope: React, Next.js, Astro, and Vite source modules, features, components, hooks, and exports.
stack: typescript
appliesTo: ["src/**/components/**/*.tsx", "src/**/features/**/*.tsx", "src/**/ui/**/*.tsx", "app/**/*.tsx"]
layers: ["ui", "components"]
alwaysApply: false
---

# Frontend Code Organization

## Ownership

- [directive:ts.ui.ownership-co-location][mode:evidence-blocking][verifier:human-evidence] Keep route-only code beside its route, feature-only code inside the feature, and truly reusable code in shared modules.
- [directive:ts.ui.promote-shared-on-reuse][mode:advisory][verifier:none] Promote code to shared scope only after it has multiple real consumers.
- [directive:ts.ui.primitives-free-of-business][mode:evidence-blocking][verifier:human-evidence] Keep UI primitives free of feature data access and business policy.
- [directive:ts.ui.no-shared-importing-features][mode:automated-blocking][verifier:linter] Prevent shared modules from importing feature or route internals.

## Module shape

- [directive:ts.ui.cohesive-modules][mode:advisory][verifier:none] Prefer cohesive modules over one-file-per-symbol ceremony.
- [directive:ts.ui.co-locate-tests-styles][mode:advisory][verifier:none] Co-locate tests, stories, and styles with their implementation when tooling supports it.
- [directive:ts.ui.focused-index-api][mode:evidence-blocking][verifier:human-evidence] Use a small `index.ts` only as a deliberate public API; avoid deep barrel chains and cycles.
- [directive:ts.ui.separate-reused-types][mode:advisory][verifier:none] Separate types/constants only when reused, substantial, or clearer independently.
- [directive:ts.ui.narrow-client-boundaries][mode:evidence-blocking][verifier:human-evidence] Keep server-only code from client bundles and mark client boundaries as narrowly as possible.

## Dependency direction

`routes/features → services/hooks → data adapters → platform clients`

`routes/features → composed components → UI primitives`

- [directive:ts.ui.enforce-dependency-direction][mode:evidence-blocking][verifier:human-evidence] Verify new imports respect this direction, no circular dependency is introduced, and the selected framework can tree-shake/server-render the module as intended.
