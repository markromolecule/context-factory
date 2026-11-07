{
  "contractVersion": 2,
  "status": "released",
  "sourceContext": {
    "path": "docs/context/harness/catalog-validation-telemetry-and-prompt-regression.md",
    "confirmedByUserOn": "2026-11-07",
    "status": "ready",
    "sha256": "sha256:9f4923afa57eabe72c76cbaa74b42c2c37f29bed3ed1bd6eaa77c71beccea7b7"
  },
  "objective": "Strengthen Context Factory catalog validation, measure observable harness-run efficiency and failures by task, and catch workflow/stage/gate regressions with deterministic fixtures.",
  "actors": [
    "Catalog author maintaining skills, workflows, templates, and manifests",
    "Harness maintainer examining task-level run metrics and failures",
    "Reviewer deciding whether fixture expectation changes are intentional",
    "Local hook and CI enforcing the same factory-health gate"
  ],
  "scope": [
    "Extend existing validator and doctor coverage for canonical skill/workflow metadata, supported task/phase/unit templates, configuration manifests, and resource references with negative fixtures",
    "Reuse the existing pre-commit hook and pull-request CI doctor chain for one deterministic validation result",
    "Record task ID, provider usage, provider attempts, and lifecycle-stage failures for Context Factory harness-owned runs in a local bounded versioned report; distinguish actual, mock, estimated, unknown, and unavailable metrics",
    "Add offline fixtures asserting workflow selection, runner stage order, and required validation-gate results under the mock provider"
  ],
  "nonGoals": [
    "No new agent tool-calling or retry loop; tool-failure frequencies and agent-loop iterations remain unavailable while the runner does not execute them",
    "No instrumentation of live Codex, Claude, Gemini, or other external host sessions",
    "No hosted telemetry, currency cost calculation, prompt/secret/tool-payload logging, or live-model CI dependency",
    "No claim that catalog doctor verifies changed application code or external agent tool behavior"
  ],
  "acceptedDecisions": [
    "User confirmed harness-owned telemetry only and measurement of the current single-provider-call runner on 2026-11-07.",
    "Extend the existing validator/doctor/hook/CI path; avoid a second catalog authority.",
    "Use observed provider and lifecycle-stage boundaries for metrics and sequence fixtures; label absent tool/loop measurements unavailable.",
    "Preserve the accepted dependency-free ESM architecture unless a dependency trade-off is explicitly revisited."
  ],
  "acceptanceCriteria": [
    "Valid catalog passes the same local and CI gate; malformed skill/workflow metadata, missing or mis-cased references, invalid configuration, and supported template contract errors fail with path-specific diagnostics.",
    "Per-run and per-task reports preserve task identity, actual provider-reported token values when supplied, labeled mock/unknown values, provider attempts, and stage failures; tool and loop fields never imply unobserved zero.",
    "Failed or interrupted runs preserve primary errors and report partial metrics honestly; concurrent runs under one task ID aggregate without silent loss or duplication.",
    "Deterministic fixtures fail for wrong workflow selection, changed runner stage order, omitted validation gate, and failed provider/stage actions; no live credentials are required.",
    "Telemetry excludes prompts, credentials, tool arguments/results, and personal data; invalid paths and unsupported report versions fail explicitly.",
    "Existing doctor baseline and affected unit/integration tests pass after the new checks are added."
  ],
  "scenarioCoverage": "Discovery record S-01 through S-09 challenge happy-path catalog/run behavior, malformed references, absent usage, provider/stage failures, prompt regressions, concurrent and interrupted reports, path/secret abuse, schema evolution, and the factory-health versus host-code boundary.",
  "risks": [
    "Text scans for script references can mistake examples for contracts; supported syntax and false-positive fixtures must be explicit.",
    "The current frontmatter parser may overlook malformed syntax; test the supported grammar with negative fixtures.",
    "Mock fixtures prove harness behavior only; absent provider usage and interrupted writes can leave partial metrics."
  ],
  "remainingAssumptions": [
    "Storage location, retention bound, schema field names, and command spelling are planning choices if the local, bounded, versioned, and concurrent-run-safe contract is preserved."
  ],
  "materialUnknowns": [],
  "readyForPlan": true,
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "source": {
    "path": "docs/discovery/catalog-validation-telemetry-and-prompt-regression/record.md",
    "sha256": "sha256:2b27e8cb6dd52a03ba5878ae9c3c8383dd176f44474fbc5703703fb79cc9535a"
  }
}
