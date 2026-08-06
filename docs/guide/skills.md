---
title: Skills Guide
type: guide
tags: [guide, skills, documentation]
---

# Skills Guide

Skills in the Context Factory are specialized, step-by-step procedures that guide an AI agent or a developer through complex tasks. They range from planning and code generation to security auditing and architecture recording.

---

## How Skills Trigger

Skills are loaded into an agent's context dynamically using three mechanisms:

1. **Semantic Relevance Scoring (Score >= 6):**
   The context harness processes your request and extracts search terms. It matches these terms against the skill folder name, name, and description. If the relevance score is **6 or higher**, the skill is loaded.
2. **Specialized Regex Guards:**
   Some skills have hardcoded checks that must pass to prevent them from being loaded accidentally:
   - `execution-plan` is only loaded if the request specifically mentions execution terms (e.g. "execute plan", "implement approved plan", "resume task").
   - `security-review` is only loaded if the request contains security-related terms (e.g. "security", "credentials", "authentication", "threat").
3. **Workflow Inclusion:**
   If a workflow is triggered, the harness scans the workflow markdown file for skill names enclosed in backticks (e.g., `` `grill-with-docs` ``). It automatically loads these referenced skills into context.

---

## Force-Triggering a Skill

If you want to guarantee a skill is loaded, use its exact name in your request prompt. For example, to force the repository discovery skill, write:
> "Run **repository-discovery** to analyze the backend database connection."

---

## Skill Inventory and Usage

Here is the list of canonical skills available in the Context Factory, their trigger keywords, and practical prompt examples:

### 1. grill-with-docs
* **Purpose:** Stress-test a new system, product idea, or materially ambiguous feature before planning. It forces a discovery-only session where goals, scenarios, and domain vocabulary are clarified one question at a time.
* **Trigger Keywords:** `pre-planning`, `new system`, `new product`, `stress-test`, `before coding`.
* **Example Prompt:**
  > "We want to build a new loyalty points system. Let's pre-plan and stress-test the idea before we write any code."

### 2. repository-discovery
* **Purpose:** Maps out code, contracts, database schemas, test suites, and project conventions of a target codebase. Crucial when entering a new repository or starting work on an unfamiliar subsystem.
* **Trigger Keywords:** `discovery`, `explore codebase`, `map routes`, `inspect files`, `analyze database schema`.
* **Example Prompt:**
  > "Run repository-discovery to map the current database models and see where users are queried."

### 3. implementation-plan
* **Purpose:** Create an evidence-backed, phased technical plan document (located under `docs/tasks/`) outlining steps, changes, and verification checks. No production code is changed while this is active.
* **Trigger Keywords:** `plan`, `proposal`, `implementation breakdown`, `design doc`, `migration plan`.
* **Example Prompt:**
  > "Create an implementation plan to migrate our notification system to use Twilio."

### 4. execution-plan
* **Purpose:** Execute a previously approved implementation plan step-by-step, keeping the task check-list and log updated.
* **Trigger Keywords:** `execute plan`, `implement approved plan`, `carry out plan`, `resume task`.
* **Example Prompt:**
  > "Execute the approved plan for the Stripe integration located under docs/tasks/2026-08-stripe-integration.md."

### 5. architecture-decision
* **Purpose:** Guides the analysis and creation of a durable Architecture Decision Record (ADR) under `docs/decisions/`.
* **Trigger Keywords:** `ADR`, `architecture decision`, `tradeoffs`, `boundary decision`, `durable choice`.
* **Example Prompt:**
  > "Let's record an architecture decision regarding our move to a PostgreSQL database instead of MySQL."

### 6. backend-module
* **Purpose:** Standardizes the creation of vertical features using Express or Hono.
* **Trigger Keywords:** `backend module`, `hono route`, `express endpoint`, `create vertical module`.
* **Example Prompt:**
  > "Add a new backend module for managing customer profiles under the api server."

### 7. knowledge-grounding
* **Purpose:** Access and query the LLM Wiki (attributable project knowledge under `knowledge/`) with authority and provenance.
* **Trigger Keywords:** `wiki search`, `ground knowledge`, `retrieve wiki`, `check facts`.
* **Example Prompt:**
  > "Ground my request using knowledge-grounding to check the current deployment credentials runbook."

### 8. playground
* **Purpose:** Guidelines for styling visual playgrounds and frontends with premium HSL-tailored colors, smooth animations, and high taste levels, avoiding generic layouts.
* **Trigger Keywords:** `styling`, `css playground`, `visual component`, `ui taste`.
* **Example Prompt:**
  > "Design a dark-mode interactive calendar widget on the playground."

### 9. security-review
* **Purpose:** Performs a threat-modeling exercise and audits application security boundaries (credentials, auth/authz, signatures, etc.).
* **Trigger Keywords:** `security review`, `auth audit`, `vulnerability assessment`, `threat modeling`.
* **Example Prompt:**
  > "Perform a security-review on the webhook signature verification handler."

### 10. verification-review
* **Purpose:** Audits completed work against fresh evidence (running tests, verifying files, build checks) before declaring a task finished.
* **Trigger Keywords:** `verification check`, `audit task`, `test completion`, `verify outcome`.
* **Example Prompt:**
  > "Run a verification-review on the checkout bug fix to confirm the tests pass."
