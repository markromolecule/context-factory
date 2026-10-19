---
title: "{{title}}"
type: unit
parent: "{{parent_phase}}"
unit: "{{unit_id}}"
task_branch: "{{task_branch}}"
base_commit: "{{base_commit}}"
status: planned
created: "{{date}}"
tags: [task, unit]
depends_on: []
parallelizable_with: []
---

# Unit {{unit_id}}: {{title}}

> Phase: {{parent_phase}} · Depends on: {{depends_on}} · Parallelizable with: {{parallelizable_with}}
> Task branch: {{task_branch}} · Base commit: {{base_commit}}

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

- `git symbolic-ref --quiet --short HEAD` exactly matches `{{task_branch}}`; stop if detached or mismatched.
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
- **Host checks:** List each configured, applicable pnpm lint, typecheck, test, or build command with host root, scope, revision, exit code, and receipt path. Mark absent optional checks `unconfigured`; a missing required check blocks the unit.
- **Human evidence:** Name any evidence-blocking directive or lifecycle checkpoint and its human receipt. A rule-selection binding is not code verification.

## Rollback

How to revert this unit alone.

## Definition of done

- [ ] Maps to acceptance criteria: <ids>
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
- [ ] Configured host checks pass, required checks are present, and evidence-blocking human receipts are attached
