# Gemini & Antigravity Entry Point Contract

Read `orchestrator/SHARED.md` before changing this factory or using it to guide project work. Treat `context-manifest.json` as the canonical inventory.

## Deterministic Context Resolution
Before executing any non-trivial user request, Gemini MUST resolve the exact required skills, rules, and workflows:
- Run: `node scripts/context.mjs resolve "<user request>"`
- Alternatively, consult the Trigger Dispatch Matrix below and load the matching skill/rule files.

## Trigger & Skill Dispatch Matrix
When any user request mentions or matches these concepts, immediately activate and follow the corresponding skill:

| Trigger Keywords / Concepts | Active Skill | Mandatory Template / Action |
| :--- | :--- | :--- |
| `implementation plan`, `plan`, `breakdown`, `task breakdown`, `design proposal` | [`skills/implementation-plan/SKILL.md`](skills/implementation-plan/SKILL.md) | Output to `docs/tasks/` using `docs/templates/Task.md` & `Phase.md`. **Stop before coding.** |
| `execute plan`, `run task`, `phase execution`, `implement phase` | [`skills/execution-plan/SKILL.md`](skills/execution-plan/SKILL.md) | Execute approved task phases incrementally with verification. |
| `grill`, `grill me`, `discovery`, `interview`, `clarify requirements`, `new system` | [`skills/grill-with-docs/SKILL.md`](skills/grill-with-docs/SKILL.md) | Clarify ambiguity and establish discovery records before planning. |
| `architecture decision`, `adr`, `tech stack choice`, `tradeoff` | [`skills/architecture-decision/SKILL.md`](skills/architecture-decision/SKILL.md) | Output to `docs/decisions/` using `docs/templates/Decision.md`. |
| `backend module`, `api endpoint`, `controller`, `service layer` | [`skills/backend-module/SKILL.md`](skills/backend-module/SKILL.md) | Follow vertical module pattern & backend rules. |
| `security review`, `auth audit`, `vulnerability`, `guardrails` | [`skills/security-review/SKILL.md`](skills/security-review/SKILL.md) | Review authentication, authorization, and data isolation. |
| `verification`, `verify`, `test review`, `qa check` | [`skills/verification-review/SKILL.md`](skills/verification-review/SKILL.md) | Validate acceptance criteria against verified evidence. |
| `knowledge`, `wiki`, `glossary`, `grounding` | [`skills/knowledge-grounding/SKILL.md`](skills/knowledge-grounding/SKILL.md) | Query canonical knowledge items before making claims. |
| `explore codebase`, `repo discovery`, `map dependencies` | [`skills/repository-discovery/SKILL.md`](skills/repository-discovery/SKILL.md) | Inspect and document existing architecture and patterns. |
| `playground`, `styling`, `frontend component demo` | [`skills/playground/SKILL.md`](skills/playground/SKILL.md) | Build isolated UI prototypes avoiding generic LLM styling. |

## Workflow Routing
For multi-stage engineering lifecycles, load the appropriate workflow from `workflows/`:
- **New Feature Delivery:** `workflows/feature-delivery.md`
- **Bug & Defect Fixes:** `workflows/defect-resolution.md`
- **Database & Schema Changes:** `workflows/database-migration.md`
- **Security Changes:** `workflows/security-sensitive-change.md`
- **Architecture Refactoring:** `workflows/architecture-change.md`

## Context Maintenance
After making changes to factory rules, skills, workflows, or templates:
1. Run `node scripts/context.mjs lock`
2. Run `node scripts/context.mjs doctor`
