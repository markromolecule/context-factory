{
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "status": "released",
  "source": {
    "path": "docs/discovery/typescript-web-rule-quality/record.md",
    "sha256": "sha256:01e0073fc8a7577461841f5805efe422beaff556ec18ea8abe664cd43bf28533"
  },
  "sourceContext": {
    "path": "docs/context/harness/typescript-web-rule-quality.md",
    "status": "ready",
    "sha256ExcludingHashLine": "sha256:38c19de768f6d4e988f346299cfa34d47562c0a5f61bc8a79c5c43862bbfad27",
    "confirmedByUserOn": "2026-10-09"
  },
  "grounding": {
    "claimPacket": "G-TS-001",
    "result": "No applicable canonical Wiki note answers host TypeScript compiler receipts or fixture test matrices. Use the cited repository source, adapter contract, and accepted ADRs (0027, 0029, 0032, 0034).",
    "source": "knowledge/README.md#Canonical-Knowledge-Items",
    "sourceHash": "sha256:76396078e7be74da4823e32e69a012c09306c1c1de4d1d91e33737fdc437bfac"
  },
  "objective": "Establish rigorous host compiler/linter execution receipts and a paired positive/negative fixture test harness for TypeScript web rule conformance, strictly separating host TOOL_UNAVAILABLE gating from dedicated offline static fixture testing.",
  "actors": [
    "Host TypeScript developer running local checks and builds",
    "CI pipeline running automated-blocking conformance gates",
    "AI agent generating React, Next.js, and SolidJS code against canonical directives",
    "Maintainer reviewing conformance evidence and human waivers"
  ],
  "scope": [
    "Strict separation: Host repository runs require real tools (tsc, eslint); missing tools return TOOL_UNAVAILABLE (BLOCKED) for automated-blocking directives",
    "Host compiler execution receipts recording tool, exact argv, effective config digest (from --showConfig), exit code, and stdout/stderr excerpt",
    "Host linter execution receipts verifying syntax-aware @typescript-eslint rules without inline bypass",
    "Comprehensive positive/negative fixture suite covering 4 violation classes across shared TypeScript, React, Next.js, and SolidJS",
    "Dedicated fixture runner mode allowing deterministic static AST verification without requiring global host tooling"
  ],
  "nonGoals": [
    "No runtime npm dependencies inside Context Factory core",
    "No automatic rewriting or AST transformation of host code",
    "No removal or bypass of human evidence gates for evidence-blocking directives",
    "No unverified assumption that exit 0 proves strict compiler options"
  ],
  "acceptedDecisions": [
    "ADR 0029: Automated-blocking directives require deterministic tool verification; missing tools cannot be normalized to PASS",
    "ADR 0034: Framework rules are scoped to package dependencies; Next.js implies React; SolidJS excludes React/Next.js",
    "Q-01 (resolved 2026-10-09): Host execution returns TOOL_UNAVAILABLE (BLOCKED) on missing tools; static AST checks are used exclusively in dedicated offline fixture/unit test modes"
  ],
  "affectedAreasAndEvidence": [
    {
      "path": "orchestrator/conformance/adapters/typescript.mjs",
      "reason": "Execution receipt generation, host tool discovery, and strict mode separation"
    },
    {
      "path": "orchestrator/conformance/evidence-gate.mjs",
      "reason": "Receipt evidence validation and TOOL_UNAVAILABLE gating"
    },
    {
      "path": "evals/tests/conformance/typescript-adapter.test.mjs",
      "reason": "Unit tests for host mode vs fixture mode and receipt emission"
    },
    {
      "path": "evals/fixtures/typescript/",
      "reason": "Positive and negative fixture pairs across 4 violation classes and 3 frameworks"
    }
  ],
  "acceptanceCriteria": [
    "In host mode without tsc or eslint, automated-blocking directives return TOOL_UNAVAILABLE and gate reports BLOCKED (exit code 2)",
    "In host mode with tsc, adapter validates effective compilerOptions (strict: true, noImplicitAny, noUncheckedIndexedAccess) and captures execution receipt",
    "In host mode with eslint, adapter verifies @typescript-eslint rules without suppression comments and captures execution receipt",
    "In dedicated fixture mode, positive fixtures pass and negative fixtures fail deterministically across ban-any, floating promises, boundary validation, and type safety",
    "Receipt schema adheres to versioned conformance report contract with tamper-evident diff and binding hashes",
    "All factory health checks, lint, and doctor diagnostics remain PASS with zero errors"
  ],
  "scenarioCoverage": "Discovery record covers happy path, missing-tool boundary, negative fixture detection, invalid tsconfig failure, ban-any abuse, concurrent runs, and lifecycle rule changes.",
  "risks": [
    "Strict tool-unavailability in host runs will block environments lacking devDependencies unless human waiver is provided",
    "ESLint v9 flat config compatibility requires resilient config inspection"
  ],
  "remainingAssumptions": [
    "Dedicated fixture mode is triggered via explicit runner capability flag (e.g. capabilities.fixtureMode = true)",
    "No new top-level command is required; existing conform CLI and orchestrator handle the adapter contract"
  ],
  "materialUnknowns": [],
  "readyForPlan": true
}
