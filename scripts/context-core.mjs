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
  const ignored = new Set(options.ignored ?? [".git", ".context-runs", "node_modules", ".DS_Store"]);
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
  const lines = match[1].split(/\r?\n/);
  let currentKey = null;
  let currentArray = null;
  let currentObject = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    // Indented list item under currentKey: "  - value"
    const listMatch = line.match(/^\s+-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!currentArray) {
        currentArray = [];
        result[currentKey] = currentArray;
      }
      currentArray.push(parseScalar(listMatch[1]));
      continue;
    }

    // Indented nested object key-value: "  key: value"
    const nestedMatch = line.match(/^\s+([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (nestedMatch && currentKey && !line.trimStart().startsWith("-")) {
      if (!currentObject || typeof result[currentKey] !== "object" || Array.isArray(result[currentKey])) {
        currentObject = {};
        result[currentKey] = currentObject;
      }
      currentObject[nestedMatch[1]] = parseScalar(nestedMatch[2]);
      continue;
    }

    // Top-level key
    const index = line.indexOf(":");
    if (index < 0) continue;
    currentKey = line.slice(0, index).trim();
    currentArray = null;
    currentObject = null;
    const rawVal = line.slice(index + 1).trim();
    if (rawVal === "") {
      result[currentKey] = null;
    } else {
      result[currentKey] = parseScalar(rawVal);
    }
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
    ...(manifest.agents ?? []),
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
    ...(manifest.datasets ?? []),
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
  "add", "adr", "architect", "build", "change", "commit", "create", "data", "deliver", "deploy",
  "design", "dip", "discovery", "doc", "docs", "documentation", "execute", "execution", "explore", "fix", "grill", "grounding", "hotfix",
  "implement", "isp", "lsp", "migrate", "mitigation", "ocp", "plan", "push", "redesign", "refactor", "release",
  "remove", "report", "resolve", "review", "sec", "security", "ship", "solid", "srp", "summary", "sync", "test",
  "threat", "triage", "upgrade", "ux", "verify", "wiki",
]);

const PREPLANNING_TEST = /\b(new system|new product|pre-?planning|before (?:we )?(?:code|coding|implement)|stress-test (?:the )?(?:idea|plan)|context spec(?:ification)?|author context|create context)\b|^\/(?:grill|discovery|context)\b|^\[(?:GRILL|DISCOVERY|CONTEXT|CONTEXT_SPEC)\]/i;
const EXECUTION_TEST = /\b(execute|implement|carry out|follow|resume)\b.*\b(existing|approved|implementation)?\s*plan\b|\b(existing|approved|implementation)\s*plan\b.*\b(execute|implement|resume)\b|^\/(?:exec|execute|execution)\b|^\[(?:EXEC|EXECUTE|EXECUTION)\]/i;

const ROUTING_HINTS = [
  // 1. Explicit Agent Commands (Highest Precedence)
  { test: /^\/architect\b|^\[ARCHITECT\]/i, workflow: "architecture-change" },
  { test: /^\/data\b|^\[DATA\]/i, workflow: "database-migration" },
  { test: /^\/ux\b|^\[UX\]/i, workflow: "feature-delivery" },
  { test: /^\/threat\b|^\[THREAT\]/i, workflow: "security-sensitive-change" },
  { test: /^\/ba\b|^\[BA\]/i, workflow: "feature-delivery" },
  { test: /^\/pm\b|^\[PM\]/i, workflow: "feature-delivery" },
  { test: /^\/devops\b|^\[DEVOPS\]/i, workflow: "release-readiness" },

  // 2. Explicit Slash Commands and Bracket Prefix Tags
  { test: /^\/(?:fix|hotfix|bug)\b|^\[(?:BUG|HOTFIX|DEFECT)\]/i, workflow: "defect-resolution" },
  { test: /^\/(?:migrate|db|schema)\b|^\[(?:MIGRATE|DB|SCHEMA)\]/i, workflow: "database-migration" },
  { test: /^\/(?:sec|security|auth)\b|^\[(?:SEC|SECURITY|AUTH)\]/i, workflow: "security-sensitive-change" },
  { test: /^\/(?:optimize|review-code)\b|^\[(?:OPTIMIZE|CODE_REVIEW)\]/i, workflow: "code-review-and-optimization" },
  { test: /^\/(?:arch|refactor|adr)\b|^\[(?:ARCH|REFACTOR|ADR)\]/i, workflow: "architecture-change" },
  { test: /^\/(?:upgrade|deps)\b|^\[(?:DEPS|UPGRADE)\]/i, workflow: "dependency-upgrade" },
  { test: /^\/(?:ship|commit-push-release)\b|^\[(?:SHIP|COMMIT_PUSH_RELEASE)\]/i, workflow: "commit-push-release" },
  { test: /^\/(?:release|ready|deploy)\b|^\[(?:RELEASE|DEPLOY)\]/i, workflow: "release-readiness" },
  { test: /^\/(?:sync|lock|maintain)\b|^\[(?:SYNC|LOCK|MAINTENANCE)\]/i, workflow: "context-maintenance" },
  { test: /^\/(?:new-project|progressive)\b|^\[(?:NEW_PROJECT|PROGRESSIVE)\]/i, workflow: "new-project-delivery" },
  { test: /^\/(?:doc|docs|documentation|report)\b|^\[(?:DOC|DOCS|DOCUMENTATION|REPORT)\]/i, workflow: "docs" },
  { test: /^\/(?:plan|feature|grill|discovery|context|triage)\b|^\[(?:PLAN|FEATURE|GRILL|DISCOVERY|CONTEXT|CONTEXT_SPEC|TRIAGE)\]/i, workflow: "feature-delivery" },

  // 3. Keyword & Concept matchers
  { test: /\b(defect|bug|broken|regression|fix|hotfix)\b/i, workflow: "defect-resolution" },
  { test: /\b(optimize|code review|review code|clean code|code quality guardrail)\b/i, workflow: "code-review-and-optimization" },
  { test: /\b(commit and push|commit push release|push to remote|tag release|ship changes)\b/i, workflow: "commit-push-release" },
  { test: /\b(architecture|cross-module|dependency direction|system boundary|refactor|solid|srp|ocp|lsp|isp|dip)\b/i, workflow: "architecture-change" },
  { test: /\b(webhook|credential|secret|authorization|authentication|security|signature|replay)\b/i, workflow: "security-sensitive-change" },
  { test: /\b(database migration|schema migration|backfill)\b/i, workflow: "database-migration" },
  { test: /\b(dependency|package|library|framework).*\b(upgrade|update|migrate)\b/i, workflow: "dependency-upgrade" },
  { test: /\b(frontend|interface|dialog|form|responsive|accessibility|ux|redesign)\b/i, workflow: "feature-delivery" },
  { test: /\b(release|readiness|production handoff)\b/i, workflow: "release-readiness" },
  { test: /\b(context factory|rule|skill|workflow|manifest).*\b(add|change|update|maintain|sync)\b/i, workflow: "context-maintenance" },
  { test: /\b(report|summary|mitigation|post-mortem)\b/i, workflow: "docs" },
  { test: PREPLANNING_TEST, workflow: "feature-delivery" },
];

export async function resolveContext(request, options = {}) {
  const manifest = await readJson("context-manifest.json");
  const hostDir = options.hostDir || options.target || null;
  const requestTerms = terms(request);
  const hasAction = requestTerms.some((term) => ACTION_TERMS.has(term)) || /^\/[a-z0-9_-]+|^\[[a-z0-9_-]+\]/i.test(request.trim());
  const ruleEntries = await entries(manifest.rules);
  const skillEntries = await entries(manifest.skills);
  const workflowEntries = await entries(manifest.workflows);
  const agentPaths = [...new Set([...(manifest.agents ?? []), ...(await filesUnder("agents"))])].filter((p) => p.endsWith("/AGENT.md"));
  const agentEntries = await entries(agentPaths);

  // 1. Check for explicit agent invocation via aliases
  let selectedAgent = null;
  const trimmedRequest = request.trim();
  for (const agent of agentEntries) {
    const aliases = Array.isArray(agent.meta.aliases) ? agent.meta.aliases : [];
    for (const alias of aliases) {
      const isBracket = alias.startsWith("[") && alias.endsWith("]");
      const pattern = isBracket
        ? new RegExp(`^\\${alias.slice(0, -1)}\\]`, "i")
        : new RegExp(`^${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (pattern.test(trimmedRequest)) {
        selectedAgent = agent;
        break;
      }
    }
    if (selectedAgent) break;
  }

  // 2. Rule selection (scored + alwaysApply + agent declared rules)
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

  if (selectedAgent && Array.isArray(selectedAgent.meta.rules)) {
    const selectedRulePaths = new Set(selectedRules.map((item) => item.path));
    for (const rulePath of selectedAgent.meta.rules) {
      if (!selectedRulePaths.has(rulePath) && manifest.rules.includes(rulePath)) {
        selectedRules.push({ path: rulePath, reason: `declared by agent ${selectedAgent.meta.name}` });
        selectedRulePaths.add(rulePath);
      }
    }
  }

  // 3. Skill selection (scored + execution/security filters + agent declared skills)
  let selectedSkills = skillEntries
    .map((entry) => ({ ...entry, relevance: scoreEntry(requestTerms, entry.path, entry.meta) }))
    .filter((entry) => (
      entry.relevance.score >= 6
      && (
        (entry.meta.name !== "execute" && entry.meta.name !== "execution" && entry.meta.name !== "execution-plan")
        || EXECUTION_TEST.test(request)
      )
      && (
        (entry.meta.name !== "security" && entry.meta.name !== "security-review")
        || /\b(security|authentication|authorization|credential|secret|threat|vulnerability|abuse)\b/i.test(request)
      )
    ))
    .sort((a, b) => b.relevance.score - a.relevance.score || a.path.localeCompare(b.path))
    .map((entry) => ({
      path: entry.path,
      reason: `matched: ${entry.relevance.matches.join(", ")}`,
    }));

  if (selectedAgent && Array.isArray(selectedAgent.meta.skills)) {
    const selectedSkillPaths = new Set(selectedSkills.map((item) => item.path));
    for (const skillName of selectedAgent.meta.skills) {
      const matchingPath = manifest.skills.find((p) => p === skillName || p.endsWith(`/${skillName}/SKILL.md`) || p === `skills/${skillName}/SKILL.md`);
      if (matchingPath && !selectedSkillPaths.has(matchingPath)) {
        selectedSkills.push({ path: matchingPath, reason: `declared by agent ${selectedAgent.meta.name}` });
        selectedSkillPaths.add(matchingPath);
      }
    }
    selectedSkills.sort((a, b) => a.path.localeCompare(b.path));
  }

  // 4. Workflow selection
  let selectedWorkflow = null;
  let selectedWorkflowSource = "";
  if (hasAction) {
    const hintedName = ROUTING_HINTS.find((hint) => hint.test.test(request))?.workflow
      ?? (selectedAgent?.meta.defaultWorkflow ? selectedAgent.meta.defaultWorkflow.replace(/\.md$/, "") : null);
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
    const selectedWorkflowMeta = frontmatter(selectedWorkflowSource) ?? {};
    const declaredRules = Array.isArray(selectedWorkflowMeta.rules) ? selectedWorkflowMeta.rules : [];
    const linkedRulePaths = new Set([
      ...declaredRules,
      ...[...selectedWorkflowSource.matchAll(/`(rules\/[^`]+)`/g)].map((match) => match[1]),
    ]);
    const selectedRulePaths = new Set(selectedRules.map((item) => item.path));
    for (const rulePath of linkedRulePaths) {
      if (!selectedRulePaths.has(rulePath) && manifest.rules.includes(rulePath)) {
        selectedRules.push({ path: rulePath, reason: `required by ${selectedWorkflow.path}` });
        selectedRulePaths.add(rulePath);
      }
    }

    const declaredSkills = Array.isArray(selectedWorkflowMeta.skills) ? selectedWorkflowMeta.skills : [];
    const linkedSkillNames = new Set([
      ...declaredSkills,
      ...[...selectedWorkflowSource.matchAll(/`([a-z0-9-]+)`/g)].map((match) => match[1]),
    ]);
    const selectedSkillPaths = new Set(selectedSkills.map((item) => item.path));
    for (const entry of skillEntries) {
      if ((entry.meta.name === "grill" || entry.meta.name === "grill-with-docs" || entry.meta.name === "context") && !PREPLANNING_TEST.test(request)) continue;
      if ((entry.meta.name === "execution" || entry.meta.name === "execution-plan") && !EXECUTION_TEST.test(request)) continue;
      if (linkedSkillNames.has(entry.meta.name) && !selectedSkillPaths.has(entry.path)) {
        selectedSkills.push({ path: entry.path, reason: `required by ${selectedWorkflow.path}` });
        selectedSkillPaths.add(entry.path);
      }
    }
    selectedSkills = selectedSkills.sort((a, b) => a.path.localeCompare(b.path));
  }

  // 5. Host project local rules discovery (if running in bridged workspace)
  const effectiveHost = hostDir ? resolve(process.cwd(), hostDir) : (process.cwd() !== root ? process.cwd() : null);
  if (effectiveHost) {
    try {
      const hostRulesDir = join(effectiveHost, "rules");
      const hostRuleFiles = (await filesUnder(hostRulesDir).catch(() => []))
        .filter((p) => extname(p) === ".md" && !p.endsWith("README.md"));

      for (const relPath of hostRuleFiles) {
        try {
          const fullPath = join(effectiveHost, relPath);
          const source = await readFile(fullPath, "utf8");
          const meta = frontmatter(source) ?? {};
          const relevance = scoreEntry(requestTerms, relPath, meta);
          if (relevance.score >= 4 || meta.alwaysApply === true) {
            selectedRules.push({
              path: relPath,
              reason: meta.alwaysApply ? "host rule: alwaysApply" : `host rule matched: ${relevance.matches.join(", ")}`,
              isHostRule: true,
            });
          }
        } catch {
          // Non-fatal
        }
      }
    } catch {
      // Non-fatal
    }
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
    agent: selectedAgent ? {
      name: selectedAgent.meta.name,
      title: selectedAgent.meta.title,
      role: selectedAgent.meta.role,
      path: selectedAgent.path,
      defaultWorkflow: selectedAgent.meta.defaultWorkflow
        ? (selectedAgent.meta.defaultWorkflow.endsWith(".md") ? selectedAgent.meta.defaultWorkflow : `workflows/${selectedAgent.meta.defaultWorkflow}.md`)
        : null,
      handoffs: selectedAgent.meta.handoffs ?? null,
    } : null,
    workflow: selectedWorkflow,
    rules: selectedRules,
    skills: selectedSkills,
    taste: [],
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
  if (expected.agent !== undefined) {
    const actualAgent = selection.agent?.name ?? null;
    if (actualAgent !== expected.agent) {
      errors.push(`agent: expected ${expected.agent ?? "none"}, got ${actualAgent ?? "none"}`);
    }
  }
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
