# Context Factory Entry Point & Agent Dispatch Contract

Read `orchestrator/SHARED.md` before changing this factory or using it to guide project work. Treat `context-manifest.json` as the canonical inventory.

## Mandatory Directives (MUST)

- MUST: Read `orchestrator/SHARED.md` and consult `context-manifest.json` as the canonical inventory.
- MUST: Deterministically resolve required context before executing non-trivial requests by running `node scripts/context.mjs resolve "<user request>"` or checking the Trigger Dispatch Matrix below.
- MUST: Inspect and load applicable rules from `rules/` matching the touched files and domain:
  - Global rules: `rules/global/` (`1-3-1-rule.md`, `code-quality.md`, `evidence-and-claims.md`, `security-guardrails.md`, `naming-conventions.md`, `architecture-conformance.md`, `git-commit.md`).
  - TypeScript rules: `rules/typescript/common/` (`type-safety.md`, `runtime-validation.md`, `error-handling.md`, `async-discipline.md`, `module-and-imports.md`, `next-react-project-structure.md`).
  - Database rules: `rules/typescript/database/` (`schema-db.md`, `data-access-via-db.md`, `query-optimization-and-pagination.md`, `testing-data-access-layer.md`).
  - Backend rules: `rules/typescript/backend/` (`module-architecture.md`, `controllers-and-routes.md`, `service-layer.md`, `data-access-via-api.md`).
  - Hooks rules: `rules/typescript/hooks/` (`custom-hooks.md`, `query-hooks.md`, `mutation-hooks.md`, `zustand-store.md`).
  - UI rules: `rules/typescript/ui/` (`frontend.md`, `code-organization.md`, `forms-and-validation.md`, `dialogs-and-overlays.md`, `interaction-feedback.md`).
- MUST: Route multi-stage engineering lifecycles to the appropriate workflow from `workflows/` (`feature-delivery.md`, `defect-resolution.md`, `database-migration.md`, `security-sensitive-change.md`, `architecture-change.md`, `context-maintenance.md`, `dependency-upgrade.md`, `release-readiness.md`).
- MUST: Activate and read the matching skill under `skills/<skill_name>/SKILL.md` whenever user request mentions or matches skill trigger concepts.
- MUST: Activate `skills/grill/SKILL.md` before planning when working on a new system, product, or materially ambiguous feature.
- MUST: Activate `skills/plan/SKILL.md` for task breakdowns, plans, and design proposals; output to `docs/tasks/` using `docs/templates/Task.md` & `Phase.md`. **Stop before coding.**
- MUST: Activate `skills/execute/SKILL.md` when executing approved phase tasks, working strictly one phase at a time with developer review stops.
- MUST: Follow vertical backend module boundaries and prevent layer leaking (`rules/typescript/backend/module-architecture.md`).
- MUST: Ground claims using canonical knowledge under `knowledge/` (`skills/grounding/SKILL.md`).
- MUST: Verify claims with fresh, reproducible test evidence before reporting completion (`rules/global/evidence-and-claims.md`, `skills/verify/SKILL.md`).
- MUST: Run `node scripts/context.mjs lock` and `node scripts/context.mjs doctor` after modifying context rules, skills, workflows, or templates.

## Trigger & Skill Dispatch Matrix
When any user request mentions or matches these concepts, immediately activate and follow the corresponding skill:

| Trigger Keywords / Concepts | Active Skill | Mandatory Template / Action |
| :--- | :--- | :--- |
| `context specification`, `context spec`, `author context`, `create context`, `write context` | [`skills/context/SKILL.md`](skills/context/SKILL.md) | Output to `docs/context/` using `docs/templates/Context.md` with embedded grilling. |
| `implementation plan`, `plan`, `breakdown`, `task breakdown`, `design proposal` | [`skills/plan/SKILL.md`](skills/plan/SKILL.md) | Output to `docs/tasks/` using `docs/templates/Task.md` & `Phase.md`. **Stop before coding.** |
| `execute plan`, `run task`, `phase execution`, `implement phase` | [`skills/execute/SKILL.md`](skills/execute/SKILL.md) | Execute approved task phases strictly one at a time with developer review stops. |
| `refactor`, `modularize`, `break down file`, `code complexity` | [`skills/refactor/SKILL.md`](skills/refactor/SKILL.md) | Decompose complex code into modular single-responsibility files. |
| `grill`, `grill me`, `discovery`, `interview`, `clarify requirements`, `new system` | [`skills/grill/SKILL.md`](skills/grill/SKILL.md) | Clarify ambiguity and establish discovery records before planning. |
| `architecture decision`, `adr`, `tech stack choice`, `tradeoff` | [`skills/adr/SKILL.md`](skills/adr/SKILL.md) | Output to `docs/decisions/` using `docs/templates/Decision.md`. |
| `security review`, `auth audit`, `vulnerability`, `guardrails` | [`skills/security/SKILL.md`](skills/security/SKILL.md) | Review authentication, authorization, and data isolation. |
| `verification`, `verify`, `test review`, `qa check` | [`skills/verify/SKILL.md`](skills/verify/SKILL.md) | Validate acceptance criteria against verified evidence. |
| `knowledge`, `wiki`, `glossary`, `grounding` | [`skills/grounding/SKILL.md`](skills/grounding/SKILL.md) | Query canonical knowledge items before making claims. |
| `explore codebase`, `repo discovery`, `map dependencies` | [`skills/explore/SKILL.md`](skills/explore/SKILL.md) | Inspect and document existing architecture and patterns. |

## Session Slash Commands & Prefix Triggers
When the user's prompt begins with a slash command or bracket prefix, prioritize the matching workflow and subagent:

| Command / Prefix | Target Workflow / Skill | Active Skill / Subagent | Key Mandatory Action |
| :--- | :--- | :--- | :--- |
| `/new-project`, `[NEW_PROJECT]` | [`workflows/new-project-delivery.md`](workflows/new-project-delivery.md) | [`skills/grill`](skills/grill/SKILL.md) + [`skills/plan`](skills/plan/SKILL.md) | Progressive vertical-slice scaffolding with 4-layer testing and loop engineering |
| `/context`, `[CONTEXT]`, `[CONTEXT_SPEC]` | [`workflows/feature-delivery.md`](workflows/feature-delivery.md) | [`agents/ba-agent`](agents/ba-agent/AGENT.md) + [`skills/context`](skills/context/SKILL.md) | Author and grill context specifications in `docs/context/` before planning |
| `/grill`, `[DISCOVERY]` | [`workflows/feature-delivery.md`](workflows/feature-delivery.md) | [`agents/ba-agent`](agents/ba-agent/AGENT.md) + [`skills/grill`](skills/grill/SKILL.md) | Pre-planning interview: clarify 1 unknown at a time before planning |
| `/plan`, `[PLAN]`, `[FEATURE]` | [`workflows/feature-delivery.md`](workflows/feature-delivery.md) | [`agents/pm-agent`](agents/pm-agent/AGENT.md) + [`skills/plan`](skills/plan/SKILL.md) | Output to `docs/tasks/` via `task:new`. **Stop before coding.** |
| `/execute`, `/exec`, `[EXEC]` | [`workflows/feature-delivery.md`](workflows/feature-delivery.md) | [`skills/execute`](skills/execute/SKILL.md) | Execute approved task phases incrementally with strict stops |
| `/optimize`, `/review-code`, `[OPTIMIZE]`, `[CODE_REVIEW]` | [`workflows/code-review-and-optimization.md`](workflows/code-review-and-optimization.md) | [`agents/pm-agent`](agents/pm-agent/AGENT.md) + [`skills/refactor`](skills/refactor/SKILL.md) | Post-implementation review: audit ESR queries, types, and modularity |
| `/refactor`, `[REFACTOR]` | [`skills/refactor/SKILL.md`](skills/refactor/SKILL.md) | [`skills/refactor`](skills/refactor/SKILL.md) | Decompose complex code into modular, single-responsibility files |
| `/fix`, `[HOTFIX]`, `[BUG]` | [`workflows/defect-resolution.md`](workflows/defect-resolution.md) | [`workflows/defect-resolution.md`](workflows/defect-resolution.md) | Capture reproduction test before modifying code. |
| `/migrate`, `[MIGRATE]`, `[DB]` | [`workflows/database-migration.md`](workflows/database-migration.md) | Database domain rules | Plan forward migration, rollback script, and consumer types. |
| `/sec`, `[SEC]`, `[SECURITY]` | [`workflows/security-sensitive-change.md`](workflows/security-sensitive-change.md) | [`skills/security`](skills/security/SKILL.md) | Review auth, credentials, data isolation, and abuse cases. |
| `/arch`, `/adr`, `[ADR]` | [`workflows/architecture-change.md`](workflows/architecture-change.md) | [`skills/adr`](skills/adr/SKILL.md) | Output to `docs/decisions/` using `Decision.md`. |
| `/deps`, `/upgrade`, `[UPGRADE]` | [`workflows/dependency-upgrade.md`](workflows/dependency-upgrade.md) | Dependency rules | Audit compatibility boundaries and run canary tests. |
| `/release`, `/verify`, `[RELEASE]` | [`workflows/release-readiness.md`](workflows/release-readiness.md) | [`agents/devops-agent`](agents/devops-agent/AGENT.md) + [`skills/verify`](skills/verify/SKILL.md) | Verify tests, lint, typecheck, and readiness evidence. |
| `/grounding`, `/wiki`, `[WIKI]` | [`skills/grounding/SKILL.md`](skills/grounding/SKILL.md) | [`skills/grounding`](skills/grounding/SKILL.md) | Query and reconcile canonical LLM Wiki knowledge. |
| `/explore`, `[EXPLORE]` | [`skills/explore/SKILL.md`](skills/explore/SKILL.md) | [`skills/explore`](skills/explore/SKILL.md) | Map code contracts, schemas, tests, and conventions. |
| `/sync`, `/maintain`, `[MAINTENANCE]` | [`workflows/context-maintenance.md`](workflows/context-maintenance.md) | Context Maintenance | Run `node scripts/harness-cli.mjs lock` and `doctor`. |

## Workflow Routing
For multi-stage engineering lifecycles, load the appropriate workflow from `workflows/`:
- **New Project & Greenfield Delivery:** `workflows/new-project-delivery.md`
- **New Feature Delivery:** `workflows/feature-delivery.md`
- **Code Review & Optimization:** `workflows/code-review-and-optimization.md`
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
