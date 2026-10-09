import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { compileRuleBinding, matchesGlob } from "../orchestrator/rules/binding-compiler.mjs";
import { parseRuleCatalog } from "../orchestrator/rules/descriptor-parser.mjs";
import { discoverFrameworkScope } from "./framework-scope.mjs";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Legacy rule path migration map for restructured categories
export const LEGACY_PATH_MAP = {
  "rules/backend/controllers-and-routes.md": "rules/typescript/backend/controllers-and-routes.md",
  "rules/backend/data-access-via-api.md": "rules/typescript/backend/data-access-via-api.md",
  "rules/backend/module-architecture.md": "rules/typescript/backend/module-architecture.md",
  "rules/backend/service-layer.md": "rules/typescript/backend/service-layer.md",
  "rules/database/data-access-via-db.md": "rules/typescript/database/data-access-via-db.md",
  "rules/database/query-optimization-and-pagination.md": "rules/typescript/database/query-optimization-and-pagination.md",
  "rules/database/schema-db.md": "rules/typescript/database/schema-db.md",
  "rules/database/testing-data-access-layer.md": "rules/typescript/database/testing-data-access-layer.md",
  "rules/hooks/async-discipline.md": "rules/typescript/hooks/async-discipline.md",
  "rules/hooks/custom-hooks.md": "rules/typescript/hooks/custom-hooks.md",
  "rules/hooks/mutation-hooks.md": "rules/typescript/hooks/mutation-hooks.md",
  "rules/hooks/query-hooks.md": "rules/typescript/hooks/query-hooks.md",
  "rules/hooks/zustand-store.md": "rules/typescript/hooks/zustand-store.md",
  "rules/ui/accessibility.md": "rules/typescript/ui/accessibility.md",
  "rules/ui/code-organization.md": "rules/typescript/ui/code-organization.md",
  "rules/ui/component-composition.md": "rules/typescript/ui/component-composition.md",
  "rules/ui/dialogs-and-overlays.md": "rules/typescript/ui/dialogs-and-overlays.md",
  "rules/ui/forms-and-validation.md": "rules/typescript/ui/forms-and-validation.md",
  "rules/ui/frontend.md": "rules/typescript/ui/frontend.md",
  "rules/ui/interaction-feedback.md": "rules/typescript/ui/interaction-feedback.md",
  "rules/ui/next-react-project-structure.md": "rules/typescript/ui/next-react-project-structure.md",
  "rules/ui/styling-and-themes.md": "rules/typescript/ui/styling-and-themes.md",
  "rules/typescript/async-discipline.md": "rules/typescript/common/async-discipline.md",
  "rules/typescript/error-handling.md": "rules/typescript/common/error-handling.md",
  "rules/typescript/module-and-imports.md": "rules/typescript/common/module-and-imports.md",
  "rules/typescript/runtime-validation.md": "rules/typescript/common/runtime-validation.md",
  "rules/typescript/type-safety.md": "rules/typescript/common/type-safety.md",
};

export function resolveLegacyRulePath(path) {
  if (!path || typeof path !== "string") return null;
  const p = path.replaceAll("\\", "/");
  if (LEGACY_PATH_MAP[p]) return LEGACY_PATH_MAP[p];
  if (p.startsWith("rules/backend/")) {
    return p.replace("rules/backend/", "rules/typescript/backend/");
  }
  if (p.startsWith("rules/database/")) {
    return p.replace("rules/database/", "rules/typescript/database/");
  }
  if (p.startsWith("rules/hooks/")) {
    return p.replace("rules/hooks/", "rules/typescript/hooks/");
  }
  if (p.startsWith("rules/ui/")) {
    return p.replace("rules/ui/", "rules/typescript/ui/");
  }
  if (/^rules\/typescript\/[^/]+\.md$/.test(p)) {
    return p.replace("rules/typescript/", "rules/typescript/common/");
  }
  return null;
}

export async function readText(path, basePath = root) {
  const targetPath = isAbsolute(path) ? path : join(basePath, path);
  try {
    return await readFile(targetPath, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      const relPath = isAbsolute(path) ? relative(basePath, path).replaceAll("\\", "/") : path.replaceAll("\\", "/");
      const legacyFallback = resolveLegacyRulePath(relPath);
      if (legacyFallback) {
        const fallbackTarget = join(basePath, legacyFallback);
        try {
          return await readFile(fallbackTarget, "utf8");
        } catch { }
        if (basePath !== root) {
          const canonicalTarget = join(root, legacyFallback);
          try {
            return await readFile(canonicalTarget, "utf8");
          } catch { }
        }
      }
      if (basePath !== root) {
        try {
          return await readFile(join(root, relPath), "utf8");
        } catch { }
      }
    }
    throw err;
  }
}

export async function readJson(path, basePath = root) {
  return JSON.parse(await readText(path, basePath));
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

export async function hashPath(path, basePath = root) {
  return sha256(await readText(path, basePath));
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
  { test: /^\/(?:session|session-save|session-resume)\b|^\[SESSION\]/i, workflow: null },

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
  const effectiveHost = hostDir ? resolve(process.cwd(), hostDir) : (process.cwd() !== root ? process.cwd() : null);
  const rawScope = options.scope || options.affectedScope || options.paths || [];
  const rawScopeArr = (Array.isArray(rawScope) ? rawScope : [rawScope])
    .flatMap((value) => typeof value === "string" ? value.split(",").map((p) => p.trim()).filter(Boolean) : []);
  const frameworkScope = await discoverFrameworkScope({ hostDir: effectiveHost, scope: rawScopeArr, request });
  const appliesToScope = (meta) => {
    const paths = rawScopeArr.length ? rawScopeArr : [""];
    return paths.some((path) =>
      (!rawScopeArr.length || !meta.appliesTo?.length || meta.appliesTo.some((glob) => matchesGlob(path, glob)))
      && (!meta.frameworks?.length || meta.frameworks.some((f) => frameworkScope.byPath[path.replaceAll("\\", "/").replace(/^\.\//, "")]?.includes(f)))
    );
  };

  // Stack determination:
  // 1. Explicit options.stacks (array) or options.stack (string)
  // 2. Read from .context-bridge.json in effectiveHost or cwd if exists
  // 3. Fallback: ["typescript"] for backwards compatibility
  let declaredStacks = null;
  if (Array.isArray(options.stacks) && options.stacks.length > 0) {
    declaredStacks = options.stacks.map((s) => s.toLowerCase());
  } else if (typeof options.stack === "string" && options.stack.trim()) {
    declaredStacks = [options.stack.trim().toLowerCase()];
  } else {
    const checkDirs = [effectiveHost, process.cwd()].filter(Boolean);
    for (const dir of checkDirs) {
      try {
        const bridgePath = join(dir, ".context-bridge.json");
        const bridgeContent = await readJson(bridgePath);
        if (Array.isArray(bridgeContent.stacks) && bridgeContent.stacks.length > 0) {
          declaredStacks = bridgeContent.stacks.map((s) => s.toLowerCase());
          break;
        }
      } catch {
        // Continue
      }
    }
  }

  if (!declaredStacks || declaredStacks.length === 0) {
    const inferred = [];
    if (/\b(typescript|nextjs|react|zod|tailwind)\b/i.test(request)) {
      inferred.push("typescript");
    }
    if (inferred.length > 0) {
      declaredStacks = inferred;
    } else {
      declaredStacks = ["typescript"];
    }
  }

  if (declaredStacks.includes("laravel")) {
    throw new Error("Stack 'laravel' was decommissioned in ADR 0036. Context Factory focuses strictly on the TypeScript ecosystem.");
  }

  const isRuleAllowed = (rulePath) => {
    if (rulePath.startsWith("rules/global/") || rulePath.startsWith("rules/solid/")) {
      return true;
    }
    const parts = rulePath.split("/");
    const stack = parts[1];
    return declaredStacks.includes(stack);
  };

  const requestTerms = terms(request);
  const hasAction = requestTerms.some((term) => ACTION_TERMS.has(term)) || /^\/[a-z0-9_-]+|^\[[a-z0-9_-]+\]/i.test(request.trim());
  const ruleEntries = await entries(manifest.rules);
  const skillEntries = await entries(manifest.skills);
  const workflowEntries = await entries(manifest.workflows);
  const agentPaths = [...new Set([...(manifest.agents ?? []), ...(await filesUnder("agents"))])].filter((p) => p.endsWith("/AGENT.md"));
  const agentEntries = await entries(agentPaths);
  const allowedRulePaths = new Set(ruleEntries.filter((entry) => appliesToScope(entry.meta)).map((entry) => entry.path));

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

  // 2. Rule selection (scored + alwaysApply + agent declared rules, filtered by stack)
  const candidateRuleEntries = ruleEntries.filter((entry) => isRuleAllowed(entry.path) && allowedRulePaths.has(entry.path));
  const selectedRules = candidateRuleEntries
    .map((entry) => ({ ...entry, relevance: scoreEntry(requestTerms, entry.path, entry.meta) }))
    .filter((entry) => (
      entry.relevance.score >= 4
      || (entry.meta.frameworks?.length && rawScopeArr.length)
      || (entry.meta.alwaysApply === true && (hasAction || entry.meta.name === "evidence-and-claims"))
    ))
    .map((entry) => ({
      path: entry.path,
      reason: entry.meta.frameworks?.length && rawScopeArr.length
        ? `matched framework and affected files: ${entry.meta.frameworks.join(", ")}`
        : entry.meta.alwaysApply === true
        ? (entry.meta.name === "evidence-and-claims" ? "global evidence contract" : "alwaysApply within action scope")
        : `matched: ${entry.relevance.matches.join(", ")}`,
    }));

  if (selectedAgent && Array.isArray(selectedAgent.meta.rules)) {
    const selectedRulePaths = new Set(selectedRules.map((item) => item.path));
    for (const rulePath of selectedAgent.meta.rules) {
      if (!selectedRulePaths.has(rulePath) && manifest.rules.includes(rulePath) && isRuleAllowed(rulePath) && allowedRulePaths.has(rulePath)) {
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
    const matchedHint = ROUTING_HINTS.find((hint) => hint.test.test(request));
    if (matchedHint && matchedHint.workflow === null) {
      selectedWorkflow = null;
    } else {
      const hintedName = matchedHint?.workflow
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
      if (!selectedRulePaths.has(rulePath) && manifest.rules.includes(rulePath) && isRuleAllowed(rulePath) && allowedRulePaths.has(rulePath)) {
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

  // Token budget estimation (~4 characters per token)
  let totalChars = 0;
  let ruleAndSkillChars = 0;
  for (const p of selectedPaths) {
    try {
      const src = await readText(p);
      totalChars += src.length;
      if (p.startsWith("rules/") || p.startsWith("skills/")) {
        ruleAndSkillChars += src.length;
      }
    } catch {
      // Non-fatal
    }
  }
  const estimatedTokens = Math.ceil(totalChars / 4);
  const ruleAndSkillTokens = Math.ceil(ruleAndSkillChars / 4);
  const maxRecommendedRuleTokens = 8000;
  const budget = {
    estimatedTokens,
    ruleAndSkillTokens,
    maxRecommendedRuleTokens,
    densityStatus: ruleAndSkillTokens <= maxRecommendedRuleTokens ? "optimal" : "warning",
    warning: ruleAndSkillTokens > maxRecommendedRuleTokens
      ? `Resolved rules and skills (${ruleAndSkillTokens} tokens) exceed recommended ceiling (${maxRecommendedRuleTokens} tokens). Consider narrowing prompt.`
      : null,
  };

  // Enforceable material rule binding compilation (requires explicit stack and non-empty affected scope)
  let binding = null;
  let bindingCompilation = null;
  const explicitStack = (typeof options.stack === "string" && options.stack.trim())
    ? options.stack.trim().toLowerCase()
    : (Array.isArray(options.stacks) && options.stacks.length === 1 ? options.stacks[0].trim().toLowerCase() : null);

  if (rawScopeArr.length > 0 && explicitStack) {
    const catalogResult = await parseRuleCatalog(join(root, "rules"));
    const workflowName = options.workflow
      || (selectedWorkflow?.path ? basename(selectedWorkflow.path, ".md") : "feature-delivery");
    bindingCompilation = compileRuleBinding({
      taskId: options.taskId || "adhoc",
      phase: options.phase || "00",
      unit: options.unit || "00",
      stack: explicitStack,
      workflow: workflowName,
      affectedScope: rawScopeArr,
      descriptors: catalogResult.descriptors,
      frameworksByPath: frameworkScope.byPath,
      waivers: options.waivers || [],
    });
    binding = bindingCompilation.binding;
  }

  return {
    schemaVersion: 1,
    contextVersion: manifest.contextVersion,
    stacks: declaredStacks,
    frameworks: frameworkScope.frameworks,
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
    budget,
    binding,
    bindingCompilation,
  };
}

export async function createLock(manifestInput, basePath = root) {
  const manifest = manifestInput ?? await readJson("context-manifest.json", basePath);
  const files = {};
  for (const path of manifestPaths(manifest)) {
    try {
      files[path] = `sha256:${await hashPath(path, basePath)}`;
    } catch (err) {
      files[path] = `missing:${err.code || "ENOENT"}`;
    }
  }
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
