# Shared Orchestration Contract

This contract is model-neutral and authoritative. Model adapters must not duplicate or override it.

## Load order

1. For direct questions and trivial edits, inspect the relevant files and skip the workflow below. For substantive changes, inspect the target repository and run `node scripts/context.mjs resolve "<request>"`; load relevant selections plus explicitly named and affected files.
2. Read `README.md` and `context-manifest.json` when changing the factory or its inventory. Resolver output is a selection aid, not a limit on what evidence may be inspected.
3. Load the single most-specific workflow when its trigger matches a multi-stage request; compose workflows only when the selected workflow explicitly requires it.
4. Load global rules, then only the backend/frontend/typescript/solid rules relevant to the touched files.
5. Load a skill only when its description matches the specialized task.
6. Load canonical knowledge only when its scope, authority, lifecycle, and task terms match; retain provenance.
7. Read linked references only when the selected skill, workflow, or knowledge item directs it.

## Working contract

- Preserve user changes and existing conventions unless a requirement explicitly replaces them.
- Strictly adhere to SOLID architectural principles (`rules/solid/`) across backend services, repositories, hooks, and UI components.
- Classify consequential claims as verified facts, assumptions, decisions, unknowns, or results and retain their evidence.
- Prefer the smallest complete change and avoid speculative dependencies.
- Keep architecture, rules, tests, and documentation synchronized with behavior.
- Verify proportionally to risk; never report completion without evidence.
- Follow declared architecture profiles and accepted decisions; do not introduce a system-wide pattern from general preference.
- Follow workflow gates and stop conditions for multi-stage work; do not treat a workflow as permission for actions outside user scope.
- Record durable architectural decisions under `docs/decisions/`.
- Record multi-phase work under `docs/tasks/` using the task template.
- Enforce session checkpointing (`session`, `node scripts/context.mjs session:save`) whenever context window load approaches ~60% saturation; snapshot machine state to `.context/sessions/` and resume in a fresh session via `.tmp/SESSION_RESUME.md` to prevent reasoning degradation.
- For a new system, product, or materially ambiguous feature, use `grill` as the first pre-planning skill (or `context` to author and grill context specifications). Resolve and persist goals, scenarios, language, boundaries, and unknowns before `plan`; do not begin production coding until the plan is approved.
- Enforce active language rule binding across all task execution units. Code generation must adhere strictly to declared stack standards (`<language_rules>`); procedural checklists must not supersede framework rules.
- Before TypeScript edits, inspect the affected package's dependencies and compiler settings, resolve rules with explicit stack and file scope, and read the selected rule text. Apply shared TypeScript rules plus only that package's framework rules; see `docs/Rules.md`. Do not invent APIs, introduce a library just because an example uses it, or report an unimplemented verifier as passing.

## Roles & Subagents

Software delivery lifecycles are orchestrated across specialized subagent personas defined under `agents/`:

- **BA Agent (`agents/ba-agent` / Discovery lead):** clarify ambiguous requirements, author and grill context specifications using `context` or `grill`, and establish verifiable scenario matrices and acceptance criteria before planning (`/ba`, `[BA]`, `[DISCOVERY]`).
- **Architect & ADR Specialist (`agents/architect-agent` / System design lead):** evaluate system boundaries, dependency direction, SOLID principles conformance, and author durable ADRs in `docs/decisions/` using `adr` (`/architect`, `[ARCHITECT]`).
- **Data Modeler (`agents/data-agent` / Database architect):** design normalized schemas, forward/rollback migration scripts, ESR compound indexing, cursor pagination, and isolated data-access layers (`/data`, `[DATA]`).
- **PM Agent (`agents/pm-agent` / Delivery coordinator):** inspect constraints, create dependency-ordered phased task breakdowns under `docs/tasks/` using `plan`, audit plans with `plan-review` (`node scripts/context.mjs plan:check`), manage milestone progress, and enforce stops before coding (`/pm`, `[PM]`, `[PLAN]`, `/plan-review`, `[PLAN_REVIEW]`).
- **UX & Design System Specialist (`agents/ux-agent` / Frontend lead):** compose accessible UI components (WCAG 2.1 AA), design token systems, interaction feedback states, and encapsulate client state in custom hooks/stores (`/ux`, `[UX]`).
- **Security & Threat Specialist (`agents/threat-agent` / Trust verification):** execute STRIDE threat modeling, audit trust boundaries, verify authentication/authorization policies, timing safety, and secrets hygiene (`/threat`, `[THREAT]`).
- **Developer (`skills/execute`, `skills/test`, `skills/refactor`):** author failing tests first using `test`, execute only approved review packets on the verified task branch, and preserve strict phase stops and synchronized evidence (`/exec`, `[EXEC]`, `/test`, `[TEST]`, `/refactor`, `[REFACTOR]`).
- **Reviewer / QA (`skills/verify`, `skills/review`, `workflows/code-review-and-optimization`):** compare changed files on the task branch with each unit's allowed files, check code quality and architecture using `review`, assess query performance and tests, verify acceptance criteria against reproducible evidence, and identify regressions or risks (`/verify`, `[VERIFY]`, `/review`, `[REVIEW]`, `/optimize`, `[OPTIMIZE]`).
- **DevOps Agent (`agents/devops-agent` / Infrastructure specialist):** automate CI/CD workflows, configure container environments (Docker, Compose), maintain secrets hygiene (`.env.example`), and verify pre-flight release readiness (`/devops`, `[DEVOPS]`, `/release`, `[RELEASE]`).

Workflows coordinate these roles across a delivery lifecycle; they do not replace role-specific judgment or user authorization.

## Conflict order

Follow system/user instructions first, then repository instructions, this contract, applicable rules, and finally skill defaults. More specific instructions override general ones at the same level.

If an implementation step in a plan and an applicable language rule (`<language_rules>`) conflict, the language rule strictly takes precedence.

## Execution & Harness Contract

- Model invocations, evaluations, and skill executions are coordinated via `orchestrator/runner.mjs`.
- The runner enforces an explicit 3-stage lifecycle:
  1. `beforeContext`: preprocess input and runtime parameters.
  2. `onPromptPrepare`: assemble context bundle, system prompt, and schemas.
  3. `afterResponseValidate`: validate structured outputs against `/schemas` via `orchestrator/validator.mjs`.
- Default to deterministic `mock` provider in CI/CD and offline evaluations; live runs use native `fetch` provider adapters (`openai`, `anthropic`, `gemini`).
- Changes to the same checkout run serially. `plan` alone creates the task branch after discovery release; downstream skills verify that branch before making changes.
- Session state lifecycle is governed by `scripts/session-core.mjs`: snapshot machine state to `.context/sessions/<id>.json` and generate ultra-compact cold-start briefings to `.tmp/SESSION_RESUME.md` (<1,500 tokens) whenever context reaches ~60% saturation.

### Executable Rule Conformance & Verification Receipts (ADR 0029, AC-08)

- **Preflight & Rule Binding Receipts:** Material code changes require a deterministic Rule Binding receipt (`binding.id`, `bindingHash`) compiled before execution (`context-cli preflight`).
- **Conformance Evaluation Gate:** Code changes must evaluate against the active stack conformance adapter (`context-cli conform`). Successful execution requires a valid `PASS` ConformanceReport (`report.id`, `diffHash`, `bindingHash`).
- **Fail-Closed Stop Conditions:** Reports with status `FAIL` or `BLOCKED` (e.g. missing required human evidence for `evidence-blocking` rules, or `TOOL_UNAVAILABLE`) halt progression immediately. No unit or phase may claim completion or merge without a clean `PASS` report receipt.
- **No Self-Attestation:** LLM prose claims or self-attestation cannot substitute for persisted machine receipts. Completion claims require verified report artifacts.
- **Governed Human Waivers:** Waivers require human maintainer authorization (`authorizedBy`), active date bounds (`authorizedAt`, `expiresAt`), explicit target scopes (no wildcards), and compensating evidence. Agent or self-authorized waivers are strictly rejected.

## Context maintenance

When changing the factory, follow the `context-maintenance` workflow:

1. Update the source file.
2. Update `context-manifest.json` if inventory changed.
3. Update the relevant Obsidian map of content.
4. Regenerate `context-lock.json`.
5. Run `node scripts/context.mjs doctor`.
6. Report the context version, lock digest, evaluation result, and validation result.
