---
title: "Phase 1: Declarative Agent Schema & Harness Resolver"
type: phase
parent: "[[docs/tasks/2026/08/2026-08-25/0001-task-lifecycle-specialist-agents/README|Task: Lifecycle Specialist Agents & Declarative Architecture]]"
phase: "01"
status: completed
created: "2026-08-25"
tags: [task, phase, agents, schema, resolver, validation]
---

# Phase 1: Declarative Agent Schema & Harness Resolver

## Objective

Extend the agent frontmatter specification in `agents/templates/AGENT_TEMPLATE.md`, upgrade existing agents (`ba-agent`, `pm-agent`, `devops-agent`) to conform to the declarative schema (`aliases`, `defaultWorkflow`, `rules`, `skills`, `workflows`, `handoffs`), enhance the context harness resolver in `scripts/context-core.mjs` to resolve agent personas and auto-compose declared rules and skills, and add comprehensive schema and reference validation in `scripts/validate-context.mjs`.

## Dependencies & Prerequisites

- Context Specification: `docs/context/agents/lifecycle-specialist-agents.md` (status: ready).
- Working directory: `/Applications/XAMPP/xamppfiles/htdocs/context-factory`.

## Impacted Files & Components

- `agents/templates/AGENT_TEMPLATE.md` — [MODIFY] Extended frontmatter template with `aliases`, `defaultWorkflow`, `rules`, and `handoffs`.
- `agents/ba-agent/AGENT.md` — [MODIFY] Updated frontmatter with `aliases: ["/ba", "[BA]", "[DISCOVERY]"]`, `defaultWorkflow: feature-delivery`, explicit `rules`, and `handoffs`.
- `agents/pm-agent/AGENT.md` — [MODIFY] Updated frontmatter with `aliases: ["/pm", "[PM]"]`, `defaultWorkflow: feature-delivery`, explicit `rules`, and `handoffs`.
- `agents/devops-agent/AGENT.md` — [MODIFY] Updated frontmatter with `aliases: ["/devops", "[DEVOPS]"]`, `defaultWorkflow: release-readiness`, explicit `rules`, and `handoffs`.
- `scripts/context-core.mjs` — [MODIFY] Added agent parsing/resolution logic, alias routing dispatch, automatic rule/skill composition for resolved agents, and fixed `.DS_Store` ignore in `filesUnder`.
- `scripts/validate-context.mjs` — [MODIFY] Added strict agent frontmatter validation: required fields, rule/skill/workflow existence in manifest, alias uniqueness and collision prevention, and handoff validity.

## Implementation Tasks

- [x] Task 1.1: Update `agents/templates/AGENT_TEMPLATE.md` with complete YAML frontmatter schema including `aliases`, `defaultWorkflow`, `rules`, `skills`, `workflows`, and `handoffs`.
- [x] Task 1.2: Update frontmatter in `agents/ba-agent/AGENT.md`, `agents/pm-agent/AGENT.md`, and `agents/devops-agent/AGENT.md` to conform to the declarative agent contract.
- [x] Task 1.3: Update `filesUnder` in `scripts/context-core.mjs` to ignore `.DS_Store` by default.
- [x] Task 1.4: Extend `resolveContext` in `scripts/context-core.mjs` to:
  - Match slash aliases and bracket prefixes for agents (`/architect`, `/data`, `/ux`, `/threat`, `/ba`, `/pm`, `/devops`, etc.).
  - Return the resolved `agent` object in the output payload (`name`, `title`, `path`, `defaultWorkflow`, `handoffs`).
  - Merge the agent's declared `rules` and `skills` into `selectedRules` and `selectedSkills`.
  - Fall back to the agent's `defaultWorkflow` if no higher-priority workflow was explicitly requested.
  - Preserve standard semantic keyword routing for general prompts without assigning an agent persona.
- [x] Task 1.5: Extend `scripts/validate-context.mjs` to enforce:
  - Agent frontmatter contains `name`, `title`, `role`, `description`, `lifecycleStage`, `aliases`, `defaultWorkflow`, `skills`, `workflows`, `rules`, `handoffs`.
  - All declared `rules` exist in `manifest.rules`.
  - All declared `skills` exist in `manifest.skills`.
  - All declared `workflows` exist in `manifest.workflows`.
  - `defaultWorkflow` is listed in `workflows`.
  - Aliases are non-empty arrays of strings, unique across agents, and do not collide with protected skill/workflow triggers (`/adr`, `/sec`, `/security`, `/plan`, `/fix`, `/execution`, `/refactor`, etc.).
  - Handoff targets (`upstream`, `downstream`) reference existing agents.

## Verification & Testing

- `node scripts/context.mjs lint` -> Validates all agent frontmatters and detects stale references.
- `node -e '...'` -> Confirmed deterministic resolution of `ba-agent`, `pm-agent`, `devops-agent` with corresponding rules and default workflows.
- `node scripts/context.mjs eval` -> 13/13 unit and dataset evaluations passed in 41ms.

## Risks & Rollback

- **Risk:** Existing routing hints could be overridden or broken by agent alias matching.
- **Mitigation:** Verified full backward compatibility against all 13 evaluation test cases.
- **Rollback:** Revert changes to `scripts/context-core.mjs` and agent files via Git.
