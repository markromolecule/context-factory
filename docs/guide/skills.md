---
title: Skills Guide
type: guide
tags: [guide, skills, documentation, slash-commands]
---

# Skills Guide

Skills in the Context Factory are specialized, step-by-step procedures that guide an AI agent or a developer through complex tasks. They range from planning and code generation to security auditing and architecture recording.

---

## How Skills Trigger

Skills are loaded into an agent's context dynamically using three mechanisms:

1. **Semantic Relevance Scoring (Score >= 6):**
   The context harness processes your request and extracts search terms. It matches these terms against the skill folder name, name, and description. If the relevance score is **6 or higher**, the skill is loaded.
2. **Slash Command & Bracket Prefix Shortcuts:**
   Directly invoke skills and workflows using concise slash commands (e.g. `/grill`, `/plan`, `/execution`, `/adr`, `/sec`, `/verify`, `/tsc`, `/zod`, `/explore`, `/api`, `/query`, `/ui`, `/test`).
3. **Specialized Regex Guards:**
   Some skills have hardcoded checks that must pass to prevent them from being loaded accidentally:
   - `execution` is only loaded if the request specifically mentions execution terms (e.g. "execute plan", "implement approved phase", "resume task", `/execution`, `[EXEC]`).
   - `security` is only loaded if the request contains security-related terms (e.g. "security", "credentials", "authentication", "threat", `/sec`, `[SEC]`).
4. **Workflow Inclusion:**
   If a workflow is triggered, the harness scans the workflow markdown file for skill names enclosed in backticks (e.g., `` `grill` ``). It automatically loads these referenced skills into context.

---

## Skill Inventory and Usage

Here is the list of 16 canonical skills available in the Context Factory, their slash triggers, and practical prompt examples:

### 1. grill (`skills/grill`)
* **Slash Commands:** `/grill`, `[GRILL]`, `[DISCOVERY]`
* **Purpose:** Stress-test a new system, product idea, or materially ambiguous feature before planning. It forces a discovery-only session where goals, scenarios, and domain vocabulary are clarified one question at a time.
* **Example Prompt:**
  > "/grill We want to build a new loyalty points system. Let's pre-plan and stress-test the idea before we write any code."

### 2. plan (`skills/plan`)
* **Slash Commands:** `/plan`, `[PLAN]`, `[FEATURE]`
* **Purpose:** Ingests user context or context `.md` files end-to-end and creates an evidence-backed, phased technical plan organized under `docs/tasks/YYYY/MM/YYYY-MM-DD/<id>-<type>-<feature>/` with a master plan and dedicated phase breakdown files. No production code is changed while this is active.
* **Example Prompt:**
  > "/plan Analyze docs/context/billing/stripe.md and create an end-to-end implementation plan breakdown."

### 3. execution (`skills/execution`)
* **Slash Commands:** `/execution`, `/exec`, `[EXEC]`
* **Purpose:** Execute a previously approved implementation plan and its phase breakdown files step-by-step, keeping task/phase checklists and verification evidence updated.
* **Example Prompt:**
  > "/execution Execute Phase 1 for the Stripe integration task under docs/tasks/2026/08/2026-08-15/001-feature-stripe-integration/."

### 4. adr (`skills/adr`)
* **Slash Commands:** `/adr`, `/arch`, `[ADR]`
* **Purpose:** Guides the analysis and creation of a durable Architecture Decision Record (ADR) under `docs/decisions/` using the 1-3-1 decision rule.
* **Example Prompt:**
  > "/adr Record an architecture decision regarding our move to PostgreSQL instead of MySQL."

### 5. verify (`skills/verify`)
* **Slash Commands:** `/verify`, `/release`, `[RELEASE]`, `[QA]`
* **Purpose:** Audits completed work against fresh evidence (running tests, verifying files, build checks) before declaring a task finished.
* **Example Prompt:**
  > "/verify Audit the checkout bug fix and confirm all tests pass."

### 6. security (`skills/security`)
* **Slash Commands:** `/sec`, `/security`, `[SEC]`, `[SECURITY]`
* **Purpose:** Performs a threat-modeling exercise and audits application security boundaries (credentials, auth/authz, signatures, etc.).
* **Example Prompt:**
  > "/sec Review webhook signature verification and rate-limiting controls."

### 7. typescript (`skills/typescript`)
* **Slash Commands:** `/tsc`, `/typescript`, `[TSC]`
* **Purpose:** Diagnoses and resolves TypeScript compiler errors, circular types, build failures, and strictness violations without resorting to `any` or `ts-ignore`.
* **Example Prompt:**
  > "/tsc Fix type errors across the checkout module."

### 8. zod (`skills/zod`)
* **Slash Commands:** `/zod`, `[ZOD]`
* **Purpose:** Designs runtime validation schemas, DTOs, branded types, and boundary transformations using Zod.
* **Example Prompt:**
  > "/zod Define request and response schemas for user onboarding."

### 9. explore (`skills/explore`)
* **Slash Commands:** `/explore`, `[EXPLORE]`
* **Purpose:** Maps out code, contracts, database schemas, test suites, and project conventions of a target codebase.
* **Example Prompt:**
  > "/explore Map the current database models and trace where users are queried."

### 10. backend-module (`skills/backend-module`)
* **Slash Commands:** `/backend`, `/backend-module`, `[BACKEND]`
* **Purpose:** Standardizes the creation of vertical backend features using Express or Hono across `routes → controllers → services → data`.
* **Example Prompt:**
  > "/backend Add a customer profile vertical feature module."

### 11. api-contract (`skills/api-contract`)
* **Slash Commands:** `/api-contract`, `/api`, `[API]`
* **Purpose:** Designs type-safe OpenAPI/Scalar API specifications, endpoint DTO schemas, and client SDK contracts.
* **Example Prompt:**
  > "/api Generate Scalar API documentation and typed fetch hooks for the billing endpoints."

### 12. database-query (`skills/database-query`)
* **Slash Commands:** `/database-query`, `/query`, `[QUERY]`
* **Purpose:** Optimizes database queries, indexes, Kysely/Prisma construction, and keyset cursor pagination.
* **Example Prompt:**
  > "/query Optimize the transaction feed query and implement keyset pagination."

### 13. component-craft (`skills/component-craft`)
* **Slash Commands:** `/component-craft`, `/component`, `/ui`, `[UI]`
* **Purpose:** Authors accessible, responsive, high-taste React and Next.js UI components with robust state handling and zero layout shifts.
* **Example Prompt:**
  > "/component Build an accessible multi-step checkout stepper component."

### 14. test-suite (`skills/test-suite`)
* **Slash Commands:** `/test-suite`, `/test`, `[TEST]`
* **Purpose:** Synthesizes 4-layer backend test suites (`*.data.test.ts`, `*.service.test.ts`, `*.controller.test.ts`, `*.routes.test.ts`) and React hook smoke tests.
* **Example Prompt:**
  > "/test Scaffold 4-layer tests for the authentication module."

### 15. knowledge-grounding (`skills/knowledge-grounding`)
* **Slash Commands:** `/wiki`, `/grounding`, `[WIKI]`
* **Purpose:** Access and query the LLM Wiki (attributable project knowledge under `knowledge/`) with authority and provenance.
* **Example Prompt:**
  > "/wiki Retrieve the deployment credentials runbook."

### 16. playground (`skills/playground`)
* **Slash Commands:** `/playground`, `[PLAYGROUND]`
* **Purpose:** Guidelines for styling visual playgrounds and frontends with premium HSL-tailored colors, smooth animations, and high taste levels, avoiding generic layouts.
* **Example Prompt:**
  > "/playground Design a dark-mode interactive calendar widget on the playground."
