---
name: review
description: Independent diff review of a unit worktree against its unit file to check for out-of-scope file edits, missing tests, SOLID violations, and unmet definitions of done before developer checkpoints (/review, [REVIEW]).
---

# Unit Diff Review: Worktree Pre-Screening Protocol

Perform an independent white-box code and diff audit of an active unit git worktree against its unit specification artifact (`unit-*.md`) *before developer inspection checkpoints*.

## Why Diff Review Exists (review vs verify)

A common failure mode in multi-agent execution is presenting unvetted, messy diffs to the human developer at batch checkpoints. If an agent modified files outside its declared boundaries, skipped critical contract tests, or violated architectural boundaries, the human reviewer is forced to act as a linter and compiler.

`review` acts as an automated pre-screener:
- **`review` (White-Box, Unit-Level):** Evaluates the active worktree diff against the unit's declared scope fence, verifies test completeness, checks SOLID principles, and audits Definition of Done checkboxes.
- **`verify` (Black-Box, System-Level):** Evaluates the integrated task across the entire repository for acceptance criteria fulfillment, cross-service contracts, operations, and release readiness.

---

## The Four-Gate Diff Review Procedure

Run this review inside the unit's active git worktree before declaring the unit verified:

### Gate 1: Scope Fence Audit

1. Inspect the unit specification's `## Scope` section:
   - Identify all file paths listed under `**In scope:**`.
   - Identify all explicit exclusions listed under `**Out of scope:**`.
2. Inspect the actual modified files in the worktree:
   ```bash
   git diff --name-only HEAD~1
   # or diff against base integration branch
   git diff --name-only <base-branch>...HEAD
   ```
3. Compare declared scope vs modified files:
   - **Scope Violation:** Any file touched in the diff that is NOT explicitly declared in `**In scope:**` (or required by canonical tooling like `context-manifest.json` / `context-lock.json`).
   - If an unlisted production file was modified, mark **FAIL**. The agent must either revert the out-of-scope modification or request a scope amendment.

### Gate 2: Test Completeness & Justification Audit

1. Cross-reference the unit artifact's `## Verification` section:
   - Verify that all declared test types (unit, integration, architecture, contract, migration) exist in the diff.
   - Verify that specific required cases (happy path, error cases, edge conditions) are implemented in the test suite.
2. Verify test execution:
   - Re-run the unit verification command (e.g. `node --test tests/...`).
   - Assert that all tests pass with exit code 0.
   - Assert that no tests are commented out, skipped (`.skip()`), or trivial (`assert(true)`).

### Gate 3: SOLID Architecture Audit

Audit newly written or modified classes and modules against Context Factory SOLID rules (`rules/solid/`):

1. **Single Responsibility (SRP):**
   - Does each new class/module have exactly one reason to change?
   - Files exceeding 200 lines or handling multiple distinct concerns must be refactored via `refactor`.
2. **Open/Closed Principle (OCP):**
   - Are new capabilities added by extending abstractions or adding strategy plugins rather than mutating central switch statements or monolithic conditionals?
3. **Liskov Substitution (LSP):**
   - Do derived types or implementations honor all preconditions and postconditions of their base interfaces without throwing `NotImplementedError`?
4. **Interface Segregation (ISP):**
   - Are client interfaces cohesive and minimal? Clients must not be forced to depend on methods they do not invoke.
5. **Dependency Inversion (DIP):**
   - Do high-level domain modules depend on abstractions/interfaces rather than concrete low-level infrastructure or transport mechanisms?

### Gate 4: Definition of Done & Evidence Audit

1. Audit every checkbox in the unit artifact's `## Definition of done`:
   - Every checked item `[x]` must be backed by tangible evidence in the git diff or command outputs.
   - Reject unverified assumptions (e.g., claiming "All tests pass" when test output was not captured).
2. Check unit metadata:
   - Unit frontmatter status should be `verified`.
   - Execution command and runtime duration logged in `## Verification`.

---

## Diff Pre-Screening Report Format

Produce a structured Pre-Screening Report before the human checkpoint:

```markdown
# Unit Diff Review: [Unit ID] - [Unit Title]

- **Worktree:** `.worktrees/...`
- **Branch:** `task/...`
- **Pre-Screen Verdict:** [READY FOR DEVELOPER REVIEW / REMEDIATION REQUIRED]

## Gate Findings

| Gate | Check | Status | Evidence / Notes |
| :--- | :--- | :--- | :--- |
| Gate 1 | Scope Fence | PASS / FAIL | N files modified, 0 out-of-scope leaks |
| Gate 2 | Test Completeness | PASS / FAIL | All verification cases present & green |
| Gate 3 | SOLID Principles | PASS / FAIL | SRP, OCP, DIP confirmed |
| Gate 4 | Definition of Done | PASS / FAIL | All DoD checkboxes backed by evidence |

## Diff Inspection Highlights
- `path/to/modified/file`: [Brief summary of change]

## Recommendations
- If **READY FOR DEVELOPER REVIEW**: Include git diff command for human inspection.
- If **REMEDIATION REQUIRED**: List specific blockers to fix before developer review.
```
