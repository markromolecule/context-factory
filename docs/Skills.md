---
title: Skills
type: moc
tags: [skills, workflows, tools]
---

# Skills

The Context Factory defines 18 focused procedural skills across two primary categories for interactive development, planning, discovery, auditing, refactoring, and knowledge grounding:

## Engineering & Coding
*Group Index:* [[skills/engineering/README|Engineering Skills Overview]]

- [[skills/engineering/execute/SKILL|execute]] — Execute an approved reviewed packet with test-first verification and phase checkpoints.
- [[skills/engineering/explore/SKILL|explore]] — Build a verified map of an unfamiliar repository's entry points, architecture, contracts and their consumers, tests, conventions, and risks before planning material work (/explore, [EXPLORE]).
- [[skills/engineering/perf/SKILL|perf]] — Profile and fix runtime bottlenecks: N+1 queries, missing indexes, async waterfalls, memory, bundle size. Triggers: /perf, [PERF], "optimize queries", "reduce latency", or review performance findings.
- [[skills/engineering/refactor/SKILL|refactor]] — Refactor and modularize lengthy, multi-responsibility code into maintainable, single-responsibility files that sync cleanly while preserving public contracts and behavioral equivalence (/refactor, [REFACTOR]).
- [[skills/engineering/review/SKILL|review]] — Independent diff review of a unit on its task branch against its unit file to check for out-of-scope file edits, missing tests, SOLID violations, and unmet definitions of done before developer checkpoints (/review, [REVIEW]).
- [[skills/engineering/security/SKILL|security]] — Threat-model and review application changes for trust-boundary, authorization, injection, secrets, data exposure, abuse, and dependency risks (/sec, /security, [SEC]).
- [[skills/engineering/test/SKILL|test]] — Turn a unit's Verification section into real tests, written test-first (failing assertions first, then implementation), specializing in architecture, contract, and migration tests (/test, [TEST]).
- [[skills/engineering/types/SKILL|types]] — Harden static types: eliminate any, remove loose casts, add discriminated unions and exhaustiveness. Triggers: /types, [TYPES], "harden types", "fix any", or review type-slop failures.
- [[skills/engineering/verify/SKILL|verify]] — Audit implementation and completion claims against acceptance criteria, source changes, fresh command output, unresolved findings, and skipped checks (/verify, [VERIFY], [QA]).

## Productivity & Discovery
*Group Index:* [[skills/productivity/README|Productivity Skills Overview]]

- [[skills/productivity/adr/SKILL|adr]] — Analyze and record a durable architecture choice using repository evidence, existing decisions, explicit tradeoffs, migration impact, and verification criteria (/adr, [ADR]).
- [[skills/productivity/context/SKILL|context]] — Author, discover, and structure a comprehensive, grilled context specification under docs/context/ using docs/templates/Context.md before implementation planning. Integrates the grill discovery process to resolve goals, actors, edge cases, and technical constraints one question at a time (/context, [CONTEXT], [CONTEXT_SPEC]).
- [[skills/productivity/docs/SKILL|docs]] — Synthesize evidence-backed development and system reports, performance mitigation summaries, architectural digests, post-mortems, and technical documentation with tables and conclusions. Strictly checks recent context specs and task plans, and leverages embedded grill discovery for requirement clarity (/doc, /docs, [DOC], [DOCS], /documentation, [DOCUMENTATION]).
- [[skills/productivity/grill/SKILL|grill]] — Stress-test a new system, product idea, or materially ambiguous feature before implementation planning by resolving goals, actors, domain language, scenarios, constraints, risks, and decisions one question at a time while preserving answers in project documentation. Use at the start of pre-planning, before writing code or committing to an architecture (/grill, [GRILL], [DISCOVERY]).
- [[skills/productivity/grounding/SKILL|grounding]] — Retrieve and reconcile canonical LLM Wiki knowledge by scope, authority, provenance, lifecycle state, recency, links, and task relevance (/grounding, /wiki, [WIKI]).
- [[skills/productivity/plan/SKILL|plan]] — Create an evidence-backed, phased implementation plan without changing production code, broken into atomic task units that can each be handed to a separate session or agent to execute. Every unit carries its own standalone context and a justified test plan (unit, integration, architecture, contract, or migration tests, chosen to fit what actually changes). Use when a user asks for a plan, design proposal, implementation breakdown, migration plan, or task artifact that another developer or agent will execute later (/plan, [PLAN]).
- [[skills/productivity/plan-review/SKILL|plan-review]] — Independently audit a plan and issue approved execution packets.
- [[skills/productivity/session/SKILL|session]] — Capture, persist, inspect, and resume active agent task execution state across clean session boundaries to prevent context saturation degradation (/session, /session-save, /session-resume, [SESSION]).
- [[skills/productivity/triage/SKILL|triage]] — Scan recent repository activity, CI failures, issues, and anomalies using explore and grounding procedures to produce structured findings in docs/tasks/INBOX.md (/triage, [TRIAGE]).

## Canonical Workflow Entries
*Group Index:* Thin host-native entries delegating to canonical workflows ([[docs/Workflows|Workflows Overview]])

- [[skills/workflow-entries/workflow-architecture-change/SKILL|workflow-architecture-change]] — Change durable system boundaries, dependency direction, shared patterns, or public contracts with explicit evidence, decisions, migration, and conformance checks.
- [[skills/workflow-entries/workflow-code-review-and-optimization/SKILL|workflow-code-review-and-optimization]] — Audit, suggest improvements for, and optimize code generated from implementation plans to ensure high performance, type safety, modularity, and clean architecture.
- [[skills/workflow-entries/workflow-commit-push-release/SKILL|workflow-commit-push-release]] — Safely stage, craft conventional commits, push to remote repository, tag releases, and execute release verification.
- [[skills/workflow-entries/workflow-context-maintenance/SKILL|workflow-context-maintenance]] — Evolve Context Factory rules, skills, workflows, orchestration, and architecture without duplication, drift, or invalid inventory.
- [[skills/workflow-entries/workflow-database-migration/SKILL|workflow-database-migration]] — Evolve schemas and production data through compatible, reviewed, observable, and recoverable migration phases.
- [[skills/workflow-entries/workflow-defect-resolution/SKILL|workflow-defect-resolution]] — Resolve a defect by reproducing it, establishing root cause, adding regression evidence, and applying the smallest safe fix.
- [[skills/workflow-entries/workflow-dependency-upgrade/SKILL|workflow-dependency-upgrade]] — Upgrade runtimes, frameworks, libraries, and tooling through bounded compatibility analysis and verified migration steps.
- [[skills/workflow-entries/workflow-docs/SKILL|workflow-docs]] — Synthesize evidence-backed development and system reports, performance mitigation summaries, architectural digests, post-mortems, and technical documentation with tables and conclusions.
- [[skills/workflow-entries/workflow-feature-delivery/SKILL|workflow-feature-delivery]] — Deliver a product capability from scoped outcome through implementation, verification, documentation, and handoff.
- [[skills/workflow-entries/workflow-new-project-delivery/SKILL|workflow-new-project-delivery]] — Deliver a greenfield system or major multi-module domain capability using progressive vertical-slice execution, pre-planning grilling discovery, 4-layer backend testing, client hook validation, and dual-loop engineering.
- [[skills/workflow-entries/workflow-release-readiness/SKILL|workflow-release-readiness]] — Decide whether a change set is ready to release using evidence across behavior, quality, operations, security, accessibility, and recovery.
- [[skills/workflow-entries/workflow-security-sensitive-change/SKILL|workflow-security-sensitive-change]] — Deliver changes across trust boundaries with explicit threat modeling, security gates, adversarial verification, and safe release controls.

Skills trigger through their YAML descriptions and slash command shortcuts. All declarative engineering standards (TypeScript type safety, runtime validation, database query optimization, backend module architecture, and UI styling) are defined in and loaded from `rules/`.

For a new system, product, or feature capability, the skill sequence is `context` / `grill` → `explore` → `plan` → approval → `execute` → `refactor` (optional). Repository discovery may run inside context authoring and grilling to answer evidence-discoverable questions.
