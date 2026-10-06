import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import {
  generateBridge,
  buildSharedEnforcementDirectives,
} from "../app/cli/core/bridge-generator.mjs";
import {
  auditEditorConfigurations,
  auditEnforcementCapabilities,
  inspectBridgeFileContent,
  handleDoctorCommand,
} from "../app/cli/commands/doctor.mjs";

const FIXTURES_DIR = join(process.cwd(), "tests", "fixtures", "mock-bridge-conformance-host");

test("Unit 04.02: Cross-Editor Bridge and Doctor Conformance Parity (AC-09, SC-07)", async (t) => {
  await rm(FIXTURES_DIR, { recursive: true, force: true });
  await mkdir(FIXTURES_DIR, { recursive: true });

  t.after(async () => {
    await rm(FIXTURES_DIR, { recursive: true, force: true });
  });

  await t.test("buildSharedEnforcementDirectives produces consistent authoritative policy across formats", () => {
    const numbered = buildSharedEnforcementDirectives({
      normalizedFactoryPath: ".context-factory",
      scriptPrefix: "node .context-factory/scripts/context.mjs",
      cliPrefix: "node .context-factory/app/cli/bin/context-cli.mjs",
      format: "numbered",
    });
    assert.match(numbered, /1\. \*\*Shared Contract:\*\*/);
    assert.match(numbered, /\.context-factory\/orchestrator\/SHARED\.md/);
    assert.match(numbered, /node \.context-factory\/scripts\/context\.mjs resolve/);
    assert.match(numbered, /node \.context-factory\/app\/cli\/bin\/context-cli\.mjs preflight/);
    assert.match(numbered, /node \.context-factory\/app\/cli\/bin\/context-cli\.mjs conform/);
    assert.match(numbered, /FAIL or BLOCKED status/);
    assert.match(numbered, /LLM self-attestation is strictly prohibited/);

    const bullet = buildSharedEnforcementDirectives({
      normalizedFactoryPath: ".",
      scriptPrefix: "node scripts/context.mjs",
      cliPrefix: "node app/cli/bin/context-cli.mjs",
      format: "bullet",
    });
    assert.match(bullet, /- \*\*Shared Contract:\*\*/);
    assert.match(bullet, /- \*\*Preflight Verification:\*\*/);
    assert.match(bullet, /- \*\*Authoritative Conformance:\*\*/);
    assert.match(bullet, /- \*\*Fail-Closed Gate:\*\*/);

    const table = buildSharedEnforcementDirectives({
      normalizedFactoryPath: ".",
      format: "table",
    });
    assert.match(table, /\|\s*`\/resolve`\s*\|/);
    assert.match(table, /\|\s*`\/preflight`\s*\|/);
    assert.match(table, /\|\s*`\/conform`\s*\|/);
    assert.match(table, /\|\s*`\/doctor`\s*\|/);
  });

  await t.test("inspectBridgeFileContent validates required authoritative gates and detects omissions", () => {
    const validContent = `
# Editor Instructions
- Shared: .context-factory/orchestrator/SHARED.md
- Run resolve: node scripts/context.mjs resolve "<prompt>"
- Run preflight: context-cli preflight "<prompt>"
- Run conform: context-cli conform "<prompt>"
- Fail closed on FAIL or BLOCKED; no self-attestation
`;
    const validInspection = inspectBridgeFileContent(validContent);
    assert.strictEqual(validInspection.valid, true);
    assert.strictEqual(validInspection.missingGates.length, 0);

    const weakenedContent = `
# Legacy Editor Instructions
- Run resolve: node scripts/context.mjs resolve "<prompt>"
`;
    const weakenedInspection = inspectBridgeFileContent(weakenedContent);
    assert.strictEqual(weakenedInspection.valid, false);
    assert.ok(weakenedInspection.missingGates.includes("shared-contract (SHARED.md)"));
    assert.ok(weakenedInspection.missingGates.includes("preflight command"));
    assert.ok(weakenedInspection.missingGates.includes("conform command"));
    assert.ok(weakenedInspection.missingGates.includes("fail-closed gate"));
  });

  await t.test("generates all 8 supported editor profiles with complete authoritative gates (AC-09)", async () => {
    const allIdesHost = join(FIXTURES_DIR, "all-ides-host");
    await mkdir(allIdesHost, { recursive: true });

    await generateBridge({
      target: allIdesHost,
      factoryPath: process.cwd(),
      ide: ["all"],
      method: "submodule",
      dryRun: false,
    });

    const expectedProfiles = [
      { file: "AGENTS.md", ide: "universal" },
      { file: "GEMINI.md", ide: "antigravity" },
      { file: "CLAUDE.md", ide: "claude" },
      { file: "CODEX.md", ide: "codex" },
      { file: ".cursorrules", ide: "cursor" },
      { file: join(".cursor", "rules", "context-factory.mdc"), ide: "cursor" },
      { file: ".windsurfrules", ide: "windsurf" },
      { file: join(".trae", "rules", "project_rules.md"), ide: "trae" },
      { file: join(".github", "copilot-instructions.md"), ide: "vscode" },
    ];

    for (const profile of expectedProfiles) {
      const fullPath = join(allIdesHost, profile.file);
      assert.strictEqual(existsSync(fullPath), true, `Profile ${profile.file} must be generated`);
      const content = await readFile(fullPath, "utf8");

      assert.match(content, /SHARED\.md/, `${profile.file} must reference SHARED.md`);
      assert.match(content, /resolve/, `${profile.file} must require context resolution`);
      assert.match(content, /preflight/, `${profile.file} must require preflight verification`);
      assert.match(content, /conform/, `${profile.file} must require conformance evaluation`);
      assert.match(content, /fail|FAIL|BLOCKED|self-attestation/i, `${profile.file} must declare fail-closed policy`);

      const inspection = inspectBridgeFileContent(content);
      assert.strictEqual(inspection.valid, true, `${profile.file} must satisfy gate inspection`);
    }

    const audit = await auditEditorConfigurations(allIdesHost);
    assert.strictEqual(audit.passed, true);
    assert.strictEqual(audit.brokenCount, 0);
    assert.strictEqual(audit.missingCount, 0);
    assert.ok(audit.healthyCount >= 8);
  });

  await t.test("doctor audit rejects editor profile with weakened or missing gates", async () => {
    const weakenedHost = join(FIXTURES_DIR, "weakened-host");
    await mkdir(weakenedHost, { recursive: true });

    await generateBridge({
      target: weakenedHost,
      factoryPath: process.cwd(),
      ide: ["claude", "trae", "vscode"],
      method: "submodule",
      dryRun: false,
    });

    let initialAudit = await auditEditorConfigurations(weakenedHost);
    assert.strictEqual(initialAudit.passed, true);

    // Intentionally strip preflight and conform commands from CLAUDE.md
    const claudePath = join(weakenedHost, "CLAUDE.md");
    const originalClaude = await readFile(claudePath, "utf8");
    const weakenedClaude = originalClaude
      .replace(/.*preflight.*/g, "")
      .replace(/.*conform.*/g, "");
    await writeFile(claudePath, weakenedClaude, "utf8");

    const auditAfterWeakening = await auditEditorConfigurations(weakenedHost);
    assert.strictEqual(auditAfterWeakening.passed, false);
    assert.ok(auditAfterWeakening.brokenCount >= 1);

    const claudeItem = auditAfterWeakening.items.find((i) => i.name === "CLAUDE.md");
    assert.ok(claudeItem);
    assert.match(claudeItem.status, /weakened contract/);
    assert.match(claudeItem.status, /preflight/);
    assert.match(claudeItem.status, /conform/);
  });

  await t.test("doctor reports enforcement capabilities separately from instruction file existence", async () => {
    const capabilities = await auditEnforcementCapabilities();
    assert.ok(capabilities);
    assert.ok(Array.isArray(capabilities.adapters));
    assert.ok(capabilities.adapters.some((a) => a.stack === "typescript" && a.status === "ready"));
    assert.ok(capabilities.adapters.some((a) => a.stack === "laravel" && a.status === "ready"));
    assert.ok(capabilities.supportedStacks.includes("typescript"));
    assert.ok(capabilities.supportedStacks.includes("laravel"));
    assert.ok(capabilities.unsupportedStacks.includes("flutter"));
    assert.strictEqual(capabilities.fullyEnforcedFromFilesAlone, false);
    assert.strictEqual(capabilities.instructionOnlyProfiles, true);

    const audit = await auditEditorConfigurations(FIXTURES_DIR);
    assert.strictEqual(audit.fullyEnforcedFromFilesAlone, false);
    assert.ok(audit.enforcementSummary.includes("procedural guidance only"));
  });

  await t.test("doctor CLI output displays enforcement capabilities and differentiates stack support", async () => {
    const testHost = join(FIXTURES_DIR, "all-ides-host");
    let capturedJson = null;

    const originalLog = console.log;
    try {
      console.log = (output) => {
        try {
          const parsed = JSON.parse(output);
          if (parsed && parsed.checks) capturedJson = parsed;
        } catch {}
      };

      await handleDoctorCommand([], { target: testHost, json: true });
    } finally {
      console.log = originalLog;
    }

    assert.ok(capturedJson, "Doctor JSON output must be produced");
    assert.strictEqual(capturedJson.checks.editorIntegrity.fullyEnforcedFromFilesAlone, false);
    assert.ok(capturedJson.checks.enforcementCapabilities);
    assert.deepStrictEqual(capturedJson.checks.enforcementCapabilities.supportedStacks, ["typescript", "laravel"]);
    assert.ok(capturedJson.checks.enforcementCapabilities.unsupportedStacks.includes("flutter"));
    assert.strictEqual(capturedJson.checks.enforcementCapabilities.enforcementMode, "repository-cli");
  });
});
