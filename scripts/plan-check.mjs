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
 * Recursively locates all unit-*.md files in a task directory and parses frontmatter
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
          units.push({
            id: String(id),
            title: meta.title || id,
            path: unitFilePath,
            content,
            meta,
            dependsOn: dependsOn.map(String),
          });
        }
      }
    } else if (entry.isFile() && /^unit-.*\.md$/.test(entry.name)) {
      const content = await readFile(fullPath, "utf8");
      const meta = frontmatter(content) || {};
      const id = meta.unit || entry.name.replace(/\.md$/, "");
      const dependsOn = Array.isArray(meta.depends_on) ? meta.depends_on : [];
      units.push({
        id: String(id),
        title: meta.title || id,
        path: fullPath,
        content,
        meta,
        dependsOn: dependsOn.map(String),
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
