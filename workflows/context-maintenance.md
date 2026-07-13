---
name: context-maintenance
description: Evolve Context Factory rules, skills, workflows, orchestration, and architecture without duplication, drift, or invalid inventory.
scope: Any change under context-factory that affects canonical agent behavior or knowledge structure.
---

# Context Maintenance

## Triggers

Use when adding, changing, renaming, or removing a rule, skill, workflow, orchestrator, canonical document, map, validator, or durable architecture decision.

## Required inputs

- The behavior gap or conflict, affected agents/tasks, existing related context, and desired validation outcome.
- Compatibility impact for current manifests, adapters, links, and task artifacts.

## Applicable rules and skills

Always follow the shared orchestration contract, naming, code-quality, and 1-3-1 rules when a material context design choice remains. Use implementation/execution planning for multi-phase migrations.

## Phases

1. Inspect the manifest, shared contract, relevant rules/skills/workflows, maps, validator, and existing decisions.
2. Classify the change as clarification, new behavior, replacement, rename, or removal; identify overlap and conflicts.
3. Update the canonical source with the smallest complete contract and progressive-disclosure boundaries.
4. Update inventory, maps, architecture, links, templates, and decisions in the same change.
5. Update validator coverage when a new context type or invariant is introduced.
6. Run context validation and relevant project checks; inspect diffs for unrelated or duplicated behavior.
7. Report context version, inventory counts, compatibility impact, and validation evidence.

## Quality gates

- Rules state enforceable constraints and scope; skills state triggered specialized procedures; workflows state lifecycle sequencing and gates.
- Model adapters remain thin and shared behavior remains model-neutral.
- Inventory matches disk, maps link every entry, and wiki links/metadata validate.
- Durable decisions are recorded and context version changes intentionally.

## Stop and escalation conditions

Stop when new behavior conflicts with higher-priority instructions, a replacement would silently invalidate active workflows, ownership of a canonical contract is unclear, or compatibility requires a user decision.

## Artifacts and completion

Record durable architecture in an ADR and multi-phase work in a task. Completion requires the source, manifest, maps, architecture, validator, and reported version to agree.
