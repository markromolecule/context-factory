#!/usr/bin/env node
import { readdir } from "node:fs/promises";
import { extname } from "node:path";
import {
  createLock,
  filesUnder,
  frontmatter,
  manifestPaths,
  markdownFiles,
  readJson,
  readText,
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
  const skillFolder = path.split("/").slice(0, 2).join("/");
  if (!manifest.skills.includes(`${skillFolder}/SKILL.md`)) {
    error(`Skill resource has no inventoried parent skill: ${path}`);
  }
  if (path.endsWith("/agents/openai.yaml")) {
    const source = await readText(path);
    const displayName = source.match(/^\s*display_name:\s*"([^"]+)"$/m)?.[1];
    const shortDescription = source.match(/^\s*short_description:\s*"([^"]+)"$/m)?.[1];
    const defaultPrompt = source.match(/^\s*default_prompt:\s*"([^"]+)"$/m)?.[1];
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

for (const path of manifest.taste ?? []) {
  const meta = frontmatter(await readText(path));
  if (!meta) error(`Taste item has no YAML frontmatter: ${path}`);
  else {
    const keys = Object.keys(meta).sort();
    if (keys.join(",") !== "description,name,scope") {
      error(`Taste frontmatter must contain only name, description, and scope: ${path}`);
    }
    if (!meta.name || !meta.description || !meta.scope) error(`Taste metadata is incomplete: ${path}`);
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
for (const path of manifest.workflows) {
  const source = await readText(path);
  const meta = frontmatter(source);
  if (!meta) error(`Workflow has no YAML frontmatter: ${path}`);
  else {
    const keys = Object.keys(meta).sort();
    if (keys.join(",") !== "description,name,scope") {
      error(`Workflow frontmatter must contain only name, description, and scope: ${path}`);
    }
    if (!meta.name || !meta.description || !meta.scope) error(`Workflow metadata is incomplete: ${path}`);
    if (meta.name !== path.split("/").at(-1).replace(/\.md$/, "")) {
      error(`Workflow name does not match its filename: ${path}`);
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

const actualRules = (await filesUnder("rules")).filter((path) => extname(path) === ".md");
const actualSkills = (await filesUnder("skills")).filter((path) => path.endsWith("/SKILL.md"));
const actualSkillResources = (await filesUnder("skills")).filter((path) => !path.endsWith("/SKILL.md"));
const actualTaste = (await filesUnder("taste")).filter((path) => extname(path) === ".md");
const actualWorkflows = (await filesUnder("workflows")).filter((path) => extname(path) === ".md");
const actualKnowledge = (await filesUnder("knowledge")).filter((path) => extname(path) === ".md");
const actualSchemas = (await filesUnder("schemas")).filter((path) => extname(path) === ".json");
const actualTemplates = (await filesUnder("docs/templates")).filter((path) => extname(path) === ".md");
const actualDecisions = (await filesUnder("docs/decisions"))
  .filter((path) => /\/\d{4}-[^/]+\.md$/.test(path));
const actualTools = (await filesUnder("scripts")).filter((path) => extname(path) === ".mjs");
const actualAutomation = (await filesUnder(".github/workflows"))
  .filter((path) => [".yml", ".yaml"].includes(extname(path)));
const actualEvaluations = (await filesUnder("evals/cases")).filter((path) => extname(path) === ".json");

if (!sameMembers(actualRules, manifest.rules)) error("Rule inventory differs from context-manifest.json");
if (!sameMembers(actualSkills, manifest.skills)) error("Skill inventory differs from context-manifest.json");
if (!sameMembers(actualSkillResources, manifest.skillResources)) {
  error("Skill resource inventory differs from context-manifest.json");
}
if (!sameMembers(actualTaste, manifest.taste ?? [])) error("Taste inventory differs from context-manifest.json");
if (!sameMembers(actualWorkflows, manifest.workflows)) error("Workflow inventory differs from context-manifest.json");
if (!sameMembers(actualKnowledge, manifest.knowledge)) error("Knowledge inventory differs from context-manifest.json");
if (!sameMembers(actualSchemas, manifest.schemas)) error("Schema inventory differs from context-manifest.json");
if (!sameMembers(actualTemplates, manifest.templates)) error("Template inventory differs from context-manifest.json");
if (!sameMembers(actualDecisions, manifest.decisions)) error("Decision inventory differs from context-manifest.json");
if (!sameMembers(actualTools, manifest.tools)) error("Tool inventory differs from context-manifest.json");
if (!sameMembers(actualAutomation, manifest.automation)) error("Automation inventory differs from context-manifest.json");
if (!sameMembers(actualEvaluations, manifest.evaluations)) error("Evaluation inventory differs from context-manifest.json");

const rulesMap = await readText("docs/Rules.md");
const skillsMap = await readText("docs/Skills.md");
const tasteMap = await readText("docs/Taste.md");
const workflowsMap = await readText("docs/Workflows.md");
const wikiMap = await readText("docs/Wiki.md");
for (const path of manifest.rules) {
  if (!rulesMap.includes(`[[${path.slice(0, -3)}`)) error(`Rule is missing from docs/Rules.md: ${path}`);
}
for (const path of manifest.skills) {
  if (!skillsMap.includes(`[[${path.slice(0, -3)}`)) error(`Skill is missing from docs/Skills.md: ${path}`);
}
for (const path of manifest.taste ?? []) {
  if (!tasteMap.includes(`[[${path.slice(0, -3)}`)) error(`Taste item is missing from docs/Taste.md: ${path}`);
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
  for (const taste of [...(testCase.expected?.taste ?? []), ...(testCase.expected?.excludedTaste ?? [])]) {
    if (!(manifest.taste ?? []).includes(taste)) error(`Evaluation references unknown taste item in ${path}: ${taste}`);
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

for (const path of ["app.json", "appearance.json", "core-plugins.json", "graph.json", "templates.json", "workspace.json"]) {
  try {
    await readJson(`.obsidian/${path}`);
  } catch {
    error(`Invalid Obsidian JSON: .obsidian/${path}`);
  }
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
  + `${manifest.taste.length} taste items, `
  + `${manifest.workflows.length} workflows, ${manifest.knowledge.length} knowledge items, `
  + `${manifest.evaluations.length} evaluations, ${allMarkdown.length} Markdown files.`,
);
