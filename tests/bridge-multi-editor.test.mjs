import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import {
  generateBridge,
  mergeJsonFile,
  detectSubmoduleContext,
  checkHostSubmoduleStatus,
} from "../app/cli/core/bridge-generator.mjs";
import {
  auditEditorConfigurations,
  handleDoctorCommand,
} from "../app/cli/commands/doctor.mjs";

const FIXTURES_DIR = join(process.cwd(), "tests", "fixtures", "mock-multi-editor-host");

test("Unit 03.02: Automated Integration Evaluations for Multi-Editor Bridging", async (t) => {
  await rm(FIXTURES_DIR, { recursive: true, force: true });
  await mkdir(FIXTURES_DIR, { recursive: true });

  t.after(async () => {
    await rm(FIXTURES_DIR, { recursive: true, force: true });
  });

  await t.test("multi-editor bridge scaffolds Trae, VS Code, Cursor, and Antigravity artifacts simultaneously", async () => {
    const result = await generateBridge({
      target: FIXTURES_DIR,
      factoryPath: process.cwd(),
      ide: ["vscode", "trae", "cursor", "antigravity"],
      method: "submodule",
      dryRun: false,
    });

    assert.ok(result);
    assert.strictEqual(result.targetDir, FIXTURES_DIR);

    // 1. Universal Contract
    const agentsMdPath = join(FIXTURES_DIR, "AGENTS.md");
    assert.strictEqual(existsSync(agentsMdPath), true);
    const agentsMdContent = await readFile(agentsMdPath, "utf8");
    assert.match(agentsMdContent, /Context Factory/);
    assert.match(agentsMdContent, /SHARED\.md/);

    // 2. Trae IDE Rules
    const traeRulesPath = join(FIXTURES_DIR, ".trae", "rules", "project_rules.md");
    assert.strictEqual(existsSync(traeRulesPath), true);
    const traeContent = await readFile(traeRulesPath, "utf8");
    assert.match(traeContent, /Trae Project Rules/);
    assert.match(traeContent, /SHARED\.md/);

    // 3. VS Code / Copilot
    const copilotPath = join(FIXTURES_DIR, ".github", "copilot-instructions.md");
    assert.strictEqual(existsSync(copilotPath), true);
    const copilotContent = await readFile(copilotPath, "utf8");
    assert.match(copilotContent, /GitHub Copilot Instructions/);

    const extensionsPath = join(FIXTURES_DIR, ".vscode", "extensions.json");
    assert.strictEqual(existsSync(extensionsPath), true);
    const extensionsJson = JSON.parse(await readFile(extensionsPath, "utf8"));
    assert.ok(extensionsJson.recommendations.includes("github.copilot"));
    assert.ok(extensionsJson.recommendations.includes("github.copilot-chat"));

    const settingsPath = join(FIXTURES_DIR, ".vscode", "settings.json");
    assert.strictEqual(existsSync(settingsPath), true);
    const settingsJson = JSON.parse(await readFile(settingsPath, "utf8"));
    assert.strictEqual(settingsJson["files.associations"]["*.mdc"], "markdown");

    // 4. Cursor Rules (modern .mdc + .cursorrules)
    const cursorMdcPath = join(FIXTURES_DIR, ".cursor", "rules", "context-factory.mdc");
    assert.strictEqual(existsSync(cursorMdcPath), true);
    const cursorMdcContent = await readFile(cursorMdcPath, "utf8");
    assert.match(cursorMdcContent, /alwaysApply:\s*true/);

    const cursorrulesPath = join(FIXTURES_DIR, ".cursorrules");
    assert.strictEqual(existsSync(cursorrulesPath), true);

    // 5. Antigravity & Gemini
    const geminiMdPath = join(FIXTURES_DIR, "GEMINI.md");
    assert.strictEqual(existsSync(geminiMdPath), true);
    assert.strictEqual(existsSync(join(FIXTURES_DIR, ".agents")), true);
    assert.strictEqual(existsSync(join(FIXTURES_DIR, ".agents", "skills.json")), true);

    // 6. Bridge Metadata
    const bridgeJsonPath = join(FIXTURES_DIR, ".context-bridge.json");
    assert.strictEqual(existsSync(bridgeJsonPath), true);
    const bridgeJson = JSON.parse(await readFile(bridgeJsonPath, "utf8"));
    assert.ok(bridgeJson.ides.includes("trae"));
    assert.ok(bridgeJson.ides.includes("vscode"));
    assert.ok(bridgeJson.ides.includes("cursor"));
    assert.ok(bridgeJson.ides.includes("antigravity"));
  });

  await t.test("safe JSON merge preserves pre-existing user settings in .vscode/settings.json", async () => {
    const customHostDir = join(FIXTURES_DIR, "custom-vscode-host");
    await mkdir(join(customHostDir, ".vscode"), { recursive: true });

    // Pre-populate .vscode/settings.json with custom developer preferences
    const initialSettings = {
      "editor.fontSize": 16,
      "editor.tabSize": 2,
      "workbench.colorTheme": "One Dark Pro",
      "files.associations": {
        "*.conf": "properties",
      },
    };
    await writeFile(
      join(customHostDir, ".vscode", "settings.json"),
      JSON.stringify(initialSettings, null, 2),
      "utf8"
    );

    // Execute bridge generation targeting vscode
    await generateBridge({
      target: customHostDir,
      factoryPath: process.cwd(),
      ide: ["vscode"],
      method: "submodule",
      dryRun: false,
    });

    // Verify settings were merged without destroying existing configuration
    const mergedSettings = JSON.parse(
      await readFile(join(customHostDir, ".vscode", "settings.json"), "utf8")
    );
    assert.strictEqual(mergedSettings["editor.fontSize"], 16);
    assert.strictEqual(mergedSettings["editor.tabSize"], 2);
    assert.strictEqual(mergedSettings["workbench.colorTheme"], "One Dark Pro");
    assert.strictEqual(mergedSettings["files.associations"]["*.conf"], "properties");
    assert.strictEqual(mergedSettings["files.associations"]["*.mdc"], "markdown");
  });

  await t.test("doctor health check audits multi-editor artifacts and auto-repairs missing files", async () => {
    // Audit initially generated FIXTURES_DIR
    let audit = await auditEditorConfigurations(FIXTURES_DIR);
    assert.strictEqual(audit.passed, true);
    assert.strictEqual(audit.missingCount, 0);

    // Delete Trae rules and Cursor modern rules
    await rm(join(FIXTURES_DIR, ".trae", "rules", "project_rules.md"), { force: true });
    await rm(join(FIXTURES_DIR, ".cursor", "rules", "context-factory.mdc"), { force: true });

    // Audit must detect both missing files
    audit = await auditEditorConfigurations(FIXTURES_DIR);
    assert.strictEqual(audit.passed, false);
    assert.strictEqual(audit.missingCount, 2);

    // Run doctor --repair
    const exitCode = await handleDoctorCommand([], { target: FIXTURES_DIR, repair: true, json: true });

    // Both files must be restored
    assert.strictEqual(existsSync(join(FIXTURES_DIR, ".trae", "rules", "project_rules.md")), true);
    assert.strictEqual(existsSync(join(FIXTURES_DIR, ".cursor", "rules", "context-factory.mdc")), true);

    // Audit recheck should now pass
    const recheck = await auditEditorConfigurations(FIXTURES_DIR);
    assert.strictEqual(recheck.passed, true);
    assert.strictEqual(recheck.missingCount, 0);
  });
});
