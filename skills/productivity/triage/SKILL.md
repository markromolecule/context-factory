---
name: triage
description: Scan recent repository activity, CI failures, issues, and anomalies using explore and grounding procedures to produce structured findings in docs/tasks/INBOX.md (/triage, [TRIAGE]).
---

# Discovery & Triage

## Procedure

1. Scan recent repository activity: recent git commits, CI/CD run statuses, opened issues, and unverified worktree branches.
2. Run [[skills/engineering/explore/SKILL|explore]] to map affected component boundaries, module dependencies, and touched test paths.
3. Run [[skills/productivity/grounding/SKILL|grounding]] to reconcile relevant canonical documentation, active rules, and architectural decisions.
4. Classify each discovery item by category (`defect`, `security`, `maintenance`, `drift`, or `feature-opportunity`) and assess severity (`critical`, `high`, `medium`, `low`).
5. Deduplicate against existing active entries in [[docs/tasks/INBOX|Triage Inbox]] and ongoing task folders under `docs/tasks/`.
6. Append newly triaged findings into `docs/tasks/INBOX.md` with finding ID, date, source, category, description, proposed action, and status `new`.
7. Stop before scaffolding task plans or modifying production code; hand off triaged entries to the PM Agent (`agents/pm-agent`).

## Output Format

Record each finding as a row in the `docs/tasks/INBOX.md` table:

```markdown
| ID | Discovered Date | Source | Category / Severity | Description | Proposed Action / Promoted Task | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| F-001 | 2026-08-29 | CI / Commit `abc1234` | defect / high | Token parser fails on malformed input | Scaffold defect task under docs/tasks/ | new |
```

## Completion

A triage run is complete when all scanned anomalies are classified, deduplicated against active tasks, and recorded in `docs/tasks/INBOX.md`.
