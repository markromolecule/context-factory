---
title: "Context Specification Authoring Skill with Embedded Grilling Synchronized to Plan"
type: decision
status: accepted
created: "2026-08-22"
tags: [adr, skills, context, grill, plan, specifications]
---

# Context Specification Authoring Skill with Embedded Grilling Synchronized to Plan

## Context

The Context Factory uses structured context specifications under `docs/context/` to capture product requirements, user stories, domain constraints, and technical context before transforming them into phased implementation tasks (`docs/tasks/`).

Previously, requirements gathering and discovery were loosely split between ad-hoc context authoring and the `grill` skill. This created friction:
1. Context files in `docs/context/` were often created with unverified assumptions or missing edge cases.
2. The `grill` skill stress-tested ideas interactively but did not systematically format and persist the entire discovery output into standardized `docs/context/` specifications.
3. The `plan` skill lacked an explicit upstream contract guaranteeing that ingested context documents were already grilled and verified.

## Options considered

1. **Option 1 (Rely on Standalone Grill & Manual Copying):** Run `/grill` in chat, manually synthesize answers into `docs/context/`, and then run `/plan`. *Rejected:* High cognitive overhead, inconsistent context documents, and risk of losing edge cases during manual copying.
2. **Option 2 (Directly Merge Grill into Plan):** Have `/plan` conduct grilling on-the-fly during task decomposition. *Rejected:* Violates separation of concerns between requirements discovery and architectural task breakdown; complicates planning artifacts.
3. **Option 3 (First-Class `context` Skill with Embedded Grilling - Selected):** Create a dedicated procedural skill `skills/context` (`/context`, `[CONTEXT]`, `[CONTEXT_SPEC]`) that initializes `docs/templates/Context.md`, conducts an embedded one-question-at-a-time `grill` discovery session, documents technical context using `explore`, and marks the context document `status: ready` for clean, deterministic ingestion by `/plan`.

## Decision

Adopt **Option 3**. Expand the procedural skills taxonomy to exactly 9 focused skills by introducing `skills/context`:

1. `skills/context` (`/context`, `[CONTEXT]`, `[CONTEXT_SPEC]`) — Author, grill, and structure context specifications under `docs/context/` using `docs/templates/Context.md`.
2. `skills/grill` (`/grill`, `[GRILL]`, `[DISCOVERY]`) — Interactive pre-planning discovery interview.
3. `skills/plan` (`/plan`, `[PLAN]`, `[FEATURE]`) — Ingest grilled context specifications and decompose into phased task plans under `docs/tasks/`.
4. `skills/execution` (`/execution`, `/exec`, `[EXEC]`) — Phased task execution and evidence tracking.
5. `skills/adr` (`/adr`, `/arch`, `[ADR]`) — 1-3-1 architectural trade-off formulation and decision recording.
6. `skills/verify` (`/verify`, `/release`, `[RELEASE]`, `[QA]`) — Completion claim auditing against fresh evidence.
7. `skills/explore` (`/explore`, `[EXPLORE]`) — Codebase mapping and contract discovery.
8. `skills/security` (`/sec`, `/security`, `[SEC]`) — Threat modeling and trust boundary security review.
9. `skills/grounding` (`/grounding`, `/wiki`, `[WIKI]`) — LLM Wiki retrieval and knowledge provenance.

### Inter-Skill Synchronization (`context` $\rightarrow$ `plan`)
- `skills/context` structures requirements into the standard 6 sections of `docs/templates/Context.md` and marks `status: ready`.
- `skills/plan` explicitly ingests the grilled context specification from `docs/context/` and translates verified goals, scenarios, and constraints into dependency-ordered phases under `docs/tasks/`.

## Consequences

- **Positive:** Guarantees that all context specifications under `docs/context/` are grilled, bounded, and verified before technical planning begins.
- **Positive:** Seamless, automated handoff from `/context` $\rightarrow$ `/plan` $\rightarrow$ `/execution`.
- **Positive:** Zero ambiguity or hidden assumptions disguised as implementation steps in task plans.

## Validation and review date

- Validated via `node evals/run-evals.mjs` and `node scripts/context.mjs doctor`.
- Review date: 2026-11-22.
