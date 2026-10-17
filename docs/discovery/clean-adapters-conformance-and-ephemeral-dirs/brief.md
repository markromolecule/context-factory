{
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "status": "released",
  "source": {
    "path": "docs/discovery/clean-adapters-conformance-and-ephemeral-dirs/record.md",
    "sha256": "sha256:23413033da8945edb2bb5fe03684de228daa91ec412382d83993a8bc2c67ac11"
  },
  "sourceContext": {
    "path": "docs/context/refactors/clean-adapters-conformance-and-ephemeral-dirs.md",
    "status": "ready",
    "sha256": "sha256:0df8aff0d049300ee4cc4af8c0a500a1f92fe096a4f9b0b4e9c8ce3379ad2f73",
    "confirmedByUserOn": "2026-10-17"
  },
  "grounding": {
    "claimPackets": [
      "G-KISS-001",
      "G-YAGNI-002",
      "G-ADR-0029",
      "G-ADR-0035"
    ],
    "result": "Grounded in canonical design principles KISS (purging complex runtime conformance indirection) and YAGNI (eliminating obsolete stack adapters and ephemeral symlink baggage). Decommissions ADR 0029 (Executable Rule Conformance Harness) and ADR 0035 (Host Conformance Receipts) in favor of standard project linting, validation, and transparent project structure."
  },
  "objective": "Clean Context Factory by removing ephemeral directories (.agents, .claude, .worktrees) and completely eliminating language conformance and adapter logic (orchestrator/conformance/, context-cli conform, conformance tests/schemas), creating a healthy, lean project structure ready for rewriting the bridge generator.",
  "actors": [
    "Context Factory developer / maintainer maintaining rules, skills, and orchestrator",
    "AI coding agent navigating workspace skills directly from canonical directories",
    "CI/CD pipeline executing fast manifest, syntax lint, and evaluation suites"
  ],
  "scope": [
    "Delete .agents directory and all its symlinks/configurations from context-factory root",
    "Delete .claude directory and all its symlinks from context-factory root",
    "Delete .worktrees directory and orphaned worktrees (0001, 0003, PLN-0004)",
    "Delete orchestrator/conformance/ directory (adapter-contract.mjs, adapters/typescript.mjs, conformance-orchestrator.mjs, change-identity.mjs, evidence-gate.mjs, process-runner.mjs, report-verifier.mjs, waiver-policy.mjs)",
    "Delete app/cli/commands/conform.mjs and remove conform command routing from app/cli/bin/context-cli.mjs",
    "Delete schemas/conformance-report.schema.json and schemas/conformance-result.schema.json",
    "Delete evals/tests/conformance/ (8 test files) and evals/datasets/conformance/ (8 dataset files)",
    "Update evals/run-evals.mjs to remove evaluateConformance calls and adapter registrations",
    "Update scripts/validate-context.mjs to remove assertions requiring .agents in context-factory",
    "Update app/cli/commands/doctor.mjs to remove adapter checks and the Conformance Enforcement check row",
    "Update app/cli/commands/preflight.mjs to remove lingering references to conformance",
    "Update evals/tests/bridge/workflow-entry-contract.test.mjs to assert canonical skills/workflows directly",
    "Update evals/tests/bridge/bridge-conformance.test.mjs to remove conform assertions",
    "Update context-manifest.json to deregister deleted tools, schemas, and datasets",
    "Update context-lock.json via node scripts/context.mjs lock",
    "Update orchestrator/SHARED.md and README.md to remove references to conform and adapters"
  ],
  "nonGoals": [
    "Rewriting bridge-generator.mjs in this task (this task establishes the clean foundation; rewrite will be executed in a dedicated follow-up task)",
    "Modifying canonical rules in rules/ or skills in skills/",
    "Modifying historical task archives under docs/tasks/ or docs/execution/"
  ],
  "acceptedDecisions": [
    "Discovery Q-01: Completely eliminate the conformance subsystem: delete orchestrator/conformance/, remove context-cli conform, purge schemas/tests, and focus doctor on manifest/lock/lint health.",
    "Discovery Q-02: Clean project state now to prepare for rewriting the bridge generator. Remove .agents and .claude from context-factory root and remove lingering checks."
  ],
  "affectedAreasAndEvidence": [
    {
      "path": ".worktrees/",
      "evidence": "E-01: Contains 3 orphaned directories; safe to delete."
    },
    {
      "path": ".claude/",
      "evidence": "E-02: Tracked symlinks to workflows; safe to remove from git and filesystem."
    },
    {
      "path": ".agents/",
      "evidence": "E-03: Symlinks and skills.json asserted by validate-context; remove directory and validator assertions."
    },
    {
      "path": "orchestrator/conformance/",
      "evidence": "E-04: Multi-adapter conformance machinery; delete entire directory."
    },
    {
      "path": "app/cli/commands/conform.mjs",
      "evidence": "E-05: Conformance CLI command; delete file and remove from context-cli.mjs."
    },
    {
      "path": "evals/tests/conformance/ and evals/datasets/conformance/",
      "evidence": "E-06: 16 test/dataset files for conformance; delete and update run-evals.mjs."
    }
  ]
}
