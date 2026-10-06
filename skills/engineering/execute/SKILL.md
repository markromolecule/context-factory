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

1. Recheck Git status and follow the packet's recorded task branch and checkout mode. Use one task branch by default. Use a worktree only when the approved packet records concurrent work, conflicting uncommitted work, or long-running isolation.
2. Perform test-first work from the packet scope. Preserve language rules, run preflight and conformance, request independent `/review`, and commit with the unit ID.
3. Append commands, report receipts, modified files, and checkpoint status to `docs/execution/<plan-id>/ledger.md`.
4. Stop after every ready batch and phase for developer inspection. Never merge or advance without a new instruction.

## Worktree cleanup

Before removal, inspect `git status --short` in the worktree. If it has tracked or untracked changes, report residual paths and stop. Keep the worktree intact. Only a clean worktree may use `git worktree remove <path>` without `--force`, followed by `git worktree prune`.
