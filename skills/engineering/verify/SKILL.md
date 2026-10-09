---
name: verify
description: Audit implementation and completion claims against acceptance criteria, source changes, fresh command output, unresolved findings, and skipped checks (/verify, [VERIFY], [QA]).
---

# Verification Review

Use the approved execution packet and `docs/execution/PLN-NNNN/ledger.md` as the task handoff. Do not require a direct full-plan or context-specification read.

## Procedure

1. Verify `git symbolic-ref --quiet --short HEAD` exactly matches the approved packet's task branch before changing verification artifacts. Stop and report a detached HEAD or mismatch. Read the requested outcome, acceptance criteria, task record, and deviations.
2. Inspect the actual change set and map each criterion to its implementation boundary.
3. Re-run the narrowest authoritative checks when safe and available.
4. Verify that all modified units have authoritative Conformance Report receipts (`report.id`, `verdict: PASS`, `bindingHash`, `diffHash`) generated via `context-cli conform`.
5. Verify report freshness against active binding and diff hashes (`verifyReportFreshness`); invalidate stale reports.
6. Classify every claimed result as verified, unsupported, contradicted, skipped, or blocked.
7. Review error paths, authorization, data integrity, compatibility, operations, and rollback proportionally to risk.
8. Produce a ready, not-ready, or blocked conclusion with evidence.

## Rules

- Independence means rechecking evidence, not trusting a developer summary.
- A passing test is not proof of behavior outside its assertions and environment.
- An LLM self-attestation or prose claim is never an acceptable substitute for machine conformance report receipts.
- Do not downgrade a failed required check to a warning without authorized human risk acceptance.
- Never infer deployment, migration application, external delivery, or user-visible success from local code alone.

## Completion

Every acceptance criterion has a status and evidence, all required checks and conformance reports are accounted for with valid `PASS` verdicts, and remaining risk has an owner or is explicitly blocking.
