---
ruleId: cf-rule-ts-module-architecture
name: module-architecture
description: Organize backend capabilities as operation-first modules with explicit transport, policy, and persistence boundaries.
scope: Backend modules, DTOs, routes, controllers, services, data access, and their tests.
stack: typescript
appliesTo: ["src/modules/**/*.ts", "src/features/**/*.ts"]
layers: ["controllers", "services", "data"]
alwaysApply: true
---

# Backend Module Architecture

## Required shape

Organize each backend capability under `src/modules/<feature>/` using clear layer folders for controllers, services, and data access, or operation folders when isolating use cases:

### Layer-based module layout

Organize feature responsibilities into explicit layer folders:

```text
src/modules/<feature>/
├── index.ts                          # Public contract for cross-module imports
├── <feature>.routes.ts               # Route composition and middleware
├── controllers/                      # HTTP/transport input validation & response mapping
│   ├── create-<operation>.controller.ts
│   ├── update-<operation>.controller.ts
│   ├── get-<operation>.controller.ts
│   └── delete-<operation>.controller.ts
├── services/                         # Business policy, orchestration, transactions
│   ├── create-<operation>.service.ts
│   ├── update-<operation>.service.ts
│   └── get-<operation>.service.ts
├── data/                             # Persistence & database queries
│   ├── <feature>.data.ts             # Mechanics shared by multiple operations
│   ├── create-<operation>.data.ts
│   └── get-<operation>.data.ts
└── dto/                              # Schemas, types, and serialization mappers
    ├── create-<operation>.dto.ts
    ├── <operation>.schema.ts
    └── <operation>.types.ts
```

### Operation-first layout

Alternatively, group all artifacts of a use case in an operation subfolder:

```text
src/modules/<feature>/
├── index.ts                          # Public contract for cross-module imports
├── <feature>.data.ts                 # Only mechanics shared by multiple operations
└── <operation>/                      # E.g., create-order/, get-order/
    ├── <operation>.schema.ts
    ├── <operation>.types.ts
    ├── <operation>.controller.ts     # E.g., create-<operation>.controller.ts
    ├── <operation>.service.ts        # E.g., create-<operation>.service.ts
    ├── <operation>.data.ts
    ├── <operation>.mapper.ts
    └── <operation>.test.ts
```

Add only files with a responsibility in the operation or layer. Use `types`, `errors`, `mapper`, `schema`, `policy`, `events`, and tests as role suffixes when they are needed; do not create empty files. Feature-root files are shared by multiple operations, never an alternate operation dump. `src/features/<feature>/` is an established-host compatibility root and follows the same shape when a host has adopted it.

- [directive:ts.module.operation-first-layout][mode:evidence-blocking][verifier:human-evidence] Organize the default backend shape as `src/modules/<feature>/<operation>/`; keep only genuinely shared concerns at the feature root.
- [directive:ts.module.cross-module-public-contract][mode:evidence-blocking][verifier:human-evidence] Expose cross-module behavior through the feature `index.ts`; do not use deep imports or sideways operation imports.

## Dependency direction

`routes → controllers → services → data`

- [directive:ts.module.routes-compose-only][mode:evidence-blocking][verifier:human-evidence] Routes compose middleware and map paths to controllers.
- [directive:ts.module.controllers-thin][mode:evidence-blocking][verifier:human-evidence] Controllers validate transport input, invoke one use case, and map results or typed errors to HTTP.
- [directive:ts.module.services-own-policy][mode:evidence-blocking][verifier:human-evidence] Services own business policy, orchestration, authorization-sensitive decisions, transactions, and side-effect ordering.
- [directive:ts.module.data-owns-persistence][mode:evidence-blocking][verifier:human-evidence] Data functions own persistence or remote-source mechanics and return domain-oriented values.
- [directive:ts.module.dto-single-source][mode:evidence-blocking][verifier:human-evidence] DTO schemas are the single input-validation source at the transport boundary. Do not use DTOs as database models.
- [directive:ts.module.no-upward-imports][mode:evidence-blocking][verifier:human-evidence] A lower layer must not import a higher layer, and one module must use another module through an explicit public contract rather than its internals. Keep this evidence-blocking until an ID-specific verifier exists.

Use `dto-and-serialization.md` for the operation's request-to-domain and response mapping contract. It complements this module boundary without duplicating runtime validation or controller response-safety rules.
Use `testing.md` for operation-boundary test ownership and `testing-data-access-layer.md` for database and network adapter test mechanics.

## Naming

- [directive:ts.module.file-suffix-convention][mode:evidence-blocking][verifier:human-evidence] Give operation files a role suffix such as `.types.ts`, `.errors.ts`, `.mapper.ts`, `.schema.ts`, `.policy.ts`, `.events.ts`, `.controller.ts`, `.service.ts`, `.data.ts`, `.routes.ts`, or the host test suffix. Keep this evidence-blocking until an ID-specific verifier exists.
- [directive:ts.module.singular-plural-naming][mode:advisory][verifier:none] Name a single-record operation with a singular feature: `delete-sample.service.ts`. Name a genuinely multi-record operation with a plural feature: `delete-samples.service.ts`.
- [directive:ts.module.action-first-naming][mode:advisory][verifier:none] Use action-first filenames and exported symbols, such as `updateSampleService` and `deleteSamplesController`.
- [directive:ts.module.no-generic-filenames][mode:evidence-blocking][verifier:human-evidence] Do not use generic filenames such as `handler.ts`, `helpers.ts`, or `manager.ts` inside a feature module. Keep this evidence-blocking until an ID-specific verifier exists.

## Verification

Unit-test services with fake data dependencies, test controllers for validation and response mapping, test data behavior at its real boundary, and add a route integration test for authentication, authorization, and middleware composition.
