# Execution Ledger: PLN-0009 (Codex and Claude Workflow Discovery)

> **Task ID:** PLN-0009
> **Target Branch:** `master`
> **Task Branch:** `feat/PLN-0009-codex-and-claude-workflow-discovery`
> **Baseline Commit:** `fa8f5db00cb0d113589190ed15d6752ab3612831`
> **Execution Packet:** `docs/execution/PLN-0009/packet.json` (plan source SHA-256: `sha256:07440a897c7f0aab8a017aeb133c03ef7c41ef3d549722849d6c5dac7c777ddb`)
> **Review Reference:** `PLN-0009-plan-review-2026-10-11`
> **Approval Reference:** `user-approval-2026-10-11`

## Execution Progress

| Phase | Title | Units | Status |
| :--- | :--- | :--- | :--- |
| **01** | Canonical workflow adapter inventory | 01.01 | VERIFIED |
| **02** | Ownership-aware host bridge and repair | 02.01 | VERIFIED |
| **03** | Resolver boundaries and host guidance | 03.01 | VERIFIED |
| **04** | Whole-diff and live-host evidence | 04.01 | VERIFIED |

---

## Packet and Branch Checkpoint: 2026-10-11

- `node scripts/context.mjs handoff:verify-packet docs/execution/PLN-0009/packet.json` → **PASS** (`valid: true`).
- Active branch: `feat/PLN-0009-codex-and-claude-workflow-discovery`, exactly matching the approved packet task branch.
- Base commit: `fa8f5db00cb0d113589190ed15d6752ab3612831`.
- Working tree clean prior to Unit 01.01.

---

## Unit 01.01: Canonical Workflow Adapter Inventory

### Changes

- Added 12 thin adapter source skills under `skills/workflow-entries/workflow-<slug>/SKILL.md` mapped 1-to-1 to all canonical workflows in `workflows/*.md`. Each adapter names its canonical workflow file, instructs the host to read the canonical file, delegates the actual user request to `node scripts/context.mjs resolve`, and defers all quality gates, stop conditions, and authorization to the workflow and shared contract without duplicating policy.
- Created Codex host discovery symlinks in `.agents/skills/workflow-<slug>` pointing to `../../skills/workflow-entries/workflow-<slug>`.
- Created Claude Code host discovery directory `.claude/skills/` with symlinks `workflow-<slug>` pointing to `../../skills/workflow-entries/workflow-<slug>`.
- Extended `scripts/validate-context.mjs` with exported `validateWorkflowEntries` function enforcing 1-to-1 name mapping, absence of duplicate policy bodies, presence and integrity of Codex and Claude symlinks, and detection of missing or stale entries.
- Added automated validation for `.claude/skills` directory and wrapped CLI execution in `if (process.argv[1]?.endsWith("validate-context.mjs"))` to allow programmatic test imports.
- Extended `app/cli/core/indexer.mjs` to categorize `skills/workflow-entries/` separately under `## Canonical Workflow Entries` in `docs/Skills.md`.
- Added contract test suite `evals/tests/bridge/workflow-entry-contract.test.mjs` verifying exact 1-to-1 mapping, frontmatter schema, no policy duplication, host symlink integrity, and validator error detection for missing and stale entries.
- Synchronized `context-manifest.json` (skills count: 18 -> 30; tools count: 63 -> 64) and regenerated `context-lock.json` (digest: `sha256:e3a530d32ee3b7eae9ed2ad1784aeedcd14e10167194e4172ee875baee5ff285`).

### Verification

- `node --test evals/tests/bridge/workflow-entry-contract.test.mjs` → **PASS** (7/7 tests passed in 17ms).
- `npm run lint` → **PASS** (41 rules, 30 skills, 12 workflows, 23 agent resources, 10 knowledge items, 20 evaluations, 532 Markdown files).
- `npm run lock` → **PASS** (lockfile updated and verified).
- `node scripts/context.mjs doctor` → **PASS** (HEALTHY; 34/34 evaluations passed in 206ms).
- `git diff --check` → **PASS** (zero whitespace or syntax issues).

### Conformance Receipt

- **Report:** `docs/execution/PLN-0009/unit-01-01-conformance-report.json`
- **Report ID:** `report-binding-adhoc-00-00-c80d46c0ab43-1791729796057`
- **Binding Hash:** `sha256:c80d46c0ab43e554616a4ff402501e60ef0d19d957ffee4e96e5031ddfde2715`
- **Diff Hash:** `sha256:7ee86e5e5f3b9d89254eb764477c6042f52e4a2e15ececa5c83779a0bca32d56`
- **Human Evidence:** "Joseph reviewed Unit 01.01 canonical workflow adapter inventory: thin adapter sources, Codex and Claude links, manifest/indexer synchronization, validator contract checks, and verified that canonical workflows remain the sole lifecycle owners."
- **Verdict:** **PASS** (50/50 directives). Receipt independently verified via `node app/cli/bin/context-cli.mjs conform verify docs/execution/PLN-0009/unit-01-01-conformance-report.json`.

---

## Unit 02.01: Ownership-Aware Host Bridge and Repair

### Changes

- Narrowed `detectInstalledIdes` in `app/cli/core/bridge-generator.mjs` so `.agents` folder presence alone never falsely identifies Antigravity; only Antigravity-specific markers (`GEMINI.md`, `.gemini`, `.agents/GEMINI.md`, `.agents/rules`, `.agents/workflows`, `.agents/agents`, `.agents/skills.json`) trigger `antigravity` detection (AC-06).
- Decoupled Codex and Claude discovery symlinks in `generateBridge`:
  - Codex profile (`activeIdes.includes("codex") || isAll`) creates `.agents/skills/` links independently of Antigravity (AC-06).
  - Claude profile (`activeIdes.includes("claude") || isAll`) creates `.claude/skills/workflow-<slug>` links without touching `.agents/` (AC-06).
  - Legacy Antigravity links (`.agents/rules`, `.agents/agents`, `.agents/workflows`, etc.) remain guarded strictly behind `isAntigravity`.
- Enforced strict ownership-aware collision detection in `createRelativeSymlink`:
  - Pre-existing unowned files and unowned symlinks are NEVER deleted or overwritten, even when `force: true` is passed (AC-04).
  - Flags collisions explicitly (`status: "collision (...)"`, `collision: true`) and leaves user content bytes 100% untouched.
  - Added atomic pre-write concurrency recheck immediately before filesystem mutation to catch race-condition destination appearance.
- Re-architected `.context-bridge.json` generation in `generateBridge`:
  - Only records symlinks that are successfully created / owned; colliding host files are excluded from bridge ownership metadata.
  - Closed silent fallback bug: declared missing factory paths throw `FACTORY_PATH_NOT_FOUND` diagnostic errors with remediation instructions instead of silently defaulting to local factory checkout (AC-05).
- Extended `verifySymlinkHealth` to audit `.claude/skills` discovery links for Claude profiles, check factory target reachability, distinguish healthy vs broken vs missing vs colliding symlinks, and report exact `collisionCount` (AC-05).
- Wired collision status and error recovery into CLI commands:
  - `handleBridgeCommand` in `app/cli/commands/bridge.mjs` formats collision items, warns users about preserved host files, catches `FACTORY_PATH_NOT_FOUND`, and returns exit code 1 on collisions.
  - `handleDoctorCommand` in `app/cli/commands/doctor.mjs` exposes `collisionCount` in JSON diagnostics, table output, and remediation instructions.
  - `repairBridgeSymlinks` safely repairs missing/broken links without clobbering unowned user files.
- Extended `evals/tests/bridge/bridge-conformance.test.mjs` with comprehensive integration test suite covering:
  - Narrowed `detectInstalledIdes` Antigravity detection (AC-06).
  - Linked host independent Codex & Claude symlink generation (AC-04, AC-06).
  - Submodule host embedded target resolution (AC-04).
  - Preservation of unowned files and symlinks on collision under both `generateBridge` and `repairBridgeSymlinks({ force: true })` (AC-04).
  - Failing closed on missing declared factory path (AC-05).
  - Rerun idempotence.
  - Pre-mutation destination appearance concurrency safety.

### Verification

- `node --test evals/tests/bridge/bridge-conformance.test.mjs` → **PASS** (16/16 tests passed in 65ms).
- `node --test evals/tests/bridge/workflow-entry-contract.test.mjs tests/bridge-generator.test.mjs tests/bridge-multi-editor.test.mjs tests/doctor-editor-audit.test.mjs tests/editor-wizard.test.mjs evals/tests/cli/init-preview.test.mjs` → **PASS** (44/44 tests passed).
- `npm run lint` → **PASS** (41 rules, 30 skills, 12 workflows, 23 agent resources, 10 knowledge items, 20 evaluations, 532 Markdown files).
- `npm run lock` → **PASS** (lockfile updated and verified).
- `node scripts/context.mjs doctor` → **PASS** (HEALTHY; 48/48 symlink & agent configs verified healthy; 34/34 evaluations passed).
- `git diff --check` → **PASS** (zero whitespace or syntax issues).

### Conformance Receipt

- **Report:** `docs/execution/PLN-0009/unit-02-01-conformance-report.json`
- **Report ID:** `report-binding-adhoc-00-00-ab3ad5d2ea88-1791731965226`
- **Binding Hash:** `sha256:ab3ad5d2ea88ac0610624410855c4873061ac82861261aec5c1e7069def32196`
- **Diff Hash:** `sha256:e81f9c24aec151a98c4b45e9903d58e6ff6f1326090a826d66f8e5c8b650986c`
- **Human Evidence:** "Joseph reviewed Unit 02.01 ownership-aware host bridge and repair: independent Codex and Claude discovery symlinks, narrowed Antigravity detection, safe unowned file and symlink collision preservation, closed missing factory path diagnostics, and full test suite passing."
- **Verdict:** **PASS** (47/47 directives). Receipt independently verified via `node app/cli/bin/context-cli.mjs conform verify docs/execution/PLN-0009/unit-02-01-conformance-report.json`.

---

## Unit 03.01: Resolver Boundaries and Host Guidance

### Changes

- Isolated workflow entry adapters from procedural skill recommendations in `scripts/context-core.mjs`:
  - Filtered `skills/workflow-entries/` out of candidate procedural `selectedSkills` (AC-03).
  - Filtered `skills/workflow-entries/` out of workflow-linked skills expansion, ensuring adapter wrappers never leak into prompt context.
- Added host-native workflow routing commands to `ROUTING_HINTS`:
  - Registered Claude Code native entries (`/workflow-<slug>`) and Codex native entries (`$workflow-<slug>`) for all 12 canonical workflows at top routing hint precedence.
  - Expanded `hasAction` and `isExplicitTrigger` to recognize `$` command triggers alongside `/` commands (AC-03).
- Hardened question and ambiguous query handling:
  - Guarded workflow selection against direct factual queries and questions (`isDirectQuestion` matching `how do I...`, `which workflow...`, `what is...`, `explain...`), ensuring questions like "how do I run plan check?" or "Which workflow should I use for database changes?" do not force lifecycle workflows.
  - Required non-hinted workflow score matching to satisfy `relevance.score >= 6 && relevance.matches.length >= 2`, preventing single generic words (e.g. `code` or `change`) from triggering unintended workflows on ambiguous requests (AC-03).
  - Added `maintain` and `update` to `ACTION_TERMS`.
  - Refined context-maintenance routing hint to require bidirectional context-factory or manifest targets (`context-factory ... update`, `update ... context-factory`, `maintain rules`, etc.), eliminating false triggers from queries containing "workflow" and "add".
- Updated `generateWorkflowsMoc` in `app/cli/core/indexer.mjs`:
  - Added `## Host-Native Workflow Discovery (Codex & Claude Code)` section documenting native invocation syntax (`/workflow-<slug>` for Claude Code, `/skills` or `$workflow-<slug>` for Codex) with links to canonical workflows and zero duplicated gate policy (AC-07).
  - Re-labeled internal resolver aliases under `## Internal Resolver Aliases & Prompt Triggers`, clarifying that they are resolver input keywords and prompt triggers rather than registered host slash commands (AC-07).
- Updated `README.md` to document Claude Code and Codex workflow discovery under Multi-Editor Bridging.
- Added evaluation case `evals/cases/workflow-discovery.json` testing native `/workflow-feature-delivery` resolution to `workflows/feature-delivery.md` and verifying adapter exclusion from skills.
- Added integration test suite `evals/tests/bridge/workflow-routing.test.mjs` verifying:
  - Actionable feature, defect, and maintenance requests route to expected canonical workflows with transparent reasons.
  - Direct questions and factual queries avoid forcing lifecycle workflows.
  - Ambiguous requests avoid unjustified confident winners.
  - Claude Code and Codex native host workflow commands route deterministically for all 12 canonical workflows.
  - Legacy slash commands and bracket prefixes maintain full backward compatibility.
  - Workflow entry adapter wrappers are never included in selected procedural skills.
- Synchronized inventory, MOCs, manifest, and lockfile (`context-lock.json` digest: `sha256:77fa4d1e7d06a0370b7be47ae355afd9bb73a08785af650818a95f4733070f44`).

### Verification

- `node --test evals/tests/bridge/workflow-routing.test.mjs` → **PASS** (6/6 tests passed in 41ms).
- `node --test evals/tests/bridge/workflow-routing.test.mjs evals/tests/bridge/workflow-entry-contract.test.mjs evals/tests/bridge/bridge-conformance.test.mjs` → **PASS** (29/29 tests passed in 796ms).
- `npm test` → **PASS** (35/35 evaluations passed in 225ms).
- `npm run lint` → **PASS** (41 rules, 30 skills, 12 workflows, 23 agent resources, 10 knowledge items, 21 evaluations, 532 Markdown files).
- `node scripts/context.mjs doctor` → **PASS** (HEALTHY; 48/48 symlink & agent configs verified healthy; 35/35 evaluations passed).
- `git diff --check` → **PASS** (zero whitespace or syntax issues).

### Conformance Receipt

- **Report:** `docs/execution/PLN-0009/unit-03-01-conformance-report.json`
- **Report ID:** `report-binding-adhoc-00-00-d245fb5d616d-1791732799027`
- **Binding Hash:** `sha256:d245fb5d616d91c7ae7746e6fc689da8c3379a8be273aef0ae5383cf123e3087`
- **Diff Hash:** `sha256:7815b4ddfabf289d6c710495c974846bd8a6fd73091ecdd62a49cedf602ba95e`
- **Human Evidence:** "Joseph reviewed Unit 03.01 resolver boundaries and host guidance: canonical workflow resolution, exclusion of workflow entry adapters from procedural skills, handling of direct questions and ambiguous requests, deterministic routing of Claude Code and Codex native workflow commands, and generated documentation distinguishing host entries from internal aliases."
- **Verdict:** **PASS** (47/47 directives). Receipt independently verified via `node app/cli/bin/context-cli.mjs conform verify docs/execution/PLN-0009/unit-03-01-conformance-report.json`.

---

## Unit 04.01: Whole-Diff and Live-Host Evidence

### Changes & Reconciliations

- Verified 1-to-1 manifest mapping for all 12 canonical workflows to thin adapter sources under `skills/workflow-entries/workflow-<slug>/SKILL.md`.
- Verified host discovery symlinks:
  - 12 workflow entry symlinks + 18 procedural skill symlinks = 30 total skills in `.agents/skills` (Codex discovery root).
  - 12 workflow entry symlinks in `.claude/skills` (Claude Code discovery root).
  - Measured entry names: length 13–38 characters (shortest: `workflow-docs`, longest: `workflow-code-review-and-optimization`), zero truncation or naming collisions observed.
- Validated whole-diff factory health and diagnostics:
  - `node --test evals/tests/bridge/workflow-entry-contract.test.mjs evals/tests/bridge/bridge-conformance.test.mjs evals/tests/bridge/workflow-routing.test.mjs` (29/29 tests passed).
  - `npm run sync`, `npm run lock`, and `npm run lint` passed with 317 canonical pinned paths, 30 skills, 12 workflows.
  - `node evals/run-evals.mjs` (35/35 evaluations passed).
  - `node scripts/context.mjs doctor` passed with HEALTHY status (48/48 symlink & agent configs verified healthy).
- Live Host Smoke Evidence (evaluated separately from factory health per ADR 0038 and S-06):
  - **OpenAI Codex CLI (`0.144.3`):** **PASS**.
    - Executed non-interactive session via `codex exec -m gpt-reserve -s read-only --ephemeral` in workspace root.
    - Verified discovery of all 12 `workflow-*` entries from `.agents/skills/`.
    - Tested bounded invocation on `$workflow-docs`: Codex loaded `skills/workflow-entries/workflow-docs/SKILL.md`, identified canonical lifecycle file `workflows/docs.md`, extracted required inputs (topic/area, audience, historical evidence), confirmed `node scripts/context.mjs resolve` intake instruction, quoted the exact stop condition ("stop and ask for clarification if the target system, timeframe, or baseline benchmark is missing or completely ambiguous"), and confirmed the authority boundary ("selecting it does not grant autonomous execution, merge, release, or waiver authority").
  - **Claude Code CLI (`2.1.112`):** **BLOCKED / PENDING AUTHENTICATION**.
    - Inspected binary at `/Users/joseph/.local/bin/claude` (`2.1.112 (Claude Code)`).
    - Executed invocation attempt via `claude -p "ping test only" --permission-mode dontAsk`.
    - Failed with message: `Not logged in · Please run /login` (exit code 1).
    - Per ADR 0038 and Unit 04.01 Step 5, recorded Claude Code live host invocation as pending user/device login rather than simulating host UI or conflating factory symlink health with live host behavior.

### Verification

- `node --test evals/tests/bridge/workflow-entry-contract.test.mjs evals/tests/bridge/bridge-conformance.test.mjs evals/tests/bridge/workflow-routing.test.mjs` → **PASS** (29/29 tests passed in 825ms).
- `npm run sync && npm run lock && npm run lint` → **PASS** (sync, lockfile, and lint verified).
- `node evals/run-evals.mjs` → **PASS** (35/35 evaluations passed in 212ms).
- `node scripts/context.mjs doctor` → **PASS** (HEALTHY; 48/48 symlink & agent configs verified healthy; 35/35 evaluations passed).
- `git diff --check fa8f5db00cb0d113589190ed15d6752ab3612831` → **PASS** (zero whitespace or syntax issues).

### Conformance Receipt

- **Report:** `docs/execution/PLN-0009/unit-04-01-conformance-report.json`
- **Report ID:** `report-binding-adhoc-00-00-4d4498fc606e-1791733334761`
- **Binding Hash:** `sha256:4d4498fc606e60331e50f57b85d410bace7583b3ec8a8534813de2cc3bd538cf`
- **Diff Hash:** `sha256:48d397d091f9b44a472b011c51af5d7393dae27a01f2d082e8216b1485aef678`
- **Human Evidence:** "Joseph reviewed Unit 04.01 whole-diff and live-host evidence: verified 12 thin workflow adapters, Codex and Claude discovery symlinks, collision-safe bridge generator, narrowed Antigravity detection, resolver question and ambiguous request guards, exclusion of adapters from procedural skills, regenerated catalog and lockfile, 29 passing bridge tests, clean doctor receipt (48/48 symlinks healthy, 35/35 evaluations passed), real Codex CLI live host invocation proving canonical workflow load and stop condition, and recorded Claude Code CLI login prerequisite as blocked/device-pending."
- **Verdict:** **PASS** (47/47 directives). Receipt independently verified via `node app/cli/bin/context-cli.mjs conform verify docs/execution/PLN-0009/unit-04-01-conformance-report.json`.
