---
name: context
description: Turn an ambiguous feature, system, or change request into a confirmed context specification under docs/context/, then carry it through grounding and grill to a released brief for plan. Use for /context, [CONTEXT], or requests to clarify requirements before planning. Do not use for implementation or plan review.
compatibility: Requires docs/templates/Context.md, grounding, grill, and scripts/context.mjs in Context Factory.
---
# Context before planning

## Access declaration

- **Reads:** the user brief, repository evidence, applicable rules, decisions, and source contracts.
- **Writes:** its own context specification under `docs/context/`.
- **Exposes to:** `grounding` and `grill` only.

Do not hand the context specification directly to `plan`, `plan-review`, `execute`, or another downstream skill. `grill` owns the released discovery brief. Do not edit production code or create a task branch; `plan` owns branch creation after release.

## Flow

1. **Open or resume the specification.** Choose one feature path under `docs/context/`. Inspect any existing draft before editing. Use `docs/templates/Context.md` for a new file and set `status: draft`. Read [spec-readiness.md](references/spec-readiness.md) while authoring or auditing it.
2. **Discover and document.** Inspect source, tests, configuration, schemas, rules, and decisions before asking what the repository can answer. Use the `grill` interview discipline: ask one unresolved question at a time with a recommended answer and trade-off. Record user answers immediately. Capture outcome, actors and authority, scenarios with failure and recovery, constraints, scope, non-goals, and measurable success. Keep verified facts, assumptions, decisions, and blockers distinct, with source paths and verification state.
3. **Close the context gate.** Challenge material requirements against the applicable happy path, boundary, failure, abuse, concurrency, and lifecycle cases. Resolve conflicting claims with evidence or a user decision. A material unknown keeps the specification `draft`. Record the user's confirmation of the shared understanding and its date or reference. Set `status: ready` only after the [readiness check](references/spec-readiness.md) passes. If the user requested only a draft specification, report its draft status and remaining questions.
4. **Complete discovery handoff.** Supply the ready specification to `grounding`, then `grill`. `grounding` returns provenance-labeled claims; `grill` owns `docs/discovery/<feature>/record.md`, challenges the evidence, and releases the sole `brief.md`. Follow [handoff.md](references/handoff.md) for the artifact contract and verification. If grounding finds a consequential conflict or the user changes a decision, update the specification, return it to draft, and repeat the affected checks.
5. **Finish at a verified brief.** For a full `/context` request, completion means the grill record is finalized, the brief carries the plan-facing outcome and boundaries, and `node scripts/context.mjs handoff:verify-brief <brief>` passes. If grilling is still awaiting a material answer or user confirmation, report the exact blocker and resume later; do not call the context plan-ready.

## Return

Give the context path and status, key decisions and scenario coverage, outstanding questions, and—when released—the discovery record and brief paths with the brief verification result. `plan` reads the released brief; the context file remains an upstream evidence source.
