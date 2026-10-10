{
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "status": "released",
  "source": {
    "path": "docs/discovery/pragmatic-design-principles-and-rule-alignment/record.md",
    "sha256": "sha256:bb56a0550f2e90d5892c929113a5184c438682c2af3a14b1b03782f74dbca069"
  },
  "sourceContext": {
    "path": "docs/context/rules/pragmatic-design-principles-and-rule-alignment.md",
    "status": "ready",
    "sha256ExcludingHashLine": "sha256:0388e05890bd5e60dff576646ecfb7152b03d8e2665de5bfab4a72dc8ad6e446",
    "confirmedByUserOn": "2026-10-10"
  },
  "grounding": {
    "claimPacket": ["G-00", "G-01", "G-02", "G-03", "G-04", "G-05"],
    "result": "The active canonical Wiki contains SOLID guidance relevant to extension, cohesion, dependency direction, narrow contracts, and substitutability, but no grounded entry for the requested pragmatic principles. Current OCP, SRP, and DIP rule mandates conflict with the target default-and-exception policy; the discovery record preserves both current claims and the user-confirmed target resolution.",
    "source": "docs/discovery/pragmatic-design-principles-and-rule-alignment/record.md#Grounding-claim-packet-TypeScript-design-principles"
  },
  "objective": "Introduce concise TypeScript knowledge and rules for YAGNI, KISS, composition over inheritance, and one combined Law of Demeter / tell, don't ask check; audit and reconcile existing rule directives so agents favor the smallest complete design while preserving justified boundaries and honest conformance evidence.",
  "actors": [
    "Host TypeScript developer and reviewer applying selected guidance",
    "Context Factory maintainer editing canonical knowledge, rules, selection, and evaluations",
    "Human maintainer providing named evidence or governed waiver where a blocking directive requires it"
  ],
  "scope": [
    "Create canonical TypeScript knowledge for distinct YAGNI and KISS concepts, composition over inheritance, and the combined Law of Demeter / tell, don't ask concept with examples, counterexamples, and valid provenance metadata",
    "Add concise .ts/.tsx rule directives that avoid speculative abstractions, favor a clear simple implementation, prefer composition for real variation, and request behavior from the owner instead of reaching through internals to decide",
    "Treat each principle as a default with a documented exception for a present requirement, accepted contract, or real boundary; keep authorization, tenant, data integrity, and trust rules binding",
    "Audit and reconcile existing OCP, SRP, DIP, global quality/architecture, and applicable TypeScript backend/UI directives and examples; retain existing directive IDs where contract compatibility permits",
    "Scope selection by affected TypeScript file and actual package metadata, with relevant framework additions only; prove that plain JavaScript and unrelated stacks do not receive the new guidance",
    "Add good/bad behavior fixtures and rule selection checks; use advisory or named human evidence for subjective checks until an ID-specific automated verifier demonstrably rejects a violation",
    "Synchronize knowledge and rule indexes, manifest, maps, context version, lock, evaluations, and doctor, and verify binding and conformance behavior after the change"
  ],
  "nonGoals": [
    "No host application source migration, schema change, new API, or runtime dependency",
    "No new plain-JavaScript or non-TypeScript guidance",
    "No blanket removal of SOLID, trust boundaries, operation-first backend ownership, or framework-specific rules",
    "No mandated inheritance, strategy registry, dependency injection framework, or interface for a single implementation",
    "No claim that a directive marker, resolver selection, or catalog doctor alone proves behavioral conformance"
  ],
  "acceptedDecisions": [
    "User 2026-10-10: principles are defaults with justified exceptions; a hypothetical future variant alone does not justify more structure",
    "User 2026-10-10: new guidance is limited to TypeScript and TSX",
    "User 2026-10-10: YAGNI and KISS are distinct knowledge concepts; concise TypeScript rules cover the requested principles and audit conflicting existing rules",
    "User 2026-10-10: Law of Demeter and tell, don't ask form one combined check covering reach-through coupling and decisions made from exposed state",
    "Existing ADR 0034 governs package-based framework rule selection; ADR 0037 governs operation-first backend boundaries and omission of placeholder files",
    "Current conflicting OCP, SRP, and DIP directives remain current-state facts until a governed rule revision is validated; the target decision is recorded as the planned reconciliation"
  ],
  "affectedAreasAndEvidence": [
    { "path": "knowledge/principles/", "reason": "New canonical principle concepts and existing SOLID cross-references" },
    { "path": "rules/solid/open-closed.md", "reason": "Unconditional extension interface and polymorphism mandates require a current-need trigger" },
    { "path": "rules/solid/single-responsibility.md", "reason": "Mandatory distinct-file wording conflicts with cohesive, operation-owned files" },
    { "path": "rules/solid/dependency-inversion.md", "reason": "Mandatory ports and adapters need a bounded real-dependency trigger" },
    { "path": "rules/global/code-quality.md", "reason": "Existing minimal-change and speculative-abstraction wording; avoid changing JavaScript semantics" },
    { "path": "rules/global/architecture-conformance.md", "reason": "Existing architecture and SOLID summary; preserve authority and trust boundaries" },
    { "path": "rules/typescript/backend/service-layer.md", "reason": "Existing simple-read exception and explicit service boundary" },
    { "path": "rules/typescript/ui/code-organization.md", "reason": "Existing cohesion and promote-on-reuse guidance" },
    { "path": "orchestrator/rules/binding-compiler.mjs", "reason": "Affected-file binding and rendered directive selection" },
    { "path": "orchestrator/conformance/adapters/typescript.mjs", "reason": "Fail-closed handling for unimplemented automated directives" },
    { "path": "docs/Rules.md", "reason": "Rule map synchronization" },
    { "path": "docs/Wiki.md", "reason": "Canonical knowledge map synchronization" },
    { "path": "context-manifest.json", "reason": "Canonical inventory synchronization" },
    { "path": "context-lock.json", "reason": "Regenerated content lock after canonical edits" }
  ],
  "acceptanceCriteria": [
    "The Wiki distinguishes YAGNI from KISS and explains composition and the combined Law of Demeter / tell, don't ask check with TypeScript examples and justified exceptions",
    "A one-implementation TypeScript case is accepted without a speculative interface, strategy, pass-through service, or file split, while a real multi-variant case can use composition or a focused strategy",
    "A reach-through caller decision is rejected or corrected by one combined rule; a legitimate DTO read, validation, serialization, or pure data transformation remains permitted",
    "Existing OCP, SRP, and DIP directive text and examples no longer contradict the default-and-exception policy; every reviewed conflict has a documented resolution or justified exception",
    "A policy-free simple read remains possible without a service, while tenant-sensitive or authorization-sensitive reads retain a trusted policy boundary",
    "New guidance binds for relevant .ts/.tsx files and not plain JavaScript or unrelated stacks; framework examples follow nearest package dependencies and do not duplicate shared TypeScript text",
    "Any automated-blocking claim has an ID-specific good/bad verifier result; unsupported or unavailable checks block or use an authorized named human-evidence path, never a false PASS",
    "Rule and knowledge metadata validate, inventory/maps/lock agree, focused evaluations and doctor pass, and reported completion distinguishes catalog health from host code correctness"
  ],
  "scenarioCoverage": "The record covers a single-implementation and real-variant happy path; tenant-policy and DTO boundaries; conflicting-rule failure; reach-through and false-verifier abuse; stale-snapshot concurrency; and stale-binding/catalog lifecycle recovery.",
  "risks": [
    "Global rule edits may change plain-JavaScript behavior despite the TypeScript-only decision",
    "New language may weaken real authorization, domain, or persistence boundaries if exceptions are vague",
    "The combined Law of Demeter / tell, don't ask rule may overreach into legitimate data transfer unless DTO exceptions are explicit",
    "Current knowledge metadata contains old skill path globs that may not select current grouped skill paths",
    "A short directive may still be unselected or unverifiable; payload and rejection-path tests are required"
  ],
  "remainingAssumptions": [
    "Exact directive IDs, file grouping, and feasible verifier implementations are selected during planning against the acceptance criteria",
    "No new ADR is required unless implementation changes an accepted architecture boundary instead of clarifying rule guidance"
  ],
  "materialUnknowns": [],
  "readyForPlan": true
}
