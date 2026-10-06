---
title: "Cross-Editor Bridge and Doctor Parity"
type: unit
parent: "phase-04-lifecycle-and-bridges"
unit: "04.02"
branch: "task/0001/phase-04/bridge-doctor-parity"
worktree: ".worktrees/0001/phase-04/bridge-doctor-parity"
status: planned
created: "2026-10-06"
tags: [task, unit, bridges, doctor]
depends_on: ["03.03"]
parallelizable_with: ["04.01"]
---

# Unit 04.02: Cross-Editor Bridge and Doctor Parity

## Objective

Generate consistent repository-gate instructions for every supported editor and make doctor report both bridge parity and enforcement capability honestly.

## Context packet

- `app/cli/core/bridge-generator.mjs:419-563` currently tells editors to resolve context but does not require preflight/conform/report receipts.
- Editor hooks are supplemental; repository commands define minimum enforcement.
- AC-09 and SC-07.

<language_rules>
- `rules/global/naming-conventions.md`: Generated command names and artifact terms are identical across adapters.
- `rules/global/evidence-and-claims.md`: Doctor distinguishes healthy bridge files, missing commands, partial adapter coverage, and unsupported stacks.
- `rules/solid/open-closed.md`: Editor profiles reuse a shared instruction fragment rather than duplicating policy strings.
- `rules/global/security-guardrails.md`: Generated instructions never embed credentials or authorize editor-specific bypasses.
</language_rules>

## Preconditions

- Phase 3 authoritative CLI commands are merged.

## Scope

**In scope:** `app/cli/core/bridge-generator.mjs`; `app/cli/commands/doctor.mjs`; bridge-related tests under `evals/ide-bridge.test.mjs` or a new `evals/bridge-conformance.test.mjs`; generated adapter snapshots owned by those tests.

**Out of scope:** lifecycle skill files, resolver internals, conformance adapter logic, and rule metadata.

## Steps

1. Extract one shared enforcement instruction fragment containing resolve/bind, preflight, conform, and report requirements.
2. Apply it to AGENTS, Codex, Claude, Gemini/Antigravity, Cursor, Windsurf, Trae, and Copilot generators while preserving platform-specific syntax.
3. Extend doctor to validate command presence and report adapter/catalog capability separately from file existence.
4. Add snapshots/semantic assertions that reject an editor profile missing or weakening the authoritative gates.

## Verification

- **Integration tests:** generate each profile in a temporary host and inspect required commands/paths.
- **Contract tests:** doctor differentiates full, partial, unsupported, and broken states.
- Command: `node --test evals/bridge-conformance.test.mjs` plus existing bridge tests.

## Rollback

Restore prior bridge fragments/doctor checks together; do not leave mixed editor semantics.

## Definition of done

- [ ] AC-09 passes for every supported editor.
- [ ] No editor can be reported fully enforced from instruction-file presence alone.
- [ ] Shared fragment removes policy duplication.
- [ ] Unit passes `/review`.
