import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

// Package evidence outranks words in the task. Next.js also uses React rules.
export async function discoverFrameworkScope({ hostDir, scope = [], request = "" }) {
  const root = resolve(hostDir || process.cwd());
  const cache = new Map();
  const fromRequest = [
    [/\breact\b/i, "react"], [/\bnext(?:\.js|js)?\b/i, "nextjs"],
    [/\bsolid(?:\.js|js)\b/i, "solidjs"], [/\bastro\b/i, "astro"],
  ].filter(([pattern]) => pattern.test(request)).map(([, name]) => name);
  if (fromRequest.includes("nextjs")) fromRequest.push("react");

  async function forDirectory(directory) {
    if (cache.has(directory)) return cache.get(directory);
    let result;
    try {
      const pkg = JSON.parse(await readFile(resolve(directory, "package.json"), "utf8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
      result = [];
      if (deps.react || deps.next) result.push("react");
      if (deps.next) result.push("nextjs");
      if (deps["solid-js"]) result.push("solidjs");
      if (deps.astro) result.push("astro");
      // A package with no framework does not inherit a sibling/root framework.
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      result = directory === root ? [] : await forDirectory(dirname(directory));
    }
    cache.set(directory, result);
    return result;
  }

  const byPath = {};
  for (const path of scope.length ? scope : [""]) {
    const normalized = path.replaceAll("\\", "/").replace(/^\.\//, "");
    const target = resolve(root, normalized);
    const rel = relative(root, target);
    if (rel === ".." || rel.startsWith("../") || isAbsolute(rel)) {
      throw new Error(`Security violation: unsafe path "${path}" outside host repository.`);
    }
    const installed = await forDirectory(path ? dirname(target) : root);
    byPath[normalized] = [...new Set(installed.length || hostDir ? installed : fromRequest)].sort();
  }
  return { byPath, frameworks: [...new Set(Object.values(byPath).flat())].sort() };
}
