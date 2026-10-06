# Discovery artifacts

`grill` owns the discovery artifacts for one feature at `docs/discovery/<feature>/`.

| Artifact | Owner | Purpose | Readable by |
| --- | --- | --- | --- |
| `record.md` | `grill` | Evidence inventory, grounded claims, question log, challenges, scenario coverage, decisions, unknowns, and release state | `grill` while authoring; its released findings are summarized in `brief.md` |
| `brief.md` | `grill` | One plan-ready, evidence-linked summary | `plan` only |

## Record contract

The record must name its source context path and hash, each grounding claim's provenance and status, repository evidence, assumptions, unknowns, scenario challenges, decisions, risks, and readiness state. A conflicting claim cannot become an accepted decision without recorded resolution. A material unknown blocks `ready` and brief release.

## Brief contract

`brief.md` is readable only by `plan`.

`brief.md` is released only when the source context is `ready`, all material unknowns and conflicts are resolved, scenario coverage is complete, and the user has confirmed the shared understanding. It includes the record hash, source context hash, objectives, in-scope and non-goal boundaries, accepted decisions, affected files and dependencies, acceptance criteria, risks, and remaining non-material assumptions.

Release exactly one `brief.md` per feature. When its source context, claims, or record changes, mark the brief `stale`; `plan` must wait for a newly released brief.
