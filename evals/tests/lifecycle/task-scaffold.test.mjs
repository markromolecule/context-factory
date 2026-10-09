import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { listTasks, scaffoldTask } from "../../../scripts/task-workflow.mjs";
import { releasePlanIdReservation, reserveNextPlanId } from "../../../scripts/plan-id-reservation.mjs";

const execFileAsync = promisify(execFile);
const contextCliPath = join(process.cwd(), "scripts/context.mjs");

describe("Evaluation Suite: Task Scaffolding & Plan Check Integration", () => {
  it("Case 1 & 2: scaffolds nested phases and starter units with one task branch", async () => {
    const res = await scaffoldTask({
      title: "Payment Processing Service",
      type: "feature",
      dryRun: true,
    });

    assert.ok(res.taskId, "taskId should be defined");
    assert.ok(res.baseBranch, "baseBranch should be defined");
    assert.match(res.taskId, /^PLN-\d{4}$/);
    assert.match(res.baseBranch, /^feat\/PLN-\d{4}-payment-processing-service$/);
    assert.match(res.planPath, /\/feat-PLN-\d{4}-payment-processing-service\.md$/);
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

    // Verify starter units inherit the one task branch.
    for (const u of res.units) {
      assert.equal(u.branch, res.baseBranch);
      assert.equal("worktree" in u, false);
    }
  });

  it("Case 3: scaffolded draft cannot pass node scripts/context.mjs plan:check", async () => {
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

      await assert.rejects(
        execFileAsync("node", [contextCliPath, "plan:check", tempDir]),
        (error) => /DONE-CHECK/i.test(String(error.stdout || "") + String(error.stderr || ""))
      );
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

  it("Case 5: lists a historical README plan and a named plan once each", async () => {
    const temporary = await mkdtemp(join(tmpdir(), "cf-task-list-"));
    try {
      await execFileAsync("git", ["init", "--quiet", temporary]);
      await execFileAsync("git", ["-C", temporary, "config", "user.email", "test@example.com"]);
      await execFileAsync("git", ["-C", temporary, "config", "user.name", "Test User"]);
      await writeFile(join(temporary, "README.md"), "fixture\n");
      await execFileAsync("git", ["-C", temporary, "add", "README.md"]);
      await execFileAsync("git", ["-C", temporary, "commit", "--quiet", "-m", "fixture"]);

      const legacyPath = join(temporary, "docs/tasks/2026/01/2026-01-01/0001-task-legacy/README.md");
      await mkdir(dirname(legacyPath), { recursive: true });
      await writeFile(legacyPath, "---\ntitle: Legacy\ntype: task\nstatus: planned\ncreated: 2026-01-01\n---\n");
      await execFileAsync("git", ["-C", temporary, "add", "."]);
      await execFileAsync("git", ["-C", temporary, "commit", "--quiet", "-m", "legacy plan"]);
      const { stdout: targetBase } = await execFileAsync("git", ["-C", temporary, "symbolic-ref", "--short", "HEAD"]);
      const preview = await scaffoldTask({ title: "Named Plan", targetDir: temporary, dryRun: true });
      await execFileAsync("git", ["-C", temporary, "switch", "-c", preview.baseBranch]);
      await scaffoldTask({ title: "Named Plan", targetDir: temporary, targetBranch: targetBase.trim() });
      const planContent = await (await import("node:fs/promises")).readFile(join(temporary, preview.planPath), "utf8");
      assert.ok(planContent.includes(`target_branch: "${targetBase.trim()}"`));
      assert.ok(planContent.includes(`| Target branch | \`${targetBase.trim()}\` |`));

      const tasks = await listTasks(temporary);
      assert.equal(tasks.length, 2);
      assert.equal(new Set(tasks.map((task) => task.path)).size, 2);
      assert.ok(tasks.some((task) => task.path.endsWith("README.md")));
      assert.ok(tasks.some((task) => /feat-PLN-\d{4}-named-plan\.md$/.test(task.path)));
    } finally {
      await rm(temporary, { recursive: true, force: true });
    }
  });

  it("Case 6: releases an unused ID when scaffolding fails", async () => {
    const temporary = await mkdtemp(join(tmpdir(), "cf-task-recovery-"));
    try {
      await execFileAsync("git", ["init", "--quiet", temporary]);
      await execFileAsync("git", ["-C", temporary, "config", "user.email", "test@example.com"]);
      await execFileAsync("git", ["-C", temporary, "config", "user.name", "Test User"]);
      await writeFile(join(temporary, "README.md"), "fixture\n");
      await execFileAsync("git", ["-C", temporary, "add", "README.md"]);
      await execFileAsync("git", ["-C", temporary, "commit", "--quiet", "-m", "fixture"]);

      const preview = await scaffoldTask({ title: "Recovery Plan", targetDir: temporary, dryRun: true });
      await mkdir(join(temporary, preview.planPath), { recursive: true });

      await assert.rejects(scaffoldTask({ title: "Recovery Plan", targetDir: temporary, targetBranch: "master" }));
      const reservation = await reserveNextPlanId({ repository: temporary });
      assert.equal(reservation.id, "PLN-0001");
      await releasePlanIdReservation({ repository: temporary, id: reservation.id, owner: reservation.owner });
    } finally {
      await rm(temporary, { recursive: true, force: true });
    }
  });
  it("Case 7: refuses wrong branch, dirty checkout, and detached HEAD before writing", async () => {
    const temporary = await mkdtemp(join(tmpdir(), "cf-task-branch-gate-"));
    try {
      await execFileAsync("git", ["init", "--quiet", temporary]);
      await execFileAsync("git", ["-C", temporary, "config", "user.email", "test@example.com"]);
      await execFileAsync("git", ["-C", temporary, "config", "user.name", "Test User"]);
      await writeFile(join(temporary, "README.md"), "fixture\n");
      await execFileAsync("git", ["-C", temporary, "add", "README.md"]);
      await execFileAsync("git", ["-C", temporary, "commit", "--quiet", "-m", "fixture"]);
      const { stdout: targetBase } = await execFileAsync("git", ["-C", temporary, "symbolic-ref", "--short", "HEAD"]);
      const base = targetBase.trim();
      const preview = await scaffoldTask({ title: "Branch Gate", targetDir: temporary, dryRun: true });
      await assert.rejects(scaffoldTask({ title: "Branch Gate", targetDir: temporary, targetBranch: base }), /Expected task branch/);
      await execFileAsync("git", ["-C", temporary, "switch", "-c", preview.baseBranch]);
      await writeFile(join(temporary, "dirty.txt"), "keep me\n");
      await assert.rejects(scaffoldTask({ title: "Branch Gate", targetDir: temporary, targetBranch: base }), /uncommitted changes/);
      await rm(join(temporary, "dirty.txt"));
      await execFileAsync("git", ["-C", temporary, "switch", "--detach", "HEAD"]);
      await assert.rejects(scaffoldTask({ title: "Branch Gate", targetDir: temporary, targetBranch: base }));
    } finally {
      await rm(temporary, { recursive: true, force: true });
    }
  });
});
