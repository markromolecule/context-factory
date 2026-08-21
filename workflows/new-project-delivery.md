---
name: new-project-delivery
description: Deliver a greenfield system or major multi-module domain capability using progressive vertical-slice execution, pre-planning grilling discovery, 4-layer backend testing, client hook validation, and dual-loop engineering.
scope: Greenfield applications, new subsystem scaffolding, and major modular feature development.
---

# New Project Progressive Delivery

## Triggers

Use when scaffolding a new project from scratch, establishing a new subsystem, or delivering major multi-module capabilities. Compose with `database-migration` when schema evolutions are involved and `security-sensitive-change` when authentication/authorization boundaries are created.

## Required inputs

- Desired system outcome, business value, and measurable success criteria.
- Target domain boundaries, actors, authority levels, and multi-tenant constraints.
- Existing codebase conventions, architectural patterns, and tech stack choices.
- Traceable discovery record from `grill`.

## Applicable rules and skills

Load global rules and relevant domain rules for touched files. Start with `grill` for pre-planning discovery; use `plan` to author phased task breakdowns under `docs/tasks/`; use `execution` to execute approved phases. Adhere to `rules/backend/module-architecture.md`, `rules/database/schema-db.md`, `rules/database/testing-data-access-layer.md`, `rules/hooks/query-hooks.md`, `rules/hooks/mutation-hooks.md`, and `rules/ui/frontend.md`.

## Phases

1. **Pre-Planning Discovery & Grilling (`grill`):** Interrogate requirements 1 question at a time. Record domain vocabulary in glossary (`references/glossary-format.md`) and architectural trade-offs in ADRs (`docs/decisions/`). Complete coverage audit before planning.
2. **Architecture & Database Schema Locking:** Draft entity models, `schema.prisma`, Kysely query layer types, and Zod boundary DTOs.
3. **Phased Implementation Plan (`plan`):** Author Master Plan (`docs/templates/Task.md`) and Phase Breakdowns (`docs/templates/Phase.md`) under `docs/tasks/`. Sequence modules in strict vertical dependency order. Stop and obtain approval before coding.
4. **Vertical Backend Module Slices:** Per module, build strictly along `routes → controllers → services → data` with transport DTO validation.
5. **Inner Loop 4-Layer Testing & Self-Correction:** Build and execute dedicated test files for every tier (`*.data.test.ts`, `*.service.test.ts`, `*.controller.test.ts`, `*.routes.test.ts`) + `tsc --noEmit`. Auto-correct diagnostics until 100% green.
6. **Scalar API Contract Docs & Client Hook Smoke Test:** Expose verified endpoints in Scalar docs. Create typed `useQuery` / `useMutation` hooks and smoke-test against live endpoints to prove client-backend connectivity.
7. **Outer Loop Gate Sign-off & Progression:** Check off module Definition of Done (DoD), run multi-module regression suite ($1 \dots N$), and advance pointer to Module $N+1$.
8. **Frontend UI & View Integration:** Once all dependent backend modules pass DoD sign-off, build UI components consuming the validated hooks and Scalar contracts.

## Quality gates

- Discovery grilling record is audited and approved before planning starts.
- Implementation plan exists and is approved before production implementation.
- Progressive delivery is strictly enforced: no monolithic multi-module scaffolding (anti-one-tap model).
- Every backend module has dedicated test files across all 4 architectural tiers passing with 100% green.
- Client query/mutation hooks are smoke-tested against live contracts before UI views are built.
- Global regression suite passes cleanly before module promotion.
- Zero TypeScript (`tsc --noEmit`) or lint errors.

## Stop and escalation conditions

Stop for user direction when:
- Pre-planning discovery uncovers ambiguous business policies or conflicting constraints.
- A database schema change would cause irreversible data loss or breaks backward compatibility.
- An unexpected circular dependency is identified between modules.
- Destructive operations or unauthorized credentials are required.

## Artifacts and completion

Use a task artifact under `docs/tasks/YYYY/MM/YYYY-MM-DD/<id>-task-<feature>/` and an ADR for durable architecture under `docs/decisions/`. Report changed outcomes, verified test evidence across all 4 layers, hook smoke test results, and follow-up work.
