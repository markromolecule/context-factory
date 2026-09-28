---
title: "{{title}}"
type: unit
parent: "{{parent_phase}}"
unit: "{{unit_id}}"
branch: "{{branch}}"
worktree: "{{worktree}}"
status: planned
created: "{{date}}"
tags: [task, unit]
depends_on: []
parallelizable_with: []
---

# Unit {{unit_id}}: {{title}}

> Phase: {{parent_phase}} · Depends on: {{depends_on}} · Parallelizable with: {{parallelizable_with}}
> Worktree: {{worktree}} · Branch: {{branch}}

## Objective

One sentence: what this unit accomplishes and why it matters to the outcome.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Relevant current-state evidence (file paths, snippets)
- The acceptance criteria this unit serves
- Any decisions from the plan's ledger that constrain this unit

## Preconditions

- Dedicated git worktree and branch provisioned at declared path.
- What must already exist or be true, including outputs of dependency units.

## Scope

**In scope:** exact files/functions/endpoints/schemas.
**Out of scope:** explicitly excluded, to keep this unit focused.

## Steps

1. ...

## Verification

- Test type(s): unit / integration / architecture / contract / migration / other — one line justifying each, per the criteria in the `plan` skill.
- Cases: specific scenarios, not "add tests"
- Commands: how to run them

## Rollback

How to revert this unit alone.

## Definition of done

- [ ] Maps to acceptance criteria: <ids>
- [ ] Executed inside dedicated worktree without touching main workspace
- [ ] Changes committed cleanly to unit branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
