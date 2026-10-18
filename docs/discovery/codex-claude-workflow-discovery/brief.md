{
  "version": 1,
  "kind": "discovery-brief",
  "owner": "grill",
  "status": "released",
  "source": {
    "path": "docs/discovery/codex-claude-workflow-discovery/record.md",
    "sha256": "sha256:9ee6ebce812e47a010e04768202ccf6b6ef29c00fc21594168bf948e9f18e2bf"
  },
  "sourceContext": {
    "path": "docs/context/cli/codex-claude-workflow-discovery.md",
    "status": "ready",
    "sha256": "sha256:4e88ad516c31f564c8039d0178ee0168fea1258e7a3690226158ba9b925f7f0b",
    "confirmedByUserOn": "2026-10-11"
  },
  "grounding": {
    "claimPacketIds": ["G-WF-001", "G-WF-002", "G-WF-003"],
    "result": "KISS and YAGNI support a thin, present-need adapter. The canonical Wiki has no host discovery contract; use verified repository source, accepted ADRs, and official host documentation for those facts.",
    "recordSection": "Grounding claim packet: workflow adapter scope"
  },
  "objective": "Make all 12 current canonical Context Factory workflows discoverable in Codex and Claude Code through host-native entries, while preserving suitable automatic workflow selection from ordinary requests. Invoked entries must load and follow the canonical workflow gates.",
  "actors": [
    "Developer using Codex or Claude Code to invoke or describe a workflow",
    "Factory maintainer changing workflow inventory, resolver, bridge generation, diagnostics, and documentation",
    "Host-project maintainer whose existing files and commands must be preserved"
  ],
  "scope": [
    "Generate or link thin, uniquely named project skill entries for every current canonical workflow in Codex .agents/skills and Claude Code .claude/skills",
    "Retain workflows/*.md and context-manifest.json as the authoritative lifecycle inventory; entries load the canonical file and resolve the actual user request",
    "Preserve action-sensitive implicit routing and verify positive, direct-question, and ambiguous request behavior",
    "Support factory checkout and bridged host repositories, including missing factory, broken link, collision, repeated setup, concurrent write, and known-ownership cleanup paths",
    "Correct generated and hand-written documentation that labels internal aliases as native slash registration",
    "Synchronize manifest, maps, lock, validation, bridge tests, resolver evaluations, and diagnostics",
    "Run separate live Codex and Claude Code smoke checks for discovery, invocation, and canonical gate adherence before a completion claim"
  ],
  "nonGoals": [
    "No conversion of full workflows into skills or second lifecycle policy source",
    "No deprecated, local-only Codex custom prompts or promise of literal /workflow-name in Codex",
    "No other editor adapters, consumer application feature changes, database or API schema changes",
    "No automatic execution, release, push, waiver, or message authority from selecting an entry"
  ],
  "acceptedDecisions": [
    "ADR 0003 keeps workflow policy and skills as separate responsibilities; ADR 0038 selects thin host-native entries that depend on canonical workflow files.",
    "The user confirmed both ordinary-language routing and visible host entries on 2026-10-11.",
    "The user confirmed host-native syntax: Codex /skills or $name, Claude Code /name; Codex custom prompts are excluded.",
    "Entries are additive, uniquely named, and fail on collision or broken target rather than replacing user-owned host files.",
    "A displayed entry, a valid link, resolver selection, and actual canonical gate adherence require distinct evidence."
  ],
  "affectedAreasAndEvidence": [
    {"path": "workflows/", "reason": "Twelve canonical lifecycle contracts; record R-01 and ADR 0003."},
    {"path": "context-manifest.json", "reason": "Workflow and skill inventory; record R-01."},
    {"path": "scripts/context-core.mjs", "reason": "Action-sensitive workflow selection and routing hints; record R-02."},
    {"path": "app/cli/core/bridge-generator.mjs", "reason": "Host instruction generation, project skill links, symlink audit, and editor detection; record R-03."},
    {"path": ".agents/skills/", "reason": "Existing factory Codex skill discovery; record R-04."},
    {"path": ".claude/skills/", "reason": "New project skill discovery destination for Claude Code; official host documentation and record R-06."},
    {"path": "app/cli/core/indexer.mjs", "reason": "Generator for docs/Workflows.md slash-alias wording; record conflict ledger."},
    {"path": "evals/tests/bridge/bridge-conformance.test.mjs", "reason": "Existing bridge contract tests cover instruction files but not workflow entries; record R-04."},
    {"path": "docs/decisions/0038-host-native-workflow-entries.md", "reason": "Accepted boundary and verification decision; record R-05."}
  ],
  "acceptanceCriteria": [
    "For each of the 12 inventoried workflows, both hosts have one uniquely named project entry whose target resolves to the canonical workflow; inventory and link checks detect missing, stale, duplicate, or broken entries.",
    "Codex invocation through /skills or $name and Claude Code invocation through /name each load the selected canonical workflow and demonstrate its required inputs and stop condition in separate live smoke checks.",
    "Plain actionable requests select the expected workflow with an inspectable reason; direct questions mentioning workflow do not force a delivery lifecycle; ambiguous requests are handled without an unjustified confident selection.",
    "Bridge generation works for a factory checkout and representative linked or submodule host, preserves existing user-owned skill and command files, reports collisions, rechecks before concurrent writes, and is idempotent on rerun.",
    "Missing or moved factory targets fail diagnostics with a repair action; known-generated entries can be reconciled without deleting unowned host content.",
    "Adding Codex entries does not falsely identify a host as Antigravity solely because .agents exists.",
    "Documentation distinguishes internal resolver aliases from Codex and Claude native entry syntax, and no generated entry duplicates canonical phase or gate policy.",
    "Manifest, maps, lock, doctor, relevant resolver evaluations, and bridge/contract checks pass; host behavior and factory health are reported separately."
  ],
  "scenarioCoverage": "The record challenges happy-path explicit and implicit selection, direct-question and ambiguous boundaries, name collision and broken-target failures, unauthorized release and file-overwrite abuse, concurrent setup, inventory lifecycle changes, and skill-list size. All have required outcomes; live host behavior remains a later verification gate.",
  "risks": [
    "Codex may shorten or omit skills from its initial list when the inventory grows; measure and smoke test discoverability.",
    "Current detectInstalledIdes treats any .agents directory as Antigravity; Codex skill setup could misreport editor identity.",
    "Factory doctor and resolver evaluations cannot prove that either host loaded or obeyed an entry.",
    "Current handoff verification checks the record hash but does not itself compare the source context hash or validate the semantic fields of this JSON brief; plan must inspect freshness and content."
  ],
  "remainingAssumptions": [
    "Exact entry names and bridge file layout are reversible planning details, subject to collision checks and host discovery tests."
  ],
  "materialUnknowns": [],
  "readyForPlan": true
}
