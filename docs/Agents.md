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
- [[agents/ba-agent/AGENT|BA Agent (`ba-agent`)]] — discovery, requirement grilling, scenario matrices, and acceptance criteria
- [[agents/pm-agent/AGENT|PM Agent (`pm-agent`)]] — task breakdowns, phase planning, milestone tracking, and blocker management
- [[agents/devops-agent/AGENT|DevOps Agent (`devops-agent`)]] — CI/CD pipelines, containerization, environment hygiene, and release readiness
- [[agents/templates/AGENT_TEMPLATE|Agent Template]] — template for creating new scalable subagents
- [[docs/guide/subagents-lifecycle|Subagents Lifecycle Guide]] — practical user guide for day-to-day coding sessions
