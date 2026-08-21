---
title: Skills
type: moc
tags: [skills, workflows, tools]
---

# Skills

The Context Factory defines 8 focused procedural skills for interactive development, planning, discovery, auditing, and knowledge grounding:

- [[skills/adr/SKILL|Architecture Decision (ADR)]] — `/adr`, `/arch`, `[ADR]`: analyze and record durable 1-3-1 boundary choices
- [[skills/execution/SKILL|Execution Plan]] — `/execution`, `/exec`, `[EXEC]`: execute approved task phases step-by-step with verified evidence
- [[skills/explore/SKILL|Explore Repository]] — `/explore`, `[EXPLORE]`: map unfamiliar repository code, contracts, tests, and conventions
- [[skills/grill/SKILL|Grill Discovery]] — `/grill`, `[GRILL]`, `[DISCOVERY]`: stress-test new systems and ambiguous features before planning
- [[skills/grounding/SKILL|Knowledge Grounding]] — `/grounding`, `/wiki`, `[WIKI]`: retrieve canonical Wiki knowledge with authority and provenance
- [[skills/plan/SKILL|Implementation Plan]] — `/plan`, `[PLAN]`, `[FEATURE]`: create evidence-backed phased task artifacts without changing production code
- [[skills/security/SKILL|Security Review]] — `/sec`, `/security`, `[SEC]`: threat-model and review application trust boundaries and credentials
- [[skills/verify/SKILL|Verification Review]] — `/verify`, `/release`, `[RELEASE]`, `[QA]`: audit completion claims against fresh, reproducible evidence

Skills trigger through their YAML descriptions and slash command shortcuts. All declarative engineering standards (TypeScript type safety, runtime validation, database query optimization, backend module architecture, and UI styling) are defined in and loaded from `rules/`.

For a new system or materially ambiguous capability, the skill sequence is `grill` → `explore` → `plan` → approval → `execution`. Repository discovery may run inside the grill to answer evidence-discoverable questions.
