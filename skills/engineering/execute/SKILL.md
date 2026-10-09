---
name: execute
description: Execute an approved reviewed packet with test-first verification and phase checkpoints.
---

# Execute Reviewed Work

## Access declaration

- **Reads:** approved execution packets, released briefs, code, and evidence.
- **Writes:** source changes and `docs/execution/<plan-id>/ledger.md`.
- **Exposes to:** review, verify, and docs through the ledger and code evidence.

Execute only after `node scripts/context.mjs handoff:verify-packet <packet>` passes. Do not read `docs/tasks/` or a full plan directly. A missing, stale, or unapproved packet stops work and must be reissued by plan-review.

1. Verify the approved packet names the task branch and its target base. Run `git symbolic-ref --quiet --short HEAD` and compare the exact result with the packet's task branch before making any changes. A detached HEAD, missing branch, or mismatch stops work; report the current and expected branch. Do not create or switch branches here. Recheck `git status --short` and preserve unrelated changes.
2. Perform test-first work from the packet scope. Preserve language rules, run preflight and conformance, request independent `/review`, and commit with the unit ID.
3. Append commands, report receipts, modified files, and checkpoint status to `docs/execution/<plan-id>/ledger.md`.
4. Stop after every ready batch and phase for developer inspection. Never merge or advance without a new instruction.
