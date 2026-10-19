import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile, mkdir, lstat, symlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildSharedEnforcementDirectives,
  detectPackageManager,
  generateBridge,
  normalizeIdeProfiles,
} from "../../app/cli/core/bridge-generator.mjs";

describe("Unit 01.01: Multi-Editor Bridge Generator Core", () => {
  it("requires pnpm and refuses other host lockfiles before writing bridge files", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "pnpm-host-test-"));
    try {
      for (const lockfile of ["package-lock.json", "npm-shrinkwrap.json", "yarn.lock", "bun.lock", "bun.lockb"]) {
        await writeFile(join(tempDir, lockfile), "{}\n");
        assert.throws(() => detectPackageManager(tempDir), /Migrate the host to pnpm/);
        await assert.rejects(generateBridge({ target: tempDir, ide: ["vscode"] }), /Migrate the host to pnpm/);
        await assert.rejects(readFile(join(tempDir, ".context-bridge.json")), { code: "ENOENT" });
        await rm(join(tempDir, lockfile));
      }
      await assert.rejects(generateBridge({ target: tempDir, ide: ["vscode"], packageManager: "bun" }), /requires pnpm/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("requires a pnpm lockfile for dependency-bearing hosts", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "pnpm-lock-test-"));
    try {
      await writeFile(join(tempDir, "package.json"), JSON.stringify({ dependencies: { example: "1.0.0" } }));
      assert.throws(() => detectPackageManager(tempDir), /no pnpm-lock.yaml/);
      await writeFile(join(tempDir, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
      assert.equal(detectPackageManager(tempDir), "pnpm");
      await writeFile(join(tempDir, "package.json"), JSON.stringify({ devEngines: { packageManager: { name: "bun", version: "1.0.0" } } }));
      assert.throws(() => detectPackageManager(tempDir), /devEngines.packageManager must be pnpm/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("rejects legacy Context Factory host scripts before changing the host", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "pnpm-script-test-"));
    try {
      await writeFile(join(tempDir, "package.json"), JSON.stringify({ scripts: { "context:update": "npm run context:doctor" } }));
      await assert.rejects(generateBridge({ target: tempDir, ide: ["vscode"] }), /Migrate them to pnpm/);
      await assert.rejects(readFile(join(tempDir, ".context-bridge.json")), { code: "ENOENT" });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("generates pnpm host helper scripts", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "pnpm-bridge-test-"));
    try {
      await writeFile(join(tempDir, "package.json"), JSON.stringify({ name: "host", scripts: {} }));
      await generateBridge({ target: tempDir, ide: ["vscode"], method: "submodule" });
      const manifest = JSON.parse(await readFile(join(tempDir, "package.json"), "utf8"));
      assert.match(manifest.scripts["context:update"], /pnpm run context:doctor$/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

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
        addPackageScripts: false,
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
        addPackageScripts: false,
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
        addPackageScripts: false,
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

  it("buildSharedEnforcementDirectives emits host-verification instead of runtime conform (D-01, AC-08)", () => {
    const bulletOutput = buildSharedEnforcementDirectives({ format: "bullet" });
    assert.match(bulletOutput, /Host Verification/i);
    assert.match(bulletOutput, /lint, typecheck, test, build/);
    assert.doesNotMatch(bulletOutput, /\bconform\b/i);

    const tableOutput = buildSharedEnforcementDirectives({ format: "table" });
    assert.doesNotMatch(tableOutput, /\/conform/);
  });

  it("generateBridge generates .agents/skills.json including workflows (AC-08)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "antigravity-test-"));
    try {
      await generateBridge({
        target: tempDir,
        factoryPath: process.cwd(),
        ide: ["antigravity"],
        addPackageScripts: false,
      });

      const skillsJsonPath = join(tempDir, ".agents", "skills.json");
      assert.ok(existsSync(skillsJsonPath), "Must generate .agents/skills.json");
      const skillsConfig = JSON.parse(await readFile(skillsJsonPath, "utf8"));
      assert.ok(Array.isArray(skillsConfig.entries), "entries must be an array");

      const paths = skillsConfig.entries.map((e) => e.path);
      assert.ok(paths.some((p) => p.endsWith("skills/engineering")), "Must include skills/engineering");
      assert.ok(paths.some((p) => p.endsWith("skills/productivity")), "Must include skills/productivity");
      assert.ok(paths.some((p) => p.endsWith("skills/workflows")), "Must include skills/workflows");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("factory .agents/skills.json and .claude/CLAUDE.md comply with inventory and pnpm (AC-08)", async () => {
    const factorySkillsJson = JSON.parse(await readFile(join(process.cwd(), ".agents", "skills.json"), "utf8"));
    const paths = factorySkillsJson.entries.map((e) => e.path);
    assert.ok(paths.includes("skills/engineering"), "Factory skills.json must contain skills/engineering");
    assert.ok(paths.includes("skills/productivity"), "Factory skills.json must contain skills/productivity");
    assert.ok(paths.includes("skills/workflows"), "Factory skills.json must contain skills/workflows");

    const claudeMd = await readFile(join(process.cwd(), ".claude", "CLAUDE.md"), "utf8");
    assert.match(claudeMd, /pnpm test/);
    assert.match(claudeMd, /pnpm run eval/);
    assert.doesNotMatch(claudeMd, /\bnpm (?:run|test)\b/);
  });

  it("generateBridge handles profile-specific Codex and Claude discovery symlinks (AC-08)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "profile-test-"));
    try {
      // Codex profile
      const codexDir = join(tempDir, "codex-host");
      await mkdir(codexDir, { recursive: true });
      await generateBridge({
        target: codexDir,
        factoryPath: process.cwd(),
        ide: ["codex"],
        addPackageScripts: false,
      });

      assert.ok(existsSync(join(codexDir, ".agents", "skills")), "Codex profile must create .agents/skills");
      assert.ok(existsSync(join(codexDir, ".agents", "skills", "plan")), "Codex profile must link procedural skill");
      assert.ok(existsSync(join(codexDir, ".agents", "skills", "workflow-feature-delivery")), "Codex profile must link workflow");
      assert.strictEqual(existsSync(join(codexDir, ".claude")), false, "Codex-only profile must NOT create .claude");

      // Claude profile
      const claudeDir = join(tempDir, "claude-host");
      await mkdir(claudeDir, { recursive: true });
      await generateBridge({
        target: claudeDir,
        factoryPath: process.cwd(),
        ide: ["claude"],
        addPackageScripts: false,
      });

      assert.ok(existsSync(join(claudeDir, ".claude", "skills")), "Claude profile must create .claude/skills");
      assert.ok(existsSync(join(claudeDir, ".claude", "skills", "workflow-feature-delivery")), "Claude profile must link workflow");
      assert.strictEqual(existsSync(join(claudeDir, ".agents")), false, "Claude-only profile must NOT create .agents");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("generateBridge detects unowned collisions and does not overwrite user files (AC-08)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "collision-test-"));
    try {
      await mkdir(join(tempDir, ".agents", "skills"), { recursive: true });
      const userFile = join(tempDir, ".agents", "skills", "plan");
      await writeFile(userFile, "USER CONTENT - DO NOT OVERWRITE", "utf8");

      const res = await generateBridge({
        target: tempDir,
        factoryPath: process.cwd(),
        ide: ["codex"],
        addPackageScripts: false,
      });

      assert.strictEqual(res.hasCollisions, true, "Must flag hasCollisions when unowned file exists");
      const collisionItem = res.symlinks.find((s) => s.id === ".agents/skills/plan");
      assert.ok(collisionItem, "Collision item must be recorded in symlinks");
      assert.strictEqual(collisionItem.collision, true, "collision property must be true");

      const survivingContent = await readFile(userFile, "utf8");
      assert.strictEqual(survivingContent, "USER CONTENT - DO NOT OVERWRITE", "User content must not be overwritten");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("generateBridge is idempotent across repeat executions (AC-08)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "idempotence-test-"));
    try {
      const run1 = await generateBridge({
        target: tempDir,
        factoryPath: process.cwd(),
        ide: ["vscode", "antigravity", "codex", "claude"],
        addPackageScripts: false,
      });
      assert.strictEqual(run1.hasCollisions, false);

      const run2 = await generateBridge({
        target: tempDir,
        factoryPath: process.cwd(),
        ide: ["vscode", "antigravity", "codex", "claude"],
        addPackageScripts: false,
      });
      assert.strictEqual(run2.hasCollisions, false);

      // Verify links and files still healthy
      assert.ok(existsSync(join(tempDir, ".agents", "skills.json")));
      assert.ok(existsSync(join(tempDir, ".claude", "skills", "workflow-feature-delivery")));
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
