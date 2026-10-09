import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";

const VALID_MODES = new Set([
  "automated-blocking",
  "evidence-blocking",
  "advisory",
  "unsupported"
]);

const VALID_VERIFIER_TYPES = new Set([
  "linter",
  "typechecker",
  "test",
  "ast",
  "human-evidence",
  "none"
]);

function computeSha256(content) {
  const hash = createHash("sha256").update(content).digest("hex");
  return `sha256:${hash}`;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, body: markdown };

  const rawMeta = match[1];
  const body = markdown.slice(match[0].length);
  const meta = {};

  for (const line of rawMeta.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    const val = trimmed.slice(colonIdx + 1).trim();

    // Parse array if [ ... ]
    if (val.startsWith("[") && val.endsWith("]")) {
      const inner = val.slice(1, -1).trim();
      meta[key] = inner
        ? inner.split(",").map((item) => item.trim().replace(/^["']|["']$/g, ""))
        : [];
    } else if (val.startsWith('"') && val.endsWith('"')) {
      meta[key] = val.slice(1, -1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      meta[key] = val.slice(1, -1);
    } else if (val === "true") {
      meta[key] = true;
    } else if (val === "false") {
      meta[key] = false;
    } else if (/^\d+$/.test(val)) {
      meta[key] = parseInt(val, 10);
    } else {
      meta[key] = val;
    }
  }

  return { meta, body };
}

function inferStack(rulePath, frontmatterStack) {
  if (frontmatterStack && typeof frontmatterStack === "string") {
    const s = frontmatterStack.toLowerCase();
    if (["typescript", "global", "common", "solid", "flutter", "general"].includes(s)) {
      return s;
    }
  }
  const normalized = rulePath.replaceAll("\\", "/").toLowerCase();
  if (normalized.includes("/typescript/")) return "typescript";
  if (normalized.includes("/solid/")) return "solid";
  if (normalized.includes("/global/")) return "global";
  if (normalized.includes("/flutter/")) return "flutter";
  return "general";
}

function extractH1Title(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Pure parsing API for a single rule Markdown string.
 * Extracts versioned directive descriptors, diagnostics, and unsupported statements.
 */
export function parseRuleDescriptor(markdownContent, rulePath, options = {}) {
  const diagnostics = [];
  const unsupported = [];
  const directives = [];
  const seenDirectiveIds = new Set();

  const sourceHash = computeSha256(markdownContent);
  const { meta, body } = parseFrontmatter(markdownContent);

  const stack = inferStack(rulePath, meta.stack);
  const defaultRuleId = meta.ruleId || `cf-rule-${meta.name || basename(rulePath, extname(rulePath))}`;
  const title = meta.title || extractH1Title(markdownContent) || meta.name || basename(rulePath, extname(rulePath));
  const description = meta.description || `${title} conformance rules`;

  const lines = markdownContent.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    let tagsRaw = null;
    let statement = null;

    if (trimmed.startsWith("- ")) {
      const bulletContent = trimmed.slice(2).trim();
      const tagMatch = bulletContent.match(/^((?:\[[a-z]+:[^\]]+\])+)\s*(.*)$/);
      if (tagMatch) {
        tagsRaw = tagMatch[1];
        statement = tagMatch[2].trim();
      } else {
        if (bulletContent.length > 0) {
          unsupported.push({
            line: lineNum,
            statement: bulletContent,
            reason: "Unmarked directive guidance"
          });
        }
        continue;
      }
    } else if (trimmed.startsWith("|") && trimmed.includes("[directive:")) {
      const cells = trimmed.split("|").map((c) => c.trim()).filter(Boolean);
      const directiveCell = cells.find((c) => c.includes("[directive:"));
      if (directiveCell) {
        const tagMatch = directiveCell.match(/((?:\[[a-z]+:[^\]]+\])+)\s*(.*)$/);
        if (tagMatch) {
          tagsRaw = tagMatch[1];
          statement = tagMatch[2].trim();
        }
      }
    }

    if (!tagsRaw) continue;

    const tags = {};
    const regex = /\[([a-z]+):([^\]]+)\]/g;
    let match;
    while ((match = regex.exec(tagsRaw)) !== null) {
      tags[match[1]] = match[2].trim();
    }

    if (!tags.directive) {
      unsupported.push({
        line: lineNum,
        statement: statement || bulletContent,
        reason: "Missing directive ID tag"
      });
      continue;
    }

    const directiveId = tags.directive;

    if (!statement) {
      diagnostics.push({
        level: "error",
        line: lineNum,
        message: `Directive "${directiveId}" has an empty statement.`
      });
      continue;
    }

    if (seenDirectiveIds.has(directiveId)) {
      diagnostics.push({
        level: "error",
        line: lineNum,
        message: `Duplicate directive ID "${directiveId}" found at line ${lineNum}.`
      });
      continue;
    }
    seenDirectiveIds.add(directiveId);

    const mode = tags.mode || (tags.verifier === "human-evidence" ? "evidence-blocking" : "automated-blocking");
    if (!VALID_MODES.has(mode)) {
      diagnostics.push({
        level: "error",
        line: lineNum,
        message: `Invalid directive mode "${mode}" for "${directiveId}". Must be one of: ${[...VALID_MODES].join(", ")}.`
      });
      continue;
    }

    const verifierType = tags.verifier || "none";
    if (!VALID_VERIFIER_TYPES.has(verifierType)) {
      diagnostics.push({
        level: "error",
        line: lineNum,
        message: `Invalid verifier type "${verifierType}" for "${directiveId}". Must be one of: ${[...VALID_VERIFIER_TYPES].join(", ")}.`
      });
      continue;
    }

    // Derive concise title from first sentence or statement
    const firstSentence = statement.split(/(?<=[.?!])\s+/)[0] || statement;
    const directiveTitle = tags.title || (firstSentence.length > 70 ? firstSentence.slice(0, 67) + "..." : firstSentence);

    const contentHash = computeSha256(statement);

    const directive = {
      id: directiveId,
      title: directiveTitle,
      mode,
      statement,
      contentHash,
      verifier: {
        type: verifierType
      }
    };

    if (tags.command) {
      directive.verifier.command = tags.command;
    }

    // Applicability mapping from rule metadata or defaults
    const applicability = {};
    if (Array.isArray(meta.frameworks) && meta.frameworks.length > 0) {
      applicability.frameworks = meta.frameworks;
    }
    if (Array.isArray(meta.appliesTo) && meta.appliesTo.length > 0) {
      applicability.paths = meta.appliesTo;
    }
    if (Array.isArray(meta.layers) && meta.layers.length > 0) {
      applicability.layers = meta.layers;
    }
    if (Array.isArray(meta.workflows) && meta.workflows.length > 0) {
      applicability.workflows = meta.workflows;
    }

    if (Object.keys(applicability).length > 0) {
      directive.applicability = applicability;
    }

    directives.push(directive);
  }

  const descriptor = {
    id: defaultRuleId,
    rulePath: rulePath.replaceAll("\\", "/"),
    title,
    stack,
    description,
    sourceHash,
    version: meta.version || 1,
    directives
  };

  return {
    descriptor,
    diagnostics,
    unsupported
  };
}

/**
 * Pure parsing API for the rules catalog directory.
 */
export async function parseRuleCatalog(rulesDir, options = {}) {
  const descriptors = [];
  const catalogDiagnostics = [];
  let totalRules = 0;
  let migratedRules = 0;
  let totalDirectives = 0;
  let unsupportedCount = 0;

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        // Skip README or index MOCs if appropriate
        if (entry.name === "README.md") continue;

        totalRules++;
        const content = await readFile(fullPath, "utf8");
        const relPath = relative(rulesDir, fullPath).replaceAll("\\", "/");
        const prefixedPath = `rules/${relPath}`;

        const result = parseRuleDescriptor(content, prefixedPath, options);
        descriptors.push(result.descriptor);

        if (result.diagnostics.length > 0) {
          catalogDiagnostics.push({ rulePath: prefixedPath, diagnostics: result.diagnostics });
        }

        if (result.descriptor.directives.length > 0) {
          migratedRules++;
          totalDirectives += result.descriptor.directives.length;
        }

        unsupportedCount += result.unsupported.length;
      }
    }
  }

  await walk(rulesDir);

  return {
    descriptors,
    catalogDiagnostics,
    coverage: {
      totalRules,
      migratedRules,
      totalDirectives,
      unsupportedCount
    }
  };
}
