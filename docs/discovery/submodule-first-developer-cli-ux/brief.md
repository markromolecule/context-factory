{
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "status": "released",
  "source": {
    "path": "docs/discovery/submodule-first-developer-cli-ux/record.md",
    "sha256": "sha256:2a5d1460e4289537658492d1a3f0a8e7ea2333ac8e1444152ee1c2b996fc7d51"
  },
  "sourceContext": {
    "path": "docs/context/cli/submodule-first-developer-cli-ux.md",
    "status": "ready",
    "sha256ExcludingHashLine": "sha256:bbe6a00dfab707084ecf8448ab723dc771892306bd4a6fc646adedc40e408087",
    "confirmedByUserOn": "2026-10-07"
  },
  "grounding": {
    "claimPacket": "G-CLI-001",
    "result": "No applicable canonical Wiki note answers host CLI onboarding, gates, or receipt transport. Use the cited repository source and accepted ADRs; do not infer CLI behavior from general SOLID notes.",
    "source": "knowledge/README.md#Canonical-Knowledge-Items",
    "sourceHash": "sha256:76396078e7be74da4823e32e69a012c09306c1c1de4d1d91e33737fdc437bfac"
  },
  "objective": "After adding Context Factory as a submodule, a developer can set up only the intended editor and AI bridge artifacts, optionally install separate local and GitHub Actions quality gates, and see a concise, accessible next action. Strict CI accepts current authoritative code-conformance evidence only.",
  "actors": [
    "Host-project developer running interactive setup",
    "Maintainer reviewing host integration, human evidence, and quality state",
    "CI author or automation running non-interactive commands"
  ],
  "scope": [
    "Compact task-focused CLI help and host-aware status with explicit setup, factory-health, and code-conformance states",
    "Submodule-first init preview, selected editor bridge setup, idempotence, and actionable recovery",
    "Separate explicit opt-in for local pre-commit hook and generated GitHub Actions gate",
    "GitHub Actions runs conformance in the checked-out change scope, persists a report, then verifies PASS, current binding, and a content- or revision-bound change identity",
    "Plain, NO_COLOR, narrow-terminal, non-TTY, and JSON output with stable documented command/exit contracts",
    "Documentation and migration for scripts that previously relied on implicit --ide all"
  ],
  "nonGoals": [
    "No full-screen TUI, new rule engine, or new runtime dependency",
    "No generated CI provider files outside GitHub Actions in the first scope; provide copyable commands instead",
    "No claim that editor guidance or doctor alone proves per-change code conformance",
    "No automatic human evidence, self-authorized waiver, or policy relaxation to make checks pass"
  ],
  "acceptedDecisions": [
    "ADR 0032 selects a task-focused facade over existing command operations and narrowly supersedes ADR 0028's mascot/default display requirements; perf/types skills remain.",
    "ADR 0026 keeps submodule-first host/editor bridging and ADR 0029 keeps repository/CLI conformance reports authoritative.",
    "If no editor is detected, interactive init asks and non-interactive init requires --ide; --ide all stays available only when explicit.",
    "Hook and CI setup are separate opt-ins; existing unrelated host hook/workflow files are preserved and conflicts are reported.",
    "GitHub Actions is the first generated CI provider. User selected CI-generated conformance reports on 2026-10-07; CI verifies its newly persisted report against its checkout.",
    "A strict gate blocks on absent report, persistence failure, FAIL, BLOCKED, unavailable tools, stale binding, or changed content even when path names match. Named human evidence or a governed human waiver is required when directives demand it."
  ],
  "affectedAreasAndEvidence": [
    {"path": "app/cli/bin/context-cli.mjs", "reason": "Default help and command discovery; source context E-02."},
    {"path": "app/cli/commands/init.mjs", "reason": "Host/editor choice and preview; source context E-03."},
    {"path": "app/cli/commands/status.mjs", "reason": "Current inventory status needs a separate host-readiness summary; source context E-04."},
    {"path": "app/cli/commands/doctor.mjs", "reason": "Current broad health command remains distinct from conformance; source context E-05."},
    {"path": "app/cli/commands/hook.mjs", "reason": "Existing install overwrites pre-commit without a conflict check; source context E-11."},
    {"path": "app/cli/core/bridge-generator.mjs", "reason": "Host artifact generation and bridge manifest; source context E-06 and E-12."},
    {"path": "app/cli/commands/conform.mjs", "reason": "Current report is local/ignored by default and persistence errors are non-fatal; discovery R-05."},
    {"path": "orchestrator/conformance/conformance-orchestrator.mjs", "reason": "Default diffHash hashes path names only; source context E-15."},
    {"path": "schemas/conformance-report.schema.json", "reason": "Any receipt identity change needs contract versioning and validation; discovery R-10."},
    {"path": "docs/decisions/0032-task-focused-host-cli-and-opt-in-quality-gates.md", "reason": "Accepted architecture, migration, and rollback boundary."}
  ],
  "acceptanceCriteria": [
    "Fresh initialized submodule: init identifies the host and previews exact selected editor, hook, and CI changes before writing; completion shows one next command.",
    "Repeated init is idempotent. Existing unrelated hook/workflow, read-only target, or concurrent setup does not silently clobber host files and never reports a false success.",
    "No detected editor requires an interactive choice or explicit --ide in automation; gates are never inferred from editor choice.",
    "Missing submodule yields the exact git submodule update --init --recursive recovery command; unsupported CI providers receive commands without an installed-gate claim.",
    "Default output has no mascot, keeps detailed help discoverable, and conveys identical states without color, emoji, wide alignment, or a TTY; JSON and documented exit codes remain stable or have an explicit versioned migration.",
    "Host setup, factory health, and code-conformance evidence remain separate; every unresolved state states why and gives an exact next action.",
    "Generated GitHub Actions initializes the submodule, checks factory/bridge health, runs conformance for the checked-out changed code, persists the report, and independently checks its verdict, active binding, and content/revision identity.",
    "The gate rejects no report, persistence failure, FAIL, BLOCKED, tool unavailability, stale report, and same-path content edits; doctor output cannot substitute for the receipt.",
    "CI never fabricates named human evidence or waiver authority. Required evidence must be explicit and reviewable; absent evidence blocks.",
    "Host lint/test commands run only when explicitly configured and are marked unconfigured otherwise."
  ],
  "scenarioCoverage": "Discovery record challenges happy path, no-editor and unsupported-provider boundaries, missing-submodule and conflict failures, waiver/evidence abuse, concurrent setup, repeated setup, stale same-path edits, and CI report acquisition. All are covered after user resolution of Q-01.",
  "risks": [
    "Current path-only diffHash cannot establish report freshness and must not be reused for strict CI acceptance.",
    "Current conform persistence errors are swallowed; strict CI must make missing artifact fatal.",
    "Evidence-blocking directives can keep CI BLOCKED until real named human evidence or governed waiver is supplied.",
    "Current docs call brief.md a summary while the handoff verifier requires JSON. This brief includes both machine metadata and the full planning summary for compatibility."
  ],
  "remainingAssumptions": [
    "A change with no applicable code files reports conformance not applicable rather than PASS; health checks still run.",
    "Exact command names, workflow path, diff algorithm, and report schema migration can be decided during planning if these acceptance criteria remain intact."
  ],
  "materialUnknowns": [],
  "readyForPlan": true
}
