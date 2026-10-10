---
title: "Canonical TypeScript pragmatic design knowledge"
type: unit
parent: "phase-01-discovery-and-scenarios"
unit: "01.01"
task_branch: "feat/PLN-0008-typescript-pragmatic-design-rules"
base_commit: "298768ee210189f2f2221f3cf8f041bce2ad26bf"
status: planned
created: "2026-10-10"
tags: [task, unit, knowledge]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Canonical TypeScript Pragmatic Design Knowledge

> Task branch: `feat/PLN-0008-typescript-pragmatic-design-rules` · Base commit: `298768ee210189f2f2221f3cf8f041bce2ad26bf`

## Objective

Make the four requested concepts independently retrievable and sufficiently precise to constrain later rule text.

## Context packet

- **Current evidence:** `knowledge/principles/` contains the five SOLID notes but no YAGNI, KISS, composition, or combined Demeter/tell-don't-ask note. `schemas/knowledge.schema.json` validates active canonical metadata; `knowledge/README.md` and `docs/Wiki.md` index concepts. `knowledge/principles/solid-ocp.md` praises composition but permits variation expected over time; the user requires a present requirement rather than a hypothetical future variant.
- **Accepted decisions:** 2026-10-10 user answers: TypeScript/TSX only; YAGNI and KISS distinct; composition over inheritance; one combined Demeter/tell-don't-ask check; defaults with justified exceptions. A DTO read, validation, serialization, or pure transformation can inspect data without itself violating the combined principle. Trust, tenant, and persistence boundaries remain binding.
- **Acceptance:** AC-01. Notes are knowledge, not enforcement. Give each a stable dotted ID, active canonical metadata, current source links, TypeScript good/bad examples, a present-need test, and an exception that names the requirement or boundary. Cross-link rather than duplicating the full SOLID notes.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
</language_rules>

**Rule satisfaction:** Use the released brief and inspected canonical files for factual claims; only the named knowledge/catalog files may change. Named human evidence reviews the subjective examples before claiming conformance.

## Preconditions

- Verify exact task branch and dependency-free unit. Stop for detached/wrong branch or unrelated dirty work.
- Verify the released brief with `node scripts/context.mjs handoff:verify-brief docs/discovery/pragmatic-design-principles-and-rule-alignment/brief.md` and inspect existing knowledge metadata before writing.

## Scope

**In scope:** `knowledge/principles/yagni.md` (new), `knowledge/principles/kiss.md` (new), `knowledge/principles/composition-over-inheritance.md` (new), `knowledge/principles/law-of-demeter-tell-dont-ask.md` (new), `knowledge/README.md`, `docs/Wiki.md`, `context-manifest.json`, `context-lock.json`.

**Out of scope:** Rule directives, SOLID note rewrites, host source, JavaScript guidance, schema changes, new ADRs, and automatic conformance verifiers.

## Steps

1. Create four notes from `docs/templates/Knowledge.md` and `schemas/knowledge.schema.json`, with unique IDs and sources. Distinguish YAGNI (whether to build extra capability) from KISS (how to implement the present capability).
2. Include one direct TypeScript implementation, one actual multi-variant composition case, one reach-through caller decision moved to the owner, and legitimate DTO/validation/serialization reads. State when a documented requirement, accepted contract, or real boundary justifies an exception.
3. Link all notes from both indexes, run `npm run sync` and `npm run lock`, and inspect actual retrieval/selection metadata. Avoid old skill-path globs; use current grouped skill paths where relevant.
4. Run validation, review semantic claims against the brief, then compile fresh unit preflight/conformance with named human evidence. Commit only after PASS and review.

## Verification

- **Knowledge contract:** `npm run lint` plus `node scripts/context.mjs doctor`. These validate schema metadata, links, inventory, and lock; without them a canonical note may not be retrievable. Inspect YAGNI/KISS definitions and all four good/bad examples manually because keyword assertions would mirror prose rather than prove meaning.
- **Retrieval integration:** `node scripts/context.mjs resolve "TypeScript YAGNI KISS composition Law of Demeter" --json`; verify selected knowledge paths and exclusion from a plain-JavaScript request. This catches metadata that validates but never binds.
- **Conformance:** Fresh `context-cli preflight` and `context-cli conform` for the exact changed scope, with named semantic evidence and a persisted PASS receipt; `conform verify` must accept the matching binding and diff hashes.

## Rollback

Revert the four notes, both indexes, and generated catalog artifacts together. No host or data migration exists.

## Definition of done

- [ ] AC-01 notes are distinct, TypeScript scoped, linked, valid, and semantically reviewed.
- [ ] Exact branch, file fence, retrieval, lint, doctor, and lock are verified.
- [ ] Fresh unit conformance and receipt verification PASS with named evidence; review is recorded before commit.
