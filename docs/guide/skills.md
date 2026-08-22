---
title: Skills Guide
type: guide
tags: [guide, skills, documentation, slash-commands]
---

# Skills Guide

Skills in the Context Factory are specialized, step-by-step procedures and interactive playbooks that guide an AI agent or a developer through complex development actions.

---

## Skills vs. Rules: The Architectural Separation

A core principle of Context Factory is the strict separation between **Rules** and **Skills**:

- **Rules (`rules/**/*.md`):** Declarative coding standards, architectural invariants, and security boundaries that must *always* or *conditionally* be obeyed when authoring code (e.g. TypeScript type safety, Zod runtime validation, ESR database indexing, vertical backend modules, and UI design systems).
- **Skills (`skills/*/SKILL.md`):** Procedural, interactive workflows and specialized toolkits that an agent *executes* when triggered by slash commands or during a workflow phase.

---

## How Skills Trigger

Skills are loaded into an agent's context dynamically using three mechanisms:

1. **Semantic Relevance Scoring (Score >= 6):**
   The context harness processes your request and extracts search terms. It matches these terms against the skill folder name, name, and description. If the relevance score is **6 or higher**, the skill is loaded.
2. **Slash Command & Bracket Prefix Shortcuts:**
   Directly invoke skills using concise slash commands (e.g. `/grill`, `/plan`, `/execution`, `/adr`, `/sec`, `/verify`, `/explore`, `/grounding`).
3. **Specialized Regex Guards:**
   - `execute` is only loaded if the request specifically mentions execution terms (e.g. "execute plan", "implement approved phase", "resume task", `/execute`, `/execution`, `[EXEC]`).
   - `refactor` is loaded when refactoring, modularizing, or splitting complex code files (`/refactor`, `[REFACTOR]`).
   - `security` is only loaded if the request contains security-related terms (e.g. "security", "credentials", "authentication", "threat", `/sec`, `[SEC]`).
4. **Workflow Inclusion:**
   If a workflow is triggered, the harness scans the workflow markdown file for skill names enclosed in backticks (e.g., `` `grill` ``). It automatically loads these referenced skills into context.

---

## Canonical 10-Skill Inventory

The Context Factory provides exactly 10 procedural skills:

### 1. context (`skills/context`)
* **Slash Commands:** `/context`, `[CONTEXT]`, `[CONTEXT_SPEC]`
* **Purpose:** Authors, grills, and structures comprehensive context specification documents under `docs/context/` using `docs/templates/Context.md`. Embeds the `grill` discovery technique to resolve goals, actors, edge cases, failure modes, and technical constraints one question at a time before synchronizing with `/plan`.
* **Example Prompt:**
  > "/context Author a comprehensive context specification for Stripe subscription checkout under docs/context/billing/stripe-subscription-checkout.md. Grill the requirements and edge cases first."

### 2. grill (`skills/grill`)
* **Slash Commands:** `/grill`, `[GRILL]`, `[DISCOVERY]`
* **Purpose:** Stress-test a new system, product idea, or materially ambiguous feature before planning. It forces a discovery-only session where goals, scenarios, and domain vocabulary are clarified one question at a time.
* **Example Prompt:**
  > "/grill We want to build a new loyalty points system. Let's pre-plan and stress-test the idea before we write any code."

### 3. plan (`skills/plan`)
* **Slash Commands:** `/plan`, `[PLAN]`, `[FEATURE]`
* **Purpose:** Ingests user context or context `.md` files end-to-end and creates an evidence-backed, phased technical plan organized under `docs/tasks/YYYY/MM/YYYY-MM-DD/<id>-<type>-<feature>/` with a master plan and dedicated phase breakdown files. No production code is changed while this is active.
* **Example Prompt:**
  > "/plan Analyze docs/context/billing/stripe.md and create an end-to-end implementation plan breakdown."

### 4. execute (`skills/execute`)
* **Slash Commands:** `/execute`, `/exec`, `[EXEC]`
* **Purpose:** Executes an approved implementation plan strictly one phase at a time, keeping task checklists and verification evidence updated. Mandates strict phase stops at every boundary so developers can inspect changes before authorizing the next phase.
* **Example Prompt:**
  > "/execute Phase 1 for the Stripe integration task under docs/tasks/2026/08/2026-08-15/001-feature-stripe-integration/."

### 5. refactor (`skills/refactor`)
* **Slash Commands:** `/refactor`, `[REFACTOR]`
* **Purpose:** Decomposes complex, lengthy (>200 lines) or multi-responsibility code files into modular, maintainable, single-responsibility files (sub-components, custom hooks, domain services) while preserving public contracts and verified behavioral equivalence.
* **Example Prompt:**
  > "/refactor src/services/billing.service.ts to split payment processing from invoice generation."

### 6. adr (`skills/adr`)
* **Slash Commands:** `/adr`, `/arch`, `[ADR]`
* **Purpose:** Guides the analysis and creation of a durable Architecture Decision Record (ADR) under `docs/decisions/` using the 1-3-1 decision rule.
* **Example Prompt:**
  > "/adr Record an architecture decision regarding our move to PostgreSQL instead of MySQL."

### 7. verify (`skills/verify`)
* **Slash Commands:** `/verify`, `/release`, `[RELEASE]`, `[QA]`
* **Purpose:** Audits completed work against fresh evidence (running tests, verifying files, build checks) before declaring a task finished.
* **Example Prompt:**
  > "/verify Audit the checkout bug fix and confirm all tests pass."

### 8. security (`skills/security`)
* **Slash Commands:** `/sec`, `/security`, `[SEC]`, `[SECURITY]`
* **Purpose:** Performs a threat-modeling exercise and audits application security boundaries (credentials, auth/authz, signatures, etc.).
* **Example Prompt:**
  > "/sec Review webhook signature verification and rate-limiting controls."

### 9. explore (`skills/explore`)
* **Slash Commands:** `/explore`, `[EXPLORE]`
* **Purpose:** Maps out code, contracts, database schemas, test suites, and project conventions of a target codebase.
* **Example Prompt:**
  > "/explore Map the current database models and trace where users are queried."

### 10. grounding (`skills/grounding`)
* **Slash Commands:** `/grounding`, `/wiki`, `[WIKI]`
* **Purpose:** Access and query the LLM Wiki (attributable project knowledge under `knowledge/`) with authority and provenance.
* **Example Prompt:**
  > "/grounding Retrieve the deployment credentials runbook."
