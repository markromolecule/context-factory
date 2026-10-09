---
name: test
description: Turn a unit's Verification section into real tests, written test-first (failing assertions first, then implementation), specializing in architecture, contract, and migration tests (/test, [TEST]).
---

# Test-First Implementation: Red-Green-Refactor Protocol

## Execution handoff

Consume the approved execution packet and its ledger entry for active-unit scope and verification. Do not read the full task plan or context specification directly.
Before writing tests, verify `git symbolic-ref --quiet --short HEAD` exactly matches the packet's task branch. Stop and report a detached HEAD or mismatch.

Turn an active task unit's `## Verification` requirements into concrete automated tests *before* writing functional code.

## Why Test-First Exists for AI Agents

When an AI agent writes implementation code before tests, it routinely falls into the "confirmation bias" trap: writing tests that merely mirror whatever code it just generated, rather than holding the code accountable to the original specification. Furthermore, non-functional tests — specifically **architecture boundary tests**, **contract schema tests**, and **database migration rollback tests** — are frequently skipped, mocked out, or written superficially.

The `test` skill enforces an uncompromising Test-Driven Development (TDD) discipline: establish the verification harness first, observe explicit assertion failure (Red), write the minimal code to satisfy the contract (Green), and refactor cleanly.

---

## The Four-Stage TDD Protocol

### Stage 1: Ingest & Boundary Inspection
1. Read the active unit artifact (`unit-*.md`) end-to-end.
2. Locate the `## Verification` section and extract:
   - **Declared Test Type(s):** unit, integration, architecture, contract, migration.
   - **Required Test Cases:** Happy path, edge cases, error conditions, and boundary behaviors.
   - **Verification Command(s):** The exact CLI command used to execute the test suite (e.g. `node --test tests/feature.test.mjs`, `npm test`, `php artisan test`).
3. Cross-reference the unit's `## Scope` section (`**In scope:**` and `**Out of scope:**`). The tests must verify only what is declared in scope without bleeding into unallocated components.

### Stage 2: Red (Author Failing Test)
1. Author the automated test file in the project's test directory (e.g., `tests/<domain>/<feature>.test.ts`, `evals/<suite>.test.mjs`, etc.).
2. Structure test assertions directly around the unit's acceptance criteria:
   - Assert precise return types, error messages, and state transitions.
   - Do not write trivial or tautological assertions (e.g., asserting `true === true`).
3. Execute the unit verification command.
4. **Mandatory Red Verification:**
   - The test **must fail**.
   - Inspect the failure output: it must fail with an expected contract or assertion error (e.g., `ERR_MODULE_NOT_FOUND`, `TypeError: fn is not a function`, or `AssertionError: expected X but received Y`).
   - If the test passes immediately without implementation, the test is tautological, testing the wrong seam, or pre-existing code already implements the feature. Stop and fix the test.

### Stage 3: Green (Minimal Implementation)
1. Write the minimal functional code required to make the failing test pass.
2. Confine all code changes strictly within the unit's `**In scope:**` file boundaries.
3. Re-execute the verification command.
4. **Mandatory Green Verification:**
   - All tests in the unit suite must pass with exit code 0.
   - Zero test regressions in existing suites.

### Stage 4: Refactor & Cleanliness
1. Inspect the newly written code for readability, performance, and SOLID principles.
2. Eliminate redundant code while keeping the public contracts and test assertions intact.
3. Re-run the verification command to confirm continuous Green status.

---

## Specialized Test Patterns

AI agents frequently write superficial tests for architecture, contract, and migration work. Follow these explicit implementation patterns when authoring those test types:

### 1. Architecture & Boundary Tests
- **Objective:** Prevent architectural drift, circular package dependencies, and violations of layer isolation (e.g., Domain must not import Infrastructure; Controllers must not bypass Service contracts).
- **Implementation Pattern:**
  - Read module source files or parse AST/imports.
  - Assert that internal domain modules only import approved standard libraries or internal abstractions.
  - Assert that high-level modules depend on interfaces, not concrete low-level implementations (Dependency Inversion).
  ```javascript
  import { readFile } from "node:fs/promises";
  import assert from "node:assert/strict";

  it("domain entity does not import infrastructure or framework modules", async () => {
    const content = await readFile("src/domain/Order.ts", "utf8");
    const forbiddenImports = ["express", "typeorm", "axios", "infrastructure/"];
    for (const forbidden of forbiddenImports) {
      assert.equal(
        content.includes(forbidden),
        false,
        `Domain entity imports forbidden dependency: ${forbidden}`
      );
    }
  });
  ```

### 2. Contract & Schema Tests
- **Objective:** Guarantee that public API surfaces, HTTP responses, CLI outputs, and event envelopes conform strictly to their published schema.
- **Implementation Pattern:**
  - Validate response payloads against strict JSON Schemas, OpenAPI schemas, or Zod/Ajv validators.
  - Test both positive schema conformance and negative handling (asserting that malformed or unauthorized requests produce structured error schemas with appropriate HTTP codes).
  ```javascript
  import { validateSchema } from "./schema-validator.mjs";
  import assert from "node:assert/strict";

  it("API response matches published OpenAPI schema", async () => {
    const response = await fetch("/api/v1/orders/123");
    const data = await response.json();
    const result = validateSchema(data, "OrderResponseSchema");
    assert.equal(result.valid, true, `Schema validation errors: ${result.errors?.join(", ")}`);
  });
  ```

### 3. Migration & Rollback Tests
- **Objective:** Verify that database schema alterations and data migrations apply cleanly forward, roll back safely without orphaned state, and re-apply idempotently.
- **Implementation Pattern (3-Step Lifecycle):**
  1. **Baseline State:** Setup the database schema at the pre-migration version with seed records.
  2. **Forward Migration:** Run migration `up`. Assert that new columns, tables, and transformed records exist and match expected types and constraints.
  3. **Rollback Migration:** Run migration `down`. Assert that schema and seed data cleanly revert to baseline without data corruption or loss.
  4. **Re-Application:** Run migration `up` once more to ensure full idempotency.

---

## Definition of Done for Test Execution

A unit's test phase is complete only when:
1. Failing test execution was observed and documented (Red).
2. Functional code satisfied the assertions with exit code 0 (Green).
3. The verification command and duration evidence are logged directly in the unit markdown file under `## Verification`.
