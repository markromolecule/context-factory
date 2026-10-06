---
title: "Mandatory Prompt Compiler and Runner Integration"
type: unit
parent: "phase-02-binding-and-prompt"
unit: "02.03"
branch: "task/0001/phase-02/prompt-compiler-runner"
worktree: ".worktrees/0001/phase-02/prompt-compiler-runner"
status: planned
created: "2026-10-06"
tags: [task, unit, prompt, runner]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 02.03: Mandatory Prompt Compiler and Runner Integration

## Objective

Compile bound directives and provenance into every default provider request and fail before dispatch when a required binding cannot be prepared.

## Context packet

- `orchestrator/runner.mjs:219-234` changes prompts only when a caller supplies `onPromptPrepare`.
- `scripts/harness-cli.mjs:63-109` already materializes source-complete bundles, but `run` bypasses them.
- Preserve custom hooks as extensions after mandatory compilation; they may not remove required directive content.
- AC-03 and SC-03.

<language_rules>
- `rules/global/security-guardrails.md`: Only validated repository-root policy sources enter the system prompt; omit secrets/unrelated source.
- `rules/typescript/common/async-discipline.md`: Await compilation and provider dispatch; propagate preparation failure without floating work.
- `rules/solid/dependency-inversion.md`: Runner depends on a prompt-compiler contract, not filesystem details.
- `rules/solid/interface-segregation.md`: Provider adapters receive the compiled prompt/system payload and binding receipt only.
</language_rules>

## Preconditions

- Unit 02.01 binding compiler is merged.

## Scope

**In scope:** new `orchestrator/rules/prompt-compiler.mjs`; `orchestrator/runner.mjs`; `scripts/harness-cli.mjs`; `app/cli/commands/run.mjs`; new `evals/prompt-compiler.test.mjs`.

**Out of scope:** post-generation conformance, adapter commands, review skills, and bridges.

## Steps

1. Render concise `<language_rules>` directives with stable IDs, modes, provenance, and binding digest; retain full sources in the bundle/receipt.
2. Make mandatory compilation occur before user `onPromptPrepare`; validate afterward that required anchors/digest were not removed.
3. Connect `run` and legacy harness CLI to the same bundle/compiler path.
4. Fail closed before provider invocation for invalid/missing material-code bindings.
5. Add capture-provider tests for mock/custom/OpenAI-compatible/Anthropic/Gemini payload preparation without network calls.

## Verification

- **Integration tests:** prove exact compiled payload reaches every provider boundary and custom hooks cannot erase it.
- **Security negative tests:** unsafe path/source and prompt-authority override attempts reject.
- Command: `node --test evals/prompt-compiler.test.mjs`.

## Rollback

Restore raw prompt dispatch behind compatibility mode; keep binding artifacts available for diagnosis.

## Definition of done

- [ ] AC-03 passes without custom hooks.
- [ ] Provider is never invoked after compilation failure.
- [ ] Prompt content is scoped and hash-linked, not a full catalog dump.
- [ ] Unit passes `/review` and regression evaluations.
