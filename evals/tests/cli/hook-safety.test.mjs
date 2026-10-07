import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  resolveGitHooksDir,
  getHookStatus,
  installHook,
  handleHookCommand,
  PRE_COMMIT_SCRIPT,
  CONTEXT_FACTORY_HOOK_MARKER,
} from "../../../app/cli/commands/hook.mjs";

describe("Unit 02.01: Safe, non-clobbering local git hook (AC-02)", () => {
  it("resolves git hooks directory for standard .git directory", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-hook-standard-"));
    try {
      const gitDir = join(tempDir, ".git");
      await mkdir(gitDir, { recursive: true });

      const resolved = await resolveGitHooksDir(tempDir);
      assert.ok(resolved);
      assert.equal(resolved.hooksDir, join(gitDir, "hooks"));
      assert.equal(resolved.preCommitPath, join(gitDir, "hooks", "pre-commit"));
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("resolves git hooks directory for worktrees and submodules with gitfile (.git file)", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "cf-hook-worktree-root-"));
    try {
      const mainGitDir = join(rootDir, "main-repo", ".git");
      const worktreeGitDir = join(mainGitDir, "worktrees", "task-branch");
      const worktreeDir = join(rootDir, "worktree-dir");

      await mkdir(worktreeGitDir, { recursive: true });
      await mkdir(worktreeDir, { recursive: true });

      // Create .git gitfile pointing to worktreeGitDir
      await writeFile(join(worktreeDir, ".git"), `gitdir: ${worktreeGitDir}\n`, "utf8");

      const resolved = await resolveGitHooksDir(worktreeDir);
      assert.ok(resolved);
      assert.equal(resolved.hooksDir, join(worktreeGitDir, "hooks"));
      assert.equal(resolved.preCommitPath, join(worktreeGitDir, "hooks", "pre-commit"));
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("returns null when directory is not a git repository", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-hook-nogit-"));
    try {
      const resolved = await resolveGitHooksDir(tempDir);
      assert.equal(resolved, null);

      const status = await getHookStatus({ targetDir: tempDir });
      assert.equal(status.status, "not_git_repo");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("previews hook installation without writing any files (dry-run / preview)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-hook-preview-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });

      const previewResult = await installHook({ targetDir: tempDir, dryRun: true });
      assert.equal(previewResult.success, true);
      assert.equal(previewResult.dryRun, true);
      assert.equal(previewResult.action, "preview");
      assert.ok(previewResult.hookPath.endsWith("pre-commit"));
      assert.match(previewResult.script, new RegExp(CONTEXT_FACTORY_HOOK_MARKER));

      // Ensure file was not created on disk
      await assert.rejects(async () => {
        await stat(previewResult.hookPath);
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("installs fresh pre-commit hook with zero-drift factory health check", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-hook-install-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });

      const installResult = await installHook({ targetDir: tempDir });
      assert.equal(installResult.success, true);
      assert.equal(installResult.action, "created");

      const content = await readFile(installResult.hookPath, "utf8");
      assert.match(content, /Context Factory Zero-Drift Pre-Commit Hook/);
      assert.match(content, /doctor/);
      assert.ok(!content.includes("mascot"));

      // Verify status is now installed
      const status = await getHookStatus({ targetDir: tempDir });
      assert.equal(status.status, "installed");
      assert.equal(status.isContextFactory, true);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("is idempotent and reports unchanged when hook is already installed", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-hook-idempotent-"));
    try {
      await mkdir(join(tempDir, ".git"), { recursive: true });

      // First install
      const first = await installHook({ targetDir: tempDir });
      assert.equal(first.success, true);
      assert.equal(first.action, "created");

      // Second install
      const second = await installHook({ targetDir: tempDir });
      assert.equal(second.success, true);
      assert.equal(second.action, "already_installed");
      assert.equal(second.hookPath, first.hookPath);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("detects conflict and refuses to clobber existing unrelated hook (AC-02)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-hook-conflict-"));
    try {
      const gitDir = join(tempDir, ".git");
      const hooksDir = join(gitDir, "hooks");
      await mkdir(hooksDir, { recursive: true });

      const customScript = "#!/bin/sh\n# Custom project hook\necho 'running lint'\nnpm run lint\n";
      const preCommitPath = join(hooksDir, "pre-commit");
      await writeFile(preCommitPath, customScript, "utf8");

      // Verify status detects conflict
      const status = await getHookStatus({ targetDir: tempDir });
      assert.equal(status.status, "conflict");
      assert.equal(status.isContextFactory, false);

      // Attempt install without force
      const result = await installHook({ targetDir: tempDir, force: false });
      assert.equal(result.success, false);
      assert.equal(result.conflict, true);
      assert.equal(result.action, "conflict");
      assert.match(result.error, /existing.*hook|conflict/i);

      // CRITICAL: Verify file was NOT modified or clobbered
      const preservedContent = await readFile(preCommitPath, "utf8");
      assert.equal(preservedContent, customScript);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("allows explicit force override when requested", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-hook-force-"));
    try {
      const gitDir = join(tempDir, ".git");
      const hooksDir = join(gitDir, "hooks");
      await mkdir(hooksDir, { recursive: true });

      const customScript = "#!/bin/sh\necho 'old'\n";
      const preCommitPath = join(hooksDir, "pre-commit");
      await writeFile(preCommitPath, customScript, "utf8");

      // Install with force: true
      const result = await installHook({ targetDir: tempDir, force: true });
      assert.equal(result.success, true);
      assert.equal(result.action, "overwritten");

      const newContent = await readFile(preCommitPath, "utf8");
      assert.match(newContent, /Context Factory Zero-Drift Pre-Commit Hook/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("CLI command handleHookCommand returns exit code 1 on conflict and 0 on success/idempotent", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-hook-cli-"));
    try {
      const gitDir = join(tempDir, ".git");
      const hooksDir = join(gitDir, "hooks");
      await mkdir(hooksDir, { recursive: true });

      // Put an unrelated hook
      const preCommitPath = join(hooksDir, "pre-commit");
      await writeFile(preCommitPath, "#!/bin/sh\necho custom\n", "utf8");

      // Run hook install via CLI with conflict
      const exitConflict = await handleHookCommand(["install"], { target: tempDir, json: true });
      assert.equal(exitConflict, 1);

      // Overwrite with force
      const exitForce = await handleHookCommand(["install"], { target: tempDir, force: true, json: true });
      assert.equal(exitForce, 0);

      // Re-run idempotent
      const exitIdempotent = await handleHookCommand(["install"], { target: tempDir, json: true });
      assert.equal(exitIdempotent, 0);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
