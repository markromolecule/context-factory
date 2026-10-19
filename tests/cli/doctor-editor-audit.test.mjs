import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { auditEditorConfigurations, handleDoctorCommand } from "../../app/cli/commands/doctor.mjs";
import { generateBridge } from "../../app/cli/core/bridge-generator.mjs";

const FIXTURES_DIR = join(process.cwd(), "tests", "fixtures", "mock-doctor-host");

test("Unit 03.01: Doctor Health Audit & Auto-Repair for All Editors", async (t) => {
  await rm(FIXTURES_DIR, { recursive: true, force: true });
  await mkdir(FIXTURES_DIR, { recursive: true });

  t.after(async () => {
    await rm(FIXTURES_DIR, { recursive: true, force: true });
  });

  await t.test("auditEditorConfigurations detects missing configured editor artifacts", async () => {
    // Generate bridge with Trae, VS Code, and Cursor configured
    await generateBridge({
      target: FIXTURES_DIR,
      factoryPath: process.cwd(),
      ide: ["trae", "vscode", "cursor"],
      method: "submodule",
      dryRun: false,
    });

    // Initial audit should pass
    let audit = await auditEditorConfigurations(FIXTURES_DIR);
    assert.strictEqual(audit.passed, true);
    assert.ok(audit.healthyCount >= 3);
    assert.strictEqual(audit.missingCount, 0);

    // Intentionally delete Trae rules
    const traeRulesPath = join(FIXTURES_DIR, ".trae", "rules", "project_rules.md");
    await rm(traeRulesPath, { force: true });

    // Subsequent audit should fail specifically reporting missing Trae rules
    audit = await auditEditorConfigurations(FIXTURES_DIR);
    assert.strictEqual(audit.passed, false);
    assert.ok(audit.missingCount >= 1);
    const traeItem = audit.items.find((i) => i.ide === "trae");
    assert.ok(traeItem);
    assert.strictEqual(traeItem.status, "missing");
  });

  await t.test("doctor --repair automatically restores missing editor artifacts", async () => {
    // Target has missing Trae rules from previous test
    assert.strictEqual(existsSync(join(FIXTURES_DIR, ".trae", "rules", "project_rules.md")), false);

    // Run doctor command with repair flag
    const exitCode = await handleDoctorCommand([], { target: FIXTURES_DIR, repair: true, json: true });

    // File should now be restored
    assert.strictEqual(existsSync(join(FIXTURES_DIR, ".trae", "rules", "project_rules.md")), true);

    const recheck = await auditEditorConfigurations(FIXTURES_DIR);
    assert.strictEqual(recheck.passed, true);
    assert.strictEqual(recheck.missingCount, 0);
  });

  await t.test("doctor claims remain narrow to catalog health and editor integrity (AC-09)", async () => {
    const logs = [];
    const origLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));

    try {
      const exitCode = await handleDoctorCommand([], { target: FIXTURES_DIR, json: true });
      assert.strictEqual(exitCode, 0);
      assert.strictEqual(logs.length, 1);
      const data = JSON.parse(logs[0]);

      // Narrow claims
      assert.ok(data.checks.manifestAndLint, "manifestAndLint check present");
      assert.ok(data.checks.lockSync, "lockSync check present");
      assert.ok(data.checks.editorIntegrity, "editorIntegrity check present");
      assert.ok(data.checks.evaluations, "evaluation case check present");

      // Must not claim code conformance or host test suite PASS
      assert.strictEqual(data.checks.codeConformance, undefined, "Doctor must not claim code conformance");
      assert.strictEqual(data.checks.hostTestSuite, undefined, "Doctor must not claim host test suite execution");
    } finally {
      console.log = origLog;
    }
  });
});
