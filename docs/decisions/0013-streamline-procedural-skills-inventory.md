---
title: "Streamline Procedural Skills Inventory & Eliminate Rule Duplications"
type: decision
status: accepted
created: "2026-08-21"
tags: [adr, skills, rules, taxonomy, ergonomics]
---

# Streamline Procedural Skills Inventory & Eliminate Rule Duplications

## Context

The Context Factory maintains a layered architecture separating declarative constraints (**Rules**) from procedural actions (**Skills**) and multi-phase delivery lifecycles (**Workflows**).

Over time, several skills duplicated domain rules that were already authoritatively defined under `rules/` (e.g. `playground` duplicating `rules/ui/frontend.md`, `typescript` duplicating `rules/typescript/type-safety.md`, `zod` duplicating `rules/typescript/runtime-validation.md`, `database-query` duplicating `rules/database/query-optimization-and-pagination.md`, `component-craft` duplicating `rules/ui/forms-and-validation.md`, `backend-module` duplicating `rules/backend/module-architecture.md`, `api-contract` duplicating `rules/backend/data-access-via-api.md`, `test-suite` duplicating `rules/database/testing-data-access-layer.md`).

This duplication bloated the IDE slash command palette with redundant options and blurred the architectural boundary between static coding standards and interactive agent procedures.

## Options considered

1. **Option 1 (Retain All 16 Skills):** Maintain skills for every specific development task alongside matching rule files. *Rejected:* Causes severe slash-command clutter, maintenance overhead, and confusion over whether a standard is governed by a rule or a skill.
2. **Option 2 (Delete Only Playground and TypeScript):** Remove only the two styling/diagnostics skills while keeping backend/API skills. *Rejected:* Leaves arbitrary duplication for database, UI, and backend modules.
3. **Option 3 (Pure Procedural Skills Taxonomy - Selected):** Prune all 8 rule-duplicate skills, rename `knowledge-grounding` to `grounding`, and establish an unambiguous inventory of exactly 8 pure procedural skills (`grill`, `plan`, `execution`, `adr`, `verify`, `explore`, `security`, `grounding`). Workflows and agents rely directly on `rules/` for all technical constraints.

## Decision

Adopt **Option 3**. The Context Factory skills inventory is strictly limited to 8 core procedural playbooks:
1. `skills/grill` (`/grill`, `[GRILL]`, `[DISCOVERY]`) — Interactive pre-planning discovery interview.
2. `skills/plan` (`/plan`, `[PLAN]`, `[FEATURE]`) — Task decomposition and phased specification authoring without coding.
3. `skills/execution` (`/execution`, `/exec`, `[EXEC]`) — Phased task execution and evidence tracking.
4. `skills/adr` (`/adr`, `/arch`, `[ADR]`) — 1-3-1 architectural trade-off formulation and decision recording.
5. `skills/verify` (`/verify`, `/release`, `[RELEASE]`, `[QA]`) — Completion claim auditing against fresh, reproducible evidence.
6. `skills/explore` (`/explore`, `[EXPLORE]`) — Codebase mapping and contract discovery.
7. `skills/security` (`/sec`, `/security`, `[SEC]`) — Threat modeling and trust boundary security review.
8. `skills/grounding` (`/grounding`, `/wiki`, `[WIKI]`) — LLM Wiki retrieval and knowledge provenance.

All coding standards, type safety policies, database query standards, UI design tokens, and module boundaries are declared and loaded exclusively from `rules/`.

## Consequences

- **Positive:** Crisp, single-word slash autocomplete palette (`/grill`, `/plan`, `/execution`, `/adr`, `/verify`, `/explore`, `/security`, `/grounding`).
- **Positive:** Clear architectural clarity: Rules define *how code must be written*; Skills define *how the agent interacts and works*.
- **Positive:** Zero duplication or drift between skill files and domain rules.
- **Migration:** Manifest, orchestrator contracts, subagents, workflows, and evaluation datasets updated to reference only the 8 procedural skills.

## Validation and review date

- Validated via `node evals/run-evals.mjs` (12/12 passing) and `node scripts/context.mjs doctor`.
- Review date: 2026-11-21.
