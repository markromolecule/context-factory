---
title: "Declarative Lifecycle Specialist Agents and Harness Resolution Architecture"
type: decision
status: accepted
created: "2026-08-25"
tags: [adr, agents, subagents, lifecycle, architect, data, ux, threat, harness]
---

# Declarative Lifecycle Specialist Agents and Harness Resolution Architecture

## Context

As the Context Factory architecture evolved to support end-to-end software engineering lifecycles:
1. Complex domain specialties—such as architectural trade-off analysis, relational and document database modeling, accessible UX/frontend design systems, and STRIDE threat modeling—required explicit persona contracts and domain rule composition.
2. The initial three subagents (`ba-agent`, `pm-agent`, `devops-agent`) lacked declarative YAML frontmatter fields specifying their aliases, default workflows, declared domain rules, declared skills, and upstream/downstream handoffs.
3. The deterministic harness resolver (`scripts/context-core.mjs`) needed the capability to detect agent slash commands and bracket prefixes (e.g. `/architect`, `/data`, `/ux`, `/threat`), automatically compose all declared rules and skills for that persona, and assign the appropriate default workflow without colliding with existing semantic commands (`/adr`, `/sec`, `/plan`, `/fix`, `/exec`, `/refactor`).
4. General natural language requests without agent aliases needed to continue resolving standard semantic workflows and rules without forcing an unwanted agent persona.

## Options Considered

1. **Option 1 (Ad-hoc agent prompts without declarative metadata):** Rely on developers manually crafting system prompts for each session without machine-readable agent schemas or harness integration.  
   *Rejected:* Error-prone, lacks deterministic rule composition, and creates context drift across different IDE environments.
2. **Option 2 (Single Monolithic Agent):** Consolidate all domain expertise into one mega-agent that attempts to perform discovery, architecture, database design, UX, security, and DevOps simultaneously.  
   *Rejected:* Violates the Single Responsibility Principle, causes token bloat, leads to hallucinations, and fails to enforce stage gates.
3. **Option 3 (Declarative 7-Agent Lifecycle Ecosystem with Deterministic Harness Resolution - Selected):**
   - Formalize a declarative YAML frontmatter schema (`name`, `title`, `role`, `description`, `lifecycleStage`, `aliases`, `defaultWorkflow`, `skills`, `workflows`, `rules`, `handoffs`).
   - Upgrade existing agents (`ba-agent`, `pm-agent`, `devops-agent`) to the declarative schema.
   - Author 4 new specialist agents:
     - `agents/architect-agent/` (`/architect`, `[ARCHITECT]`) for system boundaries, SOLID principles, and ADR authoring.
     - `agents/data-agent/` (`/data`, `[DATA]`) for schemas, ESR compound indexing, migrations, rollback runbooks, and repository isolation.
     - `agents/ux-agent/` (`/ux`, `[UX]`) for WCAG 2.1 AA accessible UI components, design tokens, interaction feedback, and custom hooks.
     - `agents/threat-agent/` (`/threat`, `[THREAT]`) for STRIDE threat modeling, trust boundaries, secrets hygiene, and adversarial security tests.
   - Enhance the harness resolver (`scripts/context-core.mjs`) to resolve agent aliases, inject declared rules and skills, and provide structured agent metadata.
   - Extend `scripts/validate-context.mjs` to enforce agent schema completeness, alias uniqueness, and handoff validity.

## Decision

Adopt **Option 3**. The Context Factory ecosystem now features 7 first-class declarative lifecycle specialist agents:

| Agent | Aliases | Lifecycle Stage | Default Workflow | Primary Focus |
| :--- | :--- | :--- | :--- | :--- |
| **`ba-agent`** | `/ba`, `[BA]`, `[DISCOVERY]` | Discovery & Scoping | `feature-delivery` | Requirements grilling, user stories, scenario test matrices |
| **`architect-agent`** | `/architect`, `[ARCHITECT]` | Architecture & System Design | `architecture-change` | System boundaries, SOLID compliance, trade-off analysis, ADR authoring |
| **`data-agent`** | `/data`, `[DATA]` | Data Modeling & Persistence | `database-migration` | Schemas, ESR indexing, forward/rollback migrations, repository layer |
| **`pm-agent`** | `/pm`, `[PM]`, `[PLAN]` | Phased Task Planning | `feature-delivery` | Phased implementation plans in `docs/tasks/`, stops before coding |
| **`ux-agent`** | `/ux`, `[UX]` | UX & Frontend Architecture | `feature-delivery` | Accessible UI components (WCAG AA), design tokens, custom hooks |
| **`threat-agent`** | `/threat`, `[THREAT]` | Security & Threat Modeling | `security-sensitive-change` | STRIDE threat modeling, trust boundaries, timing safety, secrets hygiene |
| **`devops-agent`** | `/devops`, `[DEVOPS]` | Infrastructure & Operations | `release-readiness` | CI/CD pipelines, Docker containers, release readiness verification |

### Key Architectural Decisions (Ledger):
- **D-01 (Direct Specialist Aliases):** Each specialist agent is mapped to a concise, ergonomic slash command and bracket prefix (`/architect`, `/data`, `/ux`, `/threat`). Semantic commands (`/adr`, `/sec`, `/plan`, `/fix`, `/exec`, `/refactor`) remain preserved for direct procedural execution.
- **D-02 (Declarative Agent Schema):** Every agent contract (`AGENT.md`) declares `aliases`, `defaultWorkflow`, `rules`, `skills`, `workflows`, and `handoffs` in YAML frontmatter.
- **D-03 (Separation of Workflow Gates vs Agent Personas):** Workflows define deterministic delivery phase gates; agents provide role personas, domain judgment, and automated rule/skill composition.
- **D-04 (Harness Rule & Skill Composition):** When an agent alias is matched, `scripts/context-core.mjs` merges the agent's declared rules and skills into the resolved context payload.
- **D-05 (Fallback to Semantic Matching):** Natural language prompts without an agent alias resolve semantically without injecting an unwanted persona.
- **D-06 (Declarative Handoffs):** Agents declare `upstream` and `downstream` handoffs, enforcing structured multi-agent lifecycle transitions.

## Consequences

- **Positive:** Developers can invoke precise domain specialists (`/architect`, `/data`, `/ux`, `/threat`, `/ba`, `/pm`, `/devops`) with automatic composition of relevant domain rules and skills.
- **Positive:** Standardized subagent directories (`AGENT.md`, `prompts/subagent-invocation.md`, `prompts/system-prompt.md`) ensure seamless portability across Antigravity IDE, Cursor, Claude Code, and Copilot.
- **Positive:** Automated validation in `scripts/validate-context.mjs` prevents broken rule/skill references, alias collisions, or malformed agent schemas.
- **Positive:** Complete backward compatibility with existing workflows, skills, and prompt routing.

## Validation and Review Date

- Validated via `node scripts/context.mjs eval` (13/13 evaluations passing) and resolution tests across all 7 agent aliases.
- Review date: 2026-11-25.
