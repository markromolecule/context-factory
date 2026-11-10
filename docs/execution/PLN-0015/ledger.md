# PLN-0015 execution ledger

## 2026-11-10 — Unit 01.01 checkpoint: blocked by reviewed scope

- **Batch authority:** The user invoked `execute` against approved packet `docs/execution/PLN-0015/packet.json`; Unit 01.01 is the sole dependency-ready unit. The packet verified with status `approved`, review reference `PLN-0015-plan-review-2026-11-10`, and approval reference `user-approved-PLN-0015-2026-11-10`.
- **Branch/base:** `feat/PLN-0015-grounded-run-context-and-retrieval-evalu` at `5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e`, matching the packet and Unit 01.01. Target base is `master` at the same commit. `plan:check` and `handoff:verify-brief` passed before editing.
- **Affected scope:** `orchestrator/rules/prompt-compiler.mjs` and `evals/tests/rules/prompt-compiler.test.mjs` only. The uncommitted code diff identity is SHA-256 `c8f6204b9f26b322778e07539104575abe0283b0ee2a7ab36dfd2e1e03a1db6f` from `git diff --binary` over those files. Host root: `/Users/joseph/Development/context-factory`.
- **Preflight selection:** `context-cli preflight "Assemble bounded selected source context" --stack typescript --scope orchestrator/rules/prompt-compiler.mjs,evals/tests/rules/prompt-compiler.test.mjs --json` exited 2 with `UNSUPPORTED` because both files are JavaScript/ESM. It selected binding `binding-adhoc-00-00-e3f83225c581` (`sha256:e3f83225c581cfef7e245eaad818a0d1ab978e0074b6fe7f1c609f8e3fc5f523`) and 50 directives, but reported `codeVerification: NOT_RUN`. Applicable global rule sources were read: evidence and claims `sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622`, code quality `sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe`, and security guardrails `sha256:12a5ee167f7c74c9e381f7a336c5930bbe08e8da687f82dcffa39c15125cd0d3`.

### Test-first and implementation evidence

- Initial focused test exited 1 because the new assembler export did not exist. A later test exited 1 because authority scanning still treated source data as instructions. A real KISS/YAGNI case then failed because the first estimate and optional order omitted both notes.
- The current assembler hashes the captured source text, rejects unsafe paths and mismatched provenance, serializes whole sources as escaped JSON data, keeps required shared/workflow/rule content, and admits optional knowledge before lower-priority material. Required overflow raises `INPUT_BUDGET_EXCEEDED` with path/hash-only receipt. The local estimate weights ASCII UTF-8 bytes at 3.5 bytes per token, non-ASCII bytes at 2 bytes per token, and adds message overhead; it is an estimate, not provider usage.
- `node --test evals/tests/rules/prompt-compiler.test.mjs` exited 0 at the recorded diff: 27/27 tests passed. A real resolver/bundle probe for `Explain KISS and YAGNI` included both notes and their hashes at 8,054 estimated tokens under the 9,000 cap; `README.md` was omitted whole and recorded. `git diff --check` exited 0.
- Source authority review: the source section is appended to the user prompt, never the system prompt; JSON escapes angle brackets and line breaks so a fake closing tag remains data. Integrity validation excludes only the exact assembler-produced source section while checking binding directives, and rejects a missing, duplicate, or promoted section. Developer inspection remains pending at this checkpoint.

### Configured host checks and blocker

| Command | Exit | Observed result |
| --- | ---: | --- |
| `pnpm run lint` | 1 | `context-lock.json` stale after the compiler change. |
| `pnpm run test` | 0 | Existing evaluation suite passed 27/27. |
| `pnpm run test:unit` | 1 | 55/57 passed; doctor audit fails because the lock is stale. |
| `pnpm run build` | 0 | Bundle compiled; generated untracked `dist/context-bundle.json` was removed after the check. |
| `node scripts/context.mjs doctor --json` | 1 | Evaluation 27/27 passed, but manifest/lock health failed on the stale lock. |

These host checks ran on an intermediate diff before the final optional-priority adjustment. The focused 27/27 test and real-source probe ran on the recorded final diff. Required host checks must be rerun after the scope correction; no passing status is claimed for the final diff.

**Checkpoint:** Unit 01.01 remains uncommitted and blocked. The reviewed Unit 01.01 write scope excludes `context-lock.json`, while canonical validation requires regenerating it when `prompt-compiler.mjs` changes. `package.json` also defines a build check, contrary to the unit's note that build is unconfigured. Reconcile Unit 01.01's exact scope and verification note through plan review, reissue the packet, then run the required checks and seek developer inspection before committing. No later unit or phase was started.

## 2026-11-10 — Unit 01.01 resumed after scope reconciliation

- **Authorization and handoff:** The user instructed `proceed` after the blocked checkpoint. Plan review added `context-lock.json` to Units 01.01, 03.01, and 03.02 and corrected configured build/unit-test checks across the plan. `plan:check` and `handoff:verify-brief` exited 0. The packet was reissued with review reference `PLN-0015-scope-reconciliation-review-2026-11-10` and approval reference `user-proceed-scope-reconciliation-2026-11-10`; `handoff:verify-packet` exited 0. The task branch and target-base identities still match the packet.
- **Planning baseline:** Approved source context, discovery, revised plan, and packet were committed separately as `199c480f4ebd8eba65d6dbc7ce721831692a8a8d` (`docs(plan): record approved PLN-0015 handoff`). The Unit 01.01 commit contains only its three scoped files and this ledger.
- **Changed scope and diff identity:** `orchestrator/rules/prompt-compiler.mjs`, `evals/tests/rules/prompt-compiler.test.mjs`, and `context-lock.json` at host root `/Users/joseph/Development/context-factory`; SHA-256 of their `git diff --binary` against the planning baseline is `3f4a4f5b9ffdba83fb6f4377d90c23a8ae71197782515c2c2066c3b05ff481b2`. `node scripts/context.mjs lock` exited 0 and pinned 259 canonical paths with digest `sha256:c84f27094aa95d03a18cab3926db7b051c8348db4a4a33bde09def85c7ef0814`.

| Command at the recorded diff | Exit | Evidence |
| --- | ---: | --- |
| `node --test evals/tests/rules/prompt-compiler.test.mjs` | 0 | 27/27 focused tests passed, including source capture, provenance, exact cap, overflow, omission, unsafe path, instruction-like text, and real KISS/YAGNI selection. |
| `pnpm run lint` | 0 | Context Factory lint passed; lock synchronized. |
| `pnpm run test` | 0 | Existing evaluation suite passed 27/27. |
| `pnpm run test:unit` | 0 | Repository unit suite passed 57/57. |
| `pnpm run build` | 0 | Context bundle compiled with the refreshed lock; generated untracked `dist/context-bundle.json` was removed after verification. |
| `node scripts/context.mjs doctor --json` | 0 | Healthy; manifest/lint, lock sync, editor integrity, and evaluations passed. |
| `git diff --check` | 0 | No whitespace errors. |

**Manual review evidence:** Source bodies enter the user prompt as escaped JSON data under an explicit instruction boundary. Path and hash are validated against the captured text; lexical and resolved-path guards reject traversal or links outside the repository. The assembler preserves the original order of included entries, admits optional knowledge first, and omits each rejected source whole with path/hash receipt. The KISS/YAGNI probe included both notes at 8,054 estimated tokens under a 9,000 cap and omitted only `README.md`. Required-source overflow is typed and contains no source bodies. The byte-weighted count is a conservative local estimate, not a provider tokenizer guarantee. No direct provider dispatch changes were made in Unit 01.01.

**Phase 01 checkpoint:** Unit 01.01 is committed on the approved task branch in the commit containing this receipt. All required checks passed. Stop for developer inspection; Phase 02 has not started.

## 2026-11-10 — Unit 02.01 direct runner integration

- **Authorization and handoff:** The user instructed `continue` after Phase 01. `handoff:verify-packet`, `plan:check`, and `handoff:verify-brief` passed on branch `feat/PLN-0015-grounded-run-context-and-retrieval-evalu`; Unit 01.01 is committed as `b09dfb2`. The first Unit 02.01 pass exposed that existing dataset `ds-feat-02` needed 19,313 estimated required-input tokens against the 18,000 direct default. The user explicitly approved the revised Unit 02.01 scope and packet reissue after `plan:check` and brief verification passed. The current packet has review reference `PLN-0015-unit-02-scope-review-2026-11-10` and approval reference `user-approved-PLN-0015-unit-02-eval-cap-2026-11-10`; packet verification passed. The plan/packet correction is committed as `dbf16dd47b202e800d343efb2a4ebf53b8fe159d`.
- **Branch/base and scope:** Task branch as above, target `master`, base `5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e`. The ten scoped files are `orchestrator/runner.mjs`, `app/cli/commands/run.mjs`, `app/cli/bin/context-cli.mjs`, `scripts/harness-cli.mjs`, `schemas/run-result.schema.json`, `evals/tests/rules/prompt-compiler.test.mjs`, new `evals/tests/cli/run-budget.test.mjs`, `evals/run-evals.mjs`, `context-manifest.json`, and `context-lock.json`. Host root: `/Users/joseph/Development/context-factory`. SHA-256 of the tracked-code `git diff --binary` is `f886a1328cc09daae28390ca793bf961b737adf560c9b1c09b6c2841abb0f802`; the new CLI test file SHA-256 is `90275ffef0ecacf484adf135a0320b35815a8e50d01029e0d701900032f3d438`.
- **Preflight selection:** `context-cli preflight "Send bounded selected sources to direct providers" --stack typescript --scope <ten scoped files> --json` exited 2 with `UNSUPPORTED` for JavaScript/JSON scope, binding `binding-adhoc-00-00-4a4e2c42a902` (`sha256:4a4e2c42a902e55f5caae5e096564bf605ae8c3bbd86a715ad542b4dc0b0694d`), 50 selected directives, and `codeVerification: NOT_RUN`. Read applicable rule sources: evidence and claims `sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622`, code quality `sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe`, and security guardrails `sha256:12a5ee167f7c74c9e381f7a336c5930bbe08e8da687f82dcffa39c15125cd0d3`.

### Test-first and implementation evidence

- The new focused tests initially exited 1: the provider received no selected source section, `inputBudget` was absent, invalid caps were accepted, and the harness CLI included options in the request. After integration, provider-boundary and CLI tests passed. Existing material hook tests were given explicit caps so they reach their intended binding-integrity checks. A non-Error provider throw exposed a catch-path failure; a new failing test preceded its fix.
- Direct runs now assemble the selected bundle once, send its exact source section in the lower-priority user prompt, preserve compiled directives in system text, give hooks the assembled prompt, check source/binding integrity after hooks, and recompute the final input estimate before dispatch. Required overflow and hook tampering make zero provider calls. The result-level `inputBudget` contains cap, estimate method, included/omitted paths and hashes, and policy; provider-reported `tokens` stay separate. Mock summaries use the original request rather than echoing source bodies. The `run-result` schema and both public run commands expose the same option and receipt.
- The offline dataset evaluator declares a 32,000-token cap to keep its existing routing fixtures runnable while direct runs retain the resolver's recommended cap. Unit 03.02 still owns removal of golden-output fixture injection. A read-only probe showed the `ds-feat-02` default run rejects at 19,313/18,000; the declared offline cap succeeds at 25,902/32,000 after admitting optional content. A direct caller can raise the cap explicitly when required material exceeds its default.
- `node scripts/context.mjs lock` exited 0 and pinned 260 canonical paths, including the new CLI test, with digest `sha256:c4958b25e14bfad1c654da16a4c557a90325d5e44fc6d56f8263d8301125f972`.

| Command at the recorded diff | Exit | Evidence |
| --- | ---: | --- |
| `node --test evals/tests/rules/prompt-compiler.test.mjs evals/tests/cli/run-budget.test.mjs` | 0 | 38/38 focused tests passed, including full KISS/YAGNI bodies and matching hashes at the provider boundary, directive role placement, exact/overflow behavior, hook tampering, cap validation, CLI paths, schema receipt, and source-body redaction. |
| `pnpm run lint` | 0 | Context Factory lint passed; manifest and lock synchronized. |
| `pnpm run test` | 0 | Existing evaluation suite passed 27/27 under the declared offline cap. |
| `pnpm run test:unit` | 0 | Repository unit suite passed 57/57. |
| `pnpm run build` | 0 | Context bundle compiled; generated untracked `dist/context-bundle.json` was removed after verification. |
| `node scripts/context.mjs doctor --json` | 0 | Healthy; manifest/lint, lock sync, editor integrity, and evaluations passed. |
| `git diff --check` | 0 | No whitespace errors. |

**Manual review evidence:** The provider input contract places source JSON only in `prompt`, never in `systemPrompt`. The post-hook check requires the exact assembled section, so path, hash, and full body remain together; missing, changed, duplicate, or promoted source sections fail before provider dispatch. The final estimated cap includes hook additions. `inputBudget` and error messages omit full source bodies, while actual provider token usage is reported separately. Built-in payload-builder tests verify the prepared prompt remains in each provider's user-message field; no live provider call or broad model-quality claim is made.

**Phase 02 checkpoint:** Unit 02.01 is committed on the approved task branch in the commit containing this receipt. All required checks passed. Stop for developer inspection; Phase 03 has not started.

## 2026-11-10 — Unit 03.01 authenticated endpoint routing

- **Authority and scope:** The user instructed `continue` after the Unit 02.01 checkpoint. The approved PLN-0015 packet, released brief, and plan checks passed before this unit. Branch `feat/PLN-0015-grounded-run-context-and-retrieval-evalu` started this unit clean at `aa2aa857cf45c1effb20ec722fa47ed2492c15e6`; the target base remains `master` at `5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e`. Changed files are exactly `scripts/context-core.mjs`, `evals/tests/resolver/intent-routing.test.mjs`, `context-lock.json`, and this permitted ledger. The scoped code diff SHA-256 is `6740820e2d822ea712494b29e361d0e7bf26756e1b87ca4ee4dbc021df177e02` from `git diff --binary` over the three unit files.
- **Preflight and rules:** Preflight on the three scoped JavaScript/JSON files exited 2 with `UNSUPPORTED`, selected 50 directives, and reported `codeVerification: NOT_RUN`; it did not claim a code PASS. Applicable rule hashes: evidence and claims `sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622`, code quality `sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe`, and security guardrails `sha256:12a5ee167f7c74c9e381f7a336c5930bbe08e8da687f82dcffa39c15125cd0d3`.
- **Test first:** The new focused tests initially failed 2/13: the exact authenticated endpoint request selected no workflow, and an authenticated defect omitted the security rule. Extending the existing feature and security term patterns to whole-word `authenticate`, `authenticated`, `authenticating`, and `authentication` made all 13 pass. The negative order-domain cases and defect precedence pass. Word boundaries keep unrelated longer text outside these matches; generic thresholds and explicit command precedence are unchanged.
- **Selection and budget:** `implement an authenticated orders endpoint` now selects `skills/workflows/feature-delivery/SKILL.md` with reason `routing hint: feature-delivery` and `rules/global/security-guardrails.md` with reason `matched security-sensitive terms in request`. It selects no knowledge notes. The current estimate is 13,659/18,000 total tokens (`optimal`), with 8,654/8,000 rules-and-skills tokens (`warning`). The previous selection had no workflow or security rule, so this is a larger selected set; no comparable prechange token estimate was retained. The density warning is a resolver advisory, not a dispatch-cap failure. `node scripts/context.mjs lock` exited 0 and pinned 260 canonical paths with digest `sha256:a5dbe1696faa5bc6f0a416d3261e11a9153c3b59120ebe626f98e587a9cf0926`.

| Command at the recorded diff | Exit | Evidence |
| --- | ---: | --- |
| `node --test evals/tests/resolver/intent-routing.test.mjs` | 0 | 13/13 focused tests passed. |
| `pnpm run lint` | 0 | Context Factory lint passed; lock synchronized. |
| `pnpm run test` | 0 | Evaluation suite passed 27/27. |
| `pnpm run test:unit` | 0 | Repository unit suite passed 57/57. |
| `pnpm run build` | 0 | Bundle compiled with the refreshed lock; generated untracked `dist/context-bundle.json` was removed after verification. |
| `node scripts/context.mjs doctor` | 0 | Healthy; manifest/lint, lock, editor integrity, and 27/27 evaluations passed. |
| `git diff --check` | 0 | No whitespace errors. |

**Unit 03.01 checkpoint:** Commit this scoped unit and ledger on the approved task branch, then stop for developer inspection before Unit 03.02. The selection receipt proves routing and budget estimates, not answer quality or host code behavior.

## 2026-11-10 — Unit 03.02 grounded offline evaluation

- **Authority and prerequisites:** The user instructed `continue` after Unit 03.01. The approved PLN-0015 packet verified, `plan:check` passed for the task directory, and the released brief verified. Branch `feat/PLN-0015-grounded-run-context-and-retrieval-evalu` started clean at committed Unit 03.01 revision `6d7c813e785889f4a48a06d1a5d6f427c5cb0e6e`; target `master` remains based at `5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e`. Earlier Unit 01.01 and 02.01 receipts remain committed. The four unit files are `evals/run-evals.mjs`, `evals/tests/rules/prompt-compiler.test.mjs`, `.github/workflows/context-factory.yml`, and `context-lock.json`; this ledger is the permitted fifth file. Their `git diff --binary` SHA-256 before this receipt is `949086726747dc53bfe05bb2c9b4a3486d8af0ebb421711bb4a1b836e7bb5c60`.
- **Preflight and rules:** Preflight for the four JavaScript/YAML/JSON files exited 2 with `UNSUPPORTED`, binding `binding-adhoc-00-00-941585e16b89` (`sha256:941585e16b89fac9cd6ebaaa2efff09c1961cbb81cbfd87f987022949ab76acb`), 50 selected directives, and `codeVerification: NOT_RUN`. Applicable rule sources were read and unchanged: evidence and claims `sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622`, code quality `sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe`.
- **Test first and source evidence:** The new deterministic provider parses the marked JSON section from actual `executeRun` provider input, validates hashes, and derives narrow KISS/YAGNI classifications from received bodies. The test holds the expected answer outside the provider. It cites only `knowledge/principles/kiss.md` (`sha256:caa4c31363d68199e25ce4e67e9ab80e0ec55588348ce31d6ca4e8808fba8405`) and `knowledge/principles/yagni.md` (`sha256:ff5bf723ec8c758403a4502b7ab4d893139d83fe4e4e7f6a7f52ae83b2634a2e`) even while other sources are included. Withholding KISS or changing its content fails the answer assertion; retaining a stale hash fails assembly; a canned answer without citations fails provenance. The initial test run exited 1 because the dataset runner still passed a golden fixture. After fixture removal, two historical benchmark JSON files exposed stale `goldenOutput.workflow` values with no declared `expected` route; those values are now reported as historical metadata, while their mock completion status remains checked. Four datasets retain declared routing and mock output checks. No dataset files or production resolver/provider code changed.
- **CI and lock:** The pull-request workflow now runs the exact focused Node test command after doctor; the earlier failing focused command exited 1, showing the command propagates a failure before the fix. `node scripts/context.mjs lock` exited 0 and pinned 260 canonical paths with digest `sha256:50ee910f64442f2b3652e0c7051b7c3cb264f73fa4988443f5a2bcc31bbe7673`.

| Command at the recorded diff | Exit | Evidence |
| --- | ---: | --- |
| `node --test evals/tests/rules/prompt-compiler.test.mjs evals/tests/cli/run-budget.test.mjs evals/tests/resolver/intent-routing.test.mjs` | 0 | 57/57 focused source, budget, and routing tests passed. |
| `node scripts/context.mjs eval` | 0 | 27/27 factory evaluations passed, including all six dataset paths without fixture injection. |
| `pnpm run lint` | 0 | Context Factory lint passed; lock synchronized. |
| `pnpm run test` | 0 | Evaluation suite passed 27/27. |
| `pnpm run test:unit` | 0 | Repository unit suite passed 57/57. |
| `pnpm run build` | 0 | Bundle compiled with the refreshed lock; generated untracked `dist/context-bundle.json` was removed. |
| `node scripts/context.mjs doctor` | 0 | Healthy; manifest/lint, lock, editor integrity, and evaluations passed. |
| `git diff --check` | 0 | No whitespace errors. |

**Phase 03 checkpoint and evidence limit:** Commit this unit and ledger, then stop for developer inspection. The new tests show that selected repository text, paths, and hashes reach an offline deterministic provider and that source removal or mutation fails a narrow answer/provenance assertion. The mock datasets prove routing and contract behavior only; historical benchmark cases check mock completion. No live-model answer quality or general reasoning claim is made.
