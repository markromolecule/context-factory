---
title: Agents
type: moc
tags: [agents, orchestration]
---

# Agents & Subagents

## Entry Points & Orchestrators

- [[orchestrator/SHARED|Shared contract]] — authoritative behavior and load order
- [[AGENTS|Factory entry point]]
- [[orchestrator/AGENTS|Codex/agent adapter]]
- [[orchestrator/CLAUDE|Claude adapter]]
- [[orchestrator/GEMINI|Gemini adapter]]

All adapters intentionally stay thin. Add shared behavior to `SHARED.md`, not to one model adapter.

## Coding Lifecycle Subagents

- [[agents/README|Coding Lifecycle Subagents Registry]] — lifecycle overview and handoff map
- [[agents/architect-agent/AGENT|Architect & ADR Specialist Agent (`architect-agent`)]] — Analyzes system boundaries, module dependencies, SOLID conformance, and architectural trade-offs, and authors Architectural Decision Records (ADRs).
- [[agents/ba-agent/AGENT|Business Analyst Agent (`ba-agent`)]] — Clarifies business requirements, conducts discovery interviews, formulates user stories and measurable acceptance criteria, manages domain glossaries, and stress-tests feature concepts before planning or coding.
- [[agents/data-agent/AGENT|Data Modeler & Database Architect Agent (`data-agent`)]] — Designs relational and document schemas, manages database migrations, authors rollback scripts, ensures query performance (ESR), and governs the data access layer.
- [[agents/devops-agent/AGENT|DevOps & Infrastructure Agent (`devops-agent`)]] — Manages CI/CD automation pipelines, containerization (Docker, Compose), environment configuration hygiene, deployment workflows, release verification, and security guardrails.
- [[agents/pm-agent/AGENT|Project Manager Agent (`pm-agent`)]] — Converts approved business requirements into phased implementation plans, dependency-ordered tasks, milestone schedules, risk ledgers, and execution progress tracking.
- [[agents/threat-agent/AGENT|Security & Threat Modeling Specialist Agent (`threat-agent`)]] — Conducts STRIDE threat modeling, audits trust boundaries, validates authentication/authorization policies, ensures secrets hygiene, and enforces security verification gates.
- [[agents/ux-agent/AGENT|UX & Design System Specialist Agent (`ux-agent`)]] — Designs intuitive user flows, accessible UI components (WCAG AA), responsive layouts, design token systems, stateful interaction feedback, and robust custom hooks.
- [[agents/templates/AGENT_TEMPLATE|Agent Template]] — template for creating new scalable subagents
- [[docs/guide/subagents-lifecycle|Subagents Lifecycle Guide]] — practical user guide for day-to-day coding sessions
