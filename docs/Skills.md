---
title: Skills
type: moc
tags: [skills, workflows, tools]
---

# Skills

The Context Factory defines 12 focused procedural skills across two primary categories for interactive development, planning, discovery, auditing, refactoring, and knowledge grounding:

## Engineering & Coding
*Group Index:* [[skills/engineering/README|Engineering Skills Overview]]

- [[skills/engineering/execute/SKILL|execute]] — Execute an existing task or implementation plan artifact strictly one phase at a time, verify the resulting code, record evidence, and stop at each phase boundary for developer inspection (/execute, /exec, [EXEC]).
- [[skills/engineering/explore/SKILL|explore]] — Build a verified map of an unfamiliar repository's entry points, architecture, contracts, tests, conventions, and risks before planning material work (/explore, [EXPLORE]).
- [[skills/engineering/refactor/SKILL|refactor]] — Refactor and modularize lengthy, multi-responsibility code into maintainable, single-responsibility files that sync cleanly while preserving public contracts and behavioral equivalence (/refactor, [REFACTOR]).
- [[skills/engineering/security/SKILL|security]] — Threat-model and review application changes for trust-boundary, authorization, injection, secrets, data exposure, abuse, and dependency risks (/sec, /security, [SEC]).
- [[skills/engineering/verify/SKILL|verify]] — Audit implementation and completion claims against acceptance criteria, source changes, fresh command output, unresolved findings, and skipped checks (/verify, [VERIFY], [QA]).

## Productivity & Discovery
*Group Index:* [[skills/productivity/README|Productivity Skills Overview]]

- [[skills/productivity/adr/SKILL|adr]] — Analyze and record a durable architecture choice using repository evidence, existing decisions, explicit tradeoffs, migration impact, and verification criteria (/adr, [ADR]).
- [[skills/productivity/context/SKILL|context]] — Author, discover, and structure a comprehensive, grilled context specification under docs/context/ using docs/templates/Context.md before implementation planning. Integrates the grill discovery process to resolve goals, actors, edge cases, and technical constraints one question at a time (/context, [CONTEXT], [CONTEXT_SPEC]).
- [[skills/productivity/docs/SKILL|docs]] — Synthesize evidence-backed development and system reports, performance mitigation summaries, architectural digests, post-mortems, and technical documentation with tables and conclusions. Strictly checks recent context specs and task plans, and leverages embedded grill discovery for requirement clarity (/doc, /docs, [DOC], [DOCS], /documentation, [DOCUMENTATION]).
- [[skills/productivity/grill/SKILL|grill]] — Stress-test a new system, product idea, or materially ambiguous feature before implementation planning by resolving goals, actors, domain language, scenarios, constraints, risks, and decisions one question at a time while preserving answers in project documentation. Use at the start of pre-planning, before coding or committing to an architecture (/grill, [GRILL], [DISCOVERY]).
- [[skills/productivity/grounding/SKILL|grounding]] — Retrieve and reconcile canonical LLM Wiki knowledge by scope, authority, provenance, lifecycle state, recency, links, and task relevance (/grounding, /wiki, [WIKI]).
- [[skills/productivity/plan/SKILL|plan]] — Create an evidence-backed, phased implementation plan without changing production code. Use when a user asks for a plan, design proposal, implementation breakdown, migration plan, or task artifact that another developer or agent will execute later (/plan, [PLAN]).
- [[skills/productivity/triage/SKILL|triage]] — Scan recent repository activity, CI failures, issues, and anomalies using explore and grounding procedures to produce structured findings in docs/tasks/INBOX.md (/triage, [TRIAGE]).

Skills trigger through their YAML descriptions and slash command shortcuts. All declarative engineering standards (TypeScript type safety, runtime validation, database query optimization, backend module architecture, and UI styling) are defined in and loaded from `rules/`.

For a new system, product, or feature capability, the skill sequence is `context` / `grill` → `explore` → `plan` → approval → `execute` → `refactor` (optional). Repository discovery may run inside context authoring and grilling to answer evidence-discoverable questions.
