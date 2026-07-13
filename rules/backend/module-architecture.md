---
name: module-architecture
description: Organize backend capabilities as vertical modules with explicit DTO, controller, service, and data boundaries.
scope: Backend modules, DTOs, routes, controllers, services, data access, and their tests.
alwaysApply: false
---

# Backend Module Architecture

## Required shape

Place each business capability under `src/modules/<feature>/`:

```text
<feature>/
├── dto/<feature>.dto.ts
├── data/
│   ├── <feature>.data.ts
│   ├── create-<feature>.data.ts
│   ├── update-<feature>.data.ts
│   └── delete-<feature>.data.ts
├── services/
│   ├── create-<feature>.service.ts
│   ├── update-<feature>.service.ts
│   └── delete-<feature>.service.ts
├── controllers/
│   ├── create-<feature>.controller.ts
│   ├── update-<feature>.controller.ts
│   └── delete-<feature>.controller.ts
└── <feature>.routes.ts
```

Add only layers an operation actually needs, but never collapse business rules or persistence into a controller.

## Dependency direction

`routes → controllers → services → data`

- Routes compose middleware and map paths to controllers.
- Controllers validate transport input, invoke one use case, and map results or typed errors to HTTP.
- Services own business policy, orchestration, authorization-sensitive decisions, transactions, and side-effect ordering.
- Data functions own persistence or remote-source mechanics and return domain-oriented values.
- DTO schemas are the single input-validation source at the transport boundary. Do not use DTOs as database models.
- A lower layer must not import a higher layer, and one module must use another module through an explicit public contract rather than its internals.

## Naming

- Every layer file ends with exactly `.dto.ts`, `.routes.ts`, `.controller.ts`, `.service.ts`, or `.data.ts`.
- Name a single-record operation with a singular feature: `delete-sample.service.ts`.
- Name a genuinely multi-record operation with a plural feature: `delete-samples.service.ts`. Apply the same plurality to its controller and data file.
- Use action-first filenames and exported symbols, such as `updateSampleService` and `deleteSamplesController`.
- Do not use generic filenames such as `handler.ts`, `helpers.ts`, or `manager.ts` inside a feature module.

## Verification

Unit-test services with fake data dependencies, test controllers for validation and response mapping, test data behavior at its real boundary, and add a route integration test for authentication, authorization, and middleware composition.
