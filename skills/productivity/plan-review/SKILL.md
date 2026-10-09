---
name: plan-review
description: Independently audit a plan and issue approved execution packets.
---

# Plan Review

## Access declaration

- **Reads:** task plans and released grill briefs.
- **Writes:** reviewed execution packets under `docs/execution/`.
- **Exposes to:** `execute` only, through approved packets.

Review with `node scripts/context.mjs plan:check <task-dir>` and `node scripts/context.mjs handoff:verify-brief <brief>`. Before changing packet files, verify `git symbolic-ref --quiet --short HEAD` exactly matches the plan's task branch; stop and report a detached HEAD or mismatch. Inspect AC mapping, scope, branch and base identity, done-check, and dependencies.

Issue a packet only after review and human approval:

```bash
node scripts/context.mjs handoff:issue-packet <plan> <packet> --review <review-reference> --approval <approval-reference>
```

The packet is the sole plan-derived input exposed to execute. A stale brief, failed review, missing approval, failed done-check, or wrong branch stops review. Include the verified task branch and target base in the packet.
