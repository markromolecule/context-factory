---
title: "Lifecycle Specialist Agents"
type: context
status: draft
created: "2026-08-25"
tags: [context, agents, lifecycle, orchestration]
feature: "lifecycle-specialist-agents"
---

# Lifecycle Specialist Agents Context Specification

## 1. Overview & Objective

- **Problem Statement:** Context Factory currently defines BA, PM, and DevOps agents. It has skills and workflows for architecture, database work, UI work, and security, but no corresponding specialist-agent contracts or agent-specific slash dispatch. Agent-to-rule and agent-to-workflow links are documented manually and are not currently validated as an automatic, lifecycle-wide contract.
- **Business / User Value:** Let teams invoke four consistent specialist roles—Architect / ADR, Data Modeler, UX / Design System, and Security / Threat—without needing to reconstruct their required rules, workflows, skills, handoffs, or slash-command conventions for each request.
- **Success Criteria:** Each specialist has a canonical contract, deterministic invocation, declared lifecycle handoffs, and machine-verifiable links to its applicable rules, skills, and workflows; existing semantic commands remain compatible; invalid links fail validation before lock acceptance.

### Decision Ledger

| ID | Status | Decision | Rationale / Authority |
| --- | --- | --- | --- |
| D-01 | decided | New slash commands select a specialist persona in addition to its linked workflow and skills. Existing semantic workflow and skill commands remain backward compatible. | User-confirmed on 2026-08-25; preserves established command meanings and adds explicit role selection. |
| D-02 | decided | Agent contracts declare `rules`, `skills`, `workflows`, `aliases`, and lifecycle handoffs in frontmatter. The resolver consumes these declarations and validation fails for stale or missing references. | User-confirmed on 2026-08-25; keeps agents self-describing and prevents silent drift. |
| D-03 | decided | Use `/architect`, `/data`, `/ux`, and `/threat` as the direct specialist-agent commands. Preserve `/adr`, `/sec`, and `/security` as existing semantic skill/workflow commands. | User-confirmed on 2026-08-25; prevents command collisions and retains backward compatibility. |
| D-04 | decided | Specialist agents coordinate existing workflows rather than creating duplicate specialist workflows. | User-confirmed on 2026-08-25; preserves the established separation: workflows sequence lifecycle gates and agents provide role-specific judgment. |
| D-05 | decided | Specialist personas activate only through their direct slash aliases. Existing natural-language routing continues to select semantic rules, skills, and workflows but does not implicitly assign a persona. | User-confirmed on 2026-08-25; keeps persona selection intentional and predictable. |
| D-06 | decided | `/architect`, `/data`, `/ux`, and `/threat` default to `architecture-change`, `database-migration`, `feature-delivery`, and `security-sensitive-change`, respectively. Each agent may declare additional participating workflows for handoff. | User-confirmed on 2026-08-25; guarantees deterministic slash resolution while retaining lifecycle coverage. |

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a developer, I want to invoke a specialist agent through a concise slash command, so that its role-specific lifecycle context is selected consistently.*
- *As a Context Factory maintainer, I want agent-to-rule, skill, and workflow dependencies to be declared and validated, so that agent contracts cannot silently drift.*
- *As a delivery team, I want specialist agents to exchange defined artifacts at lifecycle boundaries, so that architecture, data, UX, and security concerns remain aligned through delivery.*

### Scenario Coverage

| ID | Actor / situation | Expected outcome | Failure / recovery |
| --- | --- | --- | --- |
| S-01 | Developer invokes `/architect` for a cross-module design decision. | Select Architect / ADR, its declared context, and `architecture-change`; it may create or propose an ADR under existing gates. | An invalid declared dependency fails validation; the command never resolves a partial contract. |
| S-02 | Developer invokes `/data` for a schema-backed change. | Select Data Modeler, declared database rules, and `database-migration`; it hands schema and rollback constraints to planning/execution. | Existing migration and rollback gates remain required. |
| S-03 | Developer invokes `/ux` for an interface or design-system change. | Select UX / Design System, declared UI rules, and `feature-delivery`; it hands interaction, accessibility, and token constraints to planning. | Non-UI requests retain normal semantic routing and do not receive a UX persona implicitly. |
| S-04 | Developer invokes `/threat` for a trust-boundary review. | Select Security / Threat, security guardrails, the `security` skill, and `security-sensitive-change`; it supplies threat-model and verification expectations. | Undefined authorization policy or risk acceptance remains a workflow stop condition. |
| S-05 | A request needs multiple specialties. | An explicit primary command selects one owner; handoff metadata identifies consultation order. | The resolver does not silently load conflicting personas. |
| S-06 | A linked rule, skill, workflow, alias, or handoff target is renamed or removed. | Validation detects the invalid declaration before lock acceptance. | The maintainer repairs canonical metadata and regenerates lock/doctor evidence. |

### Functional Requirements

- [x] Define Architect / ADR, Data Modeler, UX / Design System, and Security / Threat agent scopes, lifecycle stages, inputs, outputs, and handoffs.
- [x] Define deterministic slash-command and bracket-prefix dispatch for the new agents without breaking existing semantic workflow and skill commands.
- [x] Adopt direct agent aliases: `/architect`, `/data`, `/ux`, and `/threat`.
- [x] Reuse existing workflows rather than creating specialist-specific workflows.
- [x] Limit specialist-persona activation to explicit slash aliases.
- [x] Define deterministic default workflows for all four agent commands.
- [x] Define how an agent declaration automatically supplies or validates links to applicable rules, skills, workflows, and related documentation.
- [ ] Synchronize canonical inventory, adapters, guides, maps, validator/evaluation coverage, and lock output.

### Edge Cases & Failure Modes

- Slash aliases may collide with existing commands such as `/adr`, `/sec`, and `/security`.
- A request may require more than one specialist; ownership, order, and handoff must remain explicit rather than loading conflicting personas implicitly.
- A declared rule, skill, or workflow may be renamed or removed; validation should fail before an agent contract becomes stale.
- Security specialization must retain the existing security-sensitive-change gates and avoid weakening authorization or threat-model requirements.

## 3. Technical & Architectural Context

- **Affected Domains / Layers:** `agents/`, `scripts/context-core.mjs`, `context-manifest.json`, `orchestrator/SHARED.md`, model adapters, documentation maps, context validation, evaluations, and lock generation.
- **Existing Files & Reference Symbols:** `agents/templates/AGENT_TEMPLATE.md`; `agents/README.md`; `docs/Agents.md`; `docs/guide/subagents-lifecycle.md`; `scripts/context-core.mjs` (`ROUTING_HINTS`, `resolveContext`); `workflows/context-maintenance.md`; ADRs 0009 and 0012.
- **Data Model & Schema Changes:** Extend agent frontmatter with explicit `rules`, `aliases`, `defaultWorkflow`, and lifecycle-handoff metadata in addition to existing `skills` and `workflows`. The resolver returns the selected agent and deterministically composes its declared context. Validation confirms every declaration exists, default workflows belong to their agent, aliases are unique and compatible with protected existing commands, and lifecycle references remain valid.
- **Security & Authorization:** The Security / Threat agent must consume `rules/global/security-guardrails.md`, `skills/security/SKILL.md`, and `workflows/security-sensitive-change.md`; its activation must not bypass required threat-model or verification gates.

## 4. UI/UX & Interaction Guidelines

- **Interaction Contract:** Slash commands should be concise, unambiguous, discoverable in the dispatch matrix, and compatible with documented skill/workflow commands.
- **Feedback:** Resolution output should make selected agent personas and their supplied context inspectable.

### Specialist Agent Contract Matrix

| Agent | Alias | Default workflow | Additional participation | Primary handoff |
| --- | --- | --- | --- | --- |
| Architect / ADR | `/architect` | `architecture-change` | `feature-delivery`, `context-maintenance` for factory architecture | Architecture assessment and ADR decision/rationale to PM and execution. |
| Data Modeler | `/data` | `database-migration` | `feature-delivery`, `security-sensitive-change` for sensitive data | Entity/ownership model plus migration, rollback, and data-access constraints. |
| UX / Design System | `/ux` | `feature-delivery` | `code-review-and-optimization` for UI review | User flows, interaction states, accessibility, and design-token constraints. |
| Security / Threat | `/threat` | `security-sensitive-change` | `feature-delivery`, `database-migration`, `release-readiness` as applicable | Threat model, trusted-boundary controls, adversarial checks, and residual risk. |

### Rule, Skill, and Workflow Link Baseline

- **Architect / ADR:** global architecture, code-quality, evidence, naming, and security guardrails; SOLID rules; `adr`, `plan`, `verify`, and `grounding` where applicable.
- **Data Modeler:** global rules; database rules (schema, data access, query optimization, testing); relevant backend rules; migration and security workflows.
- **UX / Design System:** global rules; UI rules (frontend, organization, forms, dialogs, interaction feedback) and relevant hook rules; feature-delivery workflow.
- **Security / Threat:** global security and evidence rules; `security` and `verify` skills; security-sensitive-change plus release/migration workflows when applicable.

## 5. Scope & Boundaries

- **In Scope:** Four agent specifications, their prompts, deterministic dispatch, declarative linkage/validation, lifecycle maps and handoffs, inventory synchronization, resolution/validation/evaluation coverage tests, and a durable ADR if approved during planning.
- **Out of Scope / Non-Goals:** Replacing skills or workflows with agents; creating IDE-specific plugins; changing existing downstream project code; silently auto-executing multi-agent work.

## 6. References & External Context

- [[orchestrator/SHARED|Shared Orchestration Contract]]
- [[workflows/context-maintenance|Context Maintenance]]
- [[docs/decisions/0009-session-keyword-triggers-and-workflow-automation|ADR 0009]]
- [[docs/decisions/0012-skill-taxonomy-and-slash-ergonomics-optimization|ADR 0012]]
- **ADR proposal:** Record the declarative agent-contract and slash-dispatch architecture because it changes public cross-IDE resolver behavior and its validation contract.
