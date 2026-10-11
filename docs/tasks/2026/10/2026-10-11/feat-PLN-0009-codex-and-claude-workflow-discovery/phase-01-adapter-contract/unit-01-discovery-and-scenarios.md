---
title: "Canonical workflow adapter inventory"
type: unit
parent: "phase-01-adapter-contract"
unit: "01.01"
task_branch: "feat/PLN-0009-codex-and-claude-workflow-discovery"
base_commit: "fa8f5db00cb0d113589190ed15d6752ab3612831"
status: verified
created: "2026-10-11"
tags: [task, unit, contract]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Canonical Workflow Adapter Inventory

> Task branch: `feat/PLN-0009-codex-and-claude-workflow-discovery` · Base: `fa8f5db00cb0d113589190ed15d6752ab3612831`

## Objective

Create one thin, auditable project entry for each canonical workflow in both hosts, with the workflow file as the only lifecycle policy owner.

## Context packet

The released brief requires all 12 `context-manifest.json` workflows to be discoverable in Codex `.agents/skills` and Claude `.claude/skills`. ADR 0003 separates workflows from procedural skills; ADR 0038 accepts thin entry skills. Today the manifest lists workflows and skills separately, `.agents/skills` contains the 18 procedural skills, and `.claude/skills` does not exist. The user accepted Codex `/skills` or `$name` and Claude `/name`. Choose deterministic `workflow-<canonical-slug>` names, generated from the workflow inventory. Entries instruct the host to read the named canonical file and resolve the user's actual request; they do not copy phase or stop text. This unit serves AC-01 and AC-07. Preserve existing skill names and files. Host bridge installation is Unit 02.01.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.reject-duplicate-policy][mode:evidence-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
- [directive:cf.arch.contracts][mode:evidence-blocking] rules/global/architecture-conformance.md sourceHash:sha256:ebd1818f58e6c3421d803fae8905b2077036fe7eec8e228cc6130066cd95af92
</language_rules>

**Rule satisfaction:** Restrict edits to inventoried entry sources, links, and validation. Keep canonical workflow contracts untouched. Test the one-to-one contract and record exact scope in the review.

## Preconditions

- Verify `git symbolic-ref --quiet --short HEAD` equals the recorded task branch and inspect `git status --short`; stop for mismatch or unrelated dirty state.
- Reconfirm released brief and read the current manifest, all workflow frontmatter/filenames, existing skill frontmatter, `scripts/validate-context.mjs`, indexer inventory logic, and ADR 0038. Recompile binding hashes at execution.

## Scope

**In scope:** `skills/workflow-entries/workflow-*/SKILL.md` (new), `.agents/skills/workflow-*` (new links), `.claude/skills/workflow-*` (new links), `context-manifest.json`, `scripts/validate-context.mjs`, `app/cli/core/indexer.mjs` (inventory output only), `evals/tests/bridge/workflow-entry-contract.test.mjs` (new), `context-lock.json`, `docs/Skills.md`.

**Out of scope:** `workflows/*.md` policy rewrites, ordinary skill edits, host bridge generator, resolver selection, consumer application files, and deprecated Codex prompt files.

## Steps

1. Write failing contract cases for all manifest workflows: exact one-to-one name mapping, unique names vs existing skills, valid target and canonical file, absence of copied phase/gate policy, and rejection of missing, duplicate, stale, or broken entries. Include both host directories.
2. Add only thin adapter source files and local host discovery links. Each entry identifies its canonical workflow path, requires reading it, passes the actual request to `node scripts/context.mjs resolve`, and defers all gates/authorization to the workflow and shared contract. Do not embed a second policy body.
3. Extend validation/inventory so `sync` and `doctor` can detect missing or stale entries, including a newly added workflow. Record any manifest schema addition and update maps/lock deterministically.
4. Run focused tests, `npm run sync`, `npm run lock`, `node scripts/context.mjs doctor`, fresh preflight and conform; review the exact unit diff and commit only after PASS.

## Verification

- **Contract/architecture tests:** `node --test evals/tests/bridge/workflow-entry-contract.test.mjs` checks mapping and canonical dependency; without it a valid-looking skill could point to the wrong workflow or duplicate policy.
- **Catalog check:** `node scripts/context.mjs doctor` and `npm run sync` catch drift across manifest, maps, and links; neither proves live host invocation.
- **Conformance gate:** Compile `node app/cli/bin/context-cli.mjs preflight` for exact scope, then run `node app/cli/bin/context-cli.mjs conform` and verify its persisted PASS report and binding/diff hashes. Stop on FAIL/BLOCKED. Commands and receipt paths are recorded at execution.

## Rollback

Revert this unit's source, manifest, validator, and generated map/lock commit; remove only links introduced by this unit after confirming their recorded targets. Canonical workflow files stay intact.

## Definition of done

- [x] AC-01 and AC-07 contract checks pass.
- [x] Exact task branch, scoped diff, and review confirmed.
- [x] Factory inventory and lock synchronized; doctor passed.
- [x] Fresh unit conformance PASS receipt verified and change committed.
