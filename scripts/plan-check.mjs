import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { frontmatter, root } from "./context-core.mjs";
import { parseRuleCatalog } from "../orchestrator/rules/descriptor-parser.mjs";

/**
 * Builds dependency graph from unit objects
 * @param {Array<{id: string, dependsOn: string[]}>} units
 */
export function buildDependencyGraph(units) {
  const nodes = new Set();
  const adjList = new Map(); // from dependency -> dependents
  const inDegree = new Map();

  for (const u of units) {
    nodes.add(u.id);
    if (!adjList.has(u.id)) adjList.set(u.id, []);
    if (!inDegree.has(u.id)) inDegree.set(u.id, 0);
  }

  for (const u of units) {
    for (const dep of u.dependsOn || []) {
      if (!nodes.has(dep)) {
        nodes.add(dep);
        if (!adjList.has(dep)) adjList.set(dep, []);
        if (!inDegree.has(dep)) inDegree.set(dep, 0);
      }
      adjList.get(dep).push(u.id);
      inDegree.set(u.id, (inDegree.get(u.id) || 0) + 1);
    }
  }

  return { nodes, adjList, inDegree };
}

/**
 * Detects cycles using Kahn's topological sort algorithm
 * @param {{nodes: Set<string>, adjList: Map<string, string[]>, inDegree: Map<string, number>}} graph
 */
export function detectCycles(graph) {
  const inDegree = new Map(graph.inDegree);
  const queue = [];
  const sortedOrder = [];

  for (const [node, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(node);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    sortedOrder.push(current);

    const neighbors = graph.adjList.get(current) || [];
    for (const neighbor of neighbors) {
      const newDegree = inDegree.get(neighbor) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  const cycleNodes = [];
  for (const [node, degree] of inDegree.entries()) {
    if (degree > 0) {
      cycleNodes.push(node);
    }
  }

  const valid = cycleNodes.length === 0;
  const cycles = valid ? [] : [cycleNodes];

  return { valid, cycles, sortedOrder };
}

/**
 * Extracts declared file scopes from unit markdown content.
 * Parses the `## Scope` section and extracts file paths under `**In scope:**`.
 * @param {string} unitContent
 * @returns {string[]} Normalized list of file paths
 */
export function extractDeclaredScopes(unitContent) {
  if (typeof unitContent !== "string") return [];

  const scopeHeaderMatch = unitContent.match(/^##\s+Scope\b/im);
  if (!scopeHeaderMatch) return [];

  const afterHeader = unitContent.slice(scopeHeaderMatch.index + scopeHeaderMatch[0].length);
  const nextHeaderMatch = afterHeader.match(/^##\s+/m);
  const scopeBlock = nextHeaderMatch ? afterHeader.slice(0, nextHeaderMatch.index) : afterHeader;

  const inScopeMatch = scopeBlock.match(
    /(?:^|\n)\s*[-*]*\s*\*\*In scope:\*\*\s*([\s\S]*?)(?=(?:\n\s*[-*]*\s*\*\*Out of scope:\*\*|\n\s*<language_rules>|\n\s*##|$))/i
  );
  if (!inScopeMatch) return [];

  const inScopeText = inScopeMatch[1].trim();
  const filePaths = new Set();

  // 1. Look for backticked paths
  const backtickRegex = /`([^`]+)`/g;
  let match;
  let hadBackticks = false;

  while ((match = backtickRegex.exec(inScopeText)) !== null) {
    hadBackticks = true;
    const token = match[1].trim();
    if (isLikelyFilePath(token)) {
      filePaths.add(normalizePath(token));
    }
  }

  // 2. If no backticks or to catch comma-separated plain text paths
  if (!hadBackticks || filePaths.size === 0) {
    const rawTokens = inScopeText
      .split(/[\n,]+/)
      .map((t) => t.replace(/^\s*[-*]\s*/, "").replace(/\(.*?\)/g, "").trim())
      .filter(Boolean);

    for (const token of rawTokens) {
      const cleanToken = token.replace(/[`'"]/g, "").trim();
      if (isLikelyFilePath(cleanToken)) {
        filePaths.add(normalizePath(cleanToken));
      }
    }
  }

  return Array.from(filePaths);
}

function isLikelyFilePath(token) {
  if (!token || typeof token !== "string") return false;
  const clean = token.trim();
  // Ignore phrases containing spaces (e.g. "exact files/functions/endpoints/schemas.")
  if (/\s/.test(clean)) return false;
  // Ignore CLI flags like --help
  if (clean.startsWith("-")) return false;
  // Rule catalog paths are rules, not application file scope
  if (clean.startsWith("rules/") && clean.endsWith(".md")) return false;
  // Ignore single identifier without dots or slashes (e.g. function names or keywords)
  if (!clean.includes("/") && !clean.includes(".")) {
    // Unless known special filenames
    return /^(Dockerfile|Makefile|LICENSE|Procfile|Gemfile)$/i.test(clean);
  }
  // If it has a slash, e.g. path/to/file or .agents/skills/
  if (clean.includes("/")) return true;
  // If it has a file extension (e.g. foo.js, config.json)
  return /\.[a-zA-Z0-9_-]+$/.test(clean);
}

function normalizePath(p) {
  let normalized = p.trim().replace(/^(\.\/)+/, "");
  // strip trailing punctuation
  normalized = normalized.replace(/[,;:]+$/, "");
  return normalized;
}

/**
 * Checks if target is reachable from start in adjList (directed path exists)
 * @param {Map<string, string[]>} adjList
 * @param {string} start
 * @param {string} target
 * @returns {boolean}
 */
export function isReachable(adjList, start, target) {
  if (start === target) return true;
  const visited = new Set();
  const queue = [start];
  while (queue.length > 0) {
    const curr = queue.shift();
    if (curr === target) return true;
    const neighbors = adjList.get(curr) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return false;
}

/**
 * Identifies pairs of units within the same phase that have no directed dependency between them
 * @param {Array<{id: string, phase?: string, meta?: any}>} units
 * @param {{nodes: Set<string>, adjList: Map<string, string[]>}} graph
 * @returns {Array<{unitA: any, unitB: any}>}
 */
export function findParallelUnitPairs(units, graph) {
  const g = graph || buildDependencyGraph(units);
  const pairs = [];

  for (let i = 0; i < units.length; i++) {
    for (let j = i + 1; j < units.length; j++) {
      const uA = units[i];
      const uB = units[j];

      const phaseA = uA.phase || uA.meta?.parent || uA.meta?.phase;
      const phaseB = uB.phase || uB.meta?.parent || uB.meta?.phase;

      // Units in different explicitly declared phases are sequential across phase boundaries
      const samePhase = (!phaseA && !phaseB) || (phaseA === phaseB);
      if (!samePhase) continue;

      const aToB = isReachable(g.adjList, uA.id, uB.id);
      const bToA = isReachable(g.adjList, uB.id, uA.id);

      if (!aToB && !bToA) {
        pairs.push({ unitA: uA, unitB: uB });
      }
    }
  }

  return pairs;
}

/**
 * Checks that parallel units have disjoint file scopes
 * @param {Array<{unitA: {id: string, scope?: string[]}, unitB: {id: string, scope?: string[]}}>} parallelPairs
 * @returns {{valid: boolean, conflicts: Array<{unitA: string, unitB: string, overlappingFiles: string[]}>}}
 */
export function checkDisjointScopes(parallelPairs) {
  const conflicts = [];

  for (const { unitA, unitB } of parallelPairs) {
    const scopeA = new Set(unitA.scope || []);
    const overlapping = (unitB.scope || []).filter((file) => scopeA.has(file));

    if (overlapping.length > 0) {
      conflicts.push({
        unitA: unitA.id,
        unitB: unitB.id,
        overlappingFiles: overlapping,
      });
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts,
  };
}

/**
 * Pure glob matcher for file patterns
 */
export function matchesGlob(filePath, pattern) {
  const normPath = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
  const normPattern = pattern.replaceAll("\\", "/").replace(/^\.\//, "");

  if (normPattern === "**/*" || normPattern === "**" || normPattern === "*") {
    return true;
  }
  if (normPath === normPattern) return true;

  let regexStr = "^";
  let i = 0;
  while (i < normPattern.length) {
    const c = normPattern[i];
    if (c === "*" && normPattern[i + 1] === "*") {
      if (normPattern[i + 2] === "/") {
        regexStr += "(?:.*/)?";
        i += 3;
        continue;
      } else {
        regexStr += ".*";
        i += 2;
        continue;
      }
    } else if (c === "*") {
      regexStr += "[^/]*";
      i += 1;
      continue;
    } else if (c === "?") {
      regexStr += "[^/]";
      i += 1;
      continue;
    } else if (/[.+^$[\](){}|\\]/.test(c)) {
      regexStr += `\\${c}`;
      i += 1;
      continue;
    } else {
      regexStr += c;
      i += 1;
    }
  }
  regexStr += "$";

  try {
    return new RegExp(regexStr).test(normPath);
  } catch {
    return false;
  }
}

/**
 * Check applicability with JS/TS file extension tolerance
 */
export function matchesApplicability(filePath, pattern) {
  if (matchesGlob(filePath, pattern)) return true;
  if (pattern === "**/*.ts" || pattern === "**/*.tsx" || pattern.endsWith("/*.ts") || pattern.endsWith("/*.tsx")) {
    if (/\.(js|mjs|cjs|jsx|ts|tsx)$/i.test(filePath)) return true;
  }
  return false;
}

/**
 * Infer unit stack from declared scope and frontmatter
 */
export function inferUnitStack(scope = [], meta = {}) {
  if (meta && typeof meta.stack === "string" && meta.stack.trim()) {
    return meta.stack.trim().toLowerCase();
  }
  const tags = Array.isArray(meta?.tags) ? meta.tags.map((t) => String(t).toLowerCase()) : [];
  if (tags.includes("laravel") || String(meta?.parent || "").includes("laravel")) {
    return "laravel";
  }
  if (tags.includes("flutter") || String(meta?.parent || "").includes("flutter")) {
    return "flutter";
  }
  if (tags.includes("typescript") || String(meta?.parent || "").includes("typescript")) {
    return "typescript";
  }
  const scopeFiles = Array.isArray(scope) ? scope : [];
  if (scopeFiles.some((f) => /\.(php)$/i.test(f))) return "laravel";
  if (scopeFiles.some((f) => /\.(dart)$/i.test(f))) return "flutter";
  if (scopeFiles.some((f) => /\.(ts|tsx|js|mjs|jsx)$/i.test(f))) return "typescript";
  return "typescript";
}

/**
 * Extracts and parses <language_rules> block from unit markdown content.
 */
export function extractLanguageRules(unitContent) {
  if (typeof unitContent !== "string") {
    return { hasBlock: false, raw: "", entries: [], failure: "missing" };
  }

  const match = unitContent.match(/<language_rules>([\s\S]*?)<\/language_rules>/i);
  if (!match || !match[1].trim()) {
    return { hasBlock: false, raw: "", entries: [], failure: "missing" };
  }

  const raw = match[1].trim();

  // Template placeholder rejection
  if (
    /Rule\s+\d+:\s+Concrete checkable directive/i.test(raw) ||
    /\{\{[^}]+\}\}/.test(raw) ||
    /\b(TODO|TBD)\b/i.test(raw) ||
    /e\.g\.\s*["']no implicit any["']/i.test(raw)
  ) {
    return { hasBlock: true, raw, entries: [], failure: "placeholder" };
  }

  const entries = [];
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim().replace(/^[-*]\s*/, "");
    if (!trimmed) continue;

    const hashMatch = trimmed.match(/(?:hash|sourceHash|contentHash)?:?(sha256:[a-f0-9]{64})/i);
    const hash = hashMatch ? hashMatch[1] : null;

    const dirTagMatch = trimmed.match(/\[directive:([a-z0-9_.-]+)\]/i);
    const rulePathMatch = trimmed.match(/`?(rules\/[a-z0-9_/.-]+\.md)`?/i);
    const dirIdMatch = trimmed.match(/`?([a-z]{2,}\.[a-z0-9_.-]+)`?/i);

    const directiveId = dirTagMatch ? dirTagMatch[1] : (dirIdMatch && !rulePathMatch ? dirIdMatch[1] : null);
    const rulePath = rulePathMatch ? rulePathMatch[1] : null;

    entries.push({
      raw: trimmed,
      rulePath,
      directiveId,
      hash,
    });
  }

  return { hasBlock: true, raw, entries, failure: null };
}

/**
 * Checks if unit markdown content contains a populated, non-placeholder <language_rules> block
 * @param {string} unitContent
 * @returns {boolean}
 */
export function hasLanguageRulesBlock(unitContent) {
  const result = extractLanguageRules(unitContent);
  return result.hasBlock && !result.failure && result.entries.length > 0;
}

/**
 * Recursively locates all unit-*.md files in a task directory and parses frontmatter & scope
 * @param {string} taskDirPath
 */
export async function parseUnitArtifacts(taskDirPath) {
  const units = [];
  const entries = await readdir(taskDirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(taskDirPath, entry.name);
    if (entry.isDirectory()) {
      const subEntries = await readdir(fullPath, { withFileTypes: true });
      for (const sub of subEntries) {
        if (sub.isFile() && /^unit-.*\.md$/.test(sub.name)) {
          const unitFilePath = join(fullPath, sub.name);
          const content = await readFile(unitFilePath, "utf8");
          const meta = frontmatter(content) || {};
          const id = meta.unit || sub.name.replace(/\.md$/, "");
          const dependsOn = Array.isArray(meta.depends_on) ? meta.depends_on : [];
          const scope = extractDeclaredScopes(content);
          units.push({
            id: String(id),
            title: meta.title || id,
            path: unitFilePath,
            content,
            meta,
            phase: meta.parent || meta.phase || entry.name,
            dependsOn: dependsOn.map(String),
            scope,
            hasLanguageRules: hasLanguageRulesBlock(content),
          });
        }
      }
    } else if (entry.isFile() && /^unit-.*\.md$/.test(entry.name)) {
      const content = await readFile(fullPath, "utf8");
      const meta = frontmatter(content) || {};
      const id = meta.unit || entry.name.replace(/\.md$/, "");
      const dependsOn = Array.isArray(meta.depends_on) ? meta.depends_on : [];
      const scope = extractDeclaredScopes(content);
      units.push({
        id: String(id),
        title: meta.title || id,
        path: fullPath,
        content,
        meta,
        phase: meta.parent || meta.phase || null,
        dependsOn: dependsOn.map(String),
        scope,
        hasLanguageRules: hasLanguageRulesBlock(content),
      });
    }
  }

  return units;
}

/**
 * Top-level graph verification for a task directory
 * @param {string} taskDirPath
 */
export async function checkPlanGraph(taskDirPath) {
  const units = await parseUnitArtifacts(taskDirPath);
  const graph = buildDependencyGraph(units);
  const cycleResult = detectCycles(graph);
  return {
    units,
    graph,
    ...cycleResult,
  };
}

/**
 * Top-level scope verification for a task directory or unit array
 * @param {string | any[]} taskDirPathOrUnits
 */
export async function checkPlanScopes(taskDirPathOrUnits) {
  let units;
  if (typeof taskDirPathOrUnits === "string") {
    units = await parseUnitArtifacts(taskDirPathOrUnits);
  } else if (Array.isArray(taskDirPathOrUnits)) {
    units = taskDirPathOrUnits.map((u) => {
      const scope = u.scope || (u.content ? extractDeclaredScopes(u.content) : []);
      return { ...u, scope };
    });
  } else {
    throw new Error("checkPlanScopes expects a directory path string or array of unit objects");
  }

  const graph = buildDependencyGraph(units);
  const parallelPairs = findParallelUnitPairs(units, graph);
  return checkDisjointScopes(parallelPairs);
}

/**
 * Validates language rules for all units against descriptor catalog and scope
 */
export async function validatePlanRules(units, options = {}) {
  const diagnostics = [];
  let descriptors = options.descriptors;
  if (!descriptors) {
    const rulesDir = options.rulesDir || join(root, "rules");
    const catalog = await parseRuleCatalog(rulesDir).catch(() => ({ descriptors: [] }));
    descriptors = catalog.descriptors || [];
  }

  const ruleMap = new Map();
  const directiveMap = new Map();
  for (const desc of descriptors) {
    ruleMap.set(desc.rulePath, desc);
    for (const dir of desc.directives || []) {
      directiveMap.set(dir.id, { directive: dir, descriptor: desc });
    }
  }

  const missingUnits = [];

  for (const unit of units) {
    // Check if starter unit (freshly scaffolded task starter with no files in scope)
    const isStarter = Boolean(
      (unit.title?.endsWith("Starter") || unit.id.endsWith(".01")) &&
      (!unit.scope || unit.scope.length === 0) &&
      unit.content.includes("One sentence: what this unit accomplishes")
    );

    const extracted = extractLanguageRules(unit.content);

    if (isStarter) {
      continue;
    }

    if (extracted.failure === "missing") {
      missingUnits.push(unit.id);
      diagnostics.push({
        unitId: unit.id,
        failureClass: "missing",
        message: `Unit ${unit.id} is missing a <language_rules> block or it is empty.`,
        remediation: `Add a populated <language_rules> block with applicable rule paths or directive IDs.`
      });
      continue;
    }

    if (extracted.failure === "placeholder") {
      missingUnits.push(unit.id);
      diagnostics.push({
        unitId: unit.id,
        failureClass: "placeholder",
        message: `Unit ${unit.id} contains template placeholder text in <language_rules>.`,
        remediation: `Replace placeholder text with concrete rule paths or directive IDs.`
      });
      continue;
    }

    // Check contradictory steps in unit body targeting a known rule/directive
    const bodyWithoutRules = unit.content.replace(/<language_rules>[\s\S]*?<\/language_rules>/i, "");
    const contradictMatch = bodyWithoutRules.match(/(?:bypass|contradict|disable|ignore)\s+(`?[a-z0-9_./-]+`?)/i);
    if (contradictMatch) {
      const target = contradictMatch[1].replace(/[`']/g, "").trim();
      const isKnownRuleOrDirective =
        ruleMap.has(target) ||
        directiveMap.has(target) ||
        target.startsWith("rules/") ||
        target.endsWith(".md") ||
        descriptors.some((d) => d.directives?.some((dir) => dir.id === target));
      if (isKnownRuleOrDirective) {
        const hasWaiver = Boolean(
          (Array.isArray(unit.meta.waivers) && unit.meta.waivers.length > 0) ||
          unit.meta.waiver ||
          /\[waiver:[^\]]+\]/i.test(unit.content) ||
          /\bwaiver-[a-z0-9-]+\b/i.test(unit.content)
        );
        if (!hasWaiver) {
          diagnostics.push({
            unitId: unit.id,
            failureClass: "contradictory",
            directiveOrRule: target,
            message: `Unit ${unit.id} steps declare bypass/contradiction of "${target}" without an authorized waiver reference.`,
            remediation: `Obtain and reference an authorized waiver or align unit steps with the applicable language rule.`
          });
        }
      }
    }

    const unitStack = inferUnitStack(unit.scope, unit.meta);

    for (const entry of extracted.entries) {
      if (!entry.rulePath && !entry.directiveId) {
        diagnostics.push({
          unitId: unit.id,
          failureClass: "nonexistent",
          directiveOrRule: entry.raw,
          message: `Unit ${unit.id} rule entry "${entry.raw}" does not reference an existing rule file or directive ID.`,
          remediation: `Reference an existing rule path in rules/ or a valid directive ID.`
        });
        continue;
      }

      if (entry.rulePath) {
        const desc = ruleMap.get(entry.rulePath);
        if (!desc) {
          diagnostics.push({
            unitId: unit.id,
            failureClass: "nonexistent",
            directiveOrRule: entry.rulePath,
            message: `Unit ${unit.id} references nonexistent rule file "${entry.rulePath}".`,
            remediation: `Reference an existing rule file under rules/.`
          });
          continue;
        }

        const descStack = (desc.stack || "general").toLowerCase();
        if (descStack !== "global" && descStack !== "general" && descStack !== "solid" && descStack !== unitStack) {
          diagnostics.push({
            unitId: unit.id,
            failureClass: "wrong-stack",
            directiveOrRule: entry.rulePath,
            message: `Unit ${unit.id} stack "${unitStack}" does not match rule "${entry.rulePath}" stack "${descStack}".`,
            remediation: `Remove wrong-stack rule reference or align unit stack.`
          });
        }

        const allPaths = (desc.directives || []).flatMap((d) => d.applicability?.paths || []).filter(Boolean);
        if (allPaths.length > 0 && Array.isArray(unit.scope) && unit.scope.length > 0) {
          const matchesAny = unit.scope.some((f) => allPaths.some((p) => matchesApplicability(f, p)));
          if (!matchesAny) {
            diagnostics.push({
              unitId: unit.id,
              failureClass: "irrelevant",
              directiveOrRule: entry.rulePath,
              message: `Unit ${unit.id} scope [${unit.scope.join(", ")}] does not match applicability paths [${allPaths.join(", ")}] for rule "${entry.rulePath}".`,
              remediation: `Scope unit to matching files or bind rules relevant to touched files.`
            });
          }
        }

        if (entry.hash && entry.hash !== desc.sourceHash) {
          diagnostics.push({
            unitId: unit.id,
            failureClass: "stale",
            directiveOrRule: entry.rulePath,
            message: `Unit ${unit.id} references "${entry.rulePath}" with stale hash "${entry.hash}" (current: "${desc.sourceHash}").`,
            remediation: `Update rule source hash in <language_rules>.`
          });
        }
      }

      if (entry.directiveId) {
        const item = directiveMap.get(entry.directiveId);
        if (!item) {
          diagnostics.push({
            unitId: unit.id,
            failureClass: "nonexistent",
            directiveOrRule: entry.directiveId,
            message: `Unit ${unit.id} references nonexistent directive ID "${entry.directiveId}".`,
            remediation: `Reference a valid directive ID from the descriptor catalog.`
          });
          continue;
        }

        const { directive, descriptor } = item;
        const descStack = (descriptor.stack || "general").toLowerCase();
        if (descStack !== "global" && descStack !== "general" && descStack !== "solid" && descStack !== unitStack) {
          diagnostics.push({
            unitId: unit.id,
            failureClass: "wrong-stack",
            directiveOrRule: entry.directiveId,
            message: `Unit ${unit.id} stack "${unitStack}" does not match directive "${entry.directiveId}" stack "${descStack}".`,
            remediation: `Remove wrong-stack directive reference or align unit stack.`
          });
        }

        const dirPaths = directive.applicability?.paths || [];
        if (dirPaths.length > 0 && Array.isArray(unit.scope) && unit.scope.length > 0) {
          const matchesAny = unit.scope.some((f) => dirPaths.some((p) => matchesApplicability(f, p)));
          if (!matchesAny) {
            diagnostics.push({
              unitId: unit.id,
              failureClass: "irrelevant",
              directiveOrRule: entry.directiveId,
              message: `Unit ${unit.id} scope does not match applicability paths [${dirPaths.join(", ")}] for directive "${entry.directiveId}".`,
              remediation: `Bind directives relevant to touched scope.`
            });
          }
        }

        if (entry.hash && entry.hash !== directive.contentHash && entry.hash !== descriptor.sourceHash) {
          diagnostics.push({
            unitId: unit.id,
            failureClass: "stale",
            directiveOrRule: entry.directiveId,
            message: `Unit ${unit.id} references "${entry.directiveId}" with stale hash "${entry.hash}" (current: "${directive.contentHash}").`,
            remediation: `Update directive hash in <language_rules>.`
          });
        }
      }
    }
  }

  return {
    valid: diagnostics.length === 0,
    diagnostics,
    missingUnits,
  };
}

function sectionContent(content, heading) {
  const match = content.match(new RegExp(`^##\\s+${heading}\\s*$([\\s\\S]*?)(?=^##\\s+|(?![\\s\\S]))`, "im"));
  return match ? match[1].trim() : "";
}

async function findTaskMaster(taskDirPath) {
  const entries = await readdir(taskDirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const path = join(taskDirPath, entry.name);
    const content = await readFile(path, "utf8");
    const meta = frontmatter(content) || {};
    if (meta.type === "task") return { path, content, meta };
  }
  return null;
}

function planDoneDiagnostic(failureClass, message, remediation) {
  return { failureClass, message, remediation };
}

function hasResolvedBlockers(blockerSection) {
  if (!blockerSection) return false;
  if (/\bnone\b/i.test(blockerSection)) return true;
  return !/\b(blocking|blocker)\b/i.test(blockerSection) || /\bresolved\b/i.test(blockerSection);
}

function hasDoneCheck(content) {
  const section = sectionContent(content, "Plan done-check");
  const required = ["acceptance", "blocker", "risk", "checkout"];
  return required.every((term) => new RegExp(`- \\[x\\][^\\n]*${term}`, "i").test(section));
}

/**
 * Validates the prospective v2 task-plan contract. Plans without the explicit
 * version remain readable as recorded historical artifacts.
 */
export async function validatePlanDoneCheck(taskDirPath, units, graph) {
  const master = await findTaskMaster(taskDirPath);
  if (!master || Number(master.meta.plan_contract_version) !== 2) {
    return { applicable: false, valid: true, diagnostics: [] };
  }

  const diagnostics = [];
  const { meta, content } = master;
  const branchTypes = "feat|fix|refactor|chore|docs|test|perf|build|ci|migration";
  const branchPattern = new RegExp(`^(${branchTypes})/(PLN-\\d{4})-([a-z0-9]+(?:-[a-z0-9]+)*)$`);
  const branchMatch = String(meta.task_branch || "").match(branchPattern);
  const checkoutMode = meta.checkout_mode;

  if (!meta.plan_id || !meta.target_branch || !branchMatch || branchMatch[2] !== meta.plan_id) {
    diagnostics.push(planDoneDiagnostic("checkout", "New plan must declare matching plan_id, target_branch, and task_branch.", "Set plan_id to PLN-NNNN and task_branch to <type>/PLN-NNNN-<slug>."));
  }
  if (!["branch", "worktree"].includes(checkoutMode)) {
    diagnostics.push(planDoneDiagnostic("checkout", `Invalid checkout_mode "${checkoutMode ?? "missing"}".`, "Use branch or worktree."));
  }
  if (!String(meta.checkout_reason || "").trim()) {
    diagnostics.push(planDoneDiagnostic("checkout", "Plan is missing checkout_reason.", "Record why branch or worktree is required for this task."));
  }
  if (checkoutMode === "branch" && meta.checkout_path) {
    diagnostics.push(planDoneDiagnostic("checkout", "branch checkout_mode must not declare checkout_path.", "Remove checkout_path or select worktree."));
  }
  if (checkoutMode === "worktree" && !/^\.worktrees\//.test(String(meta.checkout_path || ""))) {
    diagnostics.push(planDoneDiagnostic("checkout", "worktree checkout_mode requires a .worktrees/ checkout_path.", "Record the task worktree path."));
  }

  const acceptance = sectionContent(content, "Acceptance criteria");
  const acRows = acceptance.split("\n").filter((line) => /^\|\s*AC-\d+/i.test(line));
  if (acRows.length === 0 || acRows.some((row) => !/\b\d{2}\.\d{2}\b/.test(row) || !/\b(node|npm|pnpm|git|context-cli)\b/i.test(row))) {
    diagnostics.push(planDoneDiagnostic("acceptance", "Acceptance criteria need a unit ID and concrete verification command.", "Map every AC-XX row to a unit and command."));
  }

  if (!hasResolvedBlockers(sectionContent(content, "Unknowns and blockers"))) {
    diagnostics.push(planDoneDiagnostic("blocker", "Plan has a material blocker or no resolved blocker state.", "Resolve the blocker or keep the plan draft."));
  }
  if (!sectionContent(content, "Risk and dependency register")) {
    diagnostics.push(planDoneDiagnostic("risk", "Plan is missing a risk and dependency register.", "Record concrete risks, dependencies, and mitigations."));
  }
  if (!hasDoneCheck(content)) {
    diagnostics.push(planDoneDiagnostic("done-check", "Plan done-check is incomplete.", "Check acceptance, blocker, risk, and checkout completion only after evidence is present."));
  }

  for (const unit of units) {
    if (unit.meta.task_branch !== meta.task_branch || unit.meta.checkout_mode !== checkoutMode) {
      diagnostics.push(planDoneDiagnostic("checkout", `Unit ${unit.id} does not inherit the task branch and checkout mode.`, "Align unit task_branch and checkout_mode with the master plan."));
      continue;
    }
    if (checkoutMode === "worktree" && !String(unit.meta.checkout_path || "").trim()) {
      diagnostics.push(planDoneDiagnostic("checkout", `Unit ${unit.id} is missing the recorded task worktree path.`, "Copy checkout_path from the master plan."));
    }
  }

  const parallelPairs = findParallelUnitPairs(units, graph);
  if (parallelPairs.length > 0 && checkoutMode !== "worktree") {
    diagnostics.push(planDoneDiagnostic("checkout", "Concurrent units require worktree checkout_mode.", "Use a task worktree and record the concurrent-unit merge order."));
  }

  return { applicable: true, valid: diagnostics.length === 0, diagnostics };
}

/**
 * CLI runner for plan:check command
 * @param {string} taskDirPath Path to task directory
 * @param {Record<string, any>} flags CLI options (e.g. { json: boolean })
 * @returns {Promise<number>} Exit code (0 on success, 1 on failure)
 */
export async function runPlanCheckCli(taskDirPath, flags = {}) {
  try {
    const units = await parseUnitArtifacts(taskDirPath);
    if (!units || units.length === 0) {
      if (flags.json) {
        console.log(JSON.stringify({ valid: false, error: `No unit-*.md artifacts found in ${taskDirPath}` }, null, 2));
      } else {
        console.error(`\nFAIL: No unit-*.md artifacts found in ${taskDirPath}\n`);
      }
      return 1;
    }

    const graph = buildDependencyGraph(units);
    const cycleResult = detectCycles(graph);
    const parallelPairs = findParallelUnitPairs(units, graph);
    const scopeResult = checkDisjointScopes(parallelPairs);
    const ruleResult = await validatePlanRules(units);
    const doneCheckResult = await validatePlanDoneCheck(taskDirPath, units, graph);

    const isValid = cycleResult.valid && scopeResult.valid && ruleResult.valid && doneCheckResult.valid;

    if (flags.json) {
      console.log(
        JSON.stringify(
          {
            valid: isValid,
            taskDirectory: taskDirPath,
            unitCount: units.length,
            topologicalOrder: cycleResult.sortedOrder,
            cycles: cycleResult.cycles,
            conflicts: scopeResult.conflicts,
            languageRules: {
              valid: ruleResult.valid,
              diagnostics: ruleResult.diagnostics,
              missingCount: ruleResult.missingUnits.length,
              missingUnits: ruleResult.missingUnits,
            },
            doneCheck: doneCheckResult,
          },
          null,
          2
        )
      );
      return isValid ? 0 : 1;
    }

    console.log(`\n╔════════════════════════════════════════════════════════════════╗`);
    console.log(`  CONTEXT FACTORY PLAN CHECKER`);
    console.log(`╚════════════════════════════════════════════════════════════════╝\n`);
    console.log(`Task Directory: ${taskDirPath}`);
    console.log(`Units Found:    ${units.length}`);

    if (cycleResult.valid) {
      console.log(`\nTopological Order: ${cycleResult.sortedOrder.join(" -> ")}`);
    } else {
      console.error(`\n  FAIL  Dependency cycle(s) detected:`);
      for (const cycle of cycleResult.cycles) {
        console.error(`    - Cycle: ${cycle.join(" -> ")}`);
      }
    }

    if (scopeResult.valid) {
      console.log(`Parallel Scopes:   All concurrent units declare disjoint file scopes.`);
    } else {
      console.error(`\n  FAIL  Scope overlap detected between parallel units:`);
      for (const conflict of scopeResult.conflicts) {
        console.error(`    - Unit ${conflict.unitA} and Unit ${conflict.unitB} both declare:`);
        for (const file of conflict.overlappingFiles) {
          console.error(`        * ${file}`);
        }
      }
    }

    if (ruleResult.valid) {
      console.log(`Language Rules:    All units declare valid, non-stale, stack-conforming rule bindings.`);
    } else {
      console.error(`\n  FAIL  Language rule validation failure(s):`);
      for (const diag of ruleResult.diagnostics) {
        console.error(`    - [${diag.failureClass.toUpperCase()}] Unit ${diag.unitId}: ${diag.message}`);
        console.error(`      Remediation: ${diag.remediation}`);
      }
    }

    if (!doneCheckResult.applicable) {
      console.log(`Done Check:         Legacy plan contract; prospective done-check not applicable.`);
    } else if (doneCheckResult.valid) {
      console.log(`Done Check:         Complete.`);
    } else {
      console.error(`\n  FAIL  Plan done-check failure(s):`);
      for (const diag of doneCheckResult.diagnostics) {
        console.error(`    - [${diag.failureClass.toUpperCase()}] ${diag.message}`);
        console.error(`      Remediation: ${diag.remediation}`);
      }
    }

    if (isValid) {
      console.log(`\n   PASS  Plan graph is acyclic, parallel scopes are disjoint, language rules are valid, and the done-check is complete.\n`);
      return 0;
    } else {
      console.error(`\n   FAIL  Plan check failed.\n`);
      return 1;
    }
  } catch (error) {
    if (flags.json) {
      console.log(JSON.stringify({ valid: false, error: error.message }, null, 2));
    } else {
      console.error(`\nError checking plan: ${error.message}\n`);
    }
    return 1;
  }
}
