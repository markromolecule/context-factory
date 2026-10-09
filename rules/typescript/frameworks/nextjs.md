---
ruleId: cf-rule-ts-nextjs
name: nextjs
description: Preserve Next.js router conventions, server and client boundaries, authorization, and deliberate cache behavior.
scope: Next.js routes, components, actions, data loading, caching, and runtime configuration.
stack: typescript
frameworks: ["nextjs"]
appliesTo: ["**/*.ts", "**/*.tsx"]
layers: ["routes", "components", "services"]
alwaysApply: false
---

# Next.js

Use with shared TypeScript and React rules. Inspect the installed Next.js version and whether each route uses App Router or Pages Router before choosing APIs.

- [directive:ts.structure.rsc-default][mode:evidence-blocking][verifier:human-evidence] In App Router, keep components on the server unless interaction needs a client boundary. Keep that boundary narrow; do not apply React Server Component conventions to Pages Router.
- [directive:ts.nextjs.server-entrypoints][mode:evidence-blocking][verifier:human-evidence] Treat Server Actions and route handlers as public entry points: validate input and authorize the actor, action, and resource on the server. Hidden buttons or protected layouts do not authorize mutations.
- [directive:ts.nextjs.server-client-contract][mode:evidence-blocking][verifier:human-evidence] Keep credentials and server-only dependencies out of client imports. Pass only data supported by the installed framework's serialization contract across server/client boundaries; expose only fields the client needs.
- [directive:ts.nextjs.cache-isolation][mode:evidence-blocking][verifier:human-evidence] Choose caching and revalidation from freshness and identity requirements. Never share user- or tenant-specific results across identities. After mutations, refresh the affected data using APIs verified for the installed version.
- [directive:ts.nextjs.native-control-flow][mode:evidence-blocking][verifier:human-evidence] Preserve framework redirect, not-found, loading, and error behavior. Do not swallow framework control-flow exceptions in broad catches; handle expected domain failures separately.
- [directive:ts.nextjs.runtime-compatibility][mode:evidence-blocking][verifier:human-evidence] Check the route's Node or Edge runtime before importing dependencies. Preserve native route filenames and router conventions; verify builds and hydration after changing rendering boundaries.

## Verification

Test direct unauthorized action calls, cross-user cache isolation, invalid input, redirects, and mutation refresh where changed. Run the host production build. These checks need concrete test and review evidence; the generic TypeScript adapter does not implement Next.js semantics.

## References

[Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
[Authentication and authorization](https://nextjs.org/docs/app/guides/authentication)
