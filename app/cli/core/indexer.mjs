import { extname, join } from "node:path";
import { writeFile } from "node:fs/promises";
import {
  createLock,
  filesUnder,
  frontmatter,
  manifestPaths,
  readJson,
  readText,
  root,
} from "../../../scripts/context-core.mjs";
import { repairBridgeSymlinks } from "./bridge-generator.mjs";

/**
 * Generates canonical Obsidian Map of Content for rules.
 */
export async function generateRulesMoc(actualRules) {
  const ruleItems = await Promise.all(
    actualRules.map(async (path) => {
      const source = await readText(path);
      const meta = frontmatter(source) ?? {};
      const headingMatch = source.match(/^#\s+(.+)$/m);
      const title = meta.title || headingMatch?.[1] || meta.name || path.split("/").at(-1).replace(/\.md$/, "");
      return { path, meta, title };
    })
  );

  const groups = {
    global: { title: "## Global", items: [] },
    solid: { title: "## SOLID Architecture", items: [] },
    typescriptCommon: { title: "## TypeScript\n\n### Common", items: [] },
    typescriptBackend: { title: "### Backend", items: [] },
    typescriptDatabase: { title: "### Database", items: [] },
    typescriptHooks: { title: "### Hooks", items: [] },
    typescriptUi: { title: "### UI", items: [] },
  };

  const customGroups = new Map();

  for (const item of ruleItems) {
    const p = item.path;
    const linkPath = p.replace(/\.md$/, "");
    const row = `- [[${linkPath}|${item.title}]]`;

    if (p.startsWith("rules/global/")) groups.global.items.push(row);
    else if (p.startsWith("rules/solid/")) groups.solid.items.push(row);
    else if (p.startsWith("rules/typescript/common/")) groups.typescriptCommon.items.push(row);
    else if (p.startsWith("rules/typescript/backend/")) groups.typescriptBackend.items.push(row);
    else if (p.startsWith("rules/typescript/database/")) groups.typescriptDatabase.items.push(row);
    else if (p.startsWith("rules/typescript/hooks/")) groups.typescriptHooks.items.push(row);
    else if (p.startsWith("rules/typescript/ui/")) groups.typescriptUi.items.push(row);
    else {
      const parts = p.split("/");
      const cat = parts[1] || "other";
      if (!customGroups.has(cat)) customGroups.set(cat, []);
      customGroups.get(cat).push(row);
    }
  }

  const sections = [
    `---
title: Rules
type: moc
tags: [rules, engineering]
---

# Rules`,
  ];

  for (const group of Object.values(groups)) {
    if (group.items.length > 0) {
      sections.push(`${group.title}\n\n${group.items.join("\n")}`);
    }
  }

  for (const [category, items] of customGroups.entries()) {
    const catTitle = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");
    sections.push(`## ${catTitle}\n\n${items.join("\n")}`);
  }

  return `${sections.join("\n\n")}\n`;
}

/**
 * Generates canonical Obsidian Map of Content for skills.
 */
export async function generateSkillsMoc(actualSkills) {
  const skillItems = await Promise.all(
    actualSkills.map(async (path) => {
      const source = await readText(path);
      const meta = frontmatter(source) ?? {};
      const name = meta.name || path.split("/").at(-2);
      const headingMatch = source.match(/^#\s+(.+)$/m);
      const title = headingMatch?.[1] || name;
      return { path, meta, name, title, description: meta.description || "" };
    })
  );

  skillItems.sort((a, b) => a.name.localeCompare(b.name));

  const engineeringSkills = skillItems.filter((item) => item.path.startsWith("skills/engineering/"));
  const productivitySkills = skillItems.filter((item) => item.path.startsWith("skills/productivity/"));
  const otherSkills = skillItems.filter((item) => !item.path.startsWith("skills/engineering/") && !item.path.startsWith("skills/productivity/"));

  const engRows = engineeringSkills.map((item) => `- [[${item.path.replace(/\.md$/, "")}|${item.name}]] — ${item.description}`);
  const prodRows = productivitySkills.map((item) => `- [[${item.path.replace(/\.md$/, "")}|${item.name}]] — ${item.description}`);
  const otherRows = otherSkills.map((item) => `- [[${item.path.replace(/\.md$/, "")}|${item.name}]] — ${item.description}`);

  let content = `---
title: Skills
type: moc
tags: [skills, workflows, tools]
---

# Skills

The Context Factory defines ${skillItems.length} focused procedural skills across two primary categories for interactive development, planning, discovery, auditing, refactoring, and knowledge grounding:

## Engineering & Coding
*Group Index:* [[skills/engineering/README|Engineering Skills Overview]]

${engRows.join("\n")}

## Productivity & Discovery
*Group Index:* [[skills/productivity/README|Productivity Skills Overview]]

${prodRows.join("\n")}`;

  if (otherRows.length > 0) {
    content += `\n\n## Other Skills\n\n${otherRows.join("\n")}`;
  }

  content += `\n\nSkills trigger through their YAML descriptions and slash command shortcuts. All declarative engineering standards (TypeScript type safety, runtime validation, database query optimization, backend module architecture, and UI styling) are defined in and loaded from \`rules/\`.\n\nFor a new system, product, or feature capability, the skill sequence is \`context\` / \`grill\` → \`explore\` → \`plan\` → approval → \`execute\` → \`refactor\` (optional). Repository discovery may run inside context authoring and grilling to answer evidence-discoverable questions.\n`;

  return content;
}

/**
 * Generates canonical Obsidian Map of Content for workflows.
 */
export async function generateWorkflowsMoc(actualWorkflows) {
  const workflowItems = await Promise.all(
    actualWorkflows.map(async (path) => {
      const source = await readText(path);
      const meta = frontmatter(source) ?? {};
      const name = meta.name || path.split("/").at(-1).replace(/\.md$/, "");
      const headingMatch = source.match(/^#\s+(.+)$/m);
      const title = headingMatch?.[1] || name.replace(/-/g, " ");
      return { path, meta, name, title, description: meta.description || "" };
    })
  );

  const deliveryWfs = ["architecture-change", "feature-delivery", "new-project-delivery", "defect-resolution", "code-review-and-optimization", "release-readiness", "commit-push-release"];
  const riskWfs = ["security-sensitive-change", "database-migration", "dependency-upgrade"];
  const factoryWfs = ["context-maintenance"];

  const deliveryRows = [];
  const riskRows = [];
  const factoryRows = [];
  const otherRows = [];

  for (const item of workflowItems) {
    const linkPath = item.path.replace(/\.md$/, "");
    const row = `- [[${linkPath}|${item.title}]] — ${item.description}`;
    if (deliveryWfs.includes(item.name)) deliveryRows.push(row);
    else if (riskWfs.includes(item.name)) riskRows.push(row);
    else if (factoryWfs.includes(item.name)) factoryRows.push(row);
    else otherRows.push(row);
  }

  const sections = [
    `---
title: Workflows
type: moc
tags: [workflow, delivery]
---

# Workflows

Workflows coordinate rules, skills, roles, artifacts, quality gates, and stop conditions across a development lifecycle. Load only the most-specific matching workflow and compose another only when the selected workflow requires it.`,
  ];

  if (deliveryRows.length > 0) sections.push(`## Delivery\n\n${deliveryRows.join("\n")}`);
  if (riskRows.length > 0) sections.push(`## Risk-specific\n\n${riskRows.join("\n")}`);
  if (factoryRows.length > 0) sections.push(`## Factory\n\n${factoryRows.join("\n")}`);
  if (otherRows.length > 0) sections.push(`## Custom Workflows\n\n${otherRows.join("\n")}`);

  sections.push(`## Session Slash Commands & Prefix Triggers

Use leading slash commands or bracket prefix tags for instant, deterministic workflow activation:

- \`/new-project\`, \`[NEW_PROJECT]\` $\\rightarrow$ [[workflows/new-project-delivery|New project progressive delivery]]: progressive vertical-slice execution with grilling and 4-layer tests
- \`/context\`, \`[CONTEXT]\`, \`[CONTEXT_SPEC]\` $\\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: author and grill context specifications in \`docs/context/\`
- \`/grill\`, \`[DISCOVERY]\` $\\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: clarify 1 unknown at a time with \`grill\` before planning
- \`/plan\`, \`[PLAN]\`, \`[FEATURE]\` $\\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: scaffold task under \`docs/tasks/\` with \`plan\`, stop before coding
- \`/execute\`, \`/exec\`, \`[EXEC]\` $\\rightarrow$ [[workflows/feature-delivery|Feature delivery]]: execute approved task phases incrementally with \`execute\`
- \`/optimize\`, \`/review-code\`, \`[OPTIMIZE]\`, \`[CODE_REVIEW]\` $\\rightarrow$ [[workflows/code-review-and-optimization|Code review and optimization]]: audit, optimize, and refactor plan-affected code
- \`/fix\`, \`[HOTFIX]\`, \`[BUG]\` $\\rightarrow$ [[workflows/defect-resolution|Defect resolution]]: capture reproduction test before modifying code
- \`/migrate\`, \`[MIGRATE]\`, \`[DB]\` $\\rightarrow$ [[workflows/database-migration|Database migration]]: plan forward migration, rollback script, and consumer types
- \`/sec\`, \`[SEC]\`, \`[SECURITY]\` $\\rightarrow$ [[workflows/security-sensitive-change|Security-sensitive change]]: review auth, credentials, data isolation, and abuse cases
- \`/arch\`, \`/adr\`, \`[ADR]\` $\\rightarrow$ [[workflows/architecture-change|Architecture change]]: scaffold durable decision under \`docs/decisions/\`
- \`/deps\`, \`/upgrade\`, \`[UPGRADE]\` $\\rightarrow$ [[workflows/dependency-upgrade|Dependency upgrade]]: audit compatibility boundaries and run canary tests
- \`/release\`, \`/verify\`, \`[RELEASE]\` $\\rightarrow$ [[workflows/release-readiness|Release readiness]]: verify tests, lint, typecheck, and readiness evidence
- \`/ship\`, \`/commit-push-release\`, \`[SHIP]\` $\\rightarrow$ [[workflows/commit-push-release|Commit, push & release]]: stage, commit with conventional format, push to remote, tag release
- \`/sync\`, \`/maintain\`, \`[MAINTENANCE]\` $\\rightarrow$ [[workflows/context-maintenance|Context maintenance]]: run \`node scripts/harness-cli.mjs lock\` and \`doctor\`

## Selection rules

- Use feature delivery as the default for material feature work, not for routine one-file edits.
- Prefer defect resolution when observed behavior is wrong; do not implement before establishing evidence.
- Add a risk-specific workflow only when that risk is central to the change.
- Use release readiness to review and report; it does not authorize deployment.
- Begin new-system and materially ambiguous capability work with [[skills/productivity/grill/SKILL|grill]], then synthesize the confirmed discovery record with [[skills/productivity/plan/SKILL|plan]] before coding.
- Use [[rules/global/1-3-1-rule|1-3-1]] inside a workflow only for a material unresolved decision.
- Use [[skills/productivity/plan/SKILL|plan]] for plan-only output and [[skills/engineering/execute/SKILL|execute]] when executing an existing task artifact.`);

  return `${sections.join("\n\n")}\n`;
}

/**
 * Generates canonical Obsidian Map of Content for agents.
 */
export async function generateAgentsMoc(actualAgents) {
  const agentItems = await Promise.all(
    actualAgents.filter((p) => p.endsWith("/AGENT.md")).map(async (path) => {
      const source = await readText(path);
      const meta = frontmatter(source) ?? {};
      return { path, meta, name: meta.name, title: meta.title, description: meta.description };
    })
  );

  agentItems.sort((a, b) => a.name.localeCompare(b.name));

  const subagentRows = agentItems.map((item) => {
    const linkPath = item.path.replace(/\.md$/, "");
    return `- [[${linkPath}|${item.title} (\`${item.name}\`)]] — ${item.description}`;
  });

  return `---
title: Agents
type: moc
tags: [agents, orchestration]
---

# Agents & Subagents

## Entry Points & Orchestrators

- [[orchestrator/SHARED|Shared contract]] — authoritative behavior and load order
- [[AGENTS|Factory entry point]]
- [[orchestrator/AGENTS|Codex/agent adapter]]
- [[orchestrator/CLAUDE|Claude adapter]]
- [[orchestrator/GEMINI|Gemini adapter]]

All adapters intentionally stay thin. Add shared behavior to \`SHARED.md\`, not to one model adapter.

## Coding Lifecycle Subagents

- [[agents/README|Coding Lifecycle Subagents Registry]] — lifecycle overview and handoff map
${subagentRows.join("\n")}
- [[agents/templates/AGENT_TEMPLATE|Agent Template]] — template for creating new scalable subagents
- [[docs/guide/subagents-lifecycle|Subagents Lifecycle Guide]] — practical user guide for day-to-day coding sessions
`;
}

/**
 * Generates canonical Obsidian Map of Content for Architecture Decision Records (ADRs).
 */
export async function generateDecisionsMoc(actualDecisions) {
  const decisionItems = await Promise.all(
    actualDecisions.map(async (path) => {
      const source = await readText(path);
      const meta = frontmatter(source) ?? {};
      const headingMatch = source.match(/^#\s+(.+)$/m);
      const title = meta.title || headingMatch?.[1] || path.split("/").at(-1).replace(/\.md$/, "");
      return { path, title };
    })
  );

  decisionItems.sort((a, b) => a.path.localeCompare(b.path));

  const rows = decisionItems.map((item) => {
    const linkPath = item.path.replace(/\.md$/, "");
    return `- [[${linkPath}|${item.title}]]`;
  });

  return `---
title: Architecture Decisions
type: index
tags: [adr, decisions]
---

# Architecture Decisions

Store durable decisions as \`NNNN-kebab-case-title.md\`. Start from [[docs/templates/Decision|Decision Template]]. Link each decision from the plan that introduced it and from relevant architecture notes.

${rows.join("\n")}
`;
}

/**
 * Generates canonical Obsidian Map of Content for Wiki / Knowledge items.
 */
export async function generateWikiMoc(actualKnowledge) {
  const knowledgeItems = await Promise.all(
    actualKnowledge.map(async (path) => {
      const source = await readText(path);
      const meta = frontmatter(source) ?? {};
      return { path, meta, id: meta.id, title: meta.title || path.split("/").at(-1).replace(/\.md$/, "") };
    })
  );

  knowledgeItems.sort((a, b) => a.path.localeCompare(b.path));

  const rows = [
    "- [[knowledge/README|Knowledge index]]",
    ...knowledgeItems
      .filter((item) => !item.path.endsWith("README.md"))
      .map((item) => `- [[${item.path.replace(/\.md$/, "")}|${item.title} (\`${item.id}\`)]]`),
  ];

  return `---
title: LLM Wiki
type: moc
tags: [knowledge, llm, wiki]
---

# LLM Wiki

The LLM Wiki stores durable, attributable project knowledge as Markdown. It complements rules, skills, and workflows:

- rules constrain behavior;
- skills define specialized procedures;
- workflows coordinate lifecycles;
- knowledge explains facts, concepts, contracts, runbooks, and provenance.

## Authority

Use this order within an item's declared scope:

1. \`canonical\` — approved source of truth.
2. \`reviewed\` — verified supporting knowledge.
3. \`reference\` — useful but not authoritative.
4. \`example\` — illustrative only.

Lifecycle state is separate from authority: \`draft\`, \`active\`, \`deprecated\`, or \`superseded\`. Only active canonical or reviewed knowledge may ground consequential claims without additional verification.

## Required metadata

Canonical knowledge follows \`schemas/knowledge.schema.json\` and starts from [[docs/templates/Knowledge|Knowledge Template]]. Every item has a stable ID, type, lifecycle status, scope, owner, authority, verification date, review date, and sources.

## Retrieval

Use the [[skills/productivity/grounding/SKILL|grounding]] skill. Filter by metadata and task terms, prefer the highest applicable authority, follow relevant links one hop, and retain hashes plus selection reasons in the context bundle.

## Maintenance

- Update or supersede knowledge in the same change as its authoritative behavior.
- Never rewrite a durable decision to hide its history; supersede it with a new ADR or note.
- Treat stale dates, missing sources, and conflicting canonical claims as validation findings.
- Run \`node scripts/context.mjs doctor\` after knowledge changes.

## Index

${rows.join("\n")}
`;
}

/**
 * Discovers factory files and syncs context-manifest.json, Obsidian MOCs, and context-lock.json.
 */
export async function syncFactoryInventory({ writeLock = true, updateMocs = true } = {}) {
  // Verify and maintain factory .agents symlinks
  try {
    await repairBridgeSymlinks(root);
  } catch {
    // Non-fatal
  }
  const currentManifest = await readJson("context-manifest.json");

  const actualAgents = (await filesUnder("agents")).filter((p) => extname(p) === ".md").sort();
  const actualRules = (await filesUnder("rules")).filter((p) => extname(p) === ".md" && p !== "rules/README.md").sort();
  const actualSkills = (await filesUnder("skills")).filter((p) => p.endsWith("/SKILL.md")).sort();
  const actualSkillResources = (await filesUnder("skills")).filter((p) => !p.endsWith("/SKILL.md") && !p.endsWith("README.md")).sort();
  const actualWorkflows = (await filesUnder("workflows")).filter((p) => extname(p) === ".md").sort();
  const actualKnowledge = (await filesUnder("knowledge")).filter((p) => extname(p) === ".md").sort();
  const actualSchemas = (await filesUnder("schemas")).filter((p) => extname(p) === ".json").sort();
  const actualTemplates = (await filesUnder("docs/templates")).filter((p) => extname(p) === ".md").sort();
  const actualDecisions = (await filesUnder("docs/decisions"))
    .filter((p) => /\/\d{4}-[^/]+\.md$/.test(p))
    .sort();
  const actualTools = [
    ...(await filesUnder("scripts")).filter((p) => extname(p) === ".mjs"),
    ...(await filesUnder("orchestrator")).filter((p) => extname(p) === ".mjs"),
    ...(await filesUnder("evals")).filter((p) => extname(p) === ".mjs"),
  ].sort();
  const actualAutomation = (await filesUnder(".github/workflows"))
    .filter((p) => [".yml", ".yaml"].includes(extname(p)))
    .sort();
  const actualEvaluations = (await filesUnder("evals/cases")).filter((p) => extname(p) === ".json").sort();
  const actualDatasets = (await filesUnder("evals/datasets")).filter((p) => extname(p) === ".json").sort();

  const updatedManifest = {
    ...currentManifest,
    agents: actualAgents,
    rules: actualRules,
    skills: actualSkills,
    skillResources: actualSkillResources,
    workflows: actualWorkflows,
    knowledge: actualKnowledge,
    schemas: actualSchemas,
    templates: actualTemplates,
    decisions: actualDecisions,
    tools: actualTools,
    automation: actualAutomation,
    evaluations: actualEvaluations,
    datasets: actualDatasets,
  };

  const manifestPath = join(root, "context-manifest.json");
  await writeFile(manifestPath, `${JSON.stringify(updatedManifest, null, 2)}\n`, "utf8");

  let mocsUpdatedCount = 0;
  if (updateMocs) {
    const rulesMoc = await generateRulesMoc(actualRules);
    const skillsMoc = await generateSkillsMoc(actualSkills);
    const workflowsMoc = await generateWorkflowsMoc(actualWorkflows);
    const agentsMoc = await generateAgentsMoc(actualAgents);
    const decisionsMoc = await generateDecisionsMoc(actualDecisions);
    const wikiMoc = await generateWikiMoc(actualKnowledge);

    await writeFile(join(root, "docs/Rules.md"), rulesMoc, "utf8");
    await writeFile(join(root, "docs/Skills.md"), skillsMoc, "utf8");
    await writeFile(join(root, "docs/Workflows.md"), workflowsMoc, "utf8");
    await writeFile(join(root, "docs/Agents.md"), agentsMoc, "utf8");
    await writeFile(join(root, "docs/decisions/README.md"), decisionsMoc, "utf8");
    await writeFile(join(root, "docs/Wiki.md"), wikiMoc, "utf8");
    mocsUpdatedCount = 6;
  }

  let lockResult = null;
  if (writeLock) {
    const lock = await createLock(updatedManifest);
    const lockPath = join(root, "context-lock.json");
    await writeFile(lockPath, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
    lockResult = lock;
  }

  return {
    manifest: updatedManifest,
    lock: lockResult,
    mocsUpdatedCount,
    counts: {
      agents: actualAgents.length,
      rules: actualRules.length,
      skills: actualSkills.length,
      skillResources: actualSkillResources.length,
      workflows: actualWorkflows.length,
      knowledge: actualKnowledge.length,
      schemas: actualSchemas.length,
      templates: actualTemplates.length,
      decisions: actualDecisions.length,
      tools: actualTools.length,
      evaluations: actualEvaluations.length,
      datasets: actualDatasets.length,
    },
  };
}

