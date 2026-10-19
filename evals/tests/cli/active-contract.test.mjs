import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const activeFiles = [
  "orchestrator/SHARED.md",
  "docs/templates/Task.md",
  "docs/templates/Unit.md",
  "skills/productivity/plan/SKILL.md",
  "skills/productivity/plan-review/SKILL.md",
  "skills/engineering/execute/SKILL.md",
];

function deadRuntimeCommands(content) {
  return content.match(/(?:context-cli|context\.mjs)\s+conform\b|run preflight and conformance|Conformance Gate:|Conformance report passes/gi) || [];
}

describe("active execution contract", () => {
  it("rejects dead runtime conformance commands in active guidance", async () => {
    for (const path of activeFiles) {
      const content = await readFile(path, "utf8");
      assert.deepEqual(deadRuntimeCommands(content), [], `${path} still instructs a missing runtime command`);
    }
  });

  it("records and indexes the superseding host-check decision", async () => {
    const decision = await readFile("docs/decisions/0041-runtime-conformance-removal-and-host-checks.md", "utf8");
    const index = await readFile("docs/decisions/README.md", "utf8");
    assert.match(decision, /status: accepted/);
    assert.match(decision, /supersedes:[\s\S]*0029[\s\S]*0035/);
    assert.match(decision, /lint[\s\S]*typecheck[\s\S]*test[\s\S]*build/i);
    assert.match(decision, /unconfigured/i);
    assert.match(decision, /human evidence/i);
    assert.match(index, /0041-runtime-conformance-removal-and-host-checks/);
  });

  it("detects a dead command in a negative guidance fixture", () => {
    assert.deepEqual(deadRuntimeCommands("Run context-cli conform --scope src/a.ts"), ["context-cli conform"]);
  });
});
