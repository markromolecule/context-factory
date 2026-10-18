---
title: Operation-first Backend Modules
type: decision
status: accepted
created: "2026-10-10"
supersedes: ["0001"]
tags: [adr, backend, architecture, typescript]
---

# 0037 — Operation-first Backend Modules

## Status

Accepted.

Supersedes: 0001 for the default folder layout. ADR 0001 remains the historical decision for capability ownership and responsibility separation.

## Context

ADR 0001 established capability modules under `src/modules/<feature>/`, but its layer folders place one operation across `dto/`, `controllers/`, `services/`, and `data/`. That makes an operation change span several folders and obscures the use case that owns it. The existing controller and service rules also need one explicit boundary for a policy-free read.

## Options considered

1. Retain layer folders inside each feature. This preserves the current tree, but one operation still spans several directories and encourages broad shared layer files.
2. Use operation folders inside each feature. This keeps a use case, its transport adapter, policy service, persistence adapter, mapping, and tests together while suffixes retain role clarity.
3. Use a flat feature root with action-prefixed files. This reduces nesting, but related files become difficult to scan as a feature gains operations and gives no clear home for operation tests.

## Decision

Use option 2 as the default:

The default operation path is `src/modules/<feature>/<operation>/`.

```text
src/modules/<feature>/
├── index.ts
├── <feature>.data.ts             # only mechanics shared by several operations
└── <operation>/
    ├── <operation>.schema.ts
    ├── <operation>.types.ts
    ├── <operation>.controller.ts
    ├── <operation>.service.ts
    ├── <operation>.data.ts
    ├── <operation>.mapper.ts
    └── <operation>.test.ts
```

Add only files that have a responsibility in the operation. Role suffixes include `types`, `errors`, `mapper`, `schema`, `policy`, `events`, and tests; they do not require placeholder files. `index.ts` is the cross-module public contract. Operations do not import another operation directly; shared code belongs at the feature root only when multiple operations genuinely own it.

A controller may call a data function directly for a simple read only when no business policy, authorization-sensitive decision, or orchestration is involved. Commands and policy-bearing reads use a service or policy boundary. Services receive plain values and explicit data and transaction dependencies; data functions own persistence or remote mechanics. External side effects occur after a successful transaction and retryable workflows define idempotency or compensation.

`src/features/<feature>/` remains an explicit established-host compatibility root. It follows the same operation and public-contract rules. No host migration is required by this decision.

Layer-based folders remain allowed for an established host convention. They are not the default for a new capability, and they retain the same responsibility boundaries, public `index.ts` contract, and no-placeholder-file discipline. Existing hosts need not migrate their folder layout solely to adopt this rule.

## Consequences

- Operation changes and tests are locally discoverable while transport, policy, and persistence retain separate responsibilities.
- A cross-module consumer imports only through the feature `index.ts`; shared behavior is visible at the feature root instead of hidden by sideways imports.
- Operation-first is the default example in active TypeScript backend rules; a bounded layer-based alternative documents established-host compatibility. Archived ADR 0001 is retained and linked as superseded history.
- Structural import and filename directives require named human evidence until a real verifier is delivered; they cannot claim linter enforcement by prose alone.

## Rollback

Revert this decision and its linked active-rule changes together. ADR 0001 then resumes as the accepted layout decision. Host source code is unaffected because this change does not migrate applications.

## Validation and review date

Validate through `evals/tests/rules/backend-module-architecture.test.mjs`, rule catalog synchronization, and a Phase 1 review before the next phase begins.
