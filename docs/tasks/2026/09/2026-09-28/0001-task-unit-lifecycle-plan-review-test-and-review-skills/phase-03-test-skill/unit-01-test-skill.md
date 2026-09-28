---
title: "Author test Skill"
type: unit
parent: "phase-03-test-skill"
unit: "03.01"
status: planned
created: "2026-09-28"
tags: [task, unit, skill, test, tdd, engineering]
depends_on: []
parallelizable_with: ["01.01", "01.02", "01.03", "02.01", "04.01"]
---

# Unit 03.01: Author test Skill

> Phase: phase-03-test-skill · Depends on: none · Parallelizable with: 01.01, 01.02, 01.03, 02.01, 04.01

## Objective

Author `skills/engineering/test/SKILL.md` and its agent interface YAML, establishing the test-first (Red-Green-Refactor) protocol for implementing unit verification sections, with dedicated patterns for architecture, contract, and migration tests.

## Context packet

Copied in, not referenced — this is what lets the unit run without the master plan:

- Current-State Evidence:
  - Engineering skills live under `skills/engineering/<skill>/SKILL.md`.
  - Agents often improvise tests or write superficial unit mocks instead of true architecture, contract, or migration tests.
- Acceptance Criteria Served:
  - `AC-03`: `skills/engineering/test/SKILL.md` enforces test-first authoring with explicit patterns for architecture tests, contract tests, and migration forward/rollback tests.
- Decisions Constraining Unit:
  - `D-03`: Tests must be written before functional code; test execution must confirm failure (Red) before implementation commences.

## Preconditions

None (independent skill authoring).

## Scope

**In scope:** `skills/engineering/test/SKILL.md`, `skills/engineering/test/agents/openai.yaml`, `skills/engineering/README.md`.
**Out of scope:** Modifying `execute` skill.

## Steps

1. Create directory `skills/engineering/test/` and `skills/engineering/test/agents/`.
2. Author `skills/engineering/test/SKILL.md`:
   - Frontmatter: `name: test`, `description: Turn a unit's Verification section into real tests, written test-first (failing assertions first, then implementation), specializing in architecture, contract, and migration tests (/test, [TEST]).`
   - Phase 1 (Ingest): Read unit's `Verification` section and extract test types, cases, and commands.
   - Phase 2 (Red): Author the test file first; run test and confirm it fails cleanly with expected assertion failure.
   - Phase 3 (Green): Implement the minimal code within unit scope to make the test pass.
   - Pattern Guide:
     - Architecture Tests: imports analysis, layer boundary checks, dependency direction validation.
     - Contract Tests: API request/response validation, schema conformance, status codes.
     - Migration Tests: Forward migration, rollback test, re-application integrity.
3. Author `skills/engineering/test/agents/openai.yaml`:
   - `display_name: "Test-Driven Implementation"`
   - `short_description: "Author tests test-first for unit verification sections"`
   - `default_prompt: "Use $test to write failing tests first for the active unit before implementing."`
4. Update `skills/engineering/README.md` to link `test/SKILL.md`.

## Verification

- Test type(s):
  - Contract / Interface tests: Verifies frontmatter schema, folder name match, 25-64 char short_description, and engineering group README link using `node scripts/context.mjs lint`.
- Cases:
  - Frontmatter name and description format valid.
  - `openai.yaml` length within 25-64 chars.
  - Engineering group index link valid.
- Commands: `node scripts/context.mjs lint`

## Rollback

Delete `skills/engineering/test/` and revert `skills/engineering/README.md`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-03
- [ ] Skill document contains concrete patterns for architecture, contract, and migration tests
- [ ] Agent interface YAML valid with zero lint errors
- [ ] All listed verification passes
