---
title: Skill Taxonomy and Slash Command Ergonomics Optimization
type: decision
status: accepted
created: 2026-08-21
tags: [adr, skills, workflows, orchestration, slash-commands, ergonomics, taxonomy]
---

# 0012 — Skill Taxonomy and Slash Command Ergonomics Optimization

## Context

The initial Context Factory inventory grew organically with compound, multi-word skill directory names (such as `skills/execution-plan`, `skills/implementation-plan`, `skills/typescript-diagnostics`, `skills/grill-with-docs`). In AI IDEs (Antigravity IDE, Claude Code, Cursor, Windsurf), typing `/` produced cluttered, verbose slash autocomplete lists. Furthermore, the conceptual separation between macro delivery lifecycles (*Workflows*) and on-demand specialized tools (*Skills*) required stricter enforcement, along with day-to-day developer skills for client projects.

## Options considered

1. **Retain Compound Skill Names & Rely Exclusively on Prompt Free-Text:** Keep long directory names and document slash commands as aliases in prompt contracts only. Fails to optimize the native IDE autocompletion menus.
2. **Collapse Skills and Workflows into a Monolithic Rule Set:** Eliminate the distinction between skills and workflows, creating flat rule files. Destroys the multi-stage lifecycle gating needed for enterprise engineering.
3. **Streamline Skill Taxonomy, Refactor to Crisp Identifiers & Add High-Leverage Developer Skills:** Rename existing skill directories and frontmatter identifiers to concise single-action names (`execution`, `plan`, `grill`, `adr`, `verify`, `security`, `typescript`, `zod`, `explore`), maintain backward-compatible regex routers, enforce workflow lifecycle gating, and scaffold 4 practical developer velocity skills (`api-contract`, `database-query`, `component-craft`, `test-suite`).

## Decision

Adopt option 3. Streamline the skill taxonomy, optimize slash command ergonomics, and expand developer velocity capabilities.

Key architectural pillars:
1. **Ergonomic Skill Identifiers:** Skill directories and frontmatter names use short, intuitive nouns/verbs:
   - `skills/execution` (`/execution`, `/exec`, `[EXEC]`)
   - `skills/plan` (`/plan`, `[PLAN]`)
   - `skills/grill` (`/grill`, `[GRILL]`, `[DISCOVERY]`)
   - `skills/adr` (`/adr`, `[ADR]`)
   - `skills/verify` (`/verify`, `[VERIFY]`, `[QA]`)
   - `skills/security` (`/sec`, `/security`, `[SEC]`)
   - `skills/typescript` (`/tsc`, `/typescript`, `[TSC]`)
   - `skills/zod` (`/zod`, `[ZOD]`)
   - `skills/explore` (`/explore`, `[EXPLORE]`)
2. **Developer Velocity Skills:** Four new foundational skills accelerate daily engineering in bridged codebases:
   - `skills/api-contract` (OpenAPI/Scalar sync, route definitions, client SDK contracts)
   - `skills/database-query` (SQL performance tuning, Kysely/Prisma construction, index planning, cursor pagination)
   - `skills/component-craft` (Accessible React/Next.js components, micro-interactions, layout shift prevention)
   - `skills/test-suite` (4-layer backend test synthesis and frontend React hook smoke testing)
3. **Taxonomy Discipline:**
   - **Workflows:** Multi-stage, sequential, gated delivery lifecycles with input prerequisites, phase ordering, and stop conditions.
   - **Skills:** Specialized, on-demand procedural toolboxes invoked via slash triggers or within workflow phases.
4. **Harness Backward Compatibility:** Router regexes in `scripts/context-core.mjs` support both streamlined slash commands and legacy keyword patterns.

## Consequences

- Clean, fast, and ergonomic autocomplete experience in modern agentic IDEs.
- Clear mental model separating workflows (macro lifecycles) from skills (tactical capabilities).
- Rich set of 16 engineering skills available when bridging `context-factory` into downstream repositories.
- Zero broken links, 100% passing evaluations, and synchronized canonical inventory.

## Validation and review date

Review after 30 days or by 2026-09-21. Verify slash command trigger reliability across IDE environments and measure developer skill adoption.
