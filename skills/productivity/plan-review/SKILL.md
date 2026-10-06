---
name: plan-review
description: Independently audit a plan and issue approved execution packets.
---

# Plan Review

## Access declaration

- **Reads:** task plans and released grill briefs.
- **Writes:** reviewed execution packets under `docs/execution/`.
- **Exposes to:** `execute` only, through approved packets.

Review with `node scripts/context.mjs plan:check <task-dir>` and `node scripts/context.mjs handoff:verify-brief <brief>`. Inspect AC mapping, scope, checkout mode, done-check, and dependencies.

Issue a packet only after review and human approval:

```bash
node scripts/context.mjs handoff:issue-packet <plan> <packet> --review <review-reference> --approval <approval-reference>
```

The packet is the sole plan-derived input exposed to execute. A stale brief, failed review, missing approval, or failed done-check stops review. For serial work, validate the recorded task branch; use a worktree only when its recorded reason requires isolation or concurrent work.
