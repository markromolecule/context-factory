#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

async function text(path) {
  return readFile(join(root, path), "utf8");
}

async function filesUnder(path) {
  const output = [];
  async function walk(current) {
    for (const entry of await readdir(join(root, current), { withFileTypes: true })) {
      const next = join(current, entry.name);
      if (entry.isDirectory()) await walk(next);
      else output.push(next);
    }
  }
  await walk(path);
  return output.map((path) => path.replaceAll("\\", "/"));
}

function frontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return Object.fromEntries(
    match[1].split("\n").filter(Boolean).map((line) => {
      const index = line.indexOf(":");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
  );
}

const manifest = JSON.parse(await text("context-manifest.json"));
const inventory = [
  ...manifest.orchestrators,
  ...manifest.rules,
  ...manifest.skills,
  ...manifest.workflows,
  ...manifest.vaultIndexes,
  manifest.entrypoint,
  manifest.orchestrationContract,
];

for (const path of new Set(inventory)) {
  try { await text(path); } catch { errors.push(`Manifest path is missing: ${path}`); }
}

for (const path of manifest.skills) {
  const meta = frontmatter(await text(path));
  if (!meta) errors.push(`Skill has no YAML frontmatter: ${path}`);
  else {
    const keys = Object.keys(meta).sort();
    if (keys.join(",") !== "description,name") errors.push(`Skill frontmatter must contain only name and description: ${path}`);
    if (!meta.name || !meta.description) errors.push(`Skill metadata is incomplete: ${path}`);
    if (meta.name !== path.split("/").at(-2)) errors.push(`Skill name does not match its folder: ${path}`);
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
  const source = await text(path);
  const meta = frontmatter(source);
  if (!meta) errors.push(`Workflow has no YAML frontmatter: ${path}`);
  else {
    const keys = Object.keys(meta).sort();
    if (keys.join(",") !== "description,name,scope") {
      errors.push(`Workflow frontmatter must contain only name, description, and scope: ${path}`);
    }
    if (!meta.name || !meta.description || !meta.scope) errors.push(`Workflow metadata is incomplete: ${path}`);
    if (meta.name !== path.split("/").at(-1).replace(/\.md$/, "")) {
      errors.push(`Workflow name does not match its filename: ${path}`);
    }
  }
  for (const section of requiredWorkflowSections) {
    if (!source.includes(section)) errors.push(`Workflow is missing ${section}: ${path}`);
  }
}

for (const path of manifest.rules) {
  const meta = frontmatter(await text(path));
  if (!meta?.name || !meta?.description || !meta?.scope || !meta?.alwaysApply) {
    errors.push(`Rule metadata is incomplete: ${path}`);
  }
}

const actualRules = (await filesUnder("rules")).filter((path) => extname(path) === ".md").sort();
const actualSkills = (await filesUnder("skills")).filter((path) => path.endsWith("/SKILL.md")).sort();
const actualWorkflows = (await filesUnder("workflows")).filter((path) => extname(path) === ".md").sort();
if (JSON.stringify(actualRules) !== JSON.stringify([...manifest.rules].sort())) errors.push("Rule inventory differs from context-manifest.json");
if (JSON.stringify(actualSkills) !== JSON.stringify([...manifest.skills].sort())) errors.push("Skill inventory differs from context-manifest.json");
if (JSON.stringify(actualWorkflows) !== JSON.stringify([...manifest.workflows].sort())) {
  errors.push("Workflow inventory differs from context-manifest.json");
}

const rulesMap = await text("docs/Rules.md");
const skillsMap = await text("docs/Skills.md");
const workflowsMap = await text("docs/Workflows.md");
for (const path of manifest.rules) {
  if (!rulesMap.includes(`[[${path.slice(0, -3)}`)) errors.push(`Rule is missing from docs/Rules.md: ${path}`);
}
for (const path of manifest.skills) {
  if (!skillsMap.includes(`[[${path.slice(0, -3)}`)) errors.push(`Skill is missing from docs/Skills.md: ${path}`);
}
for (const path of manifest.workflows) {
  if (!workflowsMap.includes(`[[${path.slice(0, -3)}`)) {
    errors.push(`Workflow is missing from docs/Workflows.md: ${path}`);
  }
}
for (const path of manifest.orchestrators) {
  if (!(await text(path)).includes("orchestrator/SHARED.md")) errors.push(`Orchestrator does not defer to the shared contract: ${path}`);
}
try {
  await readdir(join(root, "docs/.obsidian"));
  errors.push("Nested docs/.obsidian vault found; the only vault must be at context-factory/.obsidian");
} catch {
  // Expected: the root-level vault must cover the complete factory.
}

const markdownFiles = (await filesUnder(".")).filter((path) => extname(path) === ".md");
const aliases = new Map();
for (const path of markdownFiles) {
  const noExtension = path.slice(0, -3);
  aliases.set(noExtension, path);
  aliases.set(relative(".", noExtension), path);
  aliases.set(noExtension.split("/").at(-1), path);
}
for (const path of markdownFiles) {
  const source = await text(path);
  for (const match of source.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) {
    if (!aliases.has(match[1])) errors.push(`Broken wiki link in ${path}: ${match[1]}`);
  }
}

for (const path of ["app.json", "appearance.json", "core-plugins.json", "graph.json", "templates.json", "workspace.json"]) {
  try { JSON.parse(await text(`.obsidian/${path}`)); } catch { errors.push(`Invalid Obsidian JSON: .obsidian/${path}`); }
}

if (errors.length) {
  console.error(`Context validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Context factory ${manifest.contextVersion} is valid: ${manifest.rules.length} rules, ${manifest.skills.length} skills, ${manifest.workflows.length} workflows, ${markdownFiles.length} Markdown files.`);
