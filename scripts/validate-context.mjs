#!/usr/bin/env node
import { lstat, readdir, readlink } from "node:fs/promises";
import { extname, resolve } from "node:path";
import {
  createLock,
  filesUnder,
  frontmatter,
  manifestPaths,
  markdownFiles,
  readJson,
  readText,
  root,
} from "./context-core.mjs";

const errors = [];
const manifest = await readJson("context-manifest.json");
const diskFiles = await filesUnder(".");

function error(message) {
  errors.push(message);
}

function sameMembers(actual, expected) {
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

async function exists(path) {
  try {
    await readText(path);
    return true;
  } catch {
    return false;
  }
}

function validDate(value) {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

if (manifest.schemaVersion !== 3) error(`Unsupported manifest schemaVersion: ${manifest.schemaVersion}`);
if (!/^\d+\.\d+\.\d+$/.test(manifest.contextVersion ?? "")) error("contextVersion must be semantic x.y.z");

for (const path of manifestPaths(manifest)) {
  if (!await exists(path)) error(`Manifest path is missing: ${path}`);
  else if (!diskFiles.includes(path)) error(`Manifest path casing differs from disk: ${path}`);
}

for (const path of manifest.skills) {
  const meta = frontmatter(await readText(path));
  if (!meta) error(`Skill has no YAML frontmatter: ${path}`);
  else {
    const keys = Object.keys(meta).sort();
    if (keys.join(",") !== "description,name") {
      error(`Skill frontmatter must contain only name and description: ${path}`);
    }
    if (!meta.name || !meta.description) error(`Skill metadata is incomplete: ${path}`);
    if (meta.name !== path.split("/").at(-2)) error(`Skill name does not match its folder: ${path}`);
  }
}

for (const path of manifest.skillResources) {
  if (path.endsWith("README.md")) continue;
  const matchingSkill = manifest.skills.find((s) => path.startsWith(s.replace(/\/SKILL\.md$/, "/")));
  if (!matchingSkill) {
    error(`Skill resource has no inventoried parent skill: ${path}`);
  }
  if (path.endsWith("/agents/openai.yaml")) {
    const source = await readText(path);
    const displayName = source.match(/^\s*display_name:\s*"([^"]+)"$/m)?.[1];
    const shortDescription = source.match(/^\s*short_description:\s*"([^"]+)"$/m)?.[1];
    const defaultPrompt = source.match(/^\s*default_prompt:\s*"([^"]+)"$/m)?.[1];
    const skillFolder = matchingSkill ? matchingSkill.replace(/\/SKILL\.md$/, "") : path.split("/").slice(0, -2).join("/");
    const skillName = skillFolder.split("/").at(-1);
    if (!displayName) error(`Skill interface display_name is missing or unquoted: ${path}`);
    if (!shortDescription || shortDescription.length < 25 || shortDescription.length > 64) {
      error(`Skill interface short_description must be quoted and 25-64 characters: ${path}`);
    }
    if (!defaultPrompt?.includes(`$${skillName}`)) {
      error(`Skill interface default_prompt must mention $${skillName}: ${path}`);
    }
  }
}

// Enforce skill group README invariant
const skillGroupDirs = ["skills/engineering", "skills/productivity"];
for (const groupDir of skillGroupDirs) {
  const groupReadmePath = `${groupDir}/README.md`;
  if (!await exists(groupReadmePath)) {
    error(`Missing skill group README: ${groupReadmePath}`);
  } else {
    const readmeContent = await readText(groupReadmePath);
    const groupSkills = manifest.skills.filter((s) => s.startsWith(`${groupDir}/`));
    for (const skillPath of groupSkills) {
      const skillName = skillPath.split("/").at(-2);
      const expectedLink = `[[${skillPath.slice(0, -3)}`;
      if (!readmeContent.includes(expectedLink) && !readmeContent.includes(`|${skillName}`)) {
        error(`Skill group ${groupReadmePath} does not link member skill: ${skillPath}`);
      }
    }
  }
}



const knownAgentNames = new Set([
  "user",
  "ba-agent",
  "pm-agent",
  "architect-agent",
  "data-agent",
  "ux-agent",
  "threat-agent",
  "devops-agent",
]);

for (const path of manifest.agents ?? []) {
  if (path.endsWith("/AGENT.md")) {
    const meta = frontmatter(await readText(path));
    if (meta?.name) knownAgentNames.add(meta.name);
  }
}

const requiredWorkflowSections = [
  "## Triggers",
  "## Required inputs",
  "## Applicable rules and skills",
  "## Phases",
  "## Quality gates",
  "## Stop and escalation conditions",
  "## Artifacts and completion",
];
const allowedWorkflowKeys = new Set([
  "name",
  "description",
  "scope",
  "primaryAgent",
  "participatingAgents",
  "rules",
  "skills",
]);

for (const path of manifest.workflows) {
  const source = await readText(path);
  const meta = frontmatter(source);
  if (!meta) error(`Workflow has no YAML frontmatter: ${path}`);
  else {
    for (const key of Object.keys(meta)) {
      if (!allowedWorkflowKeys.has(key)) {
        error(`Workflow frontmatter contains unrecognized key '${key}': ${path}`);
      }
    }
    if (!meta.name || !meta.description || !meta.scope) error(`Workflow metadata is incomplete: ${path}`);
    if (meta.name !== path.split("/").at(-1).replace(/\.md$/, "")) {
      error(`Workflow name does not match its filename: ${path}`);
    }
    if (meta.primaryAgent && !knownAgentNames.has(meta.primaryAgent)) {
      error(`Workflow primaryAgent references unknown agent in ${path}: ${meta.primaryAgent}`);
    }
    if (meta.participatingAgents) {
      if (!Array.isArray(meta.participatingAgents)) {
        error(`Workflow participatingAgents must be an array: ${path}`);
      } else {
        for (const agent of meta.participatingAgents) {
          if (!knownAgentNames.has(agent)) {
            error(`Workflow participatingAgents references unknown agent in ${path}: ${agent}`);
          }
        }
      }
    }
    if (meta.rules) {
      if (!Array.isArray(meta.rules)) {
        error(`Workflow rules must be an array: ${path}`);
      } else {
        for (const rulePath of meta.rules) {
          if (!manifest.rules.includes(rulePath)) {
            error(`Workflow references unknown rule in ${path}: ${rulePath}`);
          }
        }
      }
    }
    if (meta.skills) {
      if (!Array.isArray(meta.skills)) {
        error(`Workflow skills must be an array: ${path}`);
      } else {
        for (const skillName of meta.skills) {
          const matchingSkill = manifest.skills.find((s) => s === skillName || s.endsWith(`/${skillName}/SKILL.md`) || s === `skills/${skillName}/SKILL.md`);
          if (!matchingSkill) {
            error(`Workflow references unknown skill in ${path}: ${skillName}`);
          }
        }
      }
    }
  }
  for (const section of requiredWorkflowSections) {
    if (!source.includes(section)) error(`Workflow is missing ${section}: ${path}`);
  }
}

for (const path of manifest.rules) {
  const meta = frontmatter(await readText(path));
  if (!meta?.name || !meta?.description || !meta?.scope || typeof meta.alwaysApply !== "boolean") {
    error(`Rule metadata is incomplete: ${path}`);
  }
}

const protectedTriggers = new Set([
  "/fix", "/hotfix", "/bug", "[BUG]", "[HOTFIX]", "[DEFECT]",
  "/migrate", "/db", "/schema", "[MIGRATE]", "[DB]", "[SCHEMA]",
  "/sec", "/security", "/auth", "[SEC]", "[SECURITY]", "[AUTH]",
  "/optimize", "/review-code", "[OPTIMIZE]", "[CODE_REVIEW]",
  "/arch", "/refactor", "/adr", "[ARCH]", "[REFACTOR]", "[ADR]",
  "/upgrade", "/deps", "[DEPS]", "[UPGRADE]",
  "/release", "/ready", "/deploy", "[RELEASE]", "[DEPLOY]",
  "/sync", "/lock", "/maintain", "[SYNC]", "[LOCK]", "[MAINTENANCE]",
  "/new-project", "/progressive", "[NEW_PROJECT]", "[PROGRESSIVE]",
  "/plan", "/feature", "/grill", "/discovery", "/context",
  "[PLAN]", "[FEATURE]", "[GRILL]", "[DISCOVERY]", "[CONTEXT]", "[CONTEXT_SPEC]",
  "/exec", "/execute", "/execution", "[EXEC]", "[EXECUTE]", "[EXECUTION]",
  "/tsc", "/typescript", "[TSC]", "/zod", "[ZOD]", "/explore", "[EXPLORE]",
  "/grounding", "/wiki", "[WIKI]", "/verify", "[VERIFY]", "[QA]",
  "/triage", "[TRIAGE]",
  "/doc", "/docs", "/documentation", "[DOC]", "[DOCS]", "[DOCUMENTATION]",
]);

const registeredAliases = new Map();

for (const path of manifest.agents ?? []) {
  if (path.endsWith("/AGENT.md")) {
    const meta = frontmatter(await readText(path));
    if (!meta) {
      error(`Agent has no YAML frontmatter: ${path}`);
      continue;
    }
    const requiredAgentFields = [
      "name", "title", "role", "description", "lifecycleStage",
      "aliases", "defaultWorkflow", "skills", "workflows", "rules", "handoffs",
    ];
    for (const field of requiredAgentFields) {
      if (meta[field] === undefined || meta[field] === null || meta[field] === "") {
        error(`Agent metadata ${field} is missing: ${path}`);
      }
    }
    const agentFolder = path.split("/").at(-2);
    if (meta.name !== agentFolder) {
      error(`Agent name (${meta.name}) does not match its folder (${agentFolder}): ${path}`);
    }
    if (!Array.isArray(meta.aliases) || meta.aliases.length === 0) {
      error(`Agent aliases must be a non-empty array: ${path}`);
    } else {
      for (const alias of meta.aliases) {
        if (typeof alias !== "string" || !alias.trim()) {
          error(`Agent alias is invalid in ${path}: ${alias}`);
        } else {
          const lowerAlias = alias.toLowerCase();
          if (protectedTriggers.has(lowerAlias)) {
            error(`Agent alias '${alias}' collides with protected command in ${path}`);
          }
          if (registeredAliases.has(lowerAlias)) {
            error(`Duplicate agent alias '${alias}': ${registeredAliases.get(lowerAlias)} and ${path}`);
          } else {
            registeredAliases.set(lowerAlias, path);
          }
        }
      }
    }

    if (!Array.isArray(meta.skills) || meta.skills.length === 0) {
      error(`Agent skills must be a non-empty array: ${path}`);
    } else {
      for (const skillName of meta.skills) {
        const matchingSkill = manifest.skills.find((s) => s === skillName || s.endsWith(`/${skillName}/SKILL.md`) || s === `skills/${skillName}/SKILL.md`);
        if (!matchingSkill) {
          error(`Agent references unknown skill in ${path}: ${skillName}`);
        }
      }
    }

    if (!Array.isArray(meta.workflows) || meta.workflows.length === 0) {
      error(`Agent workflows must be a non-empty array: ${path}`);
    } else {
      for (const wf of meta.workflows) {
        const wfPath = wf.endsWith(".md") ? wf : `workflows/${wf}.md`;
        if (!manifest.workflows.includes(wfPath)) {
          error(`Agent references unknown workflow in ${path}: ${wf}`);
        }
      }
    }

    const defaultWfPath = meta.defaultWorkflow?.endsWith(".md") ? meta.defaultWorkflow : `workflows/${meta.defaultWorkflow}.md`;
    if (!manifest.workflows.includes(defaultWfPath)) {
      error(`Agent defaultWorkflow references unknown workflow in ${path}: ${meta.defaultWorkflow}`);
    } else if (Array.isArray(meta.workflows)) {
      const declaredWfPaths = meta.workflows.map((w) => (w.endsWith(".md") ? w : `workflows/${w}.md`));
      if (!declaredWfPaths.includes(defaultWfPath)) {
        error(`Agent defaultWorkflow '${meta.defaultWorkflow}' is not in workflows list: ${path}`);
      }
    }

    if (!Array.isArray(meta.rules) || meta.rules.length === 0) {
      error(`Agent rules must be a non-empty array: ${path}`);
    } else {
      for (const rule of meta.rules) {
        if (!manifest.rules.includes(rule)) {
          error(`Agent references unknown rule in ${path}: ${rule}`);
        }
      }
    }

    if (meta.handoffs && typeof meta.handoffs === "object") {
      const upstreams = Array.isArray(meta.handoffs.upstream) ? meta.handoffs.upstream : [];
      const downstreams = Array.isArray(meta.handoffs.downstream) ? meta.handoffs.downstream : [];
      for (const target of [...upstreams, ...downstreams]) {
        if (!knownAgentNames.has(target)) {
          error(`Agent handoff references unknown agent in ${path}: ${target}`);
        }
      }
    }

    const invocationPromptPath = `agents/${agentFolder}/prompts/subagent-invocation.md`;
    const systemPromptPath = `agents/${agentFolder}/prompts/system-prompt.md`;
    if (!await exists(invocationPromptPath)) {
      error(`Agent is missing invocation prompt: ${invocationPromptPath}`);
    }
    if (!await exists(systemPromptPath)) {
      error(`Agent is missing system prompt: ${systemPromptPath}`);
    }
  } else if (path.endsWith("/AGENT_TEMPLATE.md")) {
    const meta = frontmatter(await readText(path));
    if (!meta?.name || !meta?.title || !meta?.role || !meta?.description) {
      error(`Agent template metadata is incomplete: ${path}`);
    }
  }
}

const actualAgents = (await filesUnder("agents")).filter((path) => extname(path) === ".md");
const actualRules = (await filesUnder("rules")).filter((path) => extname(path) === ".md");
const actualSkills = (await filesUnder("skills")).filter((path) => path.endsWith("/SKILL.md"));
const actualSkillResources = (await filesUnder("skills")).filter((path) => !path.endsWith("/SKILL.md") && !path.endsWith("README.md"));

const actualWorkflows = (await filesUnder("workflows")).filter((path) => extname(path) === ".md");
const actualKnowledge = (await filesUnder("knowledge")).filter((path) => extname(path) === ".md");
const actualSchemas = (await filesUnder("schemas")).filter((path) => extname(path) === ".json");
const actualTemplates = (await filesUnder("docs/templates")).filter((path) => extname(path) === ".md");
const actualDecisions = (await filesUnder("docs/decisions"))
  .filter((path) => /\/\d{4}-[^/]+\.md$/.test(path));
const actualTools = [
  ...(await filesUnder("scripts")).filter((path) => extname(path) === ".mjs"),
  ...(await filesUnder("orchestrator")).filter((path) => extname(path) === ".mjs"),
  ...(await filesUnder("evals")).filter((path) => extname(path) === ".mjs"),
].sort();
const actualAutomation = (await filesUnder(".github/workflows"))
  .filter((path) => [".yml", ".yaml"].includes(extname(path)));
const actualEvaluations = (await filesUnder("evals/cases")).filter((path) => extname(path) === ".json");
const actualDatasets = (await filesUnder("evals/datasets")).filter((path) => extname(path) === ".json");

if (!sameMembers(actualAgents, manifest.agents ?? [])) error("Agent inventory differs from context-manifest.json");
if (!sameMembers(actualRules, manifest.rules)) error("Rule inventory differs from context-manifest.json");
if (!sameMembers(actualSkills, manifest.skills)) error("Skill inventory differs from context-manifest.json");
if (!sameMembers(actualSkillResources, manifest.skillResources)) {
  error("Skill resource inventory differs from context-manifest.json");
}

if (!sameMembers(actualWorkflows, manifest.workflows)) error("Workflow inventory differs from context-manifest.json");
if (!sameMembers(actualKnowledge, manifest.knowledge)) error("Knowledge inventory differs from context-manifest.json");
if (!sameMembers(actualSchemas, manifest.schemas)) error("Schema inventory differs from context-manifest.json");
if (!sameMembers(actualTemplates, manifest.templates)) error("Template inventory differs from context-manifest.json");
if (!sameMembers(actualDecisions, manifest.decisions)) error("Decision inventory differs from context-manifest.json");
if (!sameMembers(actualTools, manifest.tools)) error("Tool inventory differs from context-manifest.json");
if (!sameMembers(actualAutomation, manifest.automation)) error("Automation inventory differs from context-manifest.json");
if (!sameMembers(actualEvaluations, manifest.evaluations)) error("Evaluation inventory differs from context-manifest.json");
if (!sameMembers(actualDatasets, manifest.datasets ?? [])) error("Dataset inventory differs from context-manifest.json");

const rulesMap = await readText("docs/Rules.md");
const skillsMap = await readText("docs/Skills.md");
const agentsMap = await readText("docs/Agents.md");

const workflowsMap = await readText("docs/Workflows.md");
const wikiMap = await readText("docs/Wiki.md");
for (const path of manifest.agents ?? []) {
  if (path.endsWith("/AGENT.md")) {
    if (!agentsMap.includes(`[[${path.slice(0, -3)}`)) error(`Agent is missing from docs/Agents.md: ${path}`);
  }
}
for (const path of manifest.rules) {
  if (!rulesMap.includes(`[[${path.slice(0, -3)}`)) error(`Rule is missing from docs/Rules.md: ${path}`);
}
for (const path of manifest.skills) {
  if (!skillsMap.includes(`[[${path.slice(0, -3)}`)) error(`Skill is missing from docs/Skills.md: ${path}`);
}

for (const path of manifest.workflows) {
  if (!workflowsMap.includes(`[[${path.slice(0, -3)}`)) error(`Workflow is missing from docs/Workflows.md: ${path}`);
}
for (const path of manifest.knowledge) {
  if (!wikiMap.includes(`[[${path.slice(0, -3)}`)) error(`Knowledge is missing from docs/Wiki.md: ${path}`);
}

const knowledgeIds = new Map();
const allowedKnowledgeTypes = new Set(["fact", "concept", "contract", "procedure", "runbook", "example"]);
const allowedStatuses = new Set(["draft", "active", "deprecated", "superseded"]);
const allowedAuthorities = new Set(["canonical", "reviewed", "reference", "example"]);
for (const path of manifest.knowledge) {
  const meta = frontmatter(await readText(path));
  const required = ["id", "title", "type", "status", "scope", "owner", "authority", "created", "lastVerified", "reviewAfter", "sources"];
  for (const field of required) {
    if (meta?.[field] === undefined || meta[field] === "") error(`Knowledge metadata ${field} is missing: ${path}`);
  }
  if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(meta?.id ?? "")) error(`Knowledge ID is invalid: ${path}`);
  if (knowledgeIds.has(meta?.id)) error(`Duplicate knowledge ID ${meta.id}: ${knowledgeIds.get(meta.id)} and ${path}`);
  else if (meta?.id) knowledgeIds.set(meta.id, path);
  if (!allowedKnowledgeTypes.has(meta?.type)) error(`Knowledge type is invalid: ${path}`);
  if (!allowedStatuses.has(meta?.status)) error(`Knowledge status is invalid: ${path}`);
  if (!allowedAuthorities.has(meta?.authority)) error(`Knowledge authority is invalid: ${path}`);
  if (!Array.isArray(meta?.scope) || meta.scope.length === 0) error(`Knowledge scope must be a non-empty array: ${path}`);
  if (!Array.isArray(meta?.sources) || meta.sources.length === 0) error(`Knowledge sources must be a non-empty array: ${path}`);
  for (const field of ["created", "lastVerified", "reviewAfter"]) {
    if (!validDate(meta?.[field])) error(`Knowledge ${field} must be YYYY-MM-DD: ${path}`);
  }
  if (validDate(meta?.lastVerified) && validDate(meta?.reviewAfter) && meta.reviewAfter < meta.lastVerified) {
    error(`Knowledge reviewAfter precedes lastVerified: ${path}`);
  }
  for (const source of meta?.sources ?? []) {
    if (!await exists(source)) error(`Knowledge source is missing in ${path}: ${source}`);
  }
}

for (const path of manifest.evaluations) {
  const testCase = await readJson(path);
  if (!testCase.name || !testCase.request || !testCase.expected) error(`Evaluation is incomplete: ${path}`);
  if (!("workflow" in (testCase.expected ?? {}))) error(`Evaluation must declare expected.workflow: ${path}`);
  for (const rule of [...(testCase.expected?.rules ?? []), ...(testCase.expected?.excludedRules ?? [])]) {
    if (!manifest.rules.includes(rule)) error(`Evaluation references unknown rule in ${path}: ${rule}`);
  }
  for (const skill of [...(testCase.expected?.skills ?? []), ...(testCase.expected?.excludedSkills ?? [])]) {
    if (!manifest.skills.includes(skill)) error(`Evaluation references unknown skill in ${path}: ${skill}`);
  }

  if (testCase.expected?.workflow && !manifest.workflows.includes(testCase.expected.workflow)) {
    error(`Evaluation references unknown workflow in ${path}: ${testCase.expected.workflow}`);
  }
  for (const assertion of testCase.contractAssertions ?? []) {
    if (!manifestPaths(manifest).includes(assertion.path)) {
      error(`Evaluation assertion references non-canonical path in ${path}: ${assertion.path}`);
    }
    if (!Array.isArray(assertion.includes) || assertion.includes.length === 0) {
      error(`Evaluation assertion has no required fragments: ${path}`);
    }
  }
}

for (const path of manifest.orchestrators) {
  if (!(await readText(path)).includes("orchestrator/SHARED.md")) {
    error(`Orchestrator does not defer to the shared contract: ${path}`);
  }
}

try {
  await readdir(new URL("../docs/.obsidian", import.meta.url));
  error("Nested docs/.obsidian vault found; the only vault must be at context-factory/.obsidian");
} catch {
  // Expected.
}

const allMarkdown = await markdownFiles();
const aliases = new Map();
for (const path of allMarkdown) {
  const noExtension = path.slice(0, -3);
  aliases.set(noExtension, path);
  aliases.set(noExtension.split("/").at(-1), path);
}
for (const path of allMarkdown) {
  const source = await readText(path);
  for (const match of source.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) {
    if (!aliases.has(match[1])) error(`Broken wiki link in ${path}: ${match[1]}`);
  }
}

const decisionMap = await readText("docs/decisions/README.md");
for (const path of manifest.decisions) {
  if (!decisionMap.includes(`[[${path.slice(0, -3)}`)) error(`Decision is missing from docs/decisions/README.md: ${path}`);
}

for (const path of ["app.json", "appearance.json", "core-plugins.json", "graph.json", "templates.json"]) {
  try {
    await readJson(`.obsidian/${path}`);
  } catch {
    error(`Invalid Obsidian JSON: .obsidian/${path}`);
  }
}

const expectedDotAgents = ["rules", "agents", "workflows", "AGENTS.md", "GEMINI.md"];
try {
  const dotAgentsStat = await lstat(resolve(root, ".agents"));
  if (!dotAgentsStat.isDirectory()) throw new Error("not dir");
} catch {
  try {
    const { generateBridge } = await import("../app/cli/core/bridge-generator.mjs");
    await generateBridge({ target: root, factoryPath: ".", force: true });
  } catch {}
}

for (const name of expectedDotAgents) {
  const linkPath = resolve(root, `.agents/${name}`);
  try {
    const stat = await lstat(linkPath);
    if (stat.isSymbolicLink()) {
      const rawTarget = await readlink(linkPath);
      const resolved = resolve(resolve(root, ".agents"), rawTarget);
      try {
        await lstat(resolved);
      } catch {
        error(`Dangling symlink in .agents/: ${name} -> ${rawTarget}`);
      }
    }
  } catch {
    error(`Missing required .agents/ link: .agents/${name}`);
  }
}

// Validate .agents/skills.json
try {
  const skillsJson = await readJson(".agents/skills.json");
  if (!Array.isArray(skillsJson.entries) || skillsJson.entries.length === 0) {
    error("Invalid .agents/skills.json: entries array required");
  }
} catch {
  error("Missing required .agents/skills.json configuration");
}

// Validate .agents/skills/ per-skill symlinks
try {
  const skillsDirStat = await lstat(resolve(root, ".agents/skills"));
  if (!skillsDirStat.isDirectory()) {
    error(".agents/skills must be a directory containing per-skill symlinks");
  } else {
    for (const skillPath of manifest.skills) {
      const parts = skillPath.split("/");
      const skillName = parts[parts.length - 2];
      const linkPath = resolve(root, `.agents/skills/${skillName}`);
      try {
        const stat = await lstat(linkPath);
        if (stat.isSymbolicLink()) {
          const rawTarget = await readlink(linkPath);
          const resolved = resolve(resolve(root, ".agents/skills"), rawTarget);
          try {
            await lstat(resolved);
          } catch {
            error(`Dangling skill symlink in .agents/skills/: ${skillName} -> ${rawTarget}`);
          }
        } else {
          error(`.agents/skills/${skillName} must be a symbolic link`);
        }
      } catch {
        error(`Missing required skill symlink in .agents/skills/: ${skillName}`);
      }
    }
  }
} catch {
  error("Missing required .agents/skills directory");
}

try {
  const actualLock = await readJson("context-lock.json");
  const expectedLock = await createLock(manifest);
  if (JSON.stringify(actualLock) !== JSON.stringify(expectedLock)) {
    error("context-lock.json is stale; run `node scripts/context.mjs lock`");
  }
} catch {
  error("context-lock.json is missing or invalid; run `node scripts/context.mjs lock`");
}

if (errors.length) {
  console.error(`Context validation failed (${errors.length}):`);
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log(
  `Context Factory ${manifest.contextVersion} is valid: `
  + `${manifest.rules.length} rules, ${manifest.skills.length} skills, `
  + `${manifest.workflows.length} workflows, ${(manifest.agents ?? []).length} agent resources, ${manifest.knowledge.length} knowledge items, `
  + `${manifest.evaluations.length} evaluations, ${allMarkdown.length} Markdown files.`,
);
