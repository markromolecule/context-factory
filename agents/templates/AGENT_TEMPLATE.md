---
name: agent-template
title: Agent Specification Template
role: Role Title (e.g. Quality Assurance Engineer)
description: Concise description of the agent's core responsibility, scope, and key deliverables.
lifecycleStage: Lifecycle Phase (e.g. Discovery, Planning, Architecture, Data, UX, Implementation, Threat, Deployment)
aliases: ["/template", "[TEMPLATE]"]
defaultWorkflow: feature-delivery
skills: [skill-name-1, skill-name-2]
workflows: [workflow-name-1, workflow-name-2]
rules:
  - rules/global/architecture-conformance.md
  - rules/global/evidence-and-claims.md
  - rules/global/security-guardrails.md
handoffs:
  upstream: [ba-agent]
  downstream: [pm-agent]
---

# {{agent_title}} (`{{agent_name}}`)

## Role Overview

Describe the agent's persona, primary objective, and area of ownership across the development lifecycle.

- **Lifecycle Stage:** {{lifecycleStage}}
- **Primary Focus:** {{primary_focus}}
- **Key Deliverables:** {{key_deliverables}}

---

## When to Invoke

List the specific triggers, scenarios, and user intents where this agent should be activated:

- [ ] Trigger Scenario 1 (e.g., User asks to clarify requirements before coding)
- [ ] Trigger Scenario 2 (e.g., Ambiguous user story needing acceptance criteria)
- [ ] Trigger Scenario 3 (e.g., Domain term alignment)

---

## Input & Output Contracts

### Inputs
- **Required Context:** What files, documents, or user inputs the agent needs to start.
- **Upstream Artifacts:** Artifacts produced by preceding agents (e.g., PRD, Task Plan, Migration Script).

### Outputs & Deliverables
- **Generated Artifacts:** Paths and templates used for output (e.g., `docs/tasks/...`, `docs/decisions/...`).
- **Downstream Consumers:** Which agent or workflow consumes these deliverables next.

---

## Linked Skills & Workflows

| Type | Name | Purpose |
| :--- | :--- | :--- |
| **Skill** | `{{skill-1}}` | Description of how this skill is utilized by the agent |
| **Skill** | `{{skill-2}}` | Description of how this skill is utilized by the agent |
| **Workflow** | `{{workflow-1}}` | Lifecycle workflow coordinated by this agent |

---

## Step-by-Step Operating Procedure

1. **Context Ingestion:** Inspect active files, workspace rules, and upstream artifacts.
2. **Execution Steps:** Perform the role-specific actions incrementally.
3. **Quality Verification:** Validate output against required schemas, constraints, and contracts.
4. **Handoff:** Formulate explicit summary and handoff to the next lifecycle agent or user review.

---

## Applicable Rules & Safety Guardrails

- `rules/global/architecture-conformance.md`
- `rules/global/evidence-and-claims.md`
- `rules/global/security-guardrails.md`

---

## Subagent Invocation Prompt

Provide a standardized snippet to invoke this subagent in IDEs and CLI tools:

```markdown
You are acting as the {{agent_title}} for this project.
Your responsibility: {{description}}
Follow the operating procedure in `agents/{{agent_name}}/AGENT.md`.
```
