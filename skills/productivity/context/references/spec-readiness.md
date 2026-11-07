# Context specification and readiness

Use this while writing or auditing `docs/templates/Context.md`. Keep the specification focused on product and system requirements; leave implementation unit design to `plan`.

## Record in the specification

- Problem, user value, measurable success, affected actors, and who has authority over each decision.
- Primary journey plus applicable boundary, failure, abuse, concurrency, and lifecycle scenarios. Name the expected result and recovery for each.
- Functional requirements and constraints, including existing contracts, data ownership, permissions, integration points, and applicable language stack and rule candidates.
- Scope and non-goals, with rejected alternatives when their exclusion matters to later planning.
- Evidence inventory: source path and location, verification state (`verified`, `assumption`, `unknown`, or `conflict`), finding, and consequence. Mark proposed files as new rather than citing them as inspected.
- Unknowns and blockers: question, owner, whether it blocks readiness, and recorded resolution. Technical implementation choices may remain for `plan` if the requirement boundary is clear; product and scope decisions may not.

Use the template's optional UI section only when there is a user interaction to specify. Avoid copying repository manuals or full source into the specification; link to inspected evidence and preserve only the facts the downstream interview needs.

## Ready gate

Set `status: ready` only when measurable success and non-goals are explicit, actor and permission boundaries are named, applicable scenarios have outcomes and recovery, material evidence conflicts are resolved, and no material product or scope unknown remains. Record the user's confirmation of the summarized understanding with a date or durable reference. A named owner does not turn a material blocker into a resolved decision.

`ready` means the specification can be grounded and grilled. It does not authorize `plan`. If the specification changes after grounding or grill review, recheck affected claims and regenerate the released brief before planning.
