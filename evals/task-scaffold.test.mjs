import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { scaffoldTask } from "../scripts/task-workflow.mjs";

const execFileAsync = promisify(execFile);
const contextCliPath = join(process.cwd(), "scripts/context.mjs");

describe("Evaluation Suite: Task Scaffolding & Plan Check Integration", () => {
  it("Case 1 & 2: scaffolds nested phases and starter units with resolved branch and worktree metadata", async () => {
    const res = await scaffoldTask({
      title: "Payment Processing Service",
      type: "feature",
      dryRun: true,
    });

    assert.ok(res.taskId, "taskId should be defined");
    assert.ok(res.baseBranch, "baseBranch should be defined");
    assert.equal(res.units.length, 4, "Should scaffold 4 starter units for feature type");

    // Verify all rendered files contain zero unparsed template tokens
    for (const file of res.renderedFiles) {
      const unparsed = file.content.match(/\{\{[^}]+\}\}/g);
      assert.equal(
        unparsed,
        null,
        `File ${file.path} contains unparsed tokens: ${unparsed?.join(", ")}`
      );
    }

    // Verify starter unit branch and worktree format
    for (const u of res.units) {
      assert.match(u.branch, /^task\/\d{4}\/phase-\d{2}\/unit-01-[a-z0-9-]+$/);
      assert.match(u.worktree, /^\.worktrees\/\d{4}\/phase-\d{2}\/unit-01-[a-z0-9-]+$/);
    }
  });

  it("Case 3: scaffolded task passes node scripts/context.mjs plan:check out-of-the-box", async () => {
    const res = await scaffoldTask({
      title: "Order Fulfillment Service",
      type: "feature",
      dryRun: true,
    });

    const tempDir = await mkdtemp(join(tmpdir(), "cf-scaffold-check-"));

    try {
      // Write rendered files into temp directory matching task relative structure
      for (const file of res.renderedFiles) {
        const relPath = file.path.replace(new RegExp(`^${res.taskDirectory}/?`), "");
        const destPath = join(tempDir, relPath);
        await mkdir(dirname(destPath), { recursive: true });
        await writeFile(destPath, file.content, "utf8");
      }

      const { stdout } = await execFileAsync("node", [contextCliPath, "plan:check", tempDir]);
      assert.match(stdout, /PASS/i, "plan:check should output PASS");
      assert.doesNotMatch(stdout, /FAIL|cycle detected/i, "plan:check should not detect cycles");
      assert.match(stdout, /Units Found:\s+4/, "plan:check should find all 4 units in nested phases");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("Case 4: CLI flags --dry-run, --no-units, and --json execute reliably", async () => {
    // Test with units (default)
    const { stdout: withUnitsOut } = await execFileAsync("node", [
      contextCliPath,
      "task:new",
      "Telemetry Integration",
      "--dry-run",
      "--json",
    ]);
    const withUnitsJson = JSON.parse(withUnitsOut);
    assert.equal(withUnitsJson.dryRun, true);
    assert.equal(withUnitsJson.units.length, 4);
    assert.ok(withUnitsJson.baseBranch.includes("telemetry-integration"));

    // Test with --no-units
    const { stdout: noUnitsOut } = await execFileAsync("node", [
      contextCliPath,
      "task:new",
      "Telemetry Integration",
      "--dry-run",
      "--no-units",
      "--json",
    ]);
    const noUnitsJson = JSON.parse(noUnitsOut);
    assert.equal(noUnitsJson.dryRun, true);
    assert.equal(noUnitsJson.units.length, 0);
    const unitFiles = noUnitsJson.files.filter((f) => f.includes("/unit-"));
    assert.equal(unitFiles.length, 0);
  });
});
