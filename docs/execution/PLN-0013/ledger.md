# PLN-0013 execution ledger

Task branch: `refactor/PLN-0013-harden-typescript-harness`
Target base: `master` at `e53ab5b1489618bedeee44292716acd1cd91249c`
Approved packet: `docs/execution/PLN-0013/packet.json`
Latest batch: unit 02.02; Phase 02 in progress. Full evaluation failures remain open.

## Handoff and context

- `handoff:verify-packet` and `handoff:verify-brief`: exit 0; packet and released brief valid.
- Branch and clean checkout matched the packet before edits. The packet has no unit/file scope; the user explicitly authorized reading the reviewed unit files to execute this batch.
- Resolver selected 18 informational rules and six skills for the batch prompt, including unrelated TypeScript backend/database rules; it emitted no binding without scope. Selected unit rules were read directly from `rules/global/evidence-and-claims.md`.
- `context-cli preflight` for the `.mjs` checker/test scope returned exit 0 with a binding and 47 directives, but labels the JavaScript scope as TypeScript. This is selection evidence only, not code conformance. It ran after the 01.04 edit and does not satisfy a pre-edit chronology claim.

## Scope note before unit 01.01 edits

The unit explicitly calls for a dedicated active-command contract test but does not name its new file in the in-scope list. Add `evals/tests/cli/active-contract.test.mjs` as the focused test owner. Add `docs/decisions/README.md` to register ADR 0041 in the decision index. Validation also requires `context-manifest.json` to list the new ADR and evaluation test, and `context-lock.json` to synchronize source hashes. These two generated inventory files are the only additional scope. The broad `sync` command would also repair factory host symlinks, so it is not used for this unit. No unrelated source is in scope.

## Unit 01.04 — scaffolded master validation

| Evidence | Result |
| --- | --- |
| New public CLI regression test on original checker | `node --test tests/cli/plan-check-layout.test.mjs`: exit 1, 0/4; the original checker falsely passed missing brief, blocker, and missing/ambiguous master cases. |
| Checker change and focused tests | `node --test tests/cli/plan-check-layout.test.mjs`: exit 0, 4/4. |
| Existing plan-check regression suite | `node --test evals/tests/lifecycle/plan-check.test.mjs`: exit 0, 15/15. |
| Real PLN-0013 plan CLI report | `plan:check ... --json`: exit 0, 11 units, acyclic, `doneCheck.applicable=true`, `handoff.applicable=true`, both valid. |

Modified files: `scripts/plan-check.mjs`, `tests/cli/plan-check-layout.test.mjs`. Unit commit: `775b628` (`fix(01.04)`). The lock hash for this code change is included in the subsequent 01.01 inventory commit; this intermediate commit alone is not a synchronized factory snapshot. The batch HEAD is the verification target. The preflight selection was run after the initial edit, so the pre-edit policy chronology is unproven and remains explicit at this checkpoint.

## Unit 01.01 — superseding contract

| Evidence | Result |
| --- | --- |
| New contract test on original guidance | `node --test evals/tests/cli/active-contract.test.mjs`: exit 1, 1/3; active template invoked dead `conform`, and ADR 0041 was absent. |
| Contract test after ADR and guidance | Same command: exit 0, 3/3, including dead-command fixture. |
| Initial catalog validation after source changes | `node scripts/validate-context.mjs`: exit 1 for new decision, new tool, and stale lock inventory; fixed through scoped manifest and lock synchronization. |
| Catalog and health | `node scripts/validate-context.mjs`: exit 0; `node scripts/context.mjs doctor`: exit 0, 27/27 evaluations. |
| Host lint and core tests | `pnpm run lint`: exit 0; `pnpm run test:unit`: exit 0, 40/40. Typecheck and build scripts are unconfigured for this factory package. |
| Integrated plan handoff | `plan:check ... --json`: exit 0, 11 units, both done-check and brief handoff applicable/valid; `handoff:verify-packet`: exit 0. |
| Preflight selection | `context-cli preflight ... --require-binding --json`: exit 0, binding `binding-adhoc-00-00-92b469e66064`, 8 directives for selected Markdown scope. This is selection only; it ran after the documentation edit. |
| Skill access contract | `skill:access-check` initially exited 1 because the touched `plan` skill lacked an access declaration. After adding its read/write/exposure declaration, the same check exited 0 for `plan`, `plan-review`, and `execute`. |

Modified files: ADRs 0029, 0035, 0039, new 0041, decision index, task and unit templates, `orchestrator/SHARED.md`, `plan`, `plan-review`, and `execute` skills, focused contract test, manifest, and lock. Main unit commit: `8413f5f` (`docs(01.01)`); the access declaration and refreshed lock are a follow-up correction. Active runtime `conform` references in CLI/CI remain assigned to 01.02. Runtime conformance is intentionally unavailable under ADR 0041; no such check was run or claimed. Human evidence for the two user decisions is in the released brief; the batch remains subject to developer inspection.

## Batch checkpoint

AC-01 and AC-11 have focused positive and negative evidence. No later unit or phase has started. No merge, push, or full evaluation-suite completion is claimed; the prior 203/207 full-evaluation baseline remains to be addressed by later units. Pre-edit selection chronology is an explicit process limitation for this batch, not a claimed PASS. The current packet hashes the master plan but not individual unit files; branch/base and user-authorized unit reading were checked, while unit-content binding remains a handoff limitation for future review.

## Unit 01.02 scope note before edits

The reviewed unit owns the public CLI export, GitHub CI generator, its focused test, harness dispatcher, and CLI README. Updating tracked source hashes will also require `context-lock.json`; that generated lock is the only anticipated scope addition. The existing dispatcher has no `conform` command or help entry, so it may need no edit. The generator will inspect host `package.json` scripts while installing a workflow, emit configured pnpm checks, and reject an explicitly requested check whose script is absent. This preserves `app/cli/commands/init.mjs` outside the reviewed unit scope.

## Unit 01.02 — CLI exports and generated CI

Starting revision: `1b56271e28736d23dfe32b66682856f976741229`. The packet, released brief, exact task branch, clean checkout, and unchanged `master` base were verified before edits. `plan:check ... --json` exited 0 with 11 units, valid language rules, done-check, and handoff. Pre-edit `context-cli preflight ... --stack typescript --scope app/cli/index.mjs,app/cli/core/github-gate-generator.mjs,evals/tests/cli/github-gate.test.mjs --require-binding --json` exited 0 with binding `binding-adhoc-00-00-aaa149a7d1ee`, hash `sha256:aaa149a7d1ee75df419731264c4bf056bfcb52c2199e4894f1b1e75f971a1752`, and 47 directives. The `.mjs` scope was incorrectly labelled TypeScript by current preflight; this is selection evidence only and remains assigned to later scope work.

| Evidence | Result |
| --- | --- |
| Test-first regression against original CLI/CI | `node --test evals/tests/cli/github-gate.test.mjs`: exit 1; missing public export, dead `conform` steps, missing configured checks, and false green for absent scripts were exposed. |
| Focused contract and executable fixture after implementation | Same command: exit 0, 17/17; temporary host ran every emitted shell block, including dependency install, doctor, and four pnpm checks. Negative cases covered missing script, missing lock, failing script, foreign manager, unsafe command, and legacy workflow conflict. |
| Public import | `node --input-type=module -e 'import("./app/cli/index.mjs")'`: exit 0. |
| Factory checks | `pnpm run lint`: exit 0; `pnpm run test:unit`: exit 0, 40/40; `pnpm run build --out /tmp/pln0013-unit0102-bundle.json`: exit 0; `node scripts/validate-context.mjs`: exit 0; `node scripts/context.mjs doctor`: exit 0, 27/27; `git diff --check`: exit 0. |
| Inventory and plan | `node scripts/context.mjs lock`: exit 0, digest `sha256:a29f6650e76cc7c89f802eb536fc3ead4c19553d2edc0d9a767cc299febbe465`; final `plan:check ... --json`: exit 0. |

Modified files: `app/cli/index.mjs`, `app/cli/core/github-gate-generator.mjs`, `app/cli/README.md`, `evals/tests/cli/github-gate.test.mjs`, `context-lock.json`, and this ledger. `scripts/harness-cli.mjs` was inspected and had no dead `conform` dispatcher/help entry, so it was not changed. The factory package has no configured typecheck script. Full evaluation tests were not run for this unit; the prior 203/207 baseline remains open for later units. Human decision evidence is in the released brief. Phase 01 remains open, and this batch stops for developer inspection under the execute skill.

## Unit 01.03 scope note before edits

The user invoked `execute` again after the 01.02 checkpoint, authorizing the next ready Phase 01 batch, unit 01.03. The approved packet has no unit list; the reviewed 01.03 file was read under the user's earlier explicit permission to use reviewed unit files. The unit owns `app/cli/commands/preflight.mjs`, `scripts/harness-cli.mjs`, and new `tests/cli/preflight.test.mjs`. The harness dispatcher already delegates to the same handler, so it may need no edit. If a tracked canonical path changes, refresh `context-lock.json` before verification; no other implementation scope is planned. Material preflight will require TypeScript file coverage and a nonempty binding, while direct informational questions may return an explicit information-only receipt. Unsupported JS/JSX paths retain applicable global/security directive information when present and cannot be labelled TypeScript-ready.

## Unit 01.03 — fail-closed preflight selection

Starting revision: `0e7b1c7`. Approved packet and released brief verified (exit 0); exact task branch, clean checkout, and `master` base `e53ab5b1489618bedeee44292716acd1cd91249c` matched before edits. `plan:check ... --json` exited 0 with 11 units and valid language rules, done-check, and handoff. Pre-edit selection for the `.mjs` source and test exited 0 with binding `binding-adhoc-00-00-1df0a2363737`, hash `sha256:1df0a236373736f132fd6e2461bf86157f9dc48b6ba4b9c0fa0dd9b045f4a37d`, and 47 directives. This is selection evidence only: the old command wrongly labelled JavaScript scope TypeScript and said PASS.

| Evidence | Result |
| --- | --- |
| Test-first negative cases | `node --test tests/cli/preflight.test.mjs`: exit 1 against the old handler; no-scope, JS/JSX, zero-directive, and harness-dispatch cases exposed false PASS/exit 0. |
| Focused CLI contract | Same command after implementation: exit 0, 10/10. Empty and material no-scope requests return BLOCKED/exit 2; JS/JSX and mixed scopes return UNSUPPORTED/exit 2; zero directives return BLOCKED/exit 2; scoped TypeScript returns READY with binding identity and `codeVerification: NOT_RUN`; direct questions return INFORMATION. Applicable global/security IDs remain visible on supported JavaScript descriptor matches. |
| Host and catalog checks | `pnpm run test:unit`: exit 0, 50/50; `pnpm run lint`: exit 0; `pnpm run eval`: exit 0, 27/27; `pnpm run build --out /tmp/pln0013-unit0103-bundle.json`: exit 0; `node scripts/validate-context.mjs`: exit 0; `node scripts/context.mjs doctor`: exit 0, 27/27; `git diff --check`: exit 0. No typecheck script is configured. |
| Lock and plan | `node scripts/context.mjs lock`: exit 0, digest `sha256:4bca6e70a5c4a463a170dc25b2d1cf0794d8b1fa09abed1b945c2dd05cd961bf`; final `plan:check ... --json`: exit 0. |
| Broader evaluation suite | `node --test evals/tests/**/*.test.mjs`: exit 1, 210/215. Three underlying assertions fail in host bridge/discovery and execution-skill wording tests. Those read files were unchanged in 01.03; they are unresolved suite findings, not a PASS claim. The host integration work is assigned to a later unit, while the execution-skill expectation needs reconciliation. |

Modified files: `app/cli/commands/preflight.mjs`, `scripts/harness-cli.mjs`, new `tests/cli/preflight.test.mjs`, `context-lock.json`, and this ledger. The dispatcher logic itself was already shared with the public CLI, so only its help text changed. AC-03 has positive and negative executable evidence. Human decision evidence is in the released brief. The Phase 01 unit set reaches its checkpoint here; no merge or push is claimed, and the failing broader evaluation suite remains open for developer inspection.

## Ship gate and Phase 02 unit 02.01 scope note before edits

The user invoked `commit-push-release` and then `execute`. The working tree was clean at `dbcccb3`; `pnpm run lint`, `pnpm run test:unit` (50/50), `pnpm run test` (27/27), and doctor passed. The broader `node --test evals/tests/**/*.test.mjs` suite exited 1 at 210/215, with host discovery and execution-skill wording assertions failing. The `commit-push-release` skill requires a stop when tests fail, so no push, tag, or release was made. The user then explicitly chose to continue approved execution batches first and retry the push after the full suite passes.

The next ready Phase 02 batch is unit 02.01. Its reviewed scope owns `scripts/context-core.mjs` and new `evals/tests/resolver/intent-routing.test.mjs`. Registering the new evaluation test adds `context-manifest.json`; changing locked canonical sources adds `context-lock.json`. These two inventory files and this ledger are the only scope additions. Material JavaScript scope is unsupported by current preflight; no TypeScript conformance claim will be made for `.mjs` files.

Before metrics from the real resolver: a direct plan-workflow question selected 17 rules, two skills, all ten knowledge files, and about 32,109 tokens. Investigation selected 15,318 tokens; defect 28,229; `/plan` 36,009; `/execute` 25,559. All five loaded all ten knowledge files. The unit will retain applicable global/security obligations and explicit workflow triggers while removing unrelated context.

## Unit 02.01 execution receipt and checkpoint

Starting revision: `dbcccb3`. The approved packet, released brief, exact task branch, clean checkout, target `master` base, and `plan:check` (11 valid units) were verified before edits. The reviewed unit's `.mjs` scope is unsupported by the TypeScript preflight contract; no binding or TypeScript code-verification PASS is claimed. Applicable rule hashes remain `cf.evidence.scope-fencing` and `cf.evidence.verification` at `sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af`, and `cf.quality.tests-for-behavior-changes` at `sha256:4c42d15b81106b8bb6c117edd3d88808740db4f09f175f0112588990d887fa25`.

| Evidence | Result |
| --- | --- |
| Test-first resolver cases | New `node --test evals/tests/resolver/intent-routing.test.mjs`: exit 1 against baseline (6/7 failed). A later negative case proved unscoped feature context exceeded the 18,000-token budget (26,371 tokens). After implementation: exit 0, 8/8. Adjacent workflow-routing suite: exit 0, combined 14/14. |
| Measured routing | Direct question 32,109 → 8,492 tokens; investigation 15,318 → 5,681; scoped authorization defect 28,229 → 14,979; `/plan` 36,009 → 10,589; scoped `/execute` 25,559 → 12,796. Each now selects zero unrelated knowledge files. Unscoped feature selection is 13,186/18,000 tokens and retains architecture, code-quality, evidence, and planning gates. The 9,000-token direct-question ceiling accounts for the fixed entrypoint/orchestration contract plus its named procedure; other ceilings are fixture-based and reported as `totalStatus`. |
| Behavior and compatibility | Direct questions avoid lifecycle workflows; explicit skills load exactly their procedure; scoped material work omits future-phase procedures while retaining applicable rules and security; unscoped material work retains default workflow procedures and selects TypeScript rules by relevance. Named active canonical knowledge notes load on demand. `pnpm run test`: exit 0, 27/27. |
| Configured checks | `pnpm run lint`: exit 0; `pnpm run test:unit`: exit 0, 50/50; `pnpm run build`: exit 0; `node scripts/context.mjs doctor`: exit 0, including 27/27 evaluations; `node scripts/validate-context.mjs`: exit 0; `git diff --check`: exit 0. No typecheck script is configured for this JavaScript unit. |
| Inventory | `node scripts/context.mjs lock`: exit 0, digest `sha256:057e73b6d89992379353ccfcf488a63d005d160602fe6e35eb428205d5e6b7c8`; new resolver test is registered in `context-manifest.json`. |
| Broader suite | `node --test evals/tests/**/*.test.mjs`: exit 1, 218/223. Five failures are the same three underlying host discovery and execution-skill wording assertions present before 02.01. No broader-suite PASS, push, tag, or release is claimed; shipping remains gated until they are resolved. |

Modified files: `scripts/context-core.mjs`, new `evals/tests/resolver/intent-routing.test.mjs`, `context-manifest.json`, `context-lock.json`, and this ledger. AC-04 has positive and negative executable evidence. The released brief contains the required human decisions. This completes only the ready 02.01 batch and stops for its developer checkpoint.

## Unit 02.02 scope note before edits

The user invoked `execute` after the 02.01 checkpoint, authorizing the next ready batch, unit 02.02. The approved packet and released brief verified; branch `refactor/PLN-0013-harden-typescript-harness` is clean at `4c9f915`, its `master` merge base remains `e53ab5b1489618bedeee44292716acd1cd91249c`, and `plan:check` passed with 11 valid units. An initial `plan:check` attempt pointed at the master `.md` file and failed `ENOTDIR`; rerunning it against the task directory passed. The reviewed 02.02 unit depends on the committed 02.01 receipt and owns `scripts/framework-scope.mjs`, `scripts/context-core.mjs`, and new `evals/tests/resolver/framework-scope.test.mjs`. Registering the new test requires `context-manifest.json`; synchronizing canonical source hashes requires `context-lock.json`. These inventory files and this ledger are the only anticipated scope additions. The `.mjs` source is outside TypeScript preflight support, so no TypeScript conformance claim will be made for this unit.

## Unit 02.02 execution receipt and checkpoint

Starting revision: `4c9f9151e102646ea3ce075d318f8df5a9cd9eec`. The approved packet, released brief, exact task branch, clean checkout, target `master` base, committed 02.01 receipt, and final `plan:check` (11 valid units) were verified. The unit's `.mjs` implementation is unsupported by TypeScript preflight; no code conformance PASS is claimed. Applicable rule hashes remain `cf.evidence.scope-fencing` and `cf.evidence.verification` at `sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af`, and `cf.quality.tests-for-behavior-changes` at `sha256:4c42d15b81106b8bb6c117edd3d88808740db4f09f175f0112588990d887fa25`.

| Evidence | Result |
| --- | --- |
| Test-first integration cases | New `node --test evals/tests/resolver/framework-scope.test.mjs`: exit 1, 0/6 against baseline. It exposed prompt-only scoped framework inference, TypeScript rule leakage into JS/JSX, and absent package/coverage receipts. After implementation and fixture coverage: exit 0, 9/9. Adjacent intent/workflow routing: exit 0, combined 23/23. |
| Package and language behavior | Fixture root Next, sibling React/Solid/plain, and nested Next packages resolve each affected TS/TSX file to its owning `package.json`; sibling and prompt words do not cross the package boundary. React hook `.ts` selects React guidance. Scoped JS/JSX returns `UNSUPPORTED` TypeScript coverage, mixed TSX+JS reports each path separately, and `.mts` without matching TypeScript rules reports explicit unsupported coverage. Applicable global/security selection remains on `.js`; the current global rule metadata does not list `.jsx`, a catalog applicability gap for later rules work. Unscoped prompt hints are marked `request-hint`, never presented as package evidence. |
| Compatibility and host checks | The first implementation regressed no-scope selection (`pnpm run test`: 21/27, then 26/27); preserving provisional hints only without affected scope restored exit 0, 27/27. Final `pnpm run lint`: exit 0; `pnpm run test:unit`: exit 0, 50/50; `pnpm run build`: exit 0; `node scripts/context.mjs doctor`: exit 0, 27/27; `node scripts/validate-context.mjs`: exit 0; `git diff --check`: exit 0. No typecheck script is configured for this JavaScript unit. |
| Inventory | `node scripts/context.mjs lock`: exit 0, digest `sha256:a291f2d99db2ce2a5c2956af6e24e0bc3b8b0138e3416ad2f8e44f11d6c76e87`; the new resolver test is registered in `context-manifest.json`. |
| Broader suite | `node --test evals/tests/**/*.test.mjs`: exit 1, 227/232. Five failures remain the same three underlying host discovery and execution-skill wording assertions seen before 02.02. This unit makes no broader-suite PASS, push, tag, or release claim. |

Modified files: `scripts/framework-scope.mjs`, `scripts/context-core.mjs`, new `evals/tests/resolver/framework-scope.test.mjs`, `context-manifest.json`, `context-lock.json`, and this ledger. AC-05 has package, language, and unsupported-coverage evidence. The released brief contains the required human decisions. This completes only the ready 02.02 batch and stops for developer inspection.
