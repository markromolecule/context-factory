---
title: Skills
type: moc
tags: [skills, workflows]
---

# Skills

- [[skills/architecture-decision/SKILL|Architecture decision]] — analyze and record durable boundary choices
- [[skills/backend-module/SKILL|Backend module]] — create vertical Hono or Express feature modules
- [[skills/design-pattern/SKILL|Design pattern]] — define visual-system worksheets and produce accessible, responsive interfaces
- [[skills/implementation-plan/SKILL|Implementation plan]] — create evidence-backed plan artifacts without coding
- [[skills/execution-plan/SKILL|Execution plan]] — execute an existing plan and maintain its log
- [[skills/form-dialog/SKILL|Form dialog]] — design and verify accessible data-entry overlays
- [[skills/grill-with-docs/SKILL|Grill with docs]] — stress-test new systems and ambiguous features before implementation planning
- [[skills/knowledge-grounding/SKILL|Knowledge grounding]] — retrieve Wiki knowledge with authority and provenance
- [[skills/repository-discovery/SKILL|Repository discovery]] — map relevant code, contracts, tests, and conventions
- [[skills/security-review/SKILL|Security review]] — threat-model and review application security boundaries
- [[skills/verification-review/SKILL|Verification review]] — audit completion claims against fresh evidence

Skills trigger through their YAML descriptions. Load their references only when directed by the selected skill.

For a new system or materially ambiguous capability, the skill sequence is `grill-with-docs` → `repository-discovery` → `implementation-plan` → approval → `execution-plan`. Repository discovery may run inside the grill to answer evidence-discoverable questions.

The canonical `grill-with-docs` is a reviewed Context Factory adaptation. `npx skills update grill-with-docs --project` updates an installed agent copy, not this canonical source; inspect upstream changes and port compatible behavior through the context-maintenance workflow.
