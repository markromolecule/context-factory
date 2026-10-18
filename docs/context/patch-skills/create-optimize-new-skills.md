---
title: "Skill & Workflow Taxonomy and Ergonomics Optimization (Superseded)"
type: context
status: superseded
created: "2026-08-21"
tags: [context, skills, workflows, orchestration, slash-commands, taxonomy, superseded]
feature: "skill-and-workflow-optimization"
superseded_by: "docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation.md"
---

# Skill & Workflow Taxonomy and Ergonomics Optimization Context Specification

> [!NOTE]
> **Superseded Historical Context:** This early taxonomy specification from 2026-08-21 was implemented via task `2026-08-21-0001` (ADR 0012) and subsequently consolidated by [[docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation|ADR 0039]]. Declarative code standards (e.g. Zod validation, backend module architecture, TypeScript type safety) reside exclusively in `rules/`, workflows are consolidated as first-class skills under `skills/workflows/`, and procedural skills are organized into 12 core skills across `skills/engineering/` and `skills/productivity/`.

## 1. Overview & Objective

- **Problem Statement:** 
  The current inventory in `context-factory` contains skills and workflows with verbose directory names (e.g., `skills/execution-plan`, `skills/implementation-plan`, `skills/typescript-diagnostics`) that produce suboptimal slash command autocompletions (`/execution-plan` vs. a crisp `/execution`). Furthermore, the conceptual boundary between **Workflows** (multi-phase lifecycle processes with gating) and **Skills** (on-demand specialized procedures and toolboxes) has blurred in some areas. There is an opportunity to streamline naming, refine taxonomy boundaries, eliminate non-flowing pseudo-workflows, and introduce high-leverage developer skills for downstream projects.
- **Business / User Value:** 
  - **IDE Ergonomics:** Typing `/` in modern AI IDEs (Antigravity IDE, Claude Code, Cursor, Windsurf) immediately presents concise, action-oriented commands (`/execution`, `/plan`, `/grill`, `/verify`, `/backend`, `/zod`, `/tsc`, `/adr`).
  - **Conceptual Clarity:** Developers and AI subagents can immediately distinguish between a multi-stage lifecycle (*Workflow*) and an on-demand procedural capability (*Skill*).
  - **High-Velocity Bridging:** Downstream codebases bridging `context-factory` gain a rich suite of day-to-day engineering skills (API contract design, DB query tuning, component craft, test synthesis).
- **Success Criteria:**
  - Renamed skill paths and canonical identifiers are short, unambiguous, and ergonomic.
  - Every workflow strictly exhibits an explicit, gated sequential flow pattern (e.g., `new-project-delivery.md`).
  - Every skill represents a discrete, re-usable procedure that can be invoked standalone or within workflows.
  - Manifest (`context-manifest.json`), lockfile (`context-lock.json`), orchestrators (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`), and test suites pass `node scripts/context.mjs doctor` with zero regressions.

---

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a developer in an AI IDE*, I want to type `/execution` instead of `/execution-plan` so that I can trigger plan execution quickly with minimal keystrokes.
- *As an AI orchestrator*, I want a crisp taxonomy separating multi-step workflows from on-demand skills so that I never misclassify a simple procedure as a multi-stage project lifecycle.
- *As a full-stack engineer bridging context-factory*, I want access to high-impact development skills (e.g., `api-contract`, `query-optimization`, `component-craft`, `test-suite`) via slash triggers throughout the development cycle.

### Functional Requirements

- [ ] **Ergonomic Skill Renaming:**
  - Rename `skills/execution-plan` $\rightarrow$ `skills/execution` (Slash command: `/execution`, Tag: `[EXEC]`).
  - Rename `skills/implementation-plan` $\rightarrow$ `skills/plan` (Slash command: `/plan`, Tag: `[PLAN]`).
  - Rename `skills/grill-with-docs` $\rightarrow$ `skills/grill` (Slash command: `/grill`, Tag: `[GRILL]`, `[DISCOVERY]`).
  - Rename `skills/architecture-decision` $\rightarrow$ `skills/adr` (Slash command: `/adr`, Tag: `[ADR]`).
  - Rename `skills/verification-review` $\rightarrow$ `skills/verify` (Slash command: `/verify`, Tag: `[VERIFY]`, `[QA]`).
  - Rename `skills/security-review` $\rightarrow$ `skills/security` (Slash command: `/sec`, `/security`, Tag: `[SEC]`).
  - Rename `skills/typescript-diagnostics` $\rightarrow$ `skills/typescript` (Slash command: `/tsc`, `/typescript`, Tag: `[TSC]`).
  - Rename `skills/zod-schema-modeling` $\rightarrow$ `skills/zod` (Slash command: `/zod`, Tag: `[ZOD]`).
  - Rename `skills/repository-discovery` $\rightarrow$ `skills/explore` (Slash command: `/explore`, Tag: `[EXPLORE]`).
  - Maintain `skills/backend-module` (Slash command: `/backend`, `/backend-module`, Tag: `[BACKEND]`).
  - Maintain `skills/playground` (Slash command: `/playground`, Tag: `[PLAYGROUND]`).
  - Maintain `skills/knowledge-grounding` (Slash command: `/wiki`, `/grounding`, Tag: `[WIKI]`).

- [ ] **Workflows vs. Skills Taxonomy Audit & Realignment:**
  - **Workflows (Must have explicit multi-phase lifecycle & quality gates):**
    - `new-project-delivery.md` (Greenfield & major vertical slice loop engineering)
    - `feature-delivery.md` (End-to-end product capability delivery)
    - `defect-resolution.md` (Reproduction, root-cause, regression test, surgical fix)
    - `database-migration.md` (Additive / expand-and-contract schema lifecycle)
    - `architecture-change.md` (Cross-boundary architectural evolution & ADR)
    - `security-sensitive-change.md` (Threat-modeled secure delivery)
    - `dependency-upgrade.md` (Runtime & package upgrade lifecycle)
    - `release-readiness.md` (Pre-flight audit and deployment sign-off)
    - `context-maintenance.md` (Canonical context factory evolution & lock)
  - **Candidate New Skills for Enhanced Development Velocity:**
    - `skills/api-contract`: REST/RPC/OpenAPI/Scalar specification design, route mapping, and type-safe client SDK contracts.
    - `skills/database-query`: SQL optimization, Kysely/Prisma query design, indexing strategies, and cursor pagination.
    - `skills/component-craft`: Modern React/Next.js frontend component engineering (resilient state, ARIA accessibility, micro-interactions, layout shift prevention).
    - `skills/test-suite`: Multi-layer test construction (unit, service integration, route contract, mock boundaries).

- [ ] **Orchestration & Harness Synchronization:**
  - Update `context-manifest.json` canonical inventory.
  - Update `scripts/context-core.mjs` routing hints, action matchers, and regex triggers (`ROUTING_HINTS`, `EXECUTION_TEST`, `PREPLANNING_TEST`).
  - Update root orchestrators: `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `orchestrator/*`.
  - Update docs & vault indexes: `docs/Skills.md`, `docs/Workflows.md`, `docs/ARCHITECTURE.md`, `docs/guide/*`.
  - Ensure all eval cases in `evals/cases/` and `evals/datasets/` reflect the streamlined names.

### Edge Cases & Failure Modes

- **Backward Compatibility for Prompts:** Retain regex aliases so legacy references (e.g. `execution-plan`, `grill-with-docs`, `implementation-plan`) continue to resolve cleanly during transition.
- **Dangling Markdown Links / Obsidian Vault References:** Any file rename must update bidirectional links (`skills/...`) across `docs/` and `agents/` to prevent broken graph navigation.
- **Manifest / Lock Drift:** Running `node scripts/context.mjs lock` and `doctor` is mandatory to guarantee integrity.

---

## 3. Technical & Architectural Context

- **Affected Domains / Layers:**
  - `skills/` (Directory renames and `SKILL.md` frontmatter `name` updates)
  - `workflows/` (Review of scope, triggers, and phase sequencing)
  - `orchestrator/` (`SHARED.md`, `runner.mjs`, root instructions)
  - `scripts/` (`context-core.mjs`, `harness-cli.mjs`)
  - `evals/` (`cases/*.json`, `run-evals.mjs`)
  - `docs/` (Vault indexes, maps of content, guides, tasks, and decisions)
- **Existing Files & Reference Symbols:**
  - `context-manifest.json`
  - `scripts/context-core.mjs:ROUTING_HINTS`
  - `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`
- **Data Model & Schema Changes:** No database schema; manifest schema v3 remains authoritative.
- **Security & Authorization:** N/A (context metadata & agent orchestration rules only).

---

## 4. UI/UX & Slash Palette Ergonomics

- **Slash Command Palette Table:**

| Slash Trigger | Primary Skill / Workflow | Description |
| :--- | :--- | :--- |
| `/execute` | `skills/engineering/execute` | Execute an approved reviewed packet with test-first verification and phase checkpoints |
| `/plan` | `skills/productivity/plan` | Scaffolds evidence-backed phased technical plan under `docs/tasks/` |
| `/grill` | `skills/productivity/grill` | Interactive discovery grilling to resolve ambiguities before planning |
| `/context` | `skills/productivity/context` | Author, discover, and structure a comprehensive grilled context specification |
| `/adr` | `skills/productivity/adr` | 1-3-1 architectural decision record drafting (`docs/decisions/`) |
| `/sec` | `skills/engineering/security` | Threat modeling, authorization audit, and security boundary review |
| `/perf` | `skills/engineering/perf` | Profile and fix runtime bottlenecks, N+1 queries, ESR indexes |
| `/refactor` | `skills/engineering/refactor` | Refactor lengthy, multi-responsibility code into single-responsibility modules |
| `/test` | `skills/engineering/test` | Author test-first assertions for units (architecture, contract, migration) |
| `/grounding` | `skills/productivity/grounding` | Retrieve canonical LLM Wiki knowledge with authority and provenance |
| `/session` | `skills/productivity/session` | Capture, persist, inspect, and resume active task execution state |
| `/plan-review` | `skills/productivity/plan-review` | Independently audit plans and issue approved execution packets |
| `/feature` | `skills/workflows/feature-delivery` | End-to-end product capability delivery |
| `/fix` | `skills/workflows/defect-resolution` | Defect reproduction, root cause, and regression fix |
| `/migrate` | `skills/workflows/database-migration` | Expand-and-contract schema migrations and backfills |
| `/arch` | `skills/workflows/architecture-change` | System boundaries, dependency direction, and shared contracts |
| `/ship` | `skills/workflows/commit-push-release` | Stage, conventional commit, push to remote, tag release |
| `/sync` | `skills/workflows/context-maintenance` | Evolve context-factory rules, skills, workflows without drift |

---

## 5. Scope & Boundaries

- **In Scope:**
  - Refining the taxonomy and directory structure of `skills/` to provide short, ergonomic slash commands.
  - Auditing all 9 workflows to guarantee they represent structured, phased execution lifecycles.
  - Updating all manifest entries, orchestrators, scripts, evals, and documentation.
  - Scoping high-value future skill candidates for downstream development enablement.
- **Out of Scope / Non-Goals:**
  - Modifying the core 3-stage harness runtime in `orchestrator/runner.mjs`.
  - Altering backend or database rules under `rules/`.

---

## 6. Analysis & Architectural Thoughts

### Review of Skills vs. Workflows Taxonomy

1. **Why `new-project-delivery.md` is an Exemplar Workflow:**
   It defines a distinct start-to-finish process: Discovery Grilling $\rightarrow$ Schema Lock $\rightarrow$ Implementation Plan $\rightarrow$ Module 1 Inner Loop (routes/controller/service/data + 4-layer tests) $\rightarrow$ Outer Progression Loop $\rightarrow$ UI Integration. There is a clear sequential progression that cannot be executed in random order.

2. **Analysis of Current Workflows:**
   - `feature-delivery`, `defect-resolution`, `database-migration`, `architecture-change`, `dependency-upgrade`, `release-readiness`, `context-maintenance`, and `security-sensitive-change` all possess structured entry criteria, phased sequences, quality gates, and stop conditions.
   - However, several workflows tightly couple with companion skills (e.g., `feature-delivery` uses `grill` and `plan`; `security-sensitive-change` uses `security`; `architecture-change` uses `adr`).
   - Maintaining this separation is essential: the **Workflow** prescribes *when* and *in what order* steps occur, while the **Skill** encapsulates *how* a specific technique is executed.

3. **Analysis of Skills Ergonomics:**
   - Skills like `execution-plan` and `implementation-plan` suffered from compound naming. Shortening them to `execution` and `plan` significantly improves usability in IDE slash completions.
   - Adding developer-centric utility skills (`api-contract`, `database-query`, `component-craft`) will transform `context-factory` into a complete end-to-end development toolkit when linked into client projects.

---

## 7. References & External Context

- [[orchestrator/SHARED|Shared Orchestration Contract]]
- [[docs/templates/Context|Context Template Specification]]
- [[docs/templates/Task|Task Template Specification]]
- [[docs/templates/Decision|Decision Record Template Specification]]
- [[docs/SKILLS|Skills Map of Content]]
- [[docs/WORKFLOWS|Workflows Map of Content]]