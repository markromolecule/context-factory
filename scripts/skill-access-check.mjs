import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { root } from "./context-core.mjs";

export const SKILL_ACCESS_POLICY = {
  context: { reads: ["repository evidence", "rules", "decisions", "source contracts"], writes: ["docs/context/"], exposesTo: ["grounding", "grill"] },
  grounding: { reads: ["canonical knowledge", "context specification"], writes: [], exposesTo: ["grill"] },
  grill: { reads: ["context specification", "grounding claim packets", "repository evidence", "canonical decisions"], writes: ["docs/discovery/"], exposesTo: ["plan"] },
  plan: { reads: ["docs/discovery/<feature>/brief.md"], writes: ["docs/tasks/"], exposesTo: ["plan-review"] },
  "plan-review": { reads: ["docs/tasks/"], writes: ["docs/reviews/"], exposesTo: ["execute"] },
  execute: { reads: ["docs/execution/"], writes: ["source changes", "docs/execution/"], exposesTo: [] },
};

const FORBIDDEN_POSITIVE_READS = {
  plan: ["docs/context/", "docs/discovery/<feature>/record.md"],
  "plan-review": ["docs/context/", "docs/discovery/", "docs/execution/"],
  execute: ["docs/context/", "docs/discovery/", "docs/tasks/"],
};

function accessSection(content) {
  const header = /^##\s+Access declaration\s*$/im.exec(content);
  if (!header) return null;
  const offset = header.index + header[0].length;
  const remaining = content.slice(offset);
  const nextHeader = remaining.search(/^##\s+/m);
  return { text: nextHeader >= 0 ? remaining.slice(0, nextHeader) : remaining, offset };
}

function lineNumber(content, offset) {
  return content.slice(0, offset).split("\n").length;
}

export function parseAccessDeclaration(content, sourcePath = "<memory>") {
  const section = accessSection(content);
  if (!section) {
    return { valid: false, diagnostics: [{ path: sourcePath, line: 1, message: "missing ## Access declaration" }] };
  }

  const fields = {};
  for (const field of ["Reads", "Writes", "Exposes to"]) {
    const match = section.text.match(new RegExp(`^\\s*-\\s*\\*\\*${field}:\\*\\*\\s*(.+)$`, "mi"));
    if (!match) {
      return { valid: false, diagnostics: [{ path: sourcePath, line: lineNumber(content, section.offset), message: `missing **${field}:** field` }] };
    }
    fields[field] = match[1].trim();
  }
  return { valid: true, declaration: fields, diagnostics: [] };
}

function isNegativeOrHistorical(line) {
  return /\b(do not|must not|never|forbidden|historical|previously|legacy)\b/i.test(line);
}

export function lintSkillAccess({ skill, content, path = "<memory>" }) {
  const parsed = parseAccessDeclaration(content, path);
  const diagnostics = [...parsed.diagnostics];
  if (!SKILL_ACCESS_POLICY[skill]) {
    diagnostics.push({ path, line: 1, message: `unknown lifecycle skill "${skill}"` });
    return { valid: false, diagnostics };
  }

  for (const [index, line] of content.split("\n").entries()) {
    if (isNegativeOrHistorical(line)) continue;
    for (const forbiddenPath of FORBIDDEN_POSITIVE_READS[skill] || []) {
      if (line.includes(forbiddenPath) && /\b(read|input|consume|use|load|inspect|open)\b/i.test(line)) {
        diagnostics.push({ path, line: index + 1, message: `${skill} positively reads forbidden source ${forbiddenPath}` });
      }
    }
  }
  return { valid: diagnostics.length === 0, diagnostics };
}

function skillFromPath(path) {
  const match = path.replaceAll("\\\\", "/").match(/skills\/(?:productivity|engineering)\/([^/]+)\/SKILL\.md$/);
  return match?.[1] || null;
}

export async function runSkillAccessCheckCli(targetPaths) {
  if (!targetPaths.length) {
    console.error("Error: skill:access-check requires one or more SKILL.md paths");
    return 1;
  }

  const results = [];
  for (const target of targetPaths) {
    const absolutePath = resolve(process.cwd(), target);
    const skill = skillFromPath(relative(root, absolutePath)) || skillFromPath(absolutePath);
    const path = relative(root, absolutePath);
    if (!skill) {
      results.push({ valid: false, diagnostics: [{ path, line: 1, message: "cannot infer skill name from path" }] });
      continue;
    }
    results.push(lintSkillAccess({ skill, content: await readFile(absolutePath, "utf8"), path }));
  }

  const diagnostics = results.flatMap((result) => result.diagnostics);
  if (diagnostics.length) {
    for (const diagnostic of diagnostics) console.error(`${diagnostic.path}:${diagnostic.line}: ${diagnostic.message}`);
    return 1;
  }
  console.log(`PASS: skill access declarations (${targetPaths.length} file${targetPaths.length === 1 ? "" : "s"})`);
  return 0;
}
