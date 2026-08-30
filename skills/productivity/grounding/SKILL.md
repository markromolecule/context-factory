---
name: grounding
description: Retrieve and reconcile canonical LLM Wiki knowledge by scope, authority, provenance, lifecycle state, recency, links, and task relevance (/grounding, /wiki, [WIKI]).
---

# Knowledge Grounding

## Retrieval

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

For each selected note, retain its ID, path, heading, status, authority, owner, last-verified date, content hash, and reason for selection. State when the Wiki has no grounded answer.
