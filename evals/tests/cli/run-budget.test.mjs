import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const entries = [
  "app/cli/bin/context-cli.mjs",
  "scripts/context.mjs",
];
const request = "Explain KISS and YAGNI";

function run(entry, cap, json = true) {
  return spawnSync(process.execPath, [
    resolve(root, entry),
    "run",
    request,
    "--provider=mock",
    `--max-input-tokens=${cap}`,
    ...(json ? ["--json"] : []),
  ], { cwd: root, encoding: "utf8", timeout: 30_000 });
}

describe("PLN-0015 Unit 02.01: public run budget option", () => {
  for (const entry of entries) {
    it(`${entry} accepts a cap and reports included paths without source bodies`, () => {
      const processResult = run(entry, 12_000);
      assert.equal(processResult.status, 0, processResult.stderr || processResult.stdout);
      const result = JSON.parse(processResult.stdout);
      assert.equal(result.status, "success");
      assert.equal(result.inputBudget.capTokens, 12_000);
      assert.ok(result.inputBudget.estimatedTokens <= result.inputBudget.capTokens);
      assert.ok(result.inputBudget.includedSources.some(({ path }) => path === "knowledge/principles/kiss.md"));
      assert.ok(result.inputBudget.includedSources.some(({ path }) => path === "knowledge/principles/yagni.md"));
      assert.doesNotMatch(JSON.stringify(result.inputBudget), /Keep It Simple|You Ain't Gonna Need It/i);
    });

    it(`${entry} rejects malformed and overflowing caps`, () => {
      for (const cap of ["0", "-1", "1.5", "Infinity"]) {
        const processResult = run(entry, cap);
        assert.equal(processResult.status, 1, `${entry} accepted ${cap}: ${processResult.stdout}`);
        const result = JSON.parse(processResult.stdout);
        assert.equal(result.status, "error");
        assert.match(result.validationErrors[0], /maxInputTokens/i);
      }
      const overflow = run(entry, 1);
      assert.equal(overflow.status, 1);
      const result = JSON.parse(overflow.stdout);
      assert.equal(result.inputBudget.capTokens, 1);
      assert.deepEqual(result.inputBudget.includedSources.every(({ path, hash }) => Boolean(path && hash)), true);
    });
  }
});
