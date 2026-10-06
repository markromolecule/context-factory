---
ruleId: cf-rule-ts-module-architecture
name: module-architecture
description: Organize backend capabilities as vertical modules with explicit DTO, controller, service, and data boundaries.
scope: Backend modules, DTOs, routes, controllers, services, data access, and their tests.
stack: typescript
appliesTo: ["src/modules/**/*.ts", "src/features/**/*.ts"]
layers: ["controllers", "services", "data"]
alwaysApply: true
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

- [directive:ts.module.routes-compose-only][mode:evidence-blocking][verifier:human-evidence] Routes compose middleware and map paths to controllers.
- [directive:ts.module.controllers-thin][mode:evidence-blocking][verifier:human-evidence] Controllers validate transport input, invoke one use case, and map results or typed errors to HTTP.
- [directive:ts.module.services-own-policy][mode:evidence-blocking][verifier:human-evidence] Services own business policy, orchestration, authorization-sensitive decisions, transactions, and side-effect ordering.
- [directive:ts.module.data-owns-persistence][mode:evidence-blocking][verifier:human-evidence] Data functions own persistence or remote-source mechanics and return domain-oriented values.
- [directive:ts.module.dto-single-source][mode:automated-blocking][verifier:test] DTO schemas are the single input-validation source at the transport boundary. Do not use DTOs as database models.
- [directive:ts.module.no-upward-imports][mode:automated-blocking][verifier:linter] A lower layer must not import a higher layer, and one module must use another module through an explicit public contract rather than its internals.

## Naming

- [directive:ts.module.file-suffix-convention][mode:automated-blocking][verifier:linter] Every layer file ends with exactly `.dto.ts`, `.routes.ts`, `.controller.ts`, `.service.ts`, or `.data.ts`.
- [directive:ts.module.singular-plural-naming][mode:advisory][verifier:none] Name a single-record operation with a singular feature: `delete-sample.service.ts`. Name a genuinely multi-record operation with a plural feature: `delete-samples.service.ts`.
- [directive:ts.module.action-first-naming][mode:advisory][verifier:none] Use action-first filenames and exported symbols, such as `updateSampleService` and `deleteSamplesController`.
- [directive:ts.module.no-generic-filenames][mode:automated-blocking][verifier:linter] Do not use generic filenames such as `handler.ts`, `helpers.ts`, or `manager.ts` inside a feature module.

## Verification

Unit-test services with fake data dependencies, test controllers for validation and response mapping, test data behavior at its real boundary, and add a route integration test for authentication, authorization, and middleware composition.
