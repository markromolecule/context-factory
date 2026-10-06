---
title: "Descriptor Parser and Pilot Rules"
type: unit
parent: "phase-01-contract-foundation"
unit: "01.02"
branch: "task/0001/phase-01/descriptor-parser-pilot"
worktree: ".worktrees/0001/phase-01/descriptor-parser-pilot"
status: verified
created: "2026-10-06"
tags: [task, unit, parser, rules]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 01.02: Descriptor Parser and Pilot Rules

> Worktree: `.worktrees/0001/phase-01/descriptor-parser-pilot` · Branch: `task/0001/phase-01/descriptor-parser-pilot`

## Objective

Parse stable directive descriptors from canonical Markdown and prove the format on a minimal TypeScript/global rule slice while reporting every unmarked rule as unsupported.

## Context packet

- `scripts/context-core.mjs::frontmatter()` handles scalar and flat-array metadata but not nested YAML arrays of objects.
- ADR 0029 keeps Markdown canonical and requires directive-level identity/mode/verifier data.
- Use rule-level frontmatter fields (`ruleId`, `stack`, `appliesTo`, `layers`) plus inline list markers of the form `[directive:<id>][mode:<mode>][verifier:<id>]` immediately before or on the enforceable statement. The parser owns this syntax; no sidecar JSON is introduced.
- Pilot files: `rules/typescript/common/type-safety.md`, `rules/typescript/common/runtime-validation.md`, `rules/typescript/common/module-and-imports.md`, and `rules/global/architecture-conformance.md`.
- AC-01 and AC-11; SC-08.

<language_rules>
- `rules/global/evidence-and-claims.md`: Parsed descriptors retain source path, line, and content hash; unsupported statements remain visible.
- `rules/global/naming-conventions.md`: Directive IDs are stable, lowercase, dot-delimited identifiers independent of headings.
- `rules/solid/single-responsibility.md`: The parser extracts and validates descriptors; it does not select rules or execute checks.
- `rules/typescript/common/module-and-imports.md`: New ESM module uses explicit imports/exports and no hidden global state.
</language_rules>

## Preconditions

- Unit 01.01 schemas/validator are merged into the phase branch.

## Scope

**In scope:** new `orchestrator/rules/descriptor-parser.mjs`; new `evals/rule-descriptor-parser.test.mjs`; the four pilot rule Markdown files listed above.

**Out of scope:** remaining rule catalog, resolver behavior, prompt rendering, conformance execution, and CLI output.

## Steps

1. Implement pure parsing APIs for one rule source and a catalog, returning validated descriptors plus explicit diagnostics.
2. Reject duplicate IDs, malformed markers, invalid modes/verifiers, unsafe applicability patterns, and directive markers with no statement.
3. Preserve prose unchanged except for the minimal pilot metadata/markers.
4. Emit `unsupported` coverage records for unmarked enforceable guidance; never synthesize advisory success.
5. Test stable source lines/hashes, deterministic ordering, malformed input, and the pilot files.

## Verification

- **Unit tests:** isolate marker/frontmatter parsing and error paths.
- **Contract tests:** validate parser output against `rule-descriptor.schema.json`.
- **Migration tests:** prove unmarked files remain readable and reported unsupported.
- Commands: `node --test evals/rule-descriptor-parser.test.mjs` (PASS: 10/10 passed in 109ms); `npm run lint` (PASS).
- Workspace Regression: `node --test` (PASS: 82/82 passed in 955ms).

```text
▶ Unit 01.02: Rule Descriptor Parser and Pilot Rules
  ▶ Inline Marker and Frontmatter Parsing (5 passed)
  ▶ Pilot Rule Files Contract Validation (5 passed)
✔ Unit 01.02: Rule Descriptor Parser and Pilot Rules (10 passed)
```

## Rollback

Remove the parser/test and revert only pilot metadata markers; original rule prose remains intact.

## Definition of done

- [x] AC-01 and the pilot slice of AC-11 pass.
- [x] Unsupported coverage is explicit and excluded from enforced counts.
- [x] Parser has no dependency on resolver, runner, adapters, or CLI.
- [x] Unit is reviewed and committed cleanly.
