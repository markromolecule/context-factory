---
title: "Productivity Skills"
type: moc
tags: [skills, productivity, discovery, planning, documentation]
---

# Productivity & Discovery Skills

The **Productivity** group contains procedural skills for pre-planning discovery, grilling requirements, authoring context specifications, generating documentation reports, creating phased task breakdowns, capturing architectural decisions, retrieving attributable LLM Wiki knowledge, and triaging repository anomalies.

---

## Skills Inventory

| Skill | Slash Commands | Purpose & Responsibilities | Companion Resources |
| :--- | :--- | :--- | :--- |
| [[skills/productivity/adr/SKILL|adr]] | `/adr`, `/arch`, `[ADR]` | Analyze and record durable architectural decisions in `docs/decisions/` using the 1-3-1 rule | — |
| [[skills/productivity/context/SKILL|context]] | `/context`, `[CONTEXT]`, `[CONTEXT_SPEC]` | Author, grill, and structure comprehensive context specs under `docs/context/` before planning | `agents/openai.yaml` |
| [[skills/productivity/docs/SKILL|docs]] | `/doc`, `/docs`, `[DOC]`, `[DOCS]`, `/documentation` | Synthesize evidence-backed system reports, mitigation summaries, and post-mortems with tables | `agents/openai.yaml` |
| [[skills/productivity/grill/SKILL|grill]] | `/grill`, `[GRILL]`, `[DISCOVERY]` | Stress-test a new product idea or ambiguous feature 1 question at a time before coding | `agents/openai.yaml`, `references/glossary-format.md` |
| [[skills/productivity/grounding/SKILL|grounding]] | `/grounding`, `/wiki`, `[WIKI]` | Access and query attributable LLM Wiki knowledge under `knowledge/` with authority & provenance | — |
| [[skills/productivity/plan/SKILL|plan]] | `/plan`, `[PLAN]`, `[FEATURE]` | Create phased implementation plans under `docs/tasks/` without changing production code | `agents/openai.yaml` |
| [[skills/productivity/triage/SKILL|triage]] | `/triage`, `[TRIAGE]` | Scan repository activity, CI failures, and anomalies, logging findings to `docs/tasks/INBOX.md` | — |

---

## Group Maintenance & Synchronization Invariant

> [!IMPORTANT]
> **Enforced Contract:**
> - Every skill in `skills/productivity/` must be documented in the table above.
> - `scripts/validate-context.mjs` strictly verifies that all subfolders in `skills/productivity/` containing a `SKILL.md` are linked in this file.
> - Run `node scripts/context.mjs doctor` after adding, renaming, or removing a productivity skill.
