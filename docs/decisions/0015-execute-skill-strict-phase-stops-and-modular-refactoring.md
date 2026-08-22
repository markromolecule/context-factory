---
title: "Execute Skill Strict Phase Stops, Code Review Optimization Workflow, and Modular Refactoring"
type: decision
status: accepted
created: "2026-08-22"
tags: [adr, skills, execute, refactor, optimization, workflow]
---

# Execute Skill Strict Phase Stops, Code Review Optimization Workflow, and Modular Refactoring

## Context

During software implementation plan execution:
1. Multi-phase plans previously allowed continuous execution across phase boundaries without mandatory developer checkpointing, leading to cascading errors and reduced human oversight.
2. The `execution` skill name was a noun rather than an action verb, slightly diverging from the action-verb taxonomy (`grill`, `plan`, `execute`, `verify`, `explore`).
3. There was no dedicated workflow to audit, optimize, and clean up generated code affected by implementation plans before release readiness.
4. Developers and AI assistants lacked a dedicated `refactor` skill to decompose complex, monolithic files (>200 lines or handling multiple concerns) into cohesive, modular files with synchronized imports.

## Options considered

1. **Option 1 (Rely solely on manual prompt interventions):** Expect developers to remember to interrupt multi-phase executions and perform ad-hoc refactoring without formal skills. *Rejected:* Error-prone, lacks deterministic enforcement, and leads to code bloat.
2. **Option 2 (Combine refactoring into `plan` or `execute`):** Bloat existing planning and execution skills with code review, query optimization, and AST restructuring procedures. *Rejected:* Violates single-responsibility principle for procedural skills.
3. **Option 3 (First-Class `execute` with Hard Stops, Dedicated Optimization Workflow, and `refactor` Skill - Selected):**
   - Rename `skills/execution` to `skills/execute` and enforce a **mandatory hard stop** at the end of every individual phase for developer inspection.
   - Introduce `workflows/code-review-and-optimization.md` (`/optimize`, `/review-code`) as a post-implementation guardrail for ESR query performance, type safety, and clean code.
   - Introduce `skills/refactor/SKILL.md` (`/refactor`, `[REFACTOR]`) for autonomous and manual modular decomposition of complex files into synchronized single-responsibility files.

## Decision

Adopt **Option 3**. Expand the procedural skills taxonomy to 10 focused skills and workflows to 10:

1. `skills/context` (`/context`, `[CONTEXT]`) — Author and grill context specifications under `docs/context/`.
2. `skills/grill` (`/grill`, `[GRILL]`, `[DISCOVERY]`) — Pre-planning requirements interrogation.
3. `skills/plan` (`/plan`, `[PLAN]`, `[FEATURE]`) — Ingest context specifications and scaffold phased plans in `docs/tasks/`.
4. `skills/execute` (`/execute`, `/exec`, `[EXEC]`) — Execute plan phases strictly one at a time with mandatory developer review stops.
5. `skills/refactor` (`/refactor`, `[REFACTOR]`) — Decompose complex, monolithic files into modular units with synchronized exports.
6. `skills/adr` (`/adr`, `/arch`, `[ADR]`) — Record durable 1-3-1 architectural decisions.
7. `skills/verify` (`/verify`, `/release`, `[RELEASE]`, `[QA]`) — Audit completion claims against fresh evidence.
8. `skills/explore` (`/explore`, `[EXPLORE]`) — Codebase contracts, schemas, and convention mapping.
9. `skills/security` (`/sec`, `/security`, `[SEC]`) — Threat modeling and credentials security audit.
10. `skills/grounding` (`/grounding`, `/wiki`, `[WIKI]`) — LLM Wiki retrieval and canonical knowledge provenance.

### New Workflow: `workflows/code-review-and-optimization.md`
- Audits generated code across 5 stages: Diff & Contract Analysis, Quality & Performance Audit (ESR query indexing, React render efficiency, type narrowing, dead code removal), Modularity Check, Targeted Refactoring Suggestions (1-3-1), and Regression Verification.

## Consequences

- **Positive:** Developers retain 100% control and visibility over phase-by-phase execution without runaway autonomous edits.
- **Positive:** Clear, standardized toolkit (`refactor` and `code-review-and-optimization`) ensures generated code stays modular, performant, and maintainable.
- **Positive:** Uniform action-verb skill naming across all procedural skills.

## Validation and review date

- Validated via `node evals/run-evals.mjs` and `node scripts/context.mjs doctor`.
- Review date: 2026-11-22.
