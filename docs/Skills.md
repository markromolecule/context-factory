---
title: Skills
type: moc
tags: [skills, workflows, tools]
---

# Skills

The Context Factory defines 10 focused procedural skills for interactive development, planning, discovery, auditing, refactoring, and knowledge grounding:

- [[skills/context/SKILL|Context Specification]] — `/context`, `[CONTEXT]`, `[CONTEXT_SPEC]`: author, grill, and structure context specifications under `docs/context/` before planning
- [[skills/adr/SKILL|Architecture Decision (ADR)]] — `/adr`, `/arch`, `[ADR]`: analyze and record durable 1-3-1 boundary choices
- [[skills/execute/SKILL|Execute Plan]] — `/execute`, `/exec`, `[EXEC]`: execute approved task phases step-by-step with verified evidence and strict phase stops
- [[skills/explore/SKILL|Explore Repository]] — `/explore`, `[EXPLORE]`: map unfamiliar repository code, contracts, tests, and conventions
- [[skills/grill/SKILL|Grill Discovery]] — `/grill`, `[GRILL]`, `[DISCOVERY]`: stress-test new systems and ambiguous features before planning
- [[skills/grounding/SKILL|Knowledge Grounding]] — `/grounding`, `/wiki`, `[WIKI]`: retrieve canonical Wiki knowledge with authority and provenance
- [[skills/plan/SKILL|Implementation Plan]] — `/plan`, `[PLAN]`, `[FEATURE]`: create evidence-backed phased task artifacts without changing production code
- [[skills/refactor/SKILL|Modular Refactoring]] — `/refactor`, `[REFACTOR]`: decompose lengthy, multi-responsibility code into modular files that sync cleanly
- [[skills/security/SKILL|Security Review]] — `/sec`, `/security`, `[SEC]`: threat-model and review application trust boundaries and credentials
- [[skills/verify/SKILL|Verification Review]] — `/verify`, `/release`, `[RELEASE]`, `[QA]`: audit completion claims against fresh, reproducible evidence

Skills trigger through their YAML descriptions and slash command shortcuts. All declarative engineering standards (TypeScript type safety, runtime validation, database query optimization, backend module architecture, and UI styling) are defined in and loaded from `rules/`.

For a new system, product, or feature capability, the skill sequence is `context` / `grill` → `explore` → `plan` → approval → `execute` → `refactor` (optional). Repository discovery may run inside context authoring and grilling to answer evidence-discoverable questions.

