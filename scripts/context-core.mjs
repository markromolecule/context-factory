import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function readText(path) {
  return readFile(join(root, path), "utf8");
}

export async function readJson(path) {
  return JSON.parse(await readText(path));
}

export async function filesUnder(path, options = {}) {
  const ignored = new Set(options.ignored ?? [".git", ".context-runs", "node_modules"]);
  const output = [];

  async function walk(current) {
    for (const entry of await readdir(join(root, current), { withFileTypes: true })) {
      if (ignored.has(entry.name)) continue;
      const next = join(current, entry.name);
      if (entry.isDirectory()) await walk(next);
      else output.push(next.replaceAll("\\", "/"));
    }
  }

  await walk(path);
  return output;
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((item) => parseScalar(item));
  }
  return trimmed.replace(/^(['"])(.*)\1$/, "$2");
}

export function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const result = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const index = line.indexOf(":");
    if (index < 0) continue;
    result[line.slice(0, index).trim()] = parseScalar(line.slice(index + 1));
  }
  return result;
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export async function hashPath(path) {
  return sha256(await readText(path));
}

export function manifestPaths(manifest) {
  return [...new Set([
    "context-manifest.json",
    manifest.entrypoint,
    manifest.orchestrationContract,
    ...(manifest.orchestrators ?? []),
    ...(manifest.rules ?? []),
    ...(manifest.skills ?? []),
    ...(manifest.skillResources ?? []),
    ...(manifest.workflows ?? []),
    ...(manifest.knowledge ?? []),
    ...(manifest.schemas ?? []),
    ...(manifest.templates ?? []),
    ...(manifest.decisions ?? []),
    ...(manifest.tools ?? []),
    ...(manifest.automation ?? []),
    ...(manifest.evaluations ?? []),
    ...(manifest.vaultIndexes ?? []),
  ])].sort();
}

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "into",
  "is", "it", "of", "on", "or", "that", "the", "their", "this", "to", "use", "with",
]);

export function terms(value) {
  function normalize(term) {
    if (term.endsWith("ies") && term.length > 4) return `${term.slice(0, -3)}y`;
    if (term.endsWith("s") && !term.endsWith("ss") && term.length > 3) return term.slice(0, -1);
    return term;
  }
  return [...new Set(
    value.toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((term) => term.length > 1 && !STOP_WORDS.has(term))
      .map(normalize),
  )];
}

function scoreEntry(requestTerms, path, meta) {
  const nameTerms = terms(`${meta.name ?? ""} ${path.split("/").at(-2) ?? ""}`);
  const descriptionTerms = terms(meta.description ?? "");
  const scopeTerms = terms(meta.scope ?? "");
  const matchedName = requestTerms.filter((term) => nameTerms.includes(term));
  const matchedDescription = requestTerms.filter((term) => descriptionTerms.includes(term));
  const matchedScope = requestTerms.filter((term) => scopeTerms.includes(term));
  const score = matchedName.length * 4 + matchedDescription.length * 2 + matchedScope.length;
  return {
    score,
    matches: [...new Set([...matchedName, ...matchedDescription, ...matchedScope])],
  };
}

async function entries(paths) {
  return Promise.all(paths.map(async (path) => {
    const source = await readText(path);
    return { path, source, meta: frontmatter(source) ?? {} };
  }));
}

const ACTION_TERMS = new Set([
  "add", "build", "change", "create", "deliver", "deploy", "design", "execute", "fix",
  "implement", "migrate", "redesign", "release", "remove", "resolve", "review", "upgrade",
]);

const ROUTING_HINTS = [
  { test: /\b(defect|bug|broken|regression|fix)\b/i, workflow: "defect-resolution" },
  { test: /\b(architecture|cross-module|dependency direction|system boundary)\b/i, workflow: "architecture-change" },
  { test: /\b(webhook|credential|secret|authorization|authentication|security|signature|replay)\b/i, workflow: "security-sensitive-change" },
  { test: /\b(database migration|schema migration|backfill)\b/i, workflow: "database-migration" },
  { test: /\b(dependency|package|library|framework).*\b(upgrade|update|migrate)\b/i, workflow: "dependency-upgrade" },
  { test: /\b(frontend|interface|dialog|form|responsive|accessibility|ux|redesign)\b/i, workflow: "frontend-ux-change" },
  { test: /\b(release|readiness|production handoff)\b/i, workflow: "release-readiness" },
  { test: /\b(context factory|rule|skill|workflow|manifest).*\b(add|change|update|maintain|sync)\b/i, workflow: "context-maintenance" },
];

export async function resolveContext(request) {
  const manifest = await readJson("context-manifest.json");
  const requestTerms = terms(request);
  const hasAction = requestTerms.some((term) => ACTION_TERMS.has(term));
  const ruleEntries = await entries(manifest.rules);
  const skillEntries = await entries(manifest.skills);
  const workflowEntries = await entries(manifest.workflows);

  const selectedRules = ruleEntries
    .map((entry) => ({ ...entry, relevance: scoreEntry(requestTerms, entry.path, entry.meta) }))
    .filter((entry) => (
      entry.relevance.score >= 4
      || (entry.meta.alwaysApply === true && (hasAction || entry.meta.name === "evidence-and-claims"))
    ))
    .map((entry) => ({
      path: entry.path,
      reason: entry.meta.alwaysApply === true
        ? (entry.meta.name === "evidence-and-claims" ? "global evidence contract" : "alwaysApply within action scope")
        : `matched: ${entry.relevance.matches.join(", ")}`,
    }));

  let selectedSkills = skillEntries
    .map((entry) => ({ ...entry, relevance: scoreEntry(requestTerms, entry.path, entry.meta) }))
    .filter((entry) => entry.relevance.score >= 6)
    .sort((a, b) => b.relevance.score - a.relevance.score || a.path.localeCompare(b.path))
    .map((entry) => ({
      path: entry.path,
      reason: `matched: ${entry.relevance.matches.join(", ")}`,
    }));

  let selectedWorkflow = null;
  let selectedWorkflowSource = "";
  if (hasAction) {
    const hintedName = ROUTING_HINTS.find((hint) => hint.test.test(request))?.workflow;
    const ranked = workflowEntries
      .map((entry) => ({ ...entry, relevance: scoreEntry(requestTerms, entry.path, entry.meta) }))
      .sort((a, b) => b.relevance.score - a.relevance.score || a.path.localeCompare(b.path));
    const hinted = workflowEntries.find((entry) => entry.meta.name === hintedName);
    const winner = hinted ?? ranked[0];
    if (winner && (hinted || winner.relevance.score >= 4)) {
      const relevance = scoreEntry(requestTerms, winner.path, winner.meta);
      selectedWorkflow = {
        path: winner.path,
        reason: hinted
          ? `routing hint: ${hintedName}`
          : `matched: ${relevance.matches.join(", ")}`,
      };
      selectedWorkflowSource = winner.source;
    }
  }

  if (selectedWorkflow) {
    const linkedSkillNames = new Set(
      [...selectedWorkflowSource.matchAll(/`([a-z0-9-]+)`/g)].map((match) => match[1]),
    );
    const selectedSkillPaths = new Set(selectedSkills.map((item) => item.path));
    for (const entry of skillEntries) {
      if (linkedSkillNames.has(entry.meta.name) && !selectedSkillPaths.has(entry.path)) {
        selectedSkills.push({ path: entry.path, reason: `required by ${selectedWorkflow.path}` });
        selectedSkillPaths.add(entry.path);
      }
    }
    selectedSkills = selectedSkills.sort((a, b) => a.path.localeCompare(b.path));
  }

  const basePaths = [
    manifest.entrypoint,
    manifest.orchestrationContract,
    ...(manifest.knowledge ?? []),
  ];
  const selectedPaths = [...new Set([
    ...basePaths,
    ...selectedRules.map((item) => item.path),
    ...selectedSkills.map((item) => item.path),
    ...(selectedWorkflow ? [selectedWorkflow.path] : []),
  ])];

  return {
    schemaVersion: 1,
    contextVersion: manifest.contextVersion,
    request,
    requestTerms,
    workflow: selectedWorkflow,
    rules: selectedRules,
    skills: selectedSkills,
    selectedPaths,
  };
}

export async function createLock(manifestInput) {
  const manifest = manifestInput ?? await readJson("context-manifest.json");
  const files = {};
  for (const path of manifestPaths(manifest)) files[path] = `sha256:${await hashPath(path)}`;
  return {
    schemaVersion: 1,
    contextVersion: manifest.contextVersion,
    digest: `sha256:${sha256(JSON.stringify(files))}`,
    files,
  };
}

export function compareSelection(selection, expected) {
  const errors = [];
  const actualWorkflow = selection.workflow?.path ?? null;
  if (actualWorkflow !== expected.workflow) {
    errors.push(`workflow: expected ${expected.workflow ?? "none"}, got ${actualWorkflow ?? "none"}`);
  }
  const actualRules = new Set(selection.rules.map((item) => item.path));
  const actualSkills = new Set(selection.skills.map((item) => item.path));
  for (const path of expected.rules ?? []) {
    if (!actualRules.has(path)) errors.push(`missing rule: ${path}`);
  }
  for (const path of expected.skills ?? []) {
    if (!actualSkills.has(path)) errors.push(`missing skill: ${path}`);
  }
  for (const path of expected.excludedRules ?? []) {
    if (actualRules.has(path)) errors.push(`unexpected rule: ${path}`);
  }
  for (const path of expected.excludedSkills ?? []) {
    if (actualSkills.has(path)) errors.push(`unexpected skill: ${path}`);
  }
  return errors;
}

export async function markdownFiles() {
  return (await filesUnder(".")).filter((path) => extname(path) === ".md");
}

export function relativeToRoot(path) {
  return relative(root, path).replaceAll("\\", "/");
}
