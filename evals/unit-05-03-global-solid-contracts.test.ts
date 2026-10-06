/**
 * Unit 05.03 — Global and SOLID Directive Migration Tests
 *
 * Validates that all rule files under rules/global/ and rules/solid/ have:
 *  - A stable ruleId in frontmatter
 *  - stack in frontmatter (global)
 *  - At least one [directive:...][mode:...][verifier:...] marker
 *  - Unique directive IDs across all scoped files
 *  - Only registered mode values (automated-blocking | evidence-blocking | advisory)
 *  - Only registered verifier values (typechecker | linter | test | human-evidence | none)
 *  - Advisory directives use verifier:none
 *  - No policy text removed (line-count regression guard)
 *  - SOLID rules have alwaysApply: false to avoid universal prompt bloat (AC-02)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = new URL("../", import.meta.url).pathname.replace(/\/$/, "");
const SCOPED_DIRS = [
  join(REPO_ROOT, "rules/global"),
  join(REPO_ROOT, "rules/solid"),
];

const VALID_MODES = new Set(["automated-blocking", "evidence-blocking", "advisory"]);
const VALID_VERIFIERS = new Set(["typechecker", "linter", "test", "human-evidence", "none"]);

// Minimum line counts per file (baseline before annotation)
const MIN_LINES: Record<string, number> = {
  "1-3-1-rule.md": 25,
  "architecture-conformance.md": 30,
  "code-quality.md": 30,
  "evidence-and-claims.md": 30,
  "git-commit.md": 50,
  "naming-conventions.md": 25,
  "security-guardrails.md": 30,
  "dependency-inversion.md": 80,
  "interface-segregation.md": 80,
  "liskov-substitution.md": 80,
  "open-closed.md": 80,
  "single-responsibility.md": 80,
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

describe("Unit 05.03 — Global and SOLID Directive Migration", () => {
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

      it(`${fileName}: has stack: global in frontmatter`, () => {
        assert.match(
          content,
          /^stack:\s+global/m,
          `${fileName} missing stack: global in frontmatter`
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

    it("all directive IDs use cf. prefix", () => {
      for (const { file, id } of allDirectives) {
        assert.ok(
          id.startsWith("cf."),
          `Directive "${id}" in ${file} must start with "cf." namespace prefix`
        );
      }
    });
  });

  describe("SOLID over-selection prevention (AC-02)", () => {
    it("all SOLID rules have alwaysApply: false", () => {
      const solidFiles = collectMarkdownFiles(join(REPO_ROOT, "rules/solid"));
      for (const f of solidFiles) {
        const content = readFileSync(f, "utf8");
        assert.match(
          content,
          /^alwaysApply:\s+false/m,
          `${f} must have alwaysApply: false to avoid universal prompt bloat`
        );
      }
    });
  });
});
