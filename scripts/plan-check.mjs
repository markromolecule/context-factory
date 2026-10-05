import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { frontmatter } from "./context-core.mjs";

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
    /(?:^|\n)\s*[-*]*\s*\*\*In scope:\*\*\s*([\s\S]*?)(?=(?:\n\s*[-*]*\s*\*\*Out of scope:\*\*|\n\s*##|$))/i
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
  // Ignore CLI flags like --help
  if (token.startsWith("-")) return false;
  // Ignore single identifier without dots or slashes (e.g. function names or keywords)
  if (!token.includes("/") && !token.includes(".")) {
    // Unless known special filenames
    return /^(Dockerfile|Makefile|LICENSE|Procfile|Gemfile)$/i.test(token);
  }
  // If it has a slash, e.g. path/to/file or .agents/skills/
  if (token.includes("/")) return true;
  // If it has a file extension (e.g. foo.js, config.json)
  return /\.[a-zA-Z0-9_-]+$/.test(token);
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
 * Checks if unit markdown content contains a non-empty <language_rules> block
 * @param {string} unitContent
 * @returns {boolean}
 */
export function hasLanguageRulesBlock(unitContent) {
  if (typeof unitContent !== "string") return false;
  const match = unitContent.match(/<language_rules>([\s\S]*?)<\/language_rules>/i);
  return Boolean(match && match[1].trim().length > 0);
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

    const isValid = cycleResult.valid && scopeResult.valid;
    const unitsMissingLanguageRules = units.filter((u) => !u.hasLanguageRules);

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
              valid: unitsMissingLanguageRules.length === 0,
              missingCount: unitsMissingLanguageRules.length,
              missingUnits: unitsMissingLanguageRules.map((u) => u.id),
            },
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

    if (unitsMissingLanguageRules.length > 0) {
      console.log(`Language Rules:    ⚠️  ${unitsMissingLanguageRules.length} unit(s) missing <language_rules> block:`);
      for (const u of unitsMissingLanguageRules) {
        console.log(`                     * Unit ${u.id} (${u.title})`);
      }
    } else {
      console.log(`Language Rules:    All units declare populated <language_rules> blocks.`);
    }

    if (isValid) {
      console.log(`\n   PASS  Plan graph is acyclic and parallel scopes are disjoint.\n`);
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
