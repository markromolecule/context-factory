---
title: "Ownership-aware host bridge and repair"
type: unit
parent: "phase-02-bridge-integration"
unit: "02.01"
task_branch: "feat/PLN-0009-codex-and-claude-workflow-discovery"
base_commit: "fa8f5db00cb0d113589190ed15d6752ab3612831"
status: verified
created: "2026-10-11"
tags: [task, unit, bridge]
depends_on: ["01.01"]
parallelizable_with: ["03.01"]
---

# Unit 02.01: Ownership-Aware Host Bridge and Repair

> Task branch: `feat/PLN-0009-codex-and-claude-workflow-discovery` · Base: `fa8f5db00cb0d113589190ed15d6752ab3612831`

## Objective

Install and audit workflow entries in host repositories with collision-safe, ownership-aware repair.

## Context packet

Unit 01.01 supplies `workflow-<canonical-slug>` adapter sources and a deterministic manifest mapping; verify its commit and PASS receipt first. In `app/cli/core/bridge-generator.mjs`, `generateBridge` creates per-skill `.agents` links only when Antigravity/Gemini is selected, while `detectInstalledIdes` treats any `.agents` directory as Antigravity. `createRelativeSymlink` can replace an existing symlink pointing elsewhere, `repairBridgeSymlinks` passes `force: true`, and declared missing factory paths can fall back to local root. `verifySymlinkHealth` checks legacy `.agents` links but no Claude entries. `.context-bridge.json` records generated links and is the existing ownership metadata boundary. ADR 0038 requires additive, unique entries and failure on collisions/broken targets. This unit serves AC-04, AC-05, AC-06. It is logically independent of Unit 03.01 after Unit 01.01, but must run serially on the shared branch.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.sec.untrusted-input-boundaries][mode:evidence-blocking] rules/global/security-guardrails.md sourceHash:sha256:c6cdbf5679e2c6841f193af152cb534327e513282c01b8f804cac056811e81ba
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
</language_rules>

**Rule satisfaction:** Treat host paths and existing files as untrusted boundaries, recheck ownership immediately before writes, keep collisions visible, and cover behavior with failing tests before implementation. Narrow bridge helper interfaces to avoid duplicating canonical policy.

## Preconditions

- Verify exact task branch, clean state except this unit, Unit 01.01 commit/receipt, and resolved adapter inventory.
- Read `generateBridge`, `createRelativeSymlink`, `verifySymlinkHealth`, `repairBridgeSymlinks`, CLI bridge/repair/doctor callers, `.context-bridge.json` format, existing bridge tests, and current host docs. Recompile rule binding.

## Scope

**In scope:** `app/cli/core/bridge-generator.mjs`, `evals/tests/bridge/bridge-conformance.test.mjs`, `app/cli/commands/bridge.mjs`, `app/cli/commands/repair.mjs`, `app/cli/commands/doctor.mjs` (only for needed collision/diagnostic wiring), `.context-bridge.json` fixture output (test-generated).

**Out of scope:** adapter source content, canonical workflows, general resolver logic, arbitrary host files outside generated entry destinations, other editor adapters, and blanket forced replacement.

## Steps

1. Add failing integration cases for factory checkout, linked host, and submodule host: both discovery directories have exactly the expected entries and resolve to canonical sources. Preserve an existing host skill/command with the same name and report a collision.
2. Add failing cases for rerun idempotence, concurrent setup where a destination appears between planning and write, mismatched symlink targets, missing/moved factory, and cleanup of known-owned entries only. Use a controlled filesystem fixture; assert unowned content bytes remain unchanged.
3. Make Codex link creation independent of Antigravity selection. Create Claude links only for Claude/all profiles. Keep legacy Antigravity links where selected. Narrow `detectInstalledIdes` so `.agents` skill discovery alone does not identify Antigravity.
4. Use manifest-derived workflow entry names and ownership metadata for creation/audit/repair. Verify the declared factory target before generating; return a failing diagnostic and repair instruction when absent. Recheck destination with `lstat` immediately before mutation; no silent replacement, including with `force`. Make audit distinguish valid link, broken link, missing link, and collision.
5. Run focused integration tests, fresh preflight/conform, review exact scope, and commit only on PASS.

## Verification

- **Integration/contract tests:** `node --test evals/tests/bridge/bridge-conformance.test.mjs` exercises the real filesystem seam and public bridge result; without it concurrent writes, relative target errors, and unowned-file replacement can escape.
- **Negative/security cases:** The same suite verifies an attacker-controlled/mismatched symlink and path collision cannot redirect or erase host content.
- **Conformance gate:** Fresh `node app/cli/bin/context-cli.mjs preflight` and `node app/cli/bin/context-cli.mjs conform` for exact scope, persisted PASS receipt and hashes; stop on FAIL/BLOCKED.

## Rollback

Revert bridge and test changes. Remove only generated entries whose metadata and current target prove ownership; retain any unowned host path. A moved factory is repaired by updating the declared target and rerunning the bridge after audit.

## Definition of done

- [x] AC-04, AC-05, and AC-06 fixture cases pass.
- [x] Exact task branch, scoped diff, and review confirmed.
- [x] No unowned host file changed in collision/concurrency tests.
- [x] Fresh unit conformance PASS receipt verified and change committed.
