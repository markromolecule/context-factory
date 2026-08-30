---
title: Triage Inbox
type: ledger
status: active
tags: [tasks, triage, inbox, loop-engineering]
---

# Triage Inbox

The **Triage Inbox** is the live state spine for automated discovery and incoming anomalies. Automated discovery workflows ([[skills/productivity/triage/SKILL|triage]]) append unreviewed findings here. The **PM Agent** (`agents/pm-agent`) reviews this ledger, promotes actionable findings to formal task folders under `docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/`, or marks them as `dismissed`.

## Status Lifecycle

1. `new` — Discovered by background automation or manual triage; unreviewed.
2. `triaged` — Reviewed by PM/Lead; scope and priority evaluated.
3. `promoted` — Converted into a formal task plan under `docs/tasks/` (linked in table).
4. `dismissed` — Evaluated and rejected (reason noted in action column).

---

## Active Findings

| ID | Discovered Date | Source | Category / Severity | Description | Proposed Action / Promoted Task | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| F-20260829-587 | 2026-08-29 | Automated Discovery (41b4579) | drift / medium | Discovered 7 uncommitted file modifications in workspace | Review workspace diff via `context-cli diff` or commit | new |
| F-20260829-001 | 2026-08-29 | Automated Discovery / Loop Init | maintenance / low | Loop engineering primitives initialized across repository | Promoted to [[docs/tasks/2026/08/2026-08-29/0002-task-loop-engineering-integration/README|0002-task-loop-engineering-integration]] | promoted |

---

## Triage History & Resolved

| ID | Discovered Date | Resolved Date | Source | Category | Resolution Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| F-20260829-000 | 2026-08-29 | 2026-08-29 | Discovery Dry Run | drift / low | Initial verification dry-run entry |
