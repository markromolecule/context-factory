/**
 * Unit 05.01 — TypeScript Common/Backend Directive Migration Tests
 *
 * Validates that all rule files under rules/typescript/common/ and
 * rules/typescript/backend/ have:
 *  - A stable ruleId in frontmatter
 *  - At least one [directive:...][mode:...][verifier:...] marker
 *  - Unique directive IDs across all scoped files
 *  - Only registered mode values (automated-blocking | evidence-blocking | advisory)
 *  - Only registered verifier values (typechecker | linter | test | human-evidence | none)
 *  - No policy text removed (line-count regression guard)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = process.cwd();
const SCOPED_DIRS = [
  join(REPO_ROOT, "rules/typescript/common"),
  join(REPO_ROOT, "rules/typescript/backend"),
];

const VALID_MODES = new Set(["automated-blocking", "evidence-blocking", "advisory"]);
const VALID_VERIFIERS = new Set(["typechecker", "linter", "test", "human-evidence", "none"]);

// Minimum line counts per file (baseline before annotation)
const MIN_LINES: Record<string, number> = {
  "async-discipline.md": 30,
  "error-handling.md": 20,
  "next-react-project-structure.md": 40,
  "module-and-imports.md": 10,
  "runtime-validation.md": 10,
  "type-safety.md": 30,
  "controllers-and-routes.md": 20,
  "data-access-via-api.md": 15,
  "module-architecture.md": 35,
  "service-layer.md": 15,
};

function collectMarkdownFiles(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => join(dir, f));
}

function parseDirectives(content: string): Array<{ id: string; mode: string; verifier: string }> {
  const pattern = /\[directive:([^\]]+)\]\[mode:([^\]]+)\]\[verifier:([^\]]+)\]/g;
  const directives: Array<{ id: string; mode: string; verifier: string }> = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    directives.push({ id: match[1], mode: match[2], verifier: match[3] });
  }
  return directives;
}

describe("Unit 05.01 — TypeScript Common/Backend Migration", () => {
  const allFiles = SCOPED_DIRS.flatMap(collectMarkdownFiles);
  const allDirectives: Array<{ file: string; id: string; mode: string; verifier: string }> = [];

  describe("per-file invariants", () => {
    for (const filePath of allFiles) {
      const fileName = filePath.split("/").pop() ?? filePath;
      const content = readFileSync(filePath, "utf8");
      const directives = parseDirectives(content);

      it(`${fileName}: has at least one directive marker`, () => {
        assert.ok(
          directives.length > 0,
          `${fileName} has no [directive:...][mode:...][verifier:...] markers`
        );
      });

      it(`${fileName}: has ruleId in frontmatter`, () => {
        assert.match(
          content,
          /^ruleId:\s+\S+/m,
          `${fileName} missing ruleId field in frontmatter`
        );
      });

      it(`${fileName}: all modes are valid`, () => {
        for (const { id, mode } of directives) {
          assert.ok(
            VALID_MODES.has(mode),
            `${fileName} directive ${id} has invalid mode "${mode}"`
          );
        }
      });

      it(`${fileName}: all verifiers are valid`, () => {
        for (const { id, verifier } of directives) {
          assert.ok(
            VALID_VERIFIERS.has(verifier),
            `${fileName} directive ${id} has invalid verifier "${verifier}"`
          );
        }
      });

      it(`${fileName}: advisory directives use verifier:none`, () => {
        for (const { id, mode, verifier } of directives) {
          if (mode === "advisory") {
            assert.equal(
              verifier,
              "none",
              `${fileName} advisory directive ${id} must use verifier:none, got "${verifier}"`
            );
          }
        }
      });

      it(`${fileName}: minimum line count preserved`, () => {
        const lines = content.split("\n").length;
        const minLines = MIN_LINES[fileName] ?? 5;
        assert.ok(
          lines >= minLines,
          `${fileName} has ${lines} lines, expected at least ${minLines} (policy content check)`
        );
      });

      for (const d of directives) {
        allDirectives.push({ file: fileName, ...d });
      }
    }
  });

  describe("cross-file uniqueness", () => {
    it("all directive IDs are unique across scoped files", () => {
      const seen = new Map<string, string>();
      for (const { file, id } of allDirectives) {
        assert.ok(
          !seen.has(id),
          `Duplicate directive ID "${id}" in ${file} (first seen in ${seen.get(id)})`
        );
        seen.set(id, file);
      }
    });

    it("all directive IDs use ts. namespace prefix", () => {
      for (const { file, id } of allDirectives) {
        assert.ok(
          id.startsWith("ts."),
          `Directive "${id}" in ${file} must start with "ts." namespace prefix`
        );
      }
    });
  });
});
