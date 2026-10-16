{
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "status": "released",
  "source": {
    "path": "docs/discovery/typescript-factory-rebuild/record.md",
    "sha256": "sha256:f7c12ad9bc1fe939c099e4a3cf2f37007dc518b1863f6130f9e6dcd876e1d138"
  },
  "sourceContext": {
    "path": "docs/context/refactors/typescript-factory-rebuild.md",
    "status": "ready",
    "sha256": "sha256:3dd0c62402639db2e5f46bc27d2a64e768d5738e2107dae78fe904c2ca577773",
    "confirmedByUserOn": "2026-10-16"
  },
  "grounding": {
    "claimPackets": [
      "G-KISS-001",
      "G-YAGNI-002",
      "G-ADR-0038",
      "G-ADR-0036"
    ],
    "result": "Grounded in canonical design principles KISS (eliminating workflow wrapper indirection) and YAGNI (stripping unused multi-stack abstractions), in alignment with ADR 0036 (pure TypeScript focus). Supersedes ADR 0038 by making workflows first-class skills rather than separate wrapper entries."
  },
  "objective": "Rebuild and clean Context Factory to focus exclusively on the TypeScript ecosystem with zero language/framework selection overhead, consolidate workflows directly into first-class skills under skills/workflows/<slug>/SKILL.md, and purge model-specific root files in favor of model-neutral orchestration.",
  "actors": [
    "TypeScript developer configuring and verifying full-stack TypeScript projects",
    "CI/CD automated pipeline running preflight, lint, and conform checks",
    "AI coding agent executing workflows and resolving TypeScript directives in IDEs",
    "Context Factory maintainer verifying repository health, manifest integrity, and doctor diagnostics"
  ],
  "scope": [
    "Delete root model-specific entry files: AGENTS.md, CLAUDE.md, CODEX.md, GEMINI.md, .cursorrules, .windsurfrules",
    "Delete .github/copilot-instructions.md and orchestrator adapters: orchestrator/AGENTS.md, orchestrator/CLAUDE.md, orchestrator/CODEX.md, orchestrator/GEMINI.md",
    "Designate orchestrator/SHARED.md and README.md as the sole model-neutral sources of truth",
    "Delete skills/workflow-entries/ (12 wrapper folders)",
    "Relocate and transform root workflows/*.md into first-class skill directories: skills/workflows/<slug>/SKILL.md",
    "Delete root workflows/ directory",
    "Streamline CLI options: remove --stack and --stacks flags and interactive language prompts from conform, preflight, resolve, and init commands",
    "Remove lingering unsupported stack checks (flutter) from app/cli/commands/doctor.mjs, schemas/rule-descriptor.schema.json, and tests",
    "Remove framework-filtering logic from rule descriptors and resolver, treating rules/typescript/ as a unified catalog",
    "Update scripts/validate-context.mjs and app/cli/core/indexer.mjs to validate and index skills/workflows/ and clean .agents/ symlinks",
    "Update app/cli/core/bridge-generator.mjs to symlink skills/workflows into .agents/skills/ and remove generation of obsolete root files",
    "Update docs/Skills.md and docs/Workflows.md Maps of Content",
    "Synchronize context-manifest.json and context-lock.json ensuring 0 dangling paths and 100% doctor pass"
  ],
  "nonGoals": [
    "Rewriting the procedural steps or quality gates within the workflows (content is unified into SKILL.md without changing gate logic)",
    "Modifying historical task archives under docs/tasks/2026/",
    "Introducing new runtime npm dependencies into Context Factory core"
  ],
  "acceptedDecisions": [
    "Discovery Q-01: First-class skill directories (skills/workflows/<slug>/SKILL.md) merging canonical workflow and entry into one single authoritative file per workflow.",
    "Discovery Q-02: Remove all model-specific root entrypoints (AGENTS.md, CLAUDE.md, CODEX.md, GEMINI.md, .cursorrules, .windsurfrules, .github/copilot-instructions.md, orchestrator/*). orchestrator/SHARED.md and README.md become sole sources of truth.",
    "Discovery Q-03: Unified TypeScript catalog with hardcoded TypeScript environment. Removal of --stack flags, Flutter checks, and framework-filtering logic.",
    "Supersession: ADR 0038 (Host-Native Entries for Canonical Workflows) is formally superseded by this first-class workflow skill architecture."
  ],
  "affectedAreasAndEvidence": [
    {
      "path": "workflows/",
      "reason": "Relocation and removal of 12 root workflow files"
    },
    {
      "path": "skills/workflow-entries/",
      "reason": "Complete removal of 12 wrapper adapter folders"
    },
    {
      "path": "skills/workflows/",
      "reason": "Creation of 12 first-class skill directories with SKILL.md"
    },
    {
      "path": "AGENTS.md, CLAUDE.md, CODEX.md, GEMINI.md, .cursorrules, .windsurfrules",
      "reason": "Complete removal of cluttering root model files"
    },
    {
      "path": "orchestrator/AGENTS.md, CLAUDE.md, CODEX.md, GEMINI.md",
      "reason": "Removal of model-specific orchestrator wrappers; orchestrator/SHARED.md is authoritative"
    },
    {
      "path": "app/cli/commands/doctor.mjs",
      "reason": "Removal of Flutter unsupported-stack checks and updating to single-stack TypeScript"
    },
    {
      "path": "app/cli/commands/conform.mjs, preflight.mjs, resolve.mjs, init.mjs",
      "reason": "Removal of --stack flags and prompts; hardcoding TypeScript environment"
    },
    {
      "path": "scripts/validate-context.mjs",
      "reason": "Update workflow validation to check skills/workflows and remove root AGENTS.md/.agents assertions"
    },
    {
      "path": "app/cli/core/indexer.mjs",
      "reason": "Update indexer to parse workflows from skills/workflows/ and generate MOCs"
    },
    {
      "path": "app/cli/core/bridge-generator.mjs",
      "reason": "Update symlinks to include skills/workflows/ and remove obsolete root file scaffolding"
    },
    {
      "path": "context-manifest.json",
      "reason": "Update orchestrators, skills, and workflows inventory"
    },
    {
      "path": "context-lock.json",
      "reason": "Regenerate authoritative context lock"
    }
  ],
  "qualityGateRequirements": [
    "scripts/validate-context.mjs passes with 0 errors",
    "app/cli/bin/context-cli.mjs doctor passes 100% HEALTHY",
    "npm test passes 100% of unit, bridge, and conformance evaluations",
    "Zero broken wikilinks in docs/Skills.md and docs/Workflows.md",
    "context-lock.json matches manifest exactly"
  ]
}
