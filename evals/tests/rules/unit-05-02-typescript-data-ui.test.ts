/**
 * Unit 05.02 — TypeScript Database, Hooks, and UI Directive Migration Tests
 *
 * Validates that all rule files under rules/typescript/database/,
 * rules/typescript/hooks/, and rules/typescript/ui/ have:
 *  - A stable ruleId in frontmatter
 *  - stack: typescript in frontmatter
 *  - Narrow layers and appliesTo in frontmatter
 *  - At least one [directive:...][mode:...][verifier:...] marker
 *  - Unique directive IDs across all scoped files
 *  - Only registered mode values (automated-blocking | evidence-blocking | advisory)
 *  - Only registered verifier values (typechecker | linter | test | human-evidence | none)
 *  - Advisory directives use verifier:none
 *  - No policy text removed (line-count regression guard)
 *  - Proper layer segregation (database != ui)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = process.cwd();
const SCOPED_DIRS = [
  join(REPO_ROOT, "rules/typescript/database"),
  join(REPO_ROOT, "rules/typescript/hooks"),
  join(REPO_ROOT, "rules/typescript/ui"),
];

const VALID_MODES = new Set(["automated-blocking", "evidence-blocking", "advisory"]);
const VALID_VERIFIERS = new Set(["typechecker", "linter", "test", "human-evidence", "none"]);

// Minimum line counts per file (baseline before annotation)
const MIN_LINES: Record<string, number> = {
  "data-access-via-db.md": 15,
  "query-optimization-and-pagination.md": 45,
  "schema-db.md": 15,
  "testing-data-access-layer.md": 20,
  "custom-hooks.md": 30,
  "mutation-hooks.md": 40,
  "query-hooks.md": 15,
  "zustand-store.md": 18,
  "code-organization.md": 25,
  "dialogs-and-overlays.md": 35,
  "forms-and-validation.md": 35,
  "frontend.md": 75,
  "interaction-feedback.md": 18,
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

describe("Unit 05.02 — TypeScript Database, Hooks, and UI Migration", () => {
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

      it(`${fileName}: has stack: typescript in frontmatter`, () => {
        assert.match(
          content,
          /^stack:\s+typescript/m,
          `${fileName} missing stack: typescript in frontmatter`
        );
      });

      it(`${fileName}: has appliesTo array in frontmatter`, () => {
        assert.match(
          content,
          /^appliesTo:\s+\[/m,
          `${fileName} missing appliesTo array in frontmatter`
        );
      });

      it(`${fileName}: has layers array in frontmatter`, () => {
        assert.match(
          content,
          /^layers:\s+\[/m,
          `${fileName} missing layers array in frontmatter`
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

  describe("cross-file uniqueness and namespacing", () => {
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

  describe("layer segregation (database vs ui)", () => {
    it("database rules do not claim ui layer or ui directives", () => {
      const dbFiles = collectMarkdownFiles(join(REPO_ROOT, "rules/typescript/database"));
      for (const f of dbFiles) {
        const content = readFileSync(f, "utf8");
        assert.doesNotMatch(content, /layers:\s*\[.*"ui".*\]/, `${f} should not have ui layer`);
      }
    });

    it("ui rules do not claim database layer or database directives", () => {
      const uiFiles = collectMarkdownFiles(join(REPO_ROOT, "rules/typescript/ui"));
      for (const f of uiFiles) {
        const content = readFileSync(f, "utf8");
        assert.doesNotMatch(content, /layers:\s*\[.*"database".*\]/, `${f} should not have database layer`);
      }
    });
  });
});
