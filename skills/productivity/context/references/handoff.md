# Context to plan handoff

Read this when a context specification is ready. The handoff is `context specification → grounding claim packet → grill record → released discovery brief → plan`. The context file is evidence for `grounding` and `grill`; `plan` reads the brief, not the context file.

## Before release

`grill` records the source context path and hash, grounding claims and their provenance, repository evidence, answered questions, decisions, scenario challenges, risks, and remaining assumptions in `docs/discovery/<feature>/record.md`. Conflicting claims stay unresolved until the record explains their resolution. The user confirms the shared understanding before the record is final.

The plan-facing `docs/discovery/<feature>/brief.md` is a JSON artifact containing the objective, actors, in-scope and non-goal boundaries, accepted decisions, affected areas and evidence, measurable acceptance criteria, scenario coverage, risks, remaining non-material assumptions, and an empty material-unknown list. Keep one brief per feature; a changed record or context makes it stale.

For a new discovery record, set its frontmatter to `type: discovery-record`, `status: ready`, `sourceContext: <repo-relative path>`, and `sourceContextHash: <sha256 of the complete current context file>`. The established hash excluding an older context's self-hash line is also accepted. Prepare `brief.md` as JSON with `contractVersion: 2`, `status: draft`, `sourceContext: {"path":"<same path>","confirmedByUserOn":"<date or durable reference>"}`, non-empty `objective`, `actors`, `scope`, `nonGoals`, `acceptanceCriteria`, and `scenarioCoverage`, plus arrays for `acceptedDecisions`, `risks`, `remainingAssumptions`, and `materialUnknowns: []`, and `readyForPlan: true`. Record the evidence and coverage in the record; these fields summarize it for planning.

Run `node scripts/context.mjs handoff:release-brief <record> <brief>`. The command preserves the prepared brief, records the source hashes, and rejects a draft context, missing confirmation, material unknowns, or an incomplete brief. To re-release after new evidence, return the same brief to `status: draft`, update the record and brief, and run the gate again.

After release, run `node scripts/context.mjs handoff:verify-brief <brief>`. The version 2 gate checks both record and context freshness and readiness. Review the actual scenario challenges and user confirmation as evidence; the command cannot judge their quality. Give `plan` the verified brief path and record its location in the master plan's `discovery_brief` frontmatter field, relative to the master plan file. Historical version 1 briefs retain their original source-record hash check.

If any gate fails, keep the discovery draft or stale and report the missing decision or evidence. Do not substitute the context specification for a released brief.
