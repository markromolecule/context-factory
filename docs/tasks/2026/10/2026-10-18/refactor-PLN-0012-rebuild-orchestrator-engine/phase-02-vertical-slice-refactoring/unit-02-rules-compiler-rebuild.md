---
title: "Rebuild Rule Compiler and Parser Suite"
type: unit
parent: "phase-02-vertical-slice-refactoring"
unit: "02.02"
task_branch: "refactor/PLN-0012-rebuild-orchestrator-engine"
base_commit: "6c438fe680f30ff876188e056618ee058f57abc9"
status: planned
created: "2026-10-18"
tags: [task, unit, orchestrator, rules, parser, compiler]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 02.02: Rebuild Rule Compiler and Parser Suite

> Phase: phase-02-vertical-slice-refactoring · Depends on: 02.01 · Parallelizable with: none  
> Task branch: refactor/PLN-0012-rebuild-orchestrator-engine · Base commit: 6c438fe680f30ff876188e056618ee058f57abc9

## Objective

Rebuild and streamline [`orchestrator/rules/descriptor-parser.mjs`](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/orchestrator/rules/descriptor-parser.mjs), [`orchestrator/rules/binding-compiler.mjs`](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/orchestrator/rules/binding-compiler.mjs), and [`orchestrator/rules/prompt-compiler.mjs`](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/orchestrator/rules/prompt-compiler.mjs), simplifying frontmatter and directive parsing, scope-based binding compilation, and prompt rendering while maintaining deterministic SHA-256 hashes.

## Context packet

- **Key Functions and Invariants:**
  1. `descriptor-parser.mjs`:
     - `parseRuleDescriptor(markdownContent, rulePath, options)` parses YAML frontmatter and `<!-- rule: <id> mode:<mode> verifier:<verifier> -->` markers.
     - `parseRuleCatalog(rulesDir, options)` scans recursively and constructs the active rule catalog array.
  2. `binding-compiler.mjs`:
     - `matchesGlob(filePath, pattern)` evaluates minimatch-like glob patterns (`*`, `**`, `*.ts`, etc.) without external libraries.
     - `compileRuleBinding({ rules, stack, affectedScope, waivers, requireBinding, ... })` matches rule `appliesTo` and `stack` constraints, binds directives, attaches active human waivers, and calculates deterministic `bindingHash`.
  3. `prompt-compiler.mjs`:
     - `renderCompiledDirectives(binding)` converts directives into clean Markdown tables/lists for prompt injection.
     - `compilePrompt({ request, systemPrompt, selection, binding, options })` merges instructions with directives and creates prompt bundles.
     - `validatePromptIntegrity({ prompt, systemPrompt, binding })` verifies that mandatory blocking directives and hashes remain present in prepared prompts.

<language_rules>
- [directive:cf.arch.solid][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.arch.direction][mode:automated-blocking] rules/global/architecture-conformance.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 02.01 complete (`orchestrator/validator.mjs` rebuilt and passing tests).
- Active branch is `refactor/PLN-0012-rebuild-orchestrator-engine`.

## Scope

**In scope:**
- `orchestrator/rules/descriptor-parser.mjs`
- `orchestrator/rules/binding-compiler.mjs`
- `orchestrator/rules/prompt-compiler.mjs`  
**Out of scope:** `orchestrator/runner.mjs`, rule content under `rules/`.

## Steps

1. Rebuild `descriptor-parser.mjs` with clear regex for frontmatter and marker extraction, and resilient recursive catalog scanning.
2. Rebuild `binding-compiler.mjs` with deterministic glob matching, stack/scope filtering, and SHA-256 hash generation.
3. Rebuild `prompt-compiler.mjs` with clear rendering of `<language_rules>` blocks and strict integrity verification.
4. Run unit tests for descriptor parser, binding compiler, and prompt compiler.

## Verification

- **Automated Tests:**
  - `node --test evals/tests/rules/rule-descriptor-parser.test.mjs`
  - `node --test evals/tests/rules/rule-binding.test.mjs`
  - `node --test evals/tests/rules/prompt-compiler.test.mjs`
- **Justification:** Exercises rule frontmatter parsing, glob-based scope filtering, waiver attachment, and prompt integrity validation.

## Rollback

- `git checkout HEAD -- orchestrator/rules/`

## Definition of done

- [ ] Maps to acceptance criteria: AC-02, AC-03
- [ ] Executed on task branch `refactor/PLN-0012-rebuild-orchestrator-engine`
- [ ] Parser, binding, and prompt compiler tests all pass
