# Unit specificity example

Use this only when a proposed unit is too vague to execute from its file. These are illustrative excerpts, not a complete `Unit.md` artifact or a substitute for current rule bindings.

## Useful

**Goal:** Reject null input and a missing `timeoutMs` in `parseConfig` with the existing `ConfigError` shape.

**Context and preconditions:** `src/config/parse.ts` currently reads `raw.timeoutMs` before checking whether `raw` is null. No predecessor unit is required. `AC-02` requires a stable error message for absent configuration.

**In scope:** `src/config/parse.ts`, `tests/config/parse.test.ts` (verify both paths before finalizing scope).

**Out of scope:** CLI messaging and config schema changes.

**Steps:** Add an early null guard in `parseConfig`; retain the existing error type and message convention. Add cases for null input, missing field, and a valid timeout.

**Verification:** Unit tests in the configured test runner for those three cases; run the repository's typecheck if configured. These catch a regression in the function's error boundary. Record exact commands after inspecting the host.

**Rollback:** Revert the two scoped files on the task branch.

## Too vague

“Fix config errors. Update the parser and tests. Make sure everything works.”

This does not identify the contract, expected error, file scope, test cases, dependency state, or runnable verification. Its reader would have to rediscover the plan.
