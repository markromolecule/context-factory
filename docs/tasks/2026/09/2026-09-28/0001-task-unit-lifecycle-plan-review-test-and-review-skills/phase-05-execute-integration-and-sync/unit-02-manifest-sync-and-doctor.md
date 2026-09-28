---
title: "Manifest Sync & Doctor Verification"
type: unit
parent: "phase-05-execute-integration-and-sync"
unit: "05.02"
status: planned
created: "2026-09-28"
tags: [task, unit, manifest, lock, doctor, sync, orchestrators]
depends_on: ["02.01", "05.01"]
parallelizable_with: []
---

# Unit 05.02: Manifest Sync & Doctor Verification

> Phase: phase-05-execute-integration-and-sync · Depends on: 02.01, 05.01 · Parallelizable with: none

## Objective

Synchronize `context-manifest.json`, generate `.agents` symlinks, update orchestrator contracts, regenerate `context-lock.json`, and verify 100% factory health using `doctor` and the test suite.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - All skills, tools, and resources must be registered in `context-manifest.json`.
  - `.agents/` contains symlinks to skills and rules for host IDE discovery.
  - `orchestrator/SHARED.md` defines subagent roles and dispatch triggers.
- Acceptance Criteria Served:
  - `AC-06`: All new skills, scripts, and orchestrators registered in `context-manifest.json` and verified with `node scripts/context.mjs doctor`.
- Decisions Constraining Unit:
  - Invariants: 0 broken symlinks, current lockfile digest, 100% clean doctor check.

## Preconditions

All previous units (Phases 1 through 5.1) completed.

## Scope

**In scope:** `context-manifest.json`, `context-lock.json`, `orchestrator/SHARED.md`, `orchestrator/AGENTS.md`, `orchestrator/CLAUDE.md`, `orchestrator/CODEX.md`, `orchestrator/GEMINI.md`, `.agents/skills/`.
**Out of scope:** Production application files.

## Steps

1. In `context-manifest.json`:
   - Add `"scripts/plan-check.mjs"` to `"tools"`.
   - Add `"skills/productivity/plan-review/SKILL.md"`, `"skills/engineering/test/SKILL.md"`, and `"skills/engineering/review/SKILL.md"` to `"skills"`.
   - Add the three `agents/openai.yaml` paths to `"skillResources"`.
2. Update orchestrators (`orchestrator/SHARED.md`, `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`):
   - Add `/plan-review`, `/test`, and `/review` dispatch shortcuts and descriptions.
3. Update `.agents/skills/` symlinks for `plan-review`, `test`, and `review`.
4. Run `node scripts/context.mjs lock` to regenerate `context-lock.json`.
5. Run `node scripts/context.mjs doctor` and `npm test` to verify zero errors across the factory.

## Verification

- Test type(s):
  - Integration & Evaluation suite: Runs `node scripts/context.mjs doctor` and `npm test` to verify manifest validity, syntax linting, lockfile integrity, and all evaluation cases.
- Cases:
  - Doctor passes 100% (manifest & syntax lint PASS, lockfile PASS, symlink integrity PASS, eval suite PASS).
  - Test suite passes 22+ tests.
- Commands:
  - `node scripts/context.mjs doctor`
  - `npm test`

## Rollback

Revert additions to `context-manifest.json`, `context-lock.json`, and orchestrators. Remove newly generated symlinks.

## Definition of done

- [ ] Maps to acceptance criteria: AC-06
- [ ] Manifest and lockfile completely synchronized
- [ ] Symlinks verified healthy
- [ ] `node scripts/context.mjs doctor` exits with 0
- [ ] All listed verification passes
