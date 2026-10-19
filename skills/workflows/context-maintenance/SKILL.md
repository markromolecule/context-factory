---
name: context-maintenance
description: Evolve Context Factory rules, skills, workflows, orchestration, and architecture without duplication, drift, or invalid inventory.
scope: Any change under context-factory that affects canonical agent behavior or knowledge structure.
primaryAgent: architect-agent
participatingAgents: [pm-agent]
rules:
  - rules/global/evidence-and-claims.md
  - rules/global/architecture-conformance.md
skills:
  - execute
  - test
---

# Context Maintenance

## Triggers

Use when adding, changing, renaming, or removing a rule, skill, workflow, orchestrator, canonical document, map, validator, or durable architecture decision.

- **T0 (Context Queries):** Checking rule definitions, catalog contents, or manifest metadata requires no workflow; answer directly from canonical context sources.
- **T1 (Editorial Clarifications):** Fixing typos or clarifying explanations in documentation without modifying rule directives, schema definitions, or manifests. Surgical edit, validate with `validate-context.mjs`, no multi-phase plan.
- **T2 (Catalog Evolution):** Modifying rule directives, adding procedural skills, updating workflows, or adjusting validator/evaluation rules. Requires manifest update, lock generation (`node scripts/context.mjs lock`), doctor check, and evaluation test pass.
- **T3 (Systemic Context Architecture):** Major version bump, restructuring orchestration contracts, or changing stack enforcement mechanisms. Requires ADR, multi-phase plan, and review approval.


## Required inputs

- The behavior gap or conflict, affected agents/tasks, existing related context, and desired validation outcome.
- Compatibility impact for current manifests, adapters, links, and task artifacts.

## Applicable rules and skills

Always follow the shared orchestration contract, naming, code-quality, and 1-3-1 rules when a material context design choice remains. Use implementation/execution planning for multi-phase migrations.

## Phases

1. Inspect the manifest, shared contract, relevant rules/skills/workflows, maps, validator, and existing decisions.
2. Classify the change as clarification, new behavior, replacement, rename, or removal; identify overlap and conflicts.
3. Update the canonical source with the smallest complete contract and progressive-disclosure boundaries.
4. Update inventory, maps, architecture, knowledge, links, templates, schemas, evaluations, and decisions in the same change.
5. Update validator coverage, rule descriptor schemas, and conformance test fixtures when a new context type, rule directive, or invariant is introduced.
6. Regenerate the context lock and run the context doctor; inspect diffs for unrelated or duplicated behavior.
7. Report context version, lock digest, inventory counts, evaluation result, compatibility impact, and validation evidence.

## Quality gates

- Rules state enforceable constraints and scope with valid directive markers (`id`, `mode`, `verifier`); skills state triggered specialized procedures; workflows state lifecycle sequencing and gates.
- Rule descriptors validate cleanly against `rule-descriptor.schema.json` with zero duplicate IDs or malformed markers.
- Model adapters remain thin and shared behavior remains model-neutral.
- Inventory matches disk, maps link every entry, Wiki authority/provenance validate, and the lock matches canonical content.
- Behavioral evaluations cover new selection or completion behavior and all cases pass.
- Durable decisions are recorded and context version changes intentionally.

## Stop and escalation conditions

Stop when new behavior conflicts with higher-priority instructions, a replacement would silently invalidate active workflows, ownership of a canonical contract is unclear, or compatibility requires a user decision.

## Artifacts and completion

Record durable architecture in an ADR and multi-phase work in a task. Completion requires the source, manifest, maps, architecture, Wiki, schemas, lock, evaluator, validator, and reported version to agree.
