import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  GITHUB_GATE_WORKFLOW_FILE,
  GITHUB_GATE_MARKER,
  renderGitHubWorkflow,
  installGitHubWorkflow,
  getWorkflowStatus,
  getUnsupportedCiGuidance,
} from "../../../app/cli/core/github-gate-generator.mjs";
import { handleInitCommand } from "../../../app/cli/commands/init.mjs";

describe("Unit 04.01: Opt-in GitHub Actions quality gate generator (AC-02, AC-04, AC-07, AC-08, AC-09, AC-10)", () => {
  describe("Workflow Template Generation (AC-07, AC-08, AC-09, AC-10)", () => {
    it("renders workflow with recursive submodule checkout, health check, and conformance verification (AC-07, AC-08)", () => {
      const yml = renderGitHubWorkflow({
        submodulePath: ".context-factory",
        packageManager: "pnpm",
        nodeVersion: "22",
      });

      assert.ok(yml.includes(GITHUB_GATE_MARKER), "Should contain context factory marker");
      assert.ok(yml.includes("submodules: recursive"), "Should checkout submodules recursively");
      assert.ok(yml.includes("actions/checkout@v4"), "Should use actions/checkout@v4");
      assert.ok(yml.includes("actions/setup-node@v4"), "Should use actions/setup-node@v4");
      assert.ok(yml.includes("node-version: 22"), "Should specify node version");

      // Health check (AC-07)
      assert.ok(
        yml.includes(".context-factory/scripts/context.mjs doctor") ||
        yml.includes(".context-factory/app/cli/bin/context-cli.mjs doctor"),
        "Should run doctor health check"
      );

      // Conformance evaluation and persistence
      assert.ok(
        yml.includes("conform") && yml.includes(".context-runs/conformance-report.json"),
        "Should execute conformance and output report to .context-runs/"
      );

      // Conformance verification step (AC-07, AC-08)
      assert.ok(
        yml.includes("conform verify .context-runs/conformance-report.json"),
        "Should verify persisted conformance report receipt against checkout"
      );

      // Report artifact upload
      assert.ok(yml.includes("actions/upload-artifact@v4"), "Should upload report artifact");
    });

    it("marks host test and lint as unconfigured when omitted, avoiding empty or failing steps (AC-10)", () => {
      const yml = renderGitHubWorkflow({
        submodulePath: ".context-factory",
        testCommand: null,
        lintCommand: null,
      });

      // Should indicate test and lint are unconfigured and NOT generate run steps with empty commands
      assert.ok(yml.includes("unconfigured"), "Should document unconfigured host checks");
      assert.ok(!yml.includes("run: \n"), "Must not have empty run command");
      assert.ok(!yml.includes("run: ''"), "Must not have empty string run command");
    });

    it("includes host test and lint steps when explicitly configured (AC-10)", () => {
      const yml = renderGitHubWorkflow({
        submodulePath: ".context-factory",
        testCommand: "npm test",
        lintCommand: "npm run lint",
      });

      assert.ok(yml.includes("npm test"), "Should include host test command");
      assert.ok(yml.includes("npm run lint"), "Should include host lint command");
    });
  });

  describe("Safe Opt-In Installation and Conflict Prevention (AC-02)", () => {
    it("installs workflow safely in new repository", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-ci-install-"));
      try {
        await mkdir(join(tempDir, ".git"), { recursive: true });

        const result = await installGitHubWorkflow({
          targetDir: tempDir,
          submodulePath: ".context-factory",
        });

        assert.equal(result.success, true);
        assert.equal(result.action, "created");
        assert.ok(result.workflowPath.endsWith(GITHUB_GATE_WORKFLOW_FILE));

        const content = await readFile(result.workflowPath, "utf8");
        assert.ok(content.includes(GITHUB_GATE_MARKER));
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it("idempotently returns already_installed when running again without force", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-ci-idempotent-"));
      try {
        await mkdir(join(tempDir, ".git"), { recursive: true });

        const first = await installGitHubWorkflow({
          targetDir: tempDir,
          submodulePath: ".context-factory",
        });
        assert.equal(first.action, "created");

        const second = await installGitHubWorkflow({
          targetDir: tempDir,
          submodulePath: ".context-factory",
        });
        assert.equal(second.success, true);
        assert.equal(second.action, "already_installed");
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it("detects conflict and refuses to clobber existing unrelated workflow without force (AC-02)", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-ci-conflict-"));
      try {
        await mkdir(join(tempDir, ".git"), { recursive: true });
        const workflowDir = join(tempDir, ".github", "workflows");
        await mkdir(workflowDir, { recursive: true });

        const targetWorkflow = join(tempDir, GITHUB_GATE_WORKFLOW_FILE);
        await writeFile(targetWorkflow, "# Custom host workflow\nname: Host CI\n", "utf8");

        const result = await installGitHubWorkflow({
          targetDir: tempDir,
          submodulePath: ".context-factory",
        });

        assert.equal(result.success, false);
        assert.equal(result.conflict, true);
        assert.equal(result.action, "conflict");

        // Content must be preserved untouched
        const currentContent = await readFile(targetWorkflow, "utf8");
        assert.equal(currentContent, "# Custom host workflow\nname: Host CI\n");

        // With force: true, overwrite succeeds
        const forceResult = await installGitHubWorkflow({
          targetDir: tempDir,
          submodulePath: ".context-factory",
          force: true,
        });

        assert.equal(forceResult.success, true);
        assert.equal(forceResult.action, "overwritten");
        const overwrittenContent = await readFile(targetWorkflow, "utf8");
        assert.ok(overwrittenContent.includes(GITHUB_GATE_MARKER));
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it("supports preview / dry-run without writing files to disk (AC-01, AC-02)", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-ci-preview-"));
      try {
        await mkdir(join(tempDir, ".git"), { recursive: true });

        const result = await installGitHubWorkflow({
          targetDir: tempDir,
          submodulePath: ".context-factory",
          preview: true,
        });

        assert.equal(result.success, true);
        assert.equal(result.dryRun, true);
        assert.equal(result.action, "preview");
        assert.ok(result.content.includes(GITHUB_GATE_MARKER));

        // Must not create file
        await assert.rejects(async () => {
          await stat(join(tempDir, GITHUB_GATE_WORKFLOW_FILE));
        });
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe("Unsupported CI Providers Guidance (AC-04)", () => {
    it("returns copyable commands for unsupported CI provider without creating files", () => {
      const guidance = getUnsupportedCiGuidance("gitlab", {
        submodulePath: ".context-factory",
      });

      assert.equal(guidance.supported, false);
      assert.equal(guidance.provider, "gitlab");
      assert.ok(Array.isArray(guidance.commands), "Should return array of command strings");
      assert.ok(guidance.commands.some((cmd) => cmd.includes("doctor")), "Commands should include doctor");
      assert.ok(guidance.commands.some((cmd) => cmd.includes("conform")), "Commands should include conform");
      assert.ok(guidance.commands.some((cmd) => cmd.includes("conform verify")), "Commands should include conform verify");
    });
  });

  describe("Integration with context-cli init (AC-01, AC-02, AC-04)", () => {
    it("installs GitHub Actions workflow when opted into via --ci github", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-init-ci-gh-"));
      try {
        await mkdir(join(tempDir, ".git"), { recursive: true });
        await mkdir(join(tempDir, ".vscode"), { recursive: true });

        const exitCode = await handleInitCommand([], {
          target: tempDir,
          ide: "vscode",
          ci: "github",
          json: true,
          nonInteractive: true,
        });

        assert.equal(exitCode, 0);

        const workflowPath = join(tempDir, GITHUB_GATE_WORKFLOW_FILE);
        const exists = await stat(workflowPath).then(() => true).catch(() => false);
        assert.ok(exists, "Workflow file must be created on disk");

        const content = await readFile(workflowPath, "utf8");
        assert.ok(content.includes(GITHUB_GATE_MARKER));
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it("previews GitHub Actions workflow in init --preview --ci github without writing", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-init-preview-ci-"));
      try {
        await mkdir(join(tempDir, ".git"), { recursive: true });
        await mkdir(join(tempDir, ".vscode"), { recursive: true });

        const exitCode = await handleInitCommand([], {
          target: tempDir,
          ide: "vscode",
          ci: "github",
          preview: true,
          json: true,
          nonInteractive: true,
        });

        assert.equal(exitCode, 0);

        const workflowPath = join(tempDir, GITHUB_GATE_WORKFLOW_FILE);
        await assert.rejects(async () => {
          await stat(workflowPath);
        });
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it("provides copyable commands and does not create workflow for --ci gitlab (AC-04)", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-init-ci-gitlab-"));
      try {
        await mkdir(join(tempDir, ".git"), { recursive: true });
        await mkdir(join(tempDir, ".vscode"), { recursive: true });

        const exitCode = await handleInitCommand([], {
          target: tempDir,
          ide: "vscode",
          ci: "gitlab",
          json: true,
          nonInteractive: true,
        });

        assert.equal(exitCode, 0);

        // Must not create any workflow file
        const workflowPath = join(tempDir, GITHUB_GATE_WORKFLOW_FILE);
        await assert.rejects(async () => {
          await stat(workflowPath);
        });
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });
});
