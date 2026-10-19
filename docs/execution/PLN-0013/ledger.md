# PLN-0013 execution ledger

Task branch: `refactor/PLN-0013-harden-typescript-harness`
Target base: `master` at `e53ab5b1489618bedeee44292716acd1cd91249c`
Approved packet: `docs/execution/PLN-0013/packet.json`
Batch: ready units 01.01 and 01.04; checkpoint ready for developer inspection. Phase 01 remains open.

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
