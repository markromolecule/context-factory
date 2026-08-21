---
title: Skills
type: moc
tags: [skills, workflows, development, tools]
---

# Skills

- [[skills/adr/SKILL|Architecture Decision (ADR)]] — `/adr`, `[ADR]`: analyze and record durable 1-3-1 boundary choices
- [[skills/api-contract/SKILL|API Contract Design]] — `/api-contract`, `/api`, `[API]`: design type-safe OpenAPI/Scalar endpoints, DTOs, and client SDK contracts
- [[skills/backend-module/SKILL|Backend Module]] — `/backend`, `/backend-module`, `[BACKEND]`: create vertical Hono or Express feature modules
- [[skills/component-craft/SKILL|Component Craft]] — `/component-craft`, `/component`, `[UI]`: author polished, accessible React/Next.js UI components
- [[skills/database-query/SKILL|Database Query Optimization]] — `/database-query`, `/query`, `[QUERY]`: optimize SQL, index plans, Kysely/Prisma queries, and cursor pagination
- [[skills/execution/SKILL|Execution Plan]] — `/execution`, `/exec`, `[EXEC]`: execute approved task phases step-by-step with verified evidence
- [[skills/explore/SKILL|Explore Repository]] — `/explore`, `[EXPLORE]`: map unfamiliar repository code, contracts, tests, and conventions
- [[skills/grill/SKILL|Grill Discovery]] — `/grill`, `[GRILL]`, `[DISCOVERY]`: stress-test new systems and ambiguous features before planning
- [[skills/knowledge-grounding/SKILL|Knowledge Grounding]] — `/wiki`, `/grounding`, `[WIKI]`: retrieve Wiki knowledge with authority and provenance
- [[skills/plan/SKILL|Implementation Plan]] — `/plan`, `[PLAN]`: create evidence-backed phased task artifacts without changing production code
- [[skills/playground/SKILL|Playground Styling]] — `/playground`, `[PLAYGROUND]`: custom craft playground to eliminate generic LLM styling clichés
- [[skills/security/SKILL|Security Review]] — `/sec`, `/security`, `[SEC]`: threat-model and review application trust boundaries and credentials
- [[skills/test-suite/SKILL|Test Suite Engineering]] — `/test-suite`, `/test`, `[TEST]`: synthesize 4-layer backend test suites and client hook smoke tests
- [[skills/typescript/SKILL|TypeScript Diagnostics]] — `/tsc`, `/typescript`, `[TSC]`: diagnose and resolve compiler errors, circular types, and type failures
- [[skills/verify/SKILL|Verification Review]] — `/verify`, `[VERIFY]`, `[QA]`: audit completion claims against fresh, reproducible evidence
- [[skills/zod/SKILL|Zod Schema Modeling]] — `/zod`, `[ZOD]`: model runtime validation schemas and DTO contracts with Zod

Skills trigger through their YAML descriptions and slash command shortcuts. Load their references only when directed by the selected skill.

For a new system or materially ambiguous capability, the skill sequence is `grill` → `explore` → `plan` → approval → `execution`. Repository discovery may run inside the grill to answer evidence-discoverable questions.
