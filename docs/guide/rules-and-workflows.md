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

   | Request Matches Regex | Selected Workflow |
   |---|---|
   | `defect`, `bug`, `broken`, `regression`, `fix` | `defect-resolution` |
   | `architecture`, `cross-module`, `dependency direction`, `system boundary` | `architecture-change` |
   | `webhook`, `credential`, `secret`, `authorization`, `security`, `replay` | `security-sensitive-change` |
   | `database migration`, `schema migration`, `backfill` | `database-migration` |
   | `dependency`, `package`, `library`, `upgrade`, `update` | `dependency-upgrade` |
   | `frontend`, `interface`, `dialog`, `form`, `ux`, `redesign` | `feature-delivery` |
   | `release`, `readiness`, `production handoff` | `release-readiness` |
   | `context factory`, `rule`, `skill`, `workflow`, `manifest`, `sync` | `context-maintenance` |

2. **Relevance Scoring (Fallback):**
   If no routing hint matches, the context harness scores terms against the name, description, and scope of each workflow file. The highest-scoring workflow with a score of **4 or higher** is selected.

---

### Workflow Inventory

#### Delivery Workflows
* **`feature-delivery`:** The default workflow for building new system capabilities, feature work, or pre-planned templates.
* **`defect-resolution`:** Focuses on reproducing, diagnosing, fixing, and verifying software defects using fresh evidence.
* **`architecture-change`:** Coordinates changes to system boundaries, module contracts, or shared libraries.
* **`release-readiness`:** Conducts a final review of code health, test coverage, and documentation before pushing to production.

#### Risk-Specific Workflows
* **`security-sensitive-change`:** Threat-models and gates modifications affecting authentication, credentials, data privacy, or sensitive boundary conditions.
* **`database-migration`:** Handles schema evolution, indexing, data backfills, and rollback recovery.
* **`dependency-upgrade`:** Evaluates compatibility and checks for breaking API changes when updating external packages.

#### Factory Maintenance
* **`context-maintenance`:** The internal workflow used to add, edit, or remove context-factory rules, skills, workflows, or lock files without creating drift.

---

## Rules

**Rules** represent strict, enforceable engineering constraints. They ensure code quality, security practices, and consistent architecture.

### How Rules Trigger
Rules are loaded into context in two ways:

1. **Always-Apply Rules (Global):**
   When a request contains an action term, the harness automatically loads all global rules that have `alwaysApply: true` defined in their YAML frontmatter. These are:
   - `rules/global/code-quality.md`
   - `rules/global/architecture-conformance.md`
   - `rules/global/naming-conventions.md`
   - `rules/global/evidence-and-claims.md`
   - `rules/global/security-guardrails.md`

2. **Contextual Rules (Backend/Frontend):**
   If a rule does not have `alwaysApply: true`, it is scored against the request terms. If the score is **4 or higher**, it is loaded.
   - *Example:* If your prompt mentions "React hooks" or "CSS", the resolver automatically pulls in frontend rules (e.g., `query-hooks`, `mutation-hooks`, `frontend`). If it mentions "Prisma" or "Hono", it pulls in backend rules (e.g., `schema-db`, `service-layer`).

---

### Rule Inventory

* **Global:** Core rules that apply to every change (naming conventions, commit formatting, evidence standards, and code quality).
* **Backend:** Standards for Prisma/Kysely schemas, DB queries, controllers, route handlers, service layers, and data-layer unit tests.
* **Frontend:** Standards for React components, Next.js routing, form validation, Zustand stores, state updates, loading states, and custom styling.
