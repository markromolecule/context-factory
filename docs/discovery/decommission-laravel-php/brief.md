{
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "status": "released",
  "source": {
    "path": "docs/discovery/decommission-laravel-php/record.md",
    "sha256": "sha256:e2e184ce8f9bc35785c03f9180df1c8c1cc48b48ea442574b4811e7ab53f512b"
  },
  "sourceContext": {
    "path": "docs/context/refactors/decommission-laravel-php-ecosystem.md",
    "status": "ready",
    "sha256": "sha256:91c82a040d838e8c7799a02860c3c3431199c272d90c30b3a77aa0658f6f0bde",
    "confirmedByUserOn": "2026-10-09"
  },
  "grounding": {
    "claimPacket": "G-DEC-001",
    "result": "Canonical LLM Wiki contains no note regarding Laravel stack decommissioning. Rely on active repository source, manifests, and accepted ADRs (0021, 0022, 0023, 0029, 0036).",
    "source": "knowledge/README.md#Canonical-Knowledge-Items",
    "sourceHash": "sha256:76396078e7be74da4823e32e69a012c09306c1c1de4d1d91e33737fdc437bfac"
  },
  "objective": "Complete removal of all Laravel and PHP implementations, rules, adapters, evaluation cases, and fixtures to dedicate Context Factory exclusively to the TypeScript web and backend ecosystem.",
  "actors": [
    "TypeScript developer configuring and verifying full-stack TypeScript projects",
    "CI/CD automated pipeline running preflight and conform checks",
    "AI coding agent resolving directives and generating pure TypeScript code",
    "Context Factory maintainer verifying repository health and manifest integrity"
  ],
  "scope": [
    "Delete all 23 active rules under rules/laravel/",
    "Delete orchestrator/conformance/adapters/laravel.mjs and unregister from CLI conform and doctor",
    "Delete Laravel fixtures under evals/fixtures/laravel-conformance/",
    "Delete Laravel conformance and rule test suites (laravel-adapter.test.mjs, unit-06-02-laravel-http-application.test.mjs, unit-06-03-laravel-data-security.test.mjs)",
    "Replace evals/cases/laravel-resolution.json with a TypeScript resolution evaluation case",
    "Scrub PHP and Laravel snippets and references from shared rules/global/ and rules/solid/ to pure TypeScript",
    "Remove 'laravel' stack inference keyword mapping from scripts/context-core.mjs",
    "Emit informative BLOCKED (exit 2) diagnostic when --stack laravel is explicitly requested, citing ADR 0036",
    "Synchronize context-manifest.json and context-lock.json ensuring 0 dangling references"
  ],
  "nonGoals": [
    "Modifying or deleting closed historical tasks under docs/tasks/2026/09/",
    "Introducing new runtime npm dependencies into Context Factory core",
    "Breaking any active TypeScript rule descriptors or conformance pipelines"
  ],
  "acceptedDecisions": [
    "ADR 0036: Decommission Laravel / PHP Stack and Dedicate Context Factory to TypeScript Ecosystem",
    "ADR 0022 and ADR 0023: Formally superseded by ADR 0036",
    "Discovery Q-01: Explicit --stack laravel calls fail-closed with exit code 2 (BLOCKED) and an informative message referencing ADR 0036"
  ],
  "affectedAreasAndEvidence": [
    {
      "path": "rules/laravel/",
      "reason": "Complete removal of 23 active rule files"
    },
    {
      "path": "orchestrator/conformance/adapters/laravel.mjs",
      "reason": "Removal of standalone Laravel conformance adapter"
    },
    {
      "path": "app/cli/commands/conform.mjs",
      "reason": "Unregister Laravel adapter and add decommissioned stack diagnostic"
    },
    {
      "path": "app/cli/commands/doctor.mjs",
      "reason": "Update conformance diagnostics to single-stack TypeScript"
    },
    {
      "path": "scripts/context-core.mjs",
      "reason": "Remove Laravel keyword stack inference"
    },
    {
      "path": "evals/",
      "reason": "Delete Laravel test suites and fixtures, replace evaluation case"
    },
    {
      "path": "rules/global/ and rules/solid/",
      "reason": "Clean PHP references and code snippets to pure TypeScript"
    },
    {
      "path": "context-manifest.json and context-lock.json",
      "reason": "Remove all references to deleted rules, files, tests, and fixtures"
    }
  ],
  "acceptanceCriteria": [
    "Zero files remain under rules/laravel/ and zero PHP rules exist in catalog",
    "orchestrator/conformance/adapters/laravel.mjs is deleted and doctor reports single-stack typescript",
    "Explicit --stack laravel calls in conform and preflight exit with code 2 (BLOCKED) and cite ADR 0036",
    "All Laravel test files and fixtures deleted, with evals/cases/laravel-resolution.json replaced by TypeScript case",
    "Shared rules/global/ and rules/solid/ are 100% pure TypeScript with zero PHP syntax",
    "scripts/context.mjs doctor and npm test pass cleanly with 100% HEALTHY status",
    "context-manifest.json and context-lock.json are completely synchronized with zero dangling entries"
  ],
  "scenarioCoverage": "Covers pure TypeScript resolution (S-01), explicit --stack laravel rejection (S-02), single-stack doctor health (S-03), and pure TypeScript SOLID rules inspection (S-04).",
  "risks": [
    "Dangling references in context-manifest.json causing doctor or sync failures if not scrubbed comprehensively",
    "Broken relative imports or evaluation fixtures if any shared file retained Laravel dependencies"
  ],
  "remainingAssumptions": [
    "Historical tasks under docs/tasks/2026/09/ remain unchanged as historical records",
    "TypeScript remains the sole supported first-class stack for Context Factory"
  ],
  "materialUnknowns": [],
  "readyForPlan": true
}
