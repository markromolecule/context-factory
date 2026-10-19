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
    const packagePath = resolve(directory, "package.json");
    try {
      const pkg = JSON.parse(await readFile(packagePath, "utf8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
      const frameworks = [];
      if (deps.react || deps.next) frameworks.push("react");
      if (deps.next) frameworks.push("nextjs");
      if (deps["solid-js"]) frameworks.push("solidjs");
      if (deps.astro) frameworks.push("astro");
      // A package with no framework does not inherit a sibling/root framework.
      result = { frameworks, packagePath: relative(root, packagePath).replaceAll("\\", "/") };
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      result = directory === root
        ? { frameworks: [], packagePath: null }
        : await forDirectory(dirname(directory));
    }
    cache.set(directory, result);
    return result;
  }

  const byPath = {};
  const packageByPath = {};
  const sourceByPath = {};
  for (const path of scope.length ? scope : [""]) {
    const normalized = path.replaceAll("\\", "/").replace(/^\.\//, "");
    const target = resolve(root, normalized);
    const rel = relative(root, target);
    if (rel === ".." || rel.startsWith("../") || isAbsolute(rel)) {
      throw new Error(`Security violation: unsafe path "${path}" outside host repository.`);
    }
    const installed = await forDirectory(path ? dirname(target) : root);
    // Without an affected path, the root package may not be the eventual owner.
    // Prompt hints remain provisional until a material scope identifies one.
    const useRequestHint = scope.length === 0 && installed.frameworks.length === 0 && fromRequest.length > 0;
    byPath[normalized] = [...new Set(
      useRequestHint ? fromRequest : installed.frameworks
    )].sort();
    packageByPath[normalized] = installed.packagePath;
    sourceByPath[normalized] = useRequestHint ? "request-hint" : installed.packagePath ? "package" : "none";
  }
  return { byPath, packageByPath, sourceByPath, frameworks: [...new Set(Object.values(byPath).flat())].sort() };
}
