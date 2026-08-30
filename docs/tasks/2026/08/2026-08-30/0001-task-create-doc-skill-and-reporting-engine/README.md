---
title: "Create Doc Skill and Reporting Engine"
type: task
status: completed
created: "2026-08-30"
tags: [task, skills, doc, documentation, reporting, grill, context, plan]
---

# Create Docs Skill and Reporting Engine

## Outcome

Add a first-class `docs` skill (`skills/docs/SKILL.md`) to Context Factory with slash triggers (`/doc`, `/docs`, `[DOC]`, `[DOCS]`, `/documentation`, `[DOCUMENTATION]`), enabling agents to synthesize evidence-backed technical documentation, executive summaries, performance mitigation reports, and post-mortems. The skill integrates embedded `grill` discovery for ambiguity resolution, traverses recent `docs/context/` specifications and `docs/tasks/` plans, and generates structured markdown reports with comparative tables and grounded conclusions using `docs/templates/Report.md`.

## Pre-planning record

### Actors and goals

- **Developer / Stakeholder:** Issues `/doc` or `/docs` requests (e.g. `/docs I want a summary of mitigation we did in refer to the performance...`) to generate executive-ready and technical summaries of completed changes, system investigations, or performance optimizations.
- **AI Agent / Orchestrator:** Loads `skills/docs/SKILL.md` when `/doc`, `/docs`, or documentation keywords are invoked; inspects recent context specs, task plans, and ADRs; grills the user if requirements/scope are ambiguous; and formats structured reports with tables and evidence-backed conclusions.
- **PM & BA Agents (`agents/pm-agent`, `agents/ba-agent`):** Utilize the `docs` skill for milestone rollups, progress summaries, and post-implementation reporting.

### Domain language

- **Docs Skill (`skills/docs/SKILL.md`):** Specialized procedural skill for synthesizing evidence-backed system and development documentation reports.
- **Embedded Grilling:** Interactive interrogation technique (from `skills/grill/SKILL.md`) applied within doc generation when report scope, metrics, audience, or target subsystems need clarification.
- **Context & Task Traversal:** Deterministic inspection of recent files under `docs/context/` (specifications), `docs/tasks/` (plans, phase files, verification logs), and `docs/decisions/` (ADRs) to extract ground-truth facts.
- **Report Template (`docs/templates/Report.md`):** Canonical template structuring problem statements, mitigation tables, metric deltas, architectural decisions, and final conclusions.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| S-01 | User invokes `/doc` or `/docs` with specific performance mitigation prompt | User inputs `/docs I want a summary of mitigation we did in refer to the performance` | Harness resolves `skills/docs/SKILL.md`, agent inspects recent context specs and task plans, outputs structured report with mitigation & metric tables and conclusions | If recent context/plans lack figures, agent inspects code/logs or triggers grill question | Verified |
| S-02 | User invokes `/docs` with underspecified reporting request | User requests general system summary without timeframe or focus area | Agent uses embedded grill discipline (asks 1 clarifying question with recommendations) before drafting report | If user skips, defaults to most recent task/context scope | Verified |
| S-03 | CLI Context Resolution | User runs `node scripts/context.mjs resolve "/docs performance report"` | Harness returns `skills/docs/SKILL.md` with score >= 6 and matching routing | Validation error if skill is missing or misconfigured | Verified |
| S-04 | Health and Diagnostic Suite | Run `node scripts/context.mjs doctor` and `node evals/run-evals.mjs` | Manifest, lockfile, Obsidian maps, schema validations, and evaluations all pass (100% green) | Diagnostic fails if inventory, links, or lock hash drift | Verified |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | How should the docs skill be structured? | Standard procedural skill in `skills/docs/SKILL.md` with interface resource in `skills/docs/agents/openai.yaml`. | Follows existing canonical skill pattern (`skills/context`, `skills/plan`, `skills/verify`). | Embedding reporting logic into PM prompt or monolithic script. | `skills/docs/SKILL.md` |
| D-02 | How should the docs skill handle missing or ambiguous details? | Embed the `grill` interview discipline directly into the procedure: ask exactly one question at a time with clear options and trade-offs. | Matches user request and `skills/context/SKILL.md` embedded grill pattern. | Guessing unverified metrics or halting without options. | `skills/docs/SKILL.md` |
| D-03 | What template should govern generated documentation reports? | Create `docs/templates/Report.md` providing standard sections: Executive Summary, Background, Mitigation Actions Table, Results & Impact Matrix, Decision Traceability, and Conclusion. | Standardizes report quality and table formatting across agents. | Ad-hoc freeform markdown with inconsistent table headers. | `docs/templates/Report.md` |
| D-04 | Where should generated reports be saved by default? | Save to `docs/reports/YYYY/MM/YYYY-MM-DD-<topic>.md` in host repo or user-specified target path. | Consistent with `docs/tasks/` and `docs/context/` date-partitioned layout. | Writing directly to project root. | `skills/docs/SKILL.md` |

### Unknowns and blockers

- *None. All architectural contracts, harness resolution hooks, and validation invariants are defined.*

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | Phase 1 (Skill Definition) | `skills/docs/SKILL.md` created with YAML frontmatter (`name`, `description`), embedded grill instructions, context/plan traversal procedure, and tabular formatting rules | `skills/docs/SKILL.md` | `scripts/validate-context.mjs` | Verified |
| AC-02 | Phase 1 (Skill Resource & Template) | `skills/docs/agents/openai.yaml` and `docs/templates/Report.md` created and compliant | `skills/docs/agents/openai.yaml`, `docs/templates/Report.md` | `scripts/validate-context.mjs` | Verified |
| AC-03 | Phase 2 (Harness & Validation) | `scripts/context-core.mjs` and `scripts/validate-context.mjs` recognize `/doc`, `/docs`, `[DOC]`, `[DOCS]`, `/documentation`, `[DOCUMENTATION]`, scoring `skills/docs/SKILL.md` | `scripts/context-core.mjs`, `scripts/validate-context.mjs` | `node scripts/context.mjs resolve "/docs performance report"` | Verified |
| AC-04 | Phase 3 (Documentation Maps) | `docs/Skills.md`, `docs/guide/skills.md`, `agents/pm-agent/AGENT.md`, `agents/ba-agent/AGENT.md` updated and linked | Documentation and agent files | Obsidian wiki link validation in `scripts/validate-context.mjs` | Verified |
| AC-05 | Phase 3 (Evaluations & Doctor) | `evals/cases/docs-reporting.json` added; `context-manifest.json` and `context-lock.json` updated; `node scripts/context.mjs doctor` passes 100% | `evals/cases/docs-reporting.json`, `context-manifest.json`, `context-lock.json` | `node scripts/context.mjs doctor` & `node evals/run-evals.mjs` | Verified |

## Scope

- **In Scope:**
  - `skills/docs/SKILL.md` definition with embedded grilling, context/plan traversal, and tabular reporting rules.
  - `skills/docs/agents/openai.yaml` interface metadata.
  - `docs/templates/Report.md` canonical report template.
  - Resolver updates in `scripts/context-core.mjs` for `/doc`, `/docs`, `[DOC]`, `[DOCS]`, `/documentation`, `[DOCUMENTATION]`.
  - Validator updates in `scripts/validate-context.mjs` (`protectedTriggers`).
  - Documentation updates in `docs/Skills.md` and `docs/guide/skills.md`.
  - Agent updates in `agents/pm-agent/AGENT.md` and `agents/ba-agent/AGENT.md` to reference `docs`.
  - New evaluation test case `evals/cases/docs-reporting.json`.
  - Manifest update in `context-manifest.json` and lockfile regeneration in `context-lock.json`.
- **Non-goals:**
  - Changing unrelated rules or existing skills.
  - Introducing third-party npm dependencies.

## Constraints and decisions

- Zero external dependencies (pure Node.js ES modules).
- Frontmatter must contain only `name` and `description` as mandated by `scripts/validate-context.mjs`.
- Model neutrality across all prompt files and adapters.

## Phases

- [x] `phase-01-doc-skill-and-template.md` — Phase 1: Skill specification, interface metadata, and Report template
- [x] `phase-02-harness-resolution-and-validation.md` — Phase 2: Harness resolution, routing hints, and protected triggers
- [x] `phase-03-documentation-and-evaluations.md` — Phase 3: Vault maps, user guide, eval cases, manifest sync, and doctor verification

## Verification

- `node scripts/context.mjs resolve "/docs performance report"` — PASS
- `node scripts/context.mjs doctor` — PASS
- `node evals/run-evals.mjs` — 21/21 PASS

## Deviations

*None.*

## Result

Successfully created and verified the `docs` skill (`skills/docs/SKILL.md`), interface bindings, report template (`docs/templates/Report.md`), harness resolution, protected triggers, documentation maps, and evaluation suite with 100% health across Context Factory.


