import { createHash } from "node:crypto";

function computeSha256(content) {
  const hash = createHash("sha256").update(content).digest("hex");
  return `sha256:${hash}`;
}

/**
 * Pure dependency-free glob matcher for file path patterns.
 */
export function matchesGlob(filePath, pattern) {
  const normPath = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
  const normPattern = pattern.replaceAll("\\", "/").replace(/^\.\//, "");

  if (normPattern === "**/*" || normPattern === "**" || normPattern === "*") {
    return true;
  }

  // Exact match
  if (normPath === normPattern) return true;

  // Convert glob to regex
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
    const regex = new RegExp(regexStr);
    return regex.test(normPath);
  } catch {
    return false;
  }
}

function matchesAnyGlob(filePath, patterns) {
  if (!Array.isArray(patterns) || patterns.length === 0) return true;
  return patterns.some((pat) => matchesGlob(filePath, pat));
}

/**
 * Pure compiler that resolves an immutable Rule Binding Manifest from declared scope,
 * stack, workflow, descriptors, and waivers.
 */
export function compileRuleBinding({
  taskId = "adhoc",
  phase = "00",
  unit = "00",
  stack,
  workflow = "feature-delivery",
  affectedScope = [],
  descriptors = [],
  frameworksByPath = {},
  waivers = [],
  options = {}
} = {}) {
  const diagnostics = [];
  const selected = [];
  const excluded = [];
  const unsupported = [];

  // Reject ambiguous inputs for material binding
  if (!stack || typeof stack !== "string" || !stack.trim()) {
    diagnostics.push({
      level: "error",
      message: "Declared stack is required for material rule binding compilation."
    });
  }

  if (!Array.isArray(affectedScope) || affectedScope.length === 0) {
    diagnostics.push({
      level: "error",
      message: "Declared affected file scope is required for material rule binding compilation."
    });
  }

  if (diagnostics.length > 0) {
    return {
      binding: null,
      selected,
      excluded,
      unsupported,
      diagnostics
    };
  }

  const targetStack = stack.trim().toLowerCase();
  const sortedScope = [...new Set(affectedScope.map((s) => s.replaceAll("\\", "/").replace(/^\.\//, "")))].sort();

  for (const descriptor of descriptors) {
    const descStack = (descriptor.stack || "general").toLowerCase();
    const isStackMatch =
      descStack === "global" || descStack === "general" || descStack === targetStack;

    if (!isStackMatch) {
      for (const dir of descriptor.directives || []) {
        excluded.push({
          directiveId: dir.id,
          rulePath: descriptor.rulePath,
          reason: `wrong-stack: descriptor stack "${descStack}" does not match target "${targetStack}"`
        });
      }
      continue;
    }

    for (const dir of descriptor.directives || []) {
      const applicability = dir.applicability || {};

      if (applicability.frameworks?.length && !sortedScope.some((path) =>
        matchesAnyGlob(path, applicability.paths)
        && applicability.frameworks.some((framework) => frameworksByPath[path]?.includes(framework))
      )) {
        excluded.push({ directiveId: dir.id, rulePath: descriptor.rulePath,
          reason: "framework-mismatch: no matching framework in the affected package" });
        continue;
      }

      // Workflow check
      if (Array.isArray(applicability.workflows) && applicability.workflows.length > 0) {
        if (!applicability.workflows.includes(workflow)) {
          excluded.push({
            directiveId: dir.id,
            rulePath: descriptor.rulePath,
            reason: `workflow-mismatch: workflow "${workflow}" not in [${applicability.workflows.join(", ")}]`
          });
          continue;
        }
      }

      // Path scope check
      if (Array.isArray(applicability.paths) && applicability.paths.length > 0) {
        const matchesAnyPath = sortedScope.some((filePath) =>
          matchesAnyGlob(filePath, applicability.paths)
        );

        if (!matchesAnyPath) {
          excluded.push({
            directiveId: dir.id,
            rulePath: descriptor.rulePath,
            reason: `path-mismatch: touched scope does not match paths [${applicability.paths.join(", ")}]`
          });
          continue;
        }
      }

      // Directive matches
      selected.push({
        directiveId: dir.id,
        rulePath: descriptor.rulePath,
        mode: dir.mode,
        contentHash: dir.contentHash,
        statement: dir.statement,
        reason: `matched-scope: stack=${targetStack}, scope=${sortedScope.join(", ")}`
      });
    }
  }

  // Deduplicate and sort directives deterministically by ID
  const boundDirectivesMap = new Map();
  for (const item of selected) {
    if (!boundDirectivesMap.has(item.directiveId)) {
      boundDirectivesMap.set(item.directiveId, {
        id: item.directiveId,
        rulePath: item.rulePath,
        mode: item.mode,
        contentHash: item.contentHash,
        statement: item.statement
      });
    }
  }

  const sortedDirectives = Array.from(boundDirectivesMap.values()).sort((a, b) =>
    a.id.localeCompare(b.id)
  );

  // Match active waivers
  const activeWaiverIds = [];
  for (const waiver of waivers || []) {
    if (waiver && waiver.status === "active") {
      const dirMatch = sortedDirectives.some((d) => d.id === waiver.directiveId);
      if (dirMatch) {
        const scopeOverlap = (waiver.scope || []).some((wPath) =>
          sortedScope.some((s) => matchesGlob(s, wPath))
        );
        if (scopeOverlap && !activeWaiverIds.includes(waiver.id)) {
          activeWaiverIds.push(waiver.id);
        }
      }
    }
  }
  activeWaiverIds.sort();

  // Canonical binding digest calculation
  const canonicalPayload = JSON.stringify({
    taskId,
    phase,
    unit,
    stack: targetStack,
    workflow,
    affectedScope: sortedScope,
    directives: sortedDirectives,
    waivers: activeWaiverIds
  });

  const bindingHash = computeSha256(canonicalPayload);
  const hashShort = bindingHash.slice(7, 19);
  const bindingId = `binding-${taskId}-${phase}-${unit}-${hashShort}`;

  const binding = {
    id: bindingId,
    taskId,
    phase,
    unit,
    stack: targetStack,
    workflow,
    affectedScope: sortedScope,
    directives: sortedDirectives,
    waivers: activeWaiverIds,
    bindingHash,
    createdAt: new Date().toISOString()
  };

  return {
    binding,
    selected,
    excluded,
    unsupported,
    diagnostics
  };
}
