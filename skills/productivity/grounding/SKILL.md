---
name: grounding
description: Retrieve and reconcile canonical LLM Wiki knowledge by scope, authority, provenance, lifecycle state, recency, links, and task relevance (/grounding, /wiki, [WIKI]).
---

# Knowledge Grounding

## Access declaration

- **Reads:** canonical knowledge and, when supplied, a `context` specification.
- **Writes:** no discovery record or brief.
- **Exposes to:** `grill` only, as a provenance-labeled claim packet.

Do not expose a context-derived claim directly to `plan`, `plan-review`, `execute`, or another downstream skill.

## Retrieval

Begin when a `context` specification is `ready`. Validate its consequential claims against the current source, tests, configuration, and schemas before `grill` releases the plan-facing brief. Do not create or switch a branch.

1. Filter knowledge by applicable scope, path, type, lifecycle status, and task terms.
2. Prefer canonical and reviewed notes over drafts, examples, or archived task material.
3. Follow directly relevant Wiki links one hop when they clarify ownership, a contract, or a superseding decision.
4. Verify referenced code and external sources when the claim is consequential or the note is past review.
5. Return the smallest sufficient set with selection reasons and provenance.

## Reconciliation

- A higher-authority source wins only within its declared scope.
- A superseding note replaces the named predecessor; do not merge incompatible instructions.
- Surface two active canonical notes that claim the same authority as a conflict.
- Treat stale or broken provenance as an unknown, not as current truth.
- Do not let semantic similarity promote a low-authority note into a fact.

## Output

Give `grill` one claim packet per requested scope. Each claim retains its ID, source path and heading, authority, lifecycle state, last-verified date, content hash, selection reason, and one of `verified`, `assumption`, `conflict`, or `unknown`.

Conflicting claims remain separate records. Do not select a winner, change a context specification, or create a discovery brief; `grill` records any resolution and its evidence. State explicitly when the Wiki has no grounded answer, then stop.
