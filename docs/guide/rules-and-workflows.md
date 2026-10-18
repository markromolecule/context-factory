---
title: Rules and Workflows Guide
type: guide
tags: [guide, rules, workflows, documentation]
---

# Rules and Workflows Guide

Rules and Workflows govern the quality, structure, and lifecycle of all changes within the repository. They ensure that modifications align with architectural standards and go through validation before completion.

---

## Workflows

A **workflow** coordinates the lifecycle of a task. It defines the phases, quality gates, required inputs, and stop conditions that guide developers and agents from starting a request to verifying its output.

### How Workflows Trigger
Workflows only trigger if the developer's request contains an action term (e.g., "add", "build", "change", "create", "deliver", "fix", "implement", "migrate", "release", "upgrade").

When an action is detected, the context resolver matches a workflow using:

1. **Routing Hints (High Priority):**
   The harness tests the request against regex hints. If a hint matches, it immediately selects the associated workflow.

   | Request Matches Regex / Trigger | Selected Workflow |
   |---|---|
   | `defect`, `bug`, `broken`, `regression`, `fix`, `hotfix`, `/fix`, `[BUG]` | `defect-resolution` |
   | `architecture`, `cross-module`, `dependency direction`, `system boundary`, `refactor`, `solid`, `/arch`, `/refactor`, `/adr`, `/deps`, `/upgrade` | `architecture-change` |
   | `commit and push`, `commit push release`, `push to remote`, `tag release`, `ship changes`, `release readiness`, `/ship`, `/release`, `/deploy`, `[SHIP]` | `commit-push-release` |
   | `database migration`, `schema migration`, `backfill`, `/migrate`, `/db`, `/schema` | `database-migration` |
   | `feature`, `product capability`, `user story`, `frontend`, `interface`, `dialog`, `form`, `ux`, `webhook`, `credential`, `secret`, `authorization`, `security`, `/plan`, `/feature`, `/grill`, `/context` | `feature-delivery` |
   | `context factory`, `rule`, `skill`, `workflow`, `manifest`, `sync`, `lock`, `maintain`, `/sync`, `/maintain` | `context-maintenance` |

2. **Relevance Scoring (Fallback):**
   If no routing hint matches, the context harness scores terms against the name, description, and scope of each workflow file. The highest-scoring workflow with a score of **4 or higher** is selected.

---

### Workflow Inventory

The 6 canonical first-class workflows reside under `skills/workflows/<slug>/SKILL.md`:

#### 1. Delivery
* **`feature-delivery` (`skills/workflows/feature-delivery`):** The primary lifecycle for delivering product capabilities from scoped outcome through implementation, verification, documentation, and handoff. Incorporates pre-planning, grilling, planning, and execution gates.
* **`defect-resolution` (`skills/workflows/defect-resolution`):** Focuses on reproducing, diagnosing, root-causing, and verifying defects with regression tests before applying the smallest safe fix.
* **`commit-push-release` (`skills/workflows/commit-push-release`):** Manages pre-flight verification, conventional commits, pushing to remote, tagging releases, and deployment readiness handoffs.

#### 2. Architecture & Data Safety
* **`architecture-change` (`skills/workflows/architecture-change`):** Coordinates changes to system boundaries, dependency direction, SOLID compliance, shared contracts, and dependency upgrades via ADRs.
* **`database-migration` (`skills/workflows/database-migration`):** Governs schema evolution, composite indexing, data backfills, contract types, and non-destructive rollbacks.

#### 3. Factory Maintenance
* **`context-maintenance` (`skills/workflows/context-maintenance`):** Evolve Context Factory rules, skills, workflows, orchestration contracts, and context locks without duplication or drift.

---

## Rules

**Rules** represent strict, enforceable engineering constraints for the TypeScript ecosystem. They ensure code quality, security practices, and consistent architecture.

### How Rules Trigger
Rules are loaded into context in two ways:

1. **Always-Apply Rules (Global):**
   When a request contains an action term, the harness automatically loads all global rules that have `alwaysApply: true` defined in their YAML frontmatter. These are:
   - `rules/global/code-quality.md`
   - `rules/global/architecture-conformance.md`
   - `rules/global/naming-conventions.md`
   - `rules/global/evidence-and-claims.md`
   - `rules/global/security-guardrails.md`

2. **Contextual Rules (Backend/Frontend/SOLID):**
   If a rule does not have `alwaysApply: true`, it is scored against the request terms. If the score is **4 or higher**, it is loaded.
   - *Example:* If your prompt mentions "React hooks" or "CSS", the resolver automatically pulls in frontend rules (e.g., `query-hooks`, `mutation-hooks`, `frontend`). If it mentions "Prisma" or "Hono", it pulls in backend rules (e.g., `schema-db`, `service-layer`).

---

### Rule Inventory

* **Global (`rules/global/`):** Core engineering standards that apply to every change (naming conventions, commit formatting, evidence standards, security guardrails, and code quality).
* **SOLID (`rules/solid/`):** The five foundational object-oriented and structural design principles (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion).
* **TypeScript Common (`rules/typescript/common/`):** Universal TypeScript standards (strict typing, error handling, runtime validation via Zod, async discipline, module imports).
* **TypeScript Backend & Database (`rules/typescript/backend/`, `rules/typescript/database/`):** Standards for Prisma/Kysely schemas, ESR query optimization, cursor pagination, vertical domain modules, controllers, route handlers, and service layers.
* **TypeScript UI & Hooks (`rules/typescript/ui/`, `rules/typescript/hooks/`):** Standards for React/Next.js components, accessibility (WCAG 2.1 AA), design systems, dialogs/overlays, forms, custom hooks, and Zustand stores.
