---
title: "{{title}}"
type: unit
parent: "{{parent_phase}}"
unit: "{{unit_id}}"
task_branch: "{{task_branch}}"
checkout_mode: "{{checkout_mode}}"
checkout_reason: "{{checkout_reason}}"
checkout_path: "{{checkout_path}}"
status: planned
created: "{{date}}"
tags: [task, unit]
depends_on: []
parallelizable_with: []
---

# Unit {{unit_id}}: {{title}}

> Phase: {{parent_phase}} · Depends on: {{depends_on}} · Parallelizable with: {{parallelizable_with}}
> Task branch: {{task_branch}} · Checkout: {{checkout_mode}} · Path: {{checkout_path}}

## Objective

One sentence: what this unit accomplishes and why it matters to the outcome.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Relevant current-state evidence (file paths, snippets)
- The acceptance criteria this unit serves
- Any decisions from the plan's ledger that constrain this unit

<language_rules>
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- The task checkout decision remains valid; recheck Git state before changing it.
- What must already exist or be true, including outputs of dependency units.

## Scope

**In scope:** exact files/functions/endpoints/schemas.
**Out of scope:** explicitly excluded, to keep this unit focused.

## Steps

1. ...

## Verification

- **Automated Tests:**
  - Test type(s): unit / integration / architecture / contract / migration / other — one line justifying each, per the criteria in the `plan` skill.
  - Cases: specific scenarios, not "add tests"
  - Commands: how to run them
- **Conformance Gate:**
  - Command: `context-cli conform --scope <modified-files> --out .context-runs/<report-id>/conformance-report.json`
  - Conformance Report: `[report.id]` (Verdict: PASS | Diff Hash: `sha256:...` | Binding Hash: `sha256:...`)

## Rollback

How to revert this unit alone.

## Definition of done

- [ ] Maps to acceptance criteria: <ids>
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
- [ ] Conformance report passes (PASS) with zero blocking violations
