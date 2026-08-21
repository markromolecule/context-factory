---
name: defect-resolution
description: Resolve a defect by reproducing it, establishing root cause, adding regression evidence, and applying the smallest safe fix.
scope: Bugs, regressions, reliability failures, performance defects, and incorrect generated output.
---

# Defect Resolution

## Triggers

Use for diagnosis-and-fix requests. For diagnosis-only requests, complete evidence and root-cause analysis but do not mutate production code.

## Required inputs

- Observed behavior, expected behavior, environment, and reproduction information.
- Relevant logs, errors, failing tests, requests, data conditions, or screenshots when available.

## Applicable rules and skills

Load rules for the failing boundary. Add `security` when exploitation or data exposure is plausible and compose with the migration or dependency workflow when those are causal.

## Phases

1. Reproduce the failure or establish the strongest available evidence when reproduction is unavailable.
2. Minimize the case and trace the failing path across inputs, state, dependencies, and outputs.
3. Distinguish root cause from symptoms and identify the regression boundary.
4. Add a failing regression test when practical.
5. Apply the smallest complete fix without absorbing unrelated cleanup.
6. Re-run the reproduction, focused tests, adjacent edge cases, and broader affected checks.
7. Assess whether the same cause exists in sibling paths and whether monitoring or documentation must change.

## Quality gates

- Evidence explains why the defect occurs and why the fix addresses it.
- A regression test or equivalent repeatable verification fails before and passes after the fix when practical.
- Error suppression, broad retries, and unsafe fallbacks are not used to hide the cause.

## Stop and escalation conditions

Stop when evidence contradicts the requested diagnosis, production data must be changed without authorization, reproduction requires unavailable sensitive information, or multiple materially different fixes require a product/architecture choice.

## Artifacts and completion

Record multi-phase incidents under tasks and durable corrective architecture under decisions. Report root cause, corrected behavior, regression evidence, blast radius, and unresolved uncertainty.
