import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
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
    it("renders workflow with recursive submodule checkout and executable health check", () => {
      const yml = renderGitHubWorkflow({
        submodulePath: ".context-factory",
        packageManager: "pnpm",
        nodeVersion: "22",
      });

      assert.ok(yml.includes(GITHUB_GATE_MARKER), "Should contain context factory marker");
      assert.ok(yml.includes("submodules: recursive"), "Should checkout submodules recursively");
      assert.ok(yml.includes("actions/checkout@v4"), "Should use actions/checkout@v4");
      assert.ok(yml.includes("actions/setup-node@v4"), "Should use actions/setup-node@v4");
      assert.ok(yml.includes("pnpm/action-setup@v6"), "Should set up pnpm");
      assert.ok(yml.includes("pnpm install --frozen-lockfile"), "Should install locked host dependencies");
      assert.ok(yml.includes("node-version: 22"), "Should specify node version");

      // Health check (AC-07)
      assert.ok(
        yml.includes(".context-factory/scripts/context.mjs doctor") ||
        yml.includes(".context-factory/app/cli/bin/context-cli.mjs doctor"),
        "Should run doctor health check"
      );

      assert.doesNotMatch(yml, /\bconform\b|conformance-report/);
    });

    it("marks all host checks unconfigured when omitted, without empty run steps", () => {
      const yml = renderGitHubWorkflow({
        submodulePath: ".context-factory",
        testCommand: null,
        lintCommand: null,
      });

      // Should indicate test and lint are unconfigured and NOT generate run steps with empty commands
      for (const check of ["lint", "typecheck", "test", "build"]) {
        assert.ok(yml.includes(`Host ${check}: unconfigured`));
      }
      assert.ok(!yml.includes("run: \n"), "Must not have empty run command");
      assert.ok(!yml.includes("run: ''"), "Must not have empty string run command");
    });

    it("includes all explicitly configured pnpm host checks", () => {
      const yml = renderGitHubWorkflow({
        submodulePath: ".context-factory",
        testCommand: "pnpm test",
        lintCommand: "pnpm run lint",
        typecheckCommand: "pnpm run typecheck",
        buildCommand: "pnpm run build",
      });

      assert.ok(yml.includes("pnpm test"), "Should include host test command");
      assert.ok(yml.includes("pnpm run lint"), "Should include host lint command");
      assert.ok(yml.includes("pnpm run typecheck"));
      assert.ok(yml.includes("pnpm run build"));
    });

    it("rejects host CI commands using another package manager", () => {
      assert.throws(() => renderGitHubWorkflow({ testCommand: "npm test" }), /must use pnpm/);
      assert.throws(() => renderGitHubWorkflow({ packageManager: "bun" }), /requires pnpm/);
      assert.throws(() => renderGitHubWorkflow({ lintCommand: "pnpm run lint; echo unsafe" }), /pnpm script/);
    });

    it("imports the public CLI index", async () => {
      const result = await import("../../../app/cli/index.mjs");
      assert.equal(typeof result.main, "function");
    });

    it("runs every emitted shell block for a host with four configured scripts", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-ci-execute-"));
      try {
        await mkdir(join(tempDir, ".context-factory", "scripts"), { recursive: true });
        await writeFile(join(tempDir, ".context-factory", "scripts", "context.mjs"),
          "if (process.argv[2] !== 'doctor') process.exit(2);\n");
        const scripts = Object.fromEntries(["lint", "typecheck", "test", "build"].map((name) =>
          [name, `node -e \"require('fs').writeFileSync('${name}.passed', 'yes')\"`]));
        await writeFile(join(tempDir, "package.json"), JSON.stringify({ private: true, scripts }));
        const lock = spawnSync("pnpm", ["install", "--lockfile-only", "--offline"], { cwd: tempDir, encoding: "utf8" });
        assert.equal(lock.status, 0, lock.stderr);
        const result = await installGitHubWorkflow({ targetDir: tempDir });
        assert.equal(result.success, true);
        const workflow = await readFile(result.workflowPath, "utf8");
        const blocks = [...workflow.matchAll(/^        run: \|\n((?:          .*\n|\n)+)|^        run: (.+)$/gm)]
          .map((match) => match[2] || match[1].replace(/^          /gm, ""));
        assert.equal(blocks.length, 6, workflow);
        for (const block of blocks) {
          const executed = spawnSync("sh", ["-c", block], { cwd: tempDir, encoding: "utf8" });
          assert.equal(executed.status, 0, `${block}\n${executed.stderr}`);
        }
        for (const name of Object.keys(scripts)) {
          assert.equal(await readFile(join(tempDir, `${name}.passed`), "utf8"), "yes");
        }
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it("rejects requested absent scripts and preserves failing script status", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-ci-negative-"));
      try {
        await writeFile(join(tempDir, "package.json"), JSON.stringify({ private: true, scripts: { test: "node -e 'process.exit(7)'" } }));
        await writeFile(join(tempDir, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\nimporters:\n  .: {}\n");
        await assert.rejects(installGitHubWorkflow({ targetDir: tempDir, lintCommand: "pnpm run lint" }), /lint.*not configured/);
        const result = await installGitHubWorkflow({ targetDir: tempDir });
        assert.equal(result.success, true);
        const workflow = await readFile(result.workflowPath, "utf8");
        assert.ok(workflow.includes("Host lint: unconfigured"));
        const failed = spawnSync("sh", ["-c", "pnpm run test"], { cwd: tempDir, encoding: "utf8" });
        assert.notEqual(failed.status, 0);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it("fails generation when configured scripts have no pnpm lockfile", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-ci-unlocked-"));
      try {
        await writeFile(join(tempDir, "package.json"), JSON.stringify({ scripts: { lint: "node -e ''" } }));
        await assert.rejects(installGitHubWorkflow({ targetDir: tempDir }), /require pnpm-lock.yaml/);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
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

    it("treats the former conformance workflow as a migration conflict", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-ci-legacy-"));
      try {
        const path = join(tempDir, GITHUB_GATE_WORKFLOW_FILE);
        await mkdir(join(tempDir, ".github", "workflows"), { recursive: true });
        await writeFile(path, "# Context Factory Strict Conformance Gate\nname: Former gate\n");
        const result = await installGitHubWorkflow({ targetDir: tempDir });
        assert.equal(result.action, "conflict");
        assert.match(await readFile(path, "utf8"), /Former gate/);
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
      assert.ok(guidance.commands.every((cmd) => !/\bconform\b/.test(cmd)));
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
