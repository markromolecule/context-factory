---
name: execute
description: Execute an approved reviewed packet with test-first verification and phase checkpoints.
---

# Execute Reviewed Work

## Access declaration

- **Reads:** approved execution packets, released briefs, code, and evidence.
- **Writes:** source changes and `docs/execution/<plan-id>/ledger.md`.
- **Exposes to:** docs through the ledger and code evidence.

Execute only after `node scripts/context.mjs handoff:verify-packet <packet>` passes. The packet authorizes the task branch and target base; read only the self-contained reviewed unit files for the current batch, never the full master plan. Match each unit's branch and base commit to the packet, and run `plan:check` before work. If the packet does not identify a ready batch, require an explicit user instruction naming or authorizing that batch and record it in the ledger. A missing, stale, or unapproved packet stops work and must be reissued by plan-review.

1. Verify the approved packet names the task branch and its target base. Run `git symbolic-ref --quiet --short HEAD` and compare the exact result with the packet's task branch before making any changes. A detached HEAD, missing branch, or mismatch stops work; report the current and expected branch. Do not create or switch branches here. Recheck `git status --short` and preserve unrelated changes.
2. Perform test-first work within the reviewed unit scope. Read applicable rules, record preflight as a selection receipt for supported scope, and run each configured, applicable host check plus required human evidence. A binding or doctor result is not code verification. Record unavailable or missing required checks as blocked; commit with the unit ID only after its checks pass.
3. Append commands, report receipts, modified files, and checkpoint status to `docs/execution/<plan-id>/ledger.md`.
4. Stop after every ready batch and phase for developer inspection. Never merge or advance without a new instruction.
