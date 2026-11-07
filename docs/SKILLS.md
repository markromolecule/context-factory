---
title: Skills
type: moc
tags: [skills, workflows, tools]
---

# Skills

The Context Factory defines 12 focused procedural skills across two primary categories for interactive development, planning, discovery, auditing, refactoring, and knowledge grounding:

## Engineering & Coding
*Group Index:* [[skills/engineering/README|Engineering Skills Overview]]

- [[skills/engineering/execute/SKILL|execute]] — Execute an approved reviewed packet with test-first verification and phase checkpoints.
- [[skills/engineering/perf/SKILL|perf]] — Profile and fix runtime bottlenecks: N+1 queries, missing indexes, async waterfalls, memory, bundle size. Triggers: /perf, [PERF], "optimize queries", "reduce latency", or review performance findings.
- [[skills/engineering/refactor/SKILL|refactor]] — Refactor and modularize lengthy, multi-responsibility code into maintainable, single-responsibility files that sync cleanly while preserving public contracts and behavioral equivalence (/refactor, [REFACTOR]).
- [[skills/engineering/security/SKILL|security]] — Threat-model and review application changes for trust-boundary, authorization, injection, secrets, data exposure, abuse, and dependency risks (/sec, /security, [SEC]).
- [[skills/engineering/test/SKILL|test]] — Turn a unit's Verification section into real tests, written test-first (failing assertions first, then implementation), specializing in architecture, contract, and migration tests (/test, [TEST]).

## Productivity & Discovery
*Group Index:* [[skills/productivity/README|Productivity Skills Overview]]

- [[skills/productivity/adr/SKILL|adr]] — Analyze and record a durable architecture choice using repository evidence, existing decisions, explicit tradeoffs, migration impact, and verification criteria (/adr, [ADR]).
- [[skills/productivity/context/SKILL|context]] — Clarify and confirm a context specification under `docs/context/`, then carry it through grounding and grill to a verified brief for planning (/context, [CONTEXT], [CONTEXT_SPEC]).
- [[skills/productivity/grill/SKILL|grill]] — Stress-test a new system, product idea, or materially ambiguous feature before implementation planning by resolving goals, actors, domain language, scenarios, constraints, risks, and decisions one question at a time while preserving answers in project documentation. Use at the start of pre-planning, before writing code or committing to an architecture (/grill, [GRILL], [DISCOVERY]).
- [[skills/productivity/grounding/SKILL|grounding]] — Retrieve and reconcile canonical LLM Wiki knowledge by scope, authority, provenance, lifecycle state, recency, links, and task relevance (/grounding, /wiki, [WIKI]).
- [[skills/productivity/plan/SKILL|plan]] — Turn a released discovery brief into a phased implementation plan with self-contained, dependency-ordered units for later execution. Use for implementation plans, design approaches, migrations, and task breakdowns (/plan, [PLAN]); not for execution or plan review.
- [[skills/productivity/plan-review/SKILL|plan-review]] — Independently audit a plan and issue approved execution packets.
- [[skills/productivity/session/SKILL|session]] — Capture, persist, inspect, clear, and resume active agent task execution state across clean session boundaries using HANDOFF.md and machine checkpoints to prevent context saturation degradation (/session, /session save, /session resume, /session clear, [SESSION]).

Skills trigger through their YAML descriptions and slash command shortcuts. All declarative engineering standards (TypeScript type safety, runtime validation, database query optimization, backend module architecture, and UI styling) are defined in and loaded from `rules/`.

For a new system, product, or feature capability, the skill sequence is `context` / `grill` → `plan` → approval → `execute` → `refactor` (optional). Repository discovery may run inside context authoring and grilling to answer evidence-discoverable questions.
