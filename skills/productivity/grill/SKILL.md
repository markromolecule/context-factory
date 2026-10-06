---
name: grill
description: Stress-test a new system, product idea, or materially ambiguous feature before implementation planning by resolving goals, actors, domain language, scenarios, constraints, risks, and decisions one question at a time while preserving answers in project documentation. Use at the start of pre-planning, before writing code or committing to an architecture (/grill, [GRILL], [DISCOVERY]).
---

# Grill a System Before Planning

Remain in discovery. Do not write production code or silently continue into implementation.

## Access declaration

- **Reads:** the relevant `context` specification, grounding claim packets, repository evidence, and applicable canonical decisions.
- **Writes:** `docs/discovery/<feature>/record.md` and `docs/discovery/<feature>/brief.md`.
- **Exposes to:** `plan` only, through the released `brief.md`.

`grill` is the sole writer of `docs/discovery/<feature>/record.md` and `brief.md`. Do not modify the context specification; preserve its author and status.

## Session contract

1. Restate the idea, evidence already available, and the pre-planning completion condition.
2. Create or locate `docs/discovery/<feature>/record.md`; record its source context path and hash, grounding claim packets, repository observations, assumptions, unknowns, decisions, and scenario coverage.
3. Inspect the repository before asking questions its source, tests, configuration, schemas, or existing decisions can answer. Use `explore` for a material or unfamiliar codebase.
4. Build a decision tree covering outcome, actors, domain concepts, boundaries, workflows, states, permissions, data, integrations, failure and recovery, security, observability, rollout, and non-goals.
5. Walk the tree in dependency order. Ask exactly one unresolved question at a time, explain why it matters, and give a recommended answer with its trade-off.
6. Test each proposed rule with concrete happy-path, boundary, failure, abuse, concurrency, and lifecycle scenarios when applicable.
7. Record each resolved answer immediately in the discovery record and scenario coverage table. Do not rely on chat history as the source of truth.
8. Update glossary language immediately when a domain term is settled. Read `references/glossary-format.md` before creating or changing a glossary.
9. Offer an ADR only when the choice is hard to reverse, surprising without context, and based on a real trade-off. Follow the target repository's convention, defaulting to `docs/decisions/`.
10. End with a coverage audit and release the sole plan-facing brief when the release gate passes.

## Challenge and release gate

Before release, challenge every proposed decision against a happy path, boundary, failure, abuse, concurrency, and lifecycle scenario when applicable. Record the challenge and result.

Conflicting claims remain `unresolved` until the evidence and decision are recorded in `record.md`. A material unknown blocks readiness; ask the user or assign a concrete owner before continuing. Do not infer missing authority, scope, or acceptance criteria.

A brief may be released only when the source context is `ready`, no material unknown or unresolved conflict remains, the scenario coverage is complete, and the user has confirmed the shared understanding. Release exactly one `brief.md` per discovery feature. If new evidence changes the record, mark the brief stale and return to discovery.

## Documentation boundaries

- Keep the glossary limited to canonical domain vocabulary, meanings, boundaries, and discouraged synonyms.
- Keep feature behavior, scenarios, numerical defaults, constraints, and acceptance criteria in `record.md`.
- Keep durable architecture rationale in ADRs.
- Separate verified facts, assumptions, decisions, unknowns, and results.
- Preserve negative requirements and rejected alternatives; they are easy to lose during later plan synthesis.

## Coverage audit

Do not declare the grill complete until:

- the desired outcome and measurable success are explicit;
- every actor and authority boundary is named;
- primary and exceptional journeys have expected outcomes;
- lifecycle states, transitions, invariants, and recovery paths are understood;
- external contracts, data ownership, privacy, and security implications are bounded;
- scope and non-goals prevent accidental expansion;
- every material answer is traceable to a task section, scenario, acceptance criterion, or ADR;
- remaining unknowns are either assigned an owner or marked as blockers;
- the user confirms the shared understanding.

## Completion

Return the record path, brief path and hash when released, glossary changes, ADRs created or proposed, resolved decisions, remaining blockers, and a recommendation on readiness for `plan`. Stop without coding.
