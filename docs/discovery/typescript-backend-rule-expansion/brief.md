{
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "status": "released",
  "source": {
    "path": "docs/discovery/typescript-backend-rule-expansion/record.md",
    "sha256": "sha256:e5fba2ae90ab802c020a720c3e38c39f848f8e82d7f94136b5359d097a6ca21d"
  },
  "sourceContext": {
    "path": "docs/context/rules/typescript-backend-rule-expansion.md",
    "status": "ready",
    "sha256ExcludingHashLine": "sha256:37bcd9dd4f31196593fb2b19a29baf455e73e9878b31562f460a580dcff721b0",
    "confirmedByUserOn": "2026-10-10"
  },
  "grounding": {
    "claimPacket": ["G-BE-001", "G-BE-002", "G-BE-003"],
    "result": "Active canonical SRP and DIP notes establish responsibility and dependency boundaries. The Wiki has no grounded answer for operation-first layout, direct simple reads, DTO/serialization taxonomy, test suffixes, or verifier design; use the discovery record's current-source and user-decision evidence.",
    "source": "docs/discovery/typescript-backend-rule-expansion/record.md#Grounding-Claim-Packet-Backend-Module-Boundaries"
  },
  "objective": "Strengthen TypeScript backend guidance while reducing repeated input: make operation-first modules the default, add compact DTO/serialization and backend-testing owners, reconcile simple reads and transaction/public-contract seams, and ensure blocking claims have real evidence.",
  "actors": [
    "Host TypeScript backend developer applying selected rules",
    "Context Factory maintainer editing rules, selection, and verifiers",
    "Reviewer or human maintainer providing required evidence or governed waiver"
  ],
  "scope": [
    "Supersede ADR 0001's layer-folder default while retaining vertical capability ownership and separate controller/service/data responsibilities",
    "Specify operation-first module tree, operation-local files, shared module-root concerns, stable public index, and cross-module import boundary",
    "Allow controller-to-data simple reads only without policy, authorization-sensitive decisions, or orchestration; keep service boundaries for commands and sensitive reads",
    "Add compact per-operation DTO/serialization and backend-testing rules without duplicating common runtime-validation or database-adapter testing ownership",
    "Define transport/domain/persistence/public-response mapping, injected service dependencies, and transaction context seam without mandating one library",
    "Reconcile existing controller/service/module rules, path and test-suffix compatibility, directive selection, conformance evidence, Rules map, inventory, lock, and evaluation fixtures",
    "Compare scoped rendered prompt tokens and directives before/after, and verify representative create/read outputs behaviorally"
  ],
  "nonGoals": [
    "No host application migration or database schema migration",
    "No UI/common TypeScript catalog expansion in this task",
    "No required ORM, schema library, platform directory, domain-event system, generator dependency, or hard 15-operation threshold",
    "No claim that catalog doctor, token savings, or heuristic PASS alone proves host code correctness"
  ],
  "acceptedDecisions": [
    "User 2026-10-10: backend gaps first",
    "User 2026-10-10: operation-first folders replace layer folders as the default inside src/modules/<feature>/",
    "User 2026-10-10: direct controller-to-data reads are allowed only with no business policy, authorization-sensitive decision, or orchestration",
    "User 2026-10-10: confirmed shared understanding and honest enforcement requirement",
    "ADR 0029 remains authoritative for fail-closed blocking evidence; a new ADR must supersede ADR 0001's folder-layout decision",
    "Current .test.ts and src/modules/ defaults remain; established host .spec.ts and src/features/ alternatives need explicit compatibility rather than silent loss of selection"
  ],
  "affectedAreasAndEvidence": [
    { "path": "docs/decisions/0001-vertical-backend-modules.md", "reason": "Current accepted layout to supersede with a new ADR" },
    { "path": "rules/typescript/backend/module-architecture.md", "reason": "Current layer-folder tree, imports, names, applicability, and directive modes" },
    { "path": "rules/typescript/backend/controllers-and-routes.md", "reason": "Transport, response, and direct-simple-read exception" },
    { "path": "rules/typescript/backend/service-layer.md", "reason": "Policy boundary, explicit dependencies, and transactions" },
    { "path": "rules/typescript/common/runtime-validation.md", "reason": "Existing request validation owner to avoid duplication" },
    { "path": "rules/typescript/database/testing-data-access-layer.md", "reason": "Existing adapter-test owner and .test.ts applicability" },
    { "path": "orchestrator/rules/binding-compiler.mjs", "reason": "Scope and statement selection to measure and test" },
    { "path": "orchestrator/conformance/adapters/typescript.mjs", "reason": "Generic heuristic PASS gap for unhandled automated directives" },
    { "path": "orchestrator/conformance/evidence-gate.mjs", "reason": "Blocking evidence acceptance and fail-closed result" },
    { "path": "docs/Rules.md", "reason": "Catalog map to keep synchronized with new rule owners" },
    { "path": "context-manifest.json", "reason": "Canonical inventory for new rule/ADR/test files" },
    { "path": "context-lock.json", "reason": "Regenerated content lock after catalog changes" }
  ],
  "acceptanceCriteria": [
    "Representative create and simple-read operation trees follow the new default without contradictory route/controller/service/data instructions",
    "Policy-bearing reads and commands cannot bypass the service/policy boundary; cross-tenant negative case fails safely",
    "Request schema, domain value, persistence row, and response serializer have explicit mapping and a test excluding a new internal field from public output",
    "Service transaction dependencies are injected; two atomic writes share one transaction context and rollback on mid-command failure",
    "Cross-module deep imports and sideways operation imports are rejected by a real architecture check or require named human evidence; no unhandled automated directive receives a heuristic PASS",
    "Backend testing guidance covers service, controller, data, route, and public-contract cases while preserving adapter-test ownership and host .test.ts/.spec.ts discovery",
    "Affected-file selection works for default src/modules and explicit established-host src/features configurations; unrelated UI/framework rules are excluded",
    "Before/after rendered prompt payload metrics and representative generated-code behavior tests are recorded separately",
    "New ADR, rules, map, manifest, lock, evaluations, and doctor agree; final conformance follows required human-evidence gates"
  ],
  "scenarioCoverage": "Record covers create and simple-read happy paths; tenant-sensitive read and persistence-output boundaries; malformed input and rollback failure; deep-import and verifier abuse; transaction/retry concurrency; host compatibility and stale-binding lifecycle.",
  "risks": [
    "Operation-first folders can mask responsibility mixing unless imports and file ownership are checked",
    "A simple read can hide tenant policy and must then use a trusted service/policy boundary",
    "Broad alwaysApply selection or duplicated directives may increase actual provider payload despite shorter files",
    "Current adapter accepts a heuristic verifierType for some automated-blocking directives; implementation must remove false enforcement claims"
  ],
  "remainingAssumptions": [
    "The exact new directive IDs and verifier implementations are chosen during planning and verified against the current catalog",
    "No mandatory generator or platform directory is introduced without later evidence"
  ],
  "materialUnknowns": [],
  "readyForPlan": true
}
