import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { handleInitCommand } from "../../../app/cli/commands/init.mjs";
import { detectInstalledIdes } from "../../../app/cli/core/bridge-generator.mjs";

describe("Unit 02.02: Explicit init choices and preview (AC-01, AC-02, AC-03)", () => {
  it("previews host bridge actions without modifying target filesystem (AC-01)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-init-preview-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });
      await mkdir(join(tempDir, ".vscode"), { recursive: true });

      const exitCode = await handleInitCommand([], {
        target: tempDir,
        preview: true,
        json: true,
        nonInteractive: true,
      });

      assert.equal(exitCode, 0);

      // Verify that AGENTS.md was NOT created on disk during preview
      await assert.rejects(async () => {
        await stat(join(tempDir, "AGENTS.md"));
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("detects installed editors automatically in non-interactive mode", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-init-detect-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });
      await mkdir(join(tempDir, ".cursor"), { recursive: true });

      const detected = detectInstalledIdes(tempDir);
      assert.deepEqual(detected, ["cursor"]);

      // Run init in non-interactive mode without explicit --ide; should use detected cursor
      const exitCode = await handleInitCommand([], {
        target: tempDir,
        json: true,
        nonInteractive: true,
      });

      assert.equal(exitCode, 0);

      // Verify cursor artifacts created
      const bridgeJson = JSON.parse(await readFile(join(tempDir, ".context-bridge.json"), "utf8"));
      assert.deepEqual(bridgeJson.installedIdes, ["cursor"]);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("requires explicit --ide in non-interactive mode when no editors are detected (AC-03)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-init-no-ide-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });

      // No editor folders exist in tempDir
      const detected = detectInstalledIdes(tempDir);
      assert.deepEqual(detected, []);

      // Non-interactive run without --ide must FAIL closed rather than silently falling back to 'all'
      const exitCode = await handleInitCommand([], {
        target: tempDir,
        json: true,
        nonInteractive: true,
      });

      assert.equal(exitCode, 1);

      // Ensure no bridge files were created
      await assert.rejects(async () => {
        await stat(join(tempDir, ".context-bridge.json"));
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("succeeds when explicit --ide is provided even if no editors detected (AC-03)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-init-explicit-ide-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });

      const exitCode = await handleInitCommand([], {
        target: tempDir,
        ide: "vscode",
        json: true,
        nonInteractive: true,
      });

      assert.equal(exitCode, 0);

      const bridgeJson = JSON.parse(await readFile(join(tempDir, ".context-bridge.json"), "utf8"));
      assert.ok(bridgeJson.installedIdes.includes("vscode"));
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("supports explicit --ide all when requested (AC-03)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-init-explicit-all-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });

      const exitCode = await handleInitCommand([], {
        target: tempDir,
        ide: "all",
        json: true,
        nonInteractive: true,
      });

      assert.equal(exitCode, 0);

      const bridgeJson = JSON.parse(await readFile(join(tempDir, ".context-bridge.json"), "utf8"));
      assert.ok(bridgeJson.installedIdes.includes("vscode"));
      assert.ok(bridgeJson.installedIdes.includes("cursor"));
      assert.ok(bridgeJson.installedIdes.includes("trae"));
      assert.ok(bridgeJson.installedIdes.includes("antigravity"));
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("is idempotent on repeated runs and preserves existing host configs (AC-02)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-init-idempotent-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });

      // First run
      const firstExit = await handleInitCommand([], {
        target: tempDir,
        ide: "vscode",
        json: true,
        nonInteractive: true,
      });
      assert.equal(firstExit, 0);

      const initialAgents = await readFile(join(tempDir, "AGENTS.md"), "utf8");

      // Second run
      const secondExit = await handleInitCommand([], {
        target: tempDir,
        ide: "vscode",
        json: true,
        nonInteractive: true,
      });
      assert.equal(secondExit, 0);

      const secondAgents = await readFile(join(tempDir, "AGENTS.md"), "utf8");
      assert.equal(secondAgents, initialAgents);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("separately installs local pre-commit hook when --hook flag is provided (AC-02)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-init-with-hook-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });

      // Run init with --hook
      const exitCode = await handleInitCommand([], {
        target: tempDir,
        ide: "vscode",
        hook: true,
        json: true,
        nonInteractive: true,
      });
      assert.equal(exitCode, 0);

      // Verify hook was created
      const hookContent = await readFile(join(tempDir, ".git", "hooks", "pre-commit"), "utf8");
      assert.match(hookContent, /Context Factory Zero-Drift Pre-Commit Hook/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("does not install hook by default when --hook flag is omitted (AC-02)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-init-without-hook-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });

      // Run init without --hook
      const exitCode = await handleInitCommand([], {
        target: tempDir,
        ide: "vscode",
        json: true,
        nonInteractive: true,
      });
      assert.equal(exitCode, 0);

      // Verify hook was NOT created
      await assert.rejects(async () => {
        await stat(join(tempDir, ".git", "hooks", "pre-commit"));
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
