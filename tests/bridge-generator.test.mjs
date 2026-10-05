import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { generateBridge, normalizeIdeProfiles } from "../app/cli/core/bridge-generator.mjs";

describe("Unit 01.01: Multi-Editor Bridge Generator Core", () => {
  it("normalizeIdeProfiles maps vscode and trae correctly", () => {
    const res = normalizeIdeProfiles(["vscode", "trae"]);
    assert.ok(res.includes("vscode"), "Must include vscode");
    assert.ok(res.includes("trae"), "Must include trae");

    const all = normalizeIdeProfiles(["all"]);
    assert.ok(all.includes("vscode"), "all profile must include vscode");
    assert.ok(all.includes("trae"), "all profile must include trae");
    assert.ok(all.includes("cursor"), "all profile must include cursor");
    assert.ok(all.includes("antigravity"), "all profile must include antigravity");
  });

  it("generateBridge generates .trae/rules/project_rules.md for Trae IDE", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "trae-test-"));
    try {
      const res = await generateBridge({
        target: tempDir,
        ide: ["trae"],
        addNpmScripts: false,
      });

      const traeFile = res.files.find((f) => f.id === ".trae/rules/project_rules.md");
      assert.ok(traeFile, "Must include .trae/rules/project_rules.md in generated files");

      const content = await readFile(join(tempDir, ".trae/rules/project_rules.md"), "utf8");
      assert.match(content, /Trae Project Rules/i);
      assert.match(content, /Context Factory/i);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("generateBridge generates VS Code files and merges settings.json non-destructively", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "vscode-test-"));
    try {
      // Create pre-existing user settings
      await mkdir(join(tempDir, ".vscode"), { recursive: true });
      const initialSettings = {
        "editor.fontSize": 14,
        "workbench.colorTheme": "One Dark Pro",
      };
      await writeFile(
        join(tempDir, ".vscode", "settings.json"),
        JSON.stringify(initialSettings, null, 2),
        "utf8"
      );

      const res = await generateBridge({
        target: tempDir,
        ide: ["vscode"],
        addNpmScripts: false,
      });

      const copilotFile = res.files.find((f) => f.id === ".github/copilot-instructions.md");
      assert.ok(copilotFile, "Must generate .github/copilot-instructions.md");

      const extFile = res.files.find((f) => f.id === ".vscode/extensions.json");
      assert.ok(extFile, "Must generate .vscode/extensions.json");

      const settingsRaw = await readFile(join(tempDir, ".vscode", "settings.json"), "utf8");
      const settings = JSON.parse(settingsRaw);

      // User's custom settings MUST be preserved
      assert.equal(settings["editor.fontSize"], 14, "Original fontSize must be preserved");
      assert.equal(settings["workbench.colorTheme"], "One Dark Pro", "Original colorTheme must be preserved");
      // New settings must be present
      assert.ok(settings["files.associations"], "Must add files.associations or context-factory settings");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("generateBridge generates modern .cursor/rules/context-factory.mdc alongside .cursorrules", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cursor-test-"));
    try {
      const res = await generateBridge({
        target: tempDir,
        ide: ["cursor"],
        addNpmScripts: false,
      });

      const legacyCursor = res.files.find((f) => f.id === ".cursorrules");
      assert.ok(legacyCursor, "Must generate legacy .cursorrules");

      const mdcCursor = res.files.find((f) => f.id === ".cursor/rules/context-factory.mdc");
      assert.ok(mdcCursor, "Must generate .cursor/rules/context-factory.mdc");

      const content = await readFile(join(tempDir, ".cursor/rules/context-factory.mdc"), "utf8");
      assert.match(content, /alwaysApply:\s*true/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
