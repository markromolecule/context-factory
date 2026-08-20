# Context Factory Entry Point & Agent Dispatch Contract

Read `orchestrator/SHARED.md` before changing this factory or using it to guide project work. Treat `context-manifest.json` as the canonical inventory.

## Mandatory Directives (MUST)

- MUST: Read `orchestrator/SHARED.md` and consult `context-manifest.json` as the canonical inventory.
- MUST: Deterministically resolve required context before executing non-trivial requests by running `node scripts/context.mjs resolve "<user request>"` or checking the Trigger Dispatch Matrix below.
- MUST: Inspect and load applicable rules from `rules/` matching the touched files and domain:
  - Global rules: `rules/global/` (`1-3-1-rule.md`, `code-quality.md`, `evidence-and-claims.md`, `security-guardrails.md`, `naming-conventions.md`, `architecture-conformance.md`, `git-commit.md`).
  - Backend rules: `rules/backend/` (`module-architecture.md`, `controllers-and-routes.md`, `service-layer.md`, `schema-db.md`, `data-access-via-db.md`, `data-access-via-api.md`, `testing-data-access-layer.md`).
  - Frontend rules: `rules/frontend/` (`frontend.md`, `next-react-project-structure.md`, `code-organization.md`, `forms-and-validation.md`, `interaction-feedback.md`, `mutation-hooks.md`, `query-hooks.md`, `dialogs-and-overlays.md`, `zustand-store.md`).
  - TypeScript rules: `rules/typescript/` (`type-safety.md`, `runtime-validation.md`, `error-handling.md`, `async-discipline.md`, `module-and-imports.md`).
- MUST: Route multi-stage engineering lifecycles to the appropriate workflow from `workflows/` (`feature-delivery.md`, `defect-resolution.md`, `database-migration.md`, `security-sensitive-change.md`, `architecture-change.md`, `context-maintenance.md`, `dependency-upgrade.md`, `release-readiness.md`).
- MUST: Activate and read the matching skill under `skills/<skill_name>/SKILL.md` whenever user request mentions or matches skill trigger concepts.
- MUST: Activate `skills/grill-with-docs/SKILL.md` before planning when working on a new system, product, or materially ambiguous feature.
- MUST: Activate `skills/implementation-plan/SKILL.md` for task breakdowns, plans, and design proposals; output to `docs/tasks/` using `docs/templates/Task.md` & `Phase.md`. **Stop before coding.**
- MUST: Activate `skills/execution-plan/SKILL.md` when executing approved phase tasks, working incrementally with verification.
- MUST: Follow vertical backend module boundaries and prevent layer leaking (`rules/backend/module-architecture.md`).
- MUST: Avoid generic LLM frontend styling by adhering to `rules/frontend/frontend.md` and prototyping with `skills/playground/SKILL.md`.
- MUST: Ground claims using canonical knowledge under `knowledge/` (`skills/knowledge-grounding/SKILL.md`).
- MUST: Verify claims with fresh, reproducible test evidence before reporting completion (`rules/global/evidence-and-claims.md`, `skills/verification-review/SKILL.md`).
- MUST: Run `node scripts/context.mjs lock` and `node scripts/context.mjs doctor` after modifying context rules, skills, workflows, or templates.

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
| `tsc`, `compiler error`, `type error`, `circular types` | [`skills/typescript-diagnostics/SKILL.md`](skills/typescript-diagnostics/SKILL.md) | Diagnose and resolve compiler errors and type failures. |
| `verification`, `verify`, `test review`, `qa check` | [`skills/verification-review/SKILL.md`](skills/verification-review/SKILL.md) | Validate acceptance criteria against verified evidence. |
| `zod`, `schema validation`, `runtime validation`, `dto parsing` | [`skills/zod-schema-modeling/SKILL.md`](skills/zod-schema-modeling/SKILL.md) | Model runtime schemas, DTOs, and boundary validation contracts. |
| `knowledge`, `wiki`, `glossary`, `grounding` | [`skills/knowledge-grounding/SKILL.md`](skills/knowledge-grounding/SKILL.md) | Query canonical knowledge items before making claims. |
| `explore codebase`, `repo discovery`, `map dependencies` | [`skills/repository-discovery/SKILL.md`](skills/repository-discovery/SKILL.md) | Inspect and document existing architecture and patterns. |
| `playground`, `styling`, `frontend component demo` | [`skills/playground/SKILL.md`](skills/playground/SKILL.md) | Build isolated UI prototypes avoiding generic LLM styling. |

## Session Slash Commands & Prefix Triggers
When the user's prompt begins with a slash command or bracket prefix, prioritize the matching workflow and subagent:

| Command / Prefix | Target Workflow | Active Skill / Subagent | Key Mandatory Action |
| :--- | :--- | :--- | :--- |
| `/grill`, `[DISCOVERY]` | [`workflows/feature-delivery.md`](workflows/feature-delivery.md) | [`agents/ba-agent`](agents/ba-agent/AGENT.md) + [`skills/grill-with-docs`](skills/grill-with-docs/SKILL.md) | Pre-planning interview: clarify 1 unknown at a time before planning |
| `/plan`, `[PLAN]`, `[FEATURE]` | [`workflows/feature-delivery.md`](workflows/feature-delivery.md) | [`agents/pm-agent`](agents/pm-agent/AGENT.md) + [`skills/implementation-plan`](skills/implementation-plan/SKILL.md) | Output to `docs/tasks/` via `task:new`. **Stop before coding.** |
| `/exec`, `[EXEC]` | [`workflows/feature-delivery.md`](workflows/feature-delivery.md) | [`skills/execution-plan`](skills/execution-plan/SKILL.md) | Execute approved task phases incrementally with verification. |
| `/fix`, `[HOTFIX]`, `[BUG]` | [`workflows/defect-resolution.md`](workflows/defect-resolution.md) | [`workflows/defect-resolution.md`](workflows/defect-resolution.md) | Capture reproduction test before modifying code. |
| `/migrate`, `[MIGRATE]`, `[DB]` | [`workflows/database-migration.md`](workflows/database-migration.md) | Database domain rules | Plan forward migration, rollback script, and consumer types. |
| `/sec`, `[SEC]`, `[SECURITY]` | [`workflows/security-sensitive-change.md`](workflows/security-sensitive-change.md) | [`skills/security-review`](skills/security-review/SKILL.md) | Review auth, credentials, data isolation, and abuse cases. |
| `/arch`, `/adr`, `[ADR]` | [`workflows/architecture-change.md`](workflows/architecture-change.md) | [`skills/architecture-decision`](skills/architecture-decision/SKILL.md) | Output to `docs/decisions/` using `Decision.md`. |
| `/deps`, `/upgrade`, `[UPGRADE]` | [`workflows/dependency-upgrade.md`](workflows/dependency-upgrade.md) | Dependency rules | Audit compatibility boundaries and run canary tests. |
| `/release`, `/verify`, `[RELEASE]` | [`workflows/release-readiness.md`](workflows/release-readiness.md) | [`agents/devops-agent`](agents/devops-agent/AGENT.md) + [`skills/verification-review`](skills/verification-review/SKILL.md) | Verify tests, lint, typecheck, and readiness evidence. |
| `/context`, `[CONTEXT]` | [`workflows/context-maintenance.md`](workflows/context-maintenance.md) | Context Maintenance | Run `node scripts/harness-cli.mjs lock` and `doctor`. |

## Workflow Routing
For multi-stage engineering lifecycles, load the appropriate workflow from `workflows/`:
- **New Feature Delivery:** `workflows/feature-delivery.md`
- **Bug & Defect Fixes:** `workflows/defect-resolution.md`
- **Database & Schema Changes:** `workflows/database-migration.md`
- **Security Changes:** `workflows/security-sensitive-change.md`
- **Architecture Refactoring:** `workflows/architecture-change.md`
- **Context Maintenance:** `workflows/context-maintenance.md`
- **Dependency Upgrades:** `workflows/dependency-upgrade.md`
- **Release Readiness:** `workflows/release-readiness.md`

## Coding Lifecycle Subagents
When addressing lifecycle-specific phases, adopt or delegate to the corresponding subagent from `agents/`:
- **Business Analyst (`agents/ba-agent/AGENT.md`):** Use for requirements discovery, user stories, domain terms, and scenario matrices.
- **Project Manager (`agents/pm-agent/AGENT.md`):** Use for phased task plans, milestone tracking, and blocker resolution.
- **DevOps Specialist (`agents/devops-agent/AGENT.md`):** Use for CI/CD pipelines (`.github/workflows/`), Docker containerization, environment hygiene (`.env.example`), and release readiness.

## Context Maintenance
After making changes to factory rules, skills, workflows, or templates:
1. Run `node scripts/context.mjs lock`
2. Run `node scripts/context.mjs doctor`

