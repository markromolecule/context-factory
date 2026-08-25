---
title: "Task: Lifecycle Specialist Agents & Declarative Architecture"
type: task
status: completed
created: "2026-08-25"
tags: [task, master, agents, subagents, architect, data, ux, threat, devops, pm, ba, lifecycle]
---

# Task: Lifecycle Specialist Agents & Declarative Architecture

## Outcome

Introduce four canonical **Lifecycle Specialist Agents** (`architect-agent`, `data-agent`, `ux-agent`, `threat-agent`) with deterministic slash command dispatch (`/architect`, `/data`, `/ux`, `/threat`), declarative agent frontmatter contracts (`rules`, `skills`, `workflows`, `aliases`, `defaultWorkflow`, `handoffs`), automated harness resolution and validation, synchronized orchestrator adapters and user guides, and a durable architectural decision record (ADR 0016).

## Pre-planning record

- **Context Specification:** [[docs/context/agents/lifecycle-specialist-agents|Lifecycle Specialist Agents Context Specification]] (`docs/context/agents/lifecycle-specialist-agents.md`)
- **Discovery Status:** Complete and verified; 6/6 grilling decisions settled with full consensus.

### Actors and goals

- **AI Architect / ADR Specialist (`agents/architect-agent` / `/architect`):** Evaluates system boundaries, cross-module dependency direction, SOLID principles, and architectural trade-offs, authoring durable ADRs.
- **AI Data Modeler (`agents/data-agent` / `/data`):** Designs entity schemas, data-access layers, indexing strategies, forward/rollback migration scripts, and query optimizations.
- **AI UX & Design System Specialist (`agents/ux-agent` / `/ux`):** Designs user flows, interaction states, accessibility standards, design tokens, and frontend component composition.
- **AI Security & Threat Modeling Specialist (`agents/threat-agent` / `/threat`):** Performs threat modeling, audits trust boundaries, validates credential and token hygiene, and enforces security-sensitive change verification gates.
- **Context Factory Maintainer:** Ensures agent definitions are machine-verifiable, self-describing, and protected against silent dependency drift.

### Domain language

- **Specialist Persona:** A role-specific subagent contract defining focus, boundaries, linked rules/skills/workflows, and lifecycle handoffs.
- **Declarative Agent Frontmatter:** YAML frontmatter in `AGENT.md` declaring `name`, `title`, `role`, `description`, `lifecycleStage`, `aliases`, `defaultWorkflow`, `skills`, `workflows`, `rules`, and `handoffs`.
- **Deterministic Agent Dispatch:** Slash-command or bracket-prefix routing (`/architect`, `/data`, `/ux`, `/threat`) that explicitly resolves the agent persona and composes its declared context without affecting natural-language keyword routing.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
| --- | --- | --- | --- | --- | --- |
| SC-01 | Developer invokes `/architect` for modular design | Request starts with `/architect` or `[ARCHITECT]` | Harness resolves `architect-agent`, `architecture-change` workflow, SOLID rules, and `adr` skill | Validation fails if declared rules or skills are missing | Completed |
| SC-02 | Developer invokes `/data` for schema migration | Request starts with `/data` or `[DATA]` | Harness resolves `data-agent`, `database-migration` workflow, and database rules | Migration and rollback gates strictly enforced | Completed |
| SC-03 | Developer invokes `/ux` for interactive component | Request starts with `/ux` or `[UX]` | Harness resolves `ux-agent`, `feature-delivery` workflow, and UI/hook rules | Non-UI requests retain standard semantic routing | Completed |
| SC-04 | Developer invokes `/threat` for auth review | Request starts with `/threat` or `[THREAT]` | Harness resolves `threat-agent`, `security-sensitive-change`, and security guardrails | Undefined threat policy triggers workflow stop | Completed |
| SC-05 | General natural language query without alias | Query contains domain keywords (e.g. "optimize SQL query") | Semantic router selects matching workflow and rules without assigning persona | Resolver does not inject unexpected personas | Completed |
| SC-06 | Stale or broken agent frontmatter reference | Agent declares non-existent rule or workflow | `validate-context.mjs` fails during CI and doctor checks | Maintainer corrects declaration before lock | Completed |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
| --- | --- | --- | --- | --- | --- |
| D-01 | Role & Workflow Separation | New slash commands select a specialist persona in addition to default workflow and skills | Preserves established workflow gates while supplying role-specific focus (D-01, D-04) | Create duplicate specialist workflows; Flat prompts | `docs/context/agents/lifecycle-specialist-agents.md` |
| D-02 | Declarative Agent Frontmatter | Agent contracts declare `rules`, `skills`, `workflows`, `aliases`, `defaultWorkflow`, and `handoffs` | Keeps agent contracts machine-verifiable and eliminates manual sync errors (D-02) | Hardcode agent links in resolver script | `docs/context/agents/lifecycle-specialist-agents.md` |
| D-03 | Command Ergonomics & Collisions | Use `/architect`, `/data`, `/ux`, and `/threat`; preserve `/adr`, `/sec`, and `/security` | Prevents command collisions and retains 100% backward compatibility (D-03) | Reassign `/adr` or `/sec` to agents | `docs/context/agents/lifecycle-specialist-agents.md` |
| D-04 | Persona Activation Boundary | Specialist personas activate only via explicit slash aliases / bracket prefixes | Prevents surprising persona injection on general semantic queries (D-05) | Infer persona on every prompt | `docs/context/agents/lifecycle-specialist-agents.md` |
| D-05 | Default Workflow Mapping | `/architect` -> `architecture-change`, `/data` -> `database-migration`, `/ux` -> `feature-delivery`, `/threat` -> `security-sensitive-change` | Guarantees deterministic routing while allowing participating handoffs (D-06) | Prompt user for workflow on every invocation | `docs/context/agents/lifecycle-specialist-agents.md` |

### Unknowns and blockers

- *None:* All requirements, schemas, routing matrices, and validation rules are implemented and verified.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
| --- | --- | --- | --- | --- | --- |
| AC-01 | D-02 / SC-06 | Extended `AGENT_TEMPLATE.md` and updated existing agents (`ba-agent`, `pm-agent`, `devops-agent`) conforming to declarative schema | `agents/*/AGENT.md`, `agents/templates/` | Schema validation in `validate-context.mjs` | Completed |
| AC-02 | D-01 / D-03 / S-01..S-04 | 4 new specialist agent directories created with `AGENT.md`, `prompts/subagent-invocation.md`, and `prompts/system-prompt.md` | `agents/{architect,data,ux,threat}-agent/` | Inspection & manifest inventory check | Completed |
| AC-03 | D-04 / D-05 / SC-01..SC-05 | `scripts/context-core.mjs` resolves specialist agent aliases, injects declared rules/skills, and preserves semantic routing | `scripts/context-core.mjs` | `node scripts/context.mjs resolve` test suite | Completed |
| AC-04 | D-02 / SC-06 | `scripts/validate-context.mjs` enforces agent frontmatter correctness, alias uniqueness, and cross-reference integrity | `scripts/validate-context.mjs` | `node scripts/context.mjs lint` | Completed |
| AC-05 | D-01 / D-03 | Orchestration contracts (`SHARED.md`, `AGENTS.md`, `GEMINI.md`, etc.), `docs/Agents.md`, and `docs/guide/subagents-lifecycle.md` updated | `orchestrator/*`, `docs/*`, `agents/README.md` | Inspection & link validation | Completed |
| AC-06 | D-01..D-05 | ADR 0016 authored and registered in `docs/decisions/README.md` | `docs/decisions/0016-declarative-lifecycle-specialist-agents.md` | Inspection & inventory check | Completed |
| AC-07 | D-01..D-05 | Evaluation cases added, manifest updated, lock regenerated, and doctor reports 100% healthy | `evals/`, `context-manifest.json`, `context-lock.json` | `node scripts/context.mjs doctor` | Completed |

## Scope

- 4 new specialist agent directories (`agents/architect-agent`, `agents/data-agent`, `agents/ux-agent`, `agents/threat-agent`) with specifications, invocation prompts, and system prompts.
- Declarative agent frontmatter schema extension across template and all 7 agents.
- Context resolver enhancement in `scripts/context-core.mjs` for agent persona resolution and automatic context composition.
- Strict agent validation in `scripts/validate-context.mjs`.
- Synchronized orchestrator contracts (`SHARED.md`, `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.windsurfrules`).
- Updated documentation maps (`agents/README.md`, `docs/Agents.md`, `docs/guide/subagents-lifecycle.md`).
- Architectural Decision Record (`docs/decisions/0016-declarative-lifecycle-specialist-agents.md`).
- Evaluation test suite updates and lockfile synchronization.

## Non-goals

- Replacing existing workflows or skills with agent scripts.
- Modifying downstream application business logic or external project files.
- Implicitly activating specialist personas without explicit slash/bracket invocation.
- Creating IDE-specific proprietary plugin binaries.

## Phases

- [x] [[docs/tasks/2026/08/2026-08-25/0001-task-lifecycle-specialist-agents/phase-01-declarative-agent-schema-and-harness-resolver|Phase 1: Declarative Agent Schema & Harness Resolver]] — Extend agent schema, update existing agents, enhance resolver in `context-core.mjs`, and add validation in `validate-context.mjs`.
- [x] [[docs/tasks/2026/08/2026-08-25/0001-task-lifecycle-specialist-agents/phase-02-specialist-agent-contracts-and-prompts|Phase 2: Specialist Agent Contracts & Prompts]] — Author `AGENT.md`, `subagent-invocation.md`, and `system-prompt.md` for `architect-agent`, `data-agent`, `ux-agent`, and `threat-agent`.
- [x] [[docs/tasks/2026/08/2026-08-25/0001-task-lifecycle-specialist-agents/phase-03-orchestrators-guides-maps-and-adr|Phase 3: Orchestrators, Guides, Maps & ADR]] — Synchronize entrypoints, MOCs, user guides, and author ADR 0016.
- [x] [[docs/tasks/2026/08/2026-08-25/0001-task-lifecycle-specialist-agents/phase-04-evaluations-inventory-lock-and-doctor|Phase 4: Evaluations, Inventory, Lock & Doctor Verification]] — Add evaluation cases, update manifest, regenerate lock, and verify doctor health.

## Verification

- `node scripts/context.mjs lint` -> 0 errors: `Context Factory 3.9.0 is valid: 35 rules, 10 skills, 10 workflows, 23 agent resources, 6 knowledge items, 14 evaluations, 209 Markdown files.`
- `node scripts/context.mjs eval` -> 17/17 unit and dataset evaluations passed.
- `node scripts/context.mjs doctor` -> Context Factory is healthy.

## Deviations

- None.

## Result

- Complete 7-agent declarative lifecycle ecosystem implemented, tested, verified, and locked at Context Factory version 3.9.0.
