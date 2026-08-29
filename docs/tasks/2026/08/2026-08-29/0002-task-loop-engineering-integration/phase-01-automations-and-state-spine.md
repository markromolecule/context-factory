---
title: "Phase 1 — Automations + State Spine"
type: phase
parent: "0002-task-loop-engineering-integration"
phase: "01"
status: completed
created: "2026-08-29"
tags: [task, phase, automations, triage, inbox, discovery]
---

# Phase 1 — Automations + State Spine

## Objective

Implement the automations and state spine primitives: create `skills/triage/SKILL.md`, `.github/workflows/discovery.yml`, `scripts/triage.mjs`, and `docs/tasks/INBOX.md` to enable scheduled background discovery and a live triage ledger.

## Dependencies & Prerequisites

- Context Specification: [[docs/context/loop/loop-engineering-integration|Loop Engineering Integration]]
- ADR: [[docs/decisions/0019-loop-engineering-primitives|ADR 0019: Loop Engineering Primitives]]

## Impacted Files & Components

- `skills/triage/SKILL.md` — New procedural skill for discovery & triage.
- `.github/workflows/discovery.yml` — Cron-scheduled discovery workflow.
- `scripts/triage.mjs` — Automated triage execution script.
- `docs/tasks/INBOX.md` — Live ledger capturing raw incoming findings.

## Implementation Tasks

- [x] Author `skills/triage/SKILL.md` matching frontmatter requirements (`name: triage`, `description: ...`) and procedural instructions.
- [x] Author `.github/workflows/discovery.yml` with `schedule` cron (`0 6 * * *`) and `workflow_dispatch`, mirroring `context-factory.yml`.
- [x] Author `scripts/triage.mjs` supporting scanning repository state, git log, and doctor status to append structured entries into `docs/tasks/INBOX.md`.
- [x] Author `docs/tasks/INBOX.md` with finding lifecycle columns and initial structured finding.

## Verification & Testing

- `node scripts/triage.mjs --dry-run` — verify structured finding output.
- Direct execution of `node scripts/triage.mjs` — verify finding is written to `docs/tasks/INBOX.md`.
- Validate `skills/triage/SKILL.md` frontmatter with `scripts/validate-context.mjs`.

## Risks & Rollback

- **Risk:** Inbox table format drift or invalid YAML in triage skill.
- **Mitigation:** Strict schema conformance and automated formatting in `scripts/triage.mjs`.
