import { chmod, mkdir, readFile, writeFile, stat as fsStat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { badges, colors } from "../core/formatter.mjs";

export const CONTEXT_FACTORY_HOOK_MARKER = "Context Factory Zero-Drift Pre-Commit Hook";

export const PRE_COMMIT_SCRIPT = `#!/usr/bin/env sh
# Context Factory Zero-Drift Pre-Commit Hook
# Automatically runs doctor verification for factory health before commit

if [ -f "app/cli/bin/context-cli.mjs" ]; then
  node app/cli/bin/context-cli.mjs doctor --quiet
elif [ -f "scripts/context.mjs" ]; then
  node scripts/context.mjs doctor
fi

EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "\\033[1;31m[context-factory] Pre-commit health check failed. Run 'pnpm run sync' or 'npm run sync' to reconcile.\\033[0m"
  exit 1
fi
`;

/**
 * Resolves the git hooks directory for standard repositories, git submodules, and worktrees.
 * Returns null if targetDir is not a git repository root.
 *
 * @param {string} targetDir
 * @returns {Promise<{ gitDir: string, hooksDir: string, preCommitPath: string } | null>}
 */
export async function resolveGitHooksDir(targetDir) {
  const gitEntry = join(targetDir, ".git");
  if (!existsSync(gitEntry)) {
    return null;
  }

  let actualGitDir = gitEntry;
  try {
    const entryStat = await fsStat(gitEntry);
    if (entryStat.isFile()) {
      // Worktree or submodule gitfile: "gitdir: <path>"
      const content = await readFile(gitEntry, "utf8");
      const match = content.match(/^gitdir:\s*(.+)$/m);
      if (!match) {
        return null;
      }
      const rawGitDir = match[1].trim();
      actualGitDir = isAbsolute(rawGitDir) ? rawGitDir : resolve(targetDir, rawGitDir);
    } else if (!entryStat.isDirectory()) {
      return null;
    }
  } catch {
    return null;
  }

  const hooksDir = join(actualGitDir, "hooks");
  return {
    gitDir: actualGitDir,
    hooksDir,
    preCommitPath: join(hooksDir, "pre-commit"),
  };
}

/**
 * Probes the current pre-commit hook status in the target directory.
 *
 * @param {{ targetDir: string }} options
 * @returns {Promise<{
 *   status: "not_git_repo" | "not_installed" | "installed" | "conflict",
 *   gitDir?: string,
 *   hooksDir?: string,
 *   hookPath?: string,
 *   isContextFactory?: boolean,
 *   error?: string
 * }>}
 */
export async function getHookStatus({ targetDir }) {
  const resolved = await resolveGitHooksDir(targetDir);
  if (!resolved) {
    return {
      status: "not_git_repo",
      error: `Directory "${targetDir}" is not a git repository root (missing .git).`,
    };
  }

  const { gitDir, hooksDir, preCommitPath } = resolved;
  if (!existsSync(preCommitPath)) {
    return {
      status: "not_installed",
      gitDir,
      hooksDir,
      hookPath: preCommitPath,
      isContextFactory: false,
    };
  }

  try {
    const existingContent = await readFile(preCommitPath, "utf8");
    const isContextFactory = existingContent.includes(CONTEXT_FACTORY_HOOK_MARKER);
    return {
      status: isContextFactory ? "installed" : "conflict",
      gitDir,
      hooksDir,
      hookPath: preCommitPath,
      isContextFactory,
    };
  } catch (readError) {
    return {
      status: "conflict",
      gitDir,
      hooksDir,
      hookPath: preCommitPath,
      isContextFactory: false,
      error: readError.message,
    };
  }
}

/**
 * Safely installs or updates the pre-commit hook with idempotence and non-clobbering guarantees.
 *
 * @param {{
 *   targetDir: string,
 *   dryRun?: boolean,
 *   force?: boolean,
 *   preview?: boolean
 * }} options
 * @returns {Promise<{
 *   success: boolean,
 *   action: "preview" | "created" | "already_installed" | "overwritten" | "conflict" | "error",
 *   hookPath?: string,
 *   dryRun?: boolean,
 *   conflict?: boolean,
 *   status?: string,
 *   script?: string,
 *   error?: string
 * }>}
 */
export async function installHook({ targetDir, dryRun = false, force = false, preview = false }) {
  const isPreview = Boolean(dryRun || preview);
  const resolved = await resolveGitHooksDir(targetDir);

  if (!resolved) {
    return {
      success: false,
      action: "error",
      error: `Directory "${targetDir}" is not a git repository root (missing .git).`,
    };
  }

  const hookStatus = await getHookStatus({ targetDir });
  if (hookStatus.status === "not_git_repo") {
    return {
      success: false,
      action: "error",
      error: hookStatus.error,
    };
  }

  if (isPreview) {
    return {
      success: true,
      dryRun: true,
      action: "preview",
      hookPath: resolved.preCommitPath,
      status: hookStatus.status,
      script: PRE_COMMIT_SCRIPT,
    };
  }

  if (hookStatus.status === "installed" && !force) {
    return {
      success: true,
      action: "already_installed",
      hookPath: resolved.preCommitPath,
    };
  }

  if (hookStatus.status === "conflict" && !force) {
    return {
      success: false,
      conflict: true,
      action: "conflict",
      hookPath: resolved.preCommitPath,
      error: `An existing unrelated git hook was found at "${resolved.preCommitPath}". Context Factory will not overwrite existing hooks without --force.`,
    };
  }

  await mkdir(resolved.hooksDir, { recursive: true });

  let action = "created";
  if (force) {
    await writeFile(resolved.preCommitPath, PRE_COMMIT_SCRIPT, "utf8");
    action = hookStatus.status === "not_installed" ? "created" : "overwritten";
  } else {
    try {
      // Exclusive write to prevent concurrent race condition clobbering
      await writeFile(resolved.preCommitPath, PRE_COMMIT_SCRIPT, { encoding: "utf8", flag: "wx" });
      action = "created";
    } catch (writeError) {
      if (writeError.code === "EEXIST") {
        const recheckContent = await readFile(resolved.preCommitPath, "utf8").catch(() => "");
        if (recheckContent.includes(CONTEXT_FACTORY_HOOK_MARKER)) {
          return {
            success: true,
            action: "already_installed",
            hookPath: resolved.preCommitPath,
          };
        }
        return {
          success: false,
          conflict: true,
          action: "conflict",
          hookPath: resolved.preCommitPath,
          error: `A concurrent process wrote an existing hook at "${resolved.preCommitPath}".`,
        };
      }
      throw writeError;
    }
  }

  try {
    await chmod(resolved.preCommitPath, 0o755);
  } catch {
    // Fallback for filesystems/platforms where chmod is unsupported
  }

  return {
    success: true,
    action,
    hookPath: resolved.preCommitPath,
  };
}

/**
 * Handles 'context-cli hook' subcommand dispatch.
 *
 * @param {string[]} args
 * @param {Record<string, any>} flags
 * @returns {Promise<number>}
 */
export async function handleHookCommand(args = [], flags = {}) {
  const subCommand = args[0] || "install";
  const targetDir = flags.target ? resolve(process.cwd(), flags.target) : process.cwd();
  const dryRun = Boolean(flags.dryRun || flags["dry-run"] || flags.preview);
  const force = Boolean(flags.force);
  const isJson = Boolean(flags.json);

  if (subCommand === "status" || subCommand === "check") {
    const statusResult = await getHookStatus({ targetDir });
    if (isJson) {
      console.log(JSON.stringify(statusResult, null, 2));
      return statusResult.status === "not_git_repo" || statusResult.status === "conflict" ? 1 : 0;
    }

    if (statusResult.status === "not_git_repo") {
      console.error(`\n${badges.fail()} ${colors.bold(colors.red(statusResult.error))}\n`);
      return 1;
    }

    if (statusResult.status === "installed") {
      console.log(`\n${badges.done("HOOK")} ${colors.bold(colors.green("Pre-Commit Hook Installed"))}\n`);
      console.log(`  ${colors.bold("Target Hook:")} ${colors.cyan(statusResult.hookPath)}`);
      console.log(`  ${colors.bold("Type:")}        Context Factory zero-drift factory health check\n`);
      return 0;
    }

    if (statusResult.status === "conflict") {
      console.log(`\n${badges.warn("HOOK")} ${colors.bold(colors.yellow("Unrelated Pre-Commit Hook Detected"))}\n`);
      console.log(`  ${colors.bold("Target Hook:")} ${colors.cyan(statusResult.hookPath)}`);
      console.log(`  ${colors.bold("Notice:")}      An existing hook is present without Context Factory markers.\n`);
      return 1;
    }

    console.log(`\n${badges.info("HOOK")} ${colors.bold("Pre-Commit Hook Not Installed")}\n`);
    console.log(`  ${colors.bold("Target Hook:")} ${colors.cyan(statusResult.hookPath)}`);
    console.log(`  ${colors.bold("Next Step:")}   Run ${colors.cyan("context-cli hook install")} to opt into pre-commit health verification.\n`);
    return 0;
  }

  if (subCommand === "install" || subCommand === "setup" || subCommand === "add" || subCommand === "preview") {
    const isPreviewOnly = subCommand === "preview" || dryRun;
    const result = await installHook({ targetDir, dryRun: isPreviewOnly, force, preview: isPreviewOnly });

    if (!result.success) {
      if (isJson) {
        console.log(JSON.stringify(result, null, 2));
        return 1;
      }
      console.error(`\n${badges.fail()} ${colors.bold(colors.red(result.error))}\n`);
      if (result.conflict) {
        console.error(`  ${colors.yellow("Recovery:")} Keep your existing hook intact, chain Context Factory doctor manually, or use ${colors.cyan("--force")} to replace it.\n`);
      }
      return 1;
    }

    if (isJson) {
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }

    if (result.action === "already_installed") {
      console.log(`\n${badges.info("HOOK")} ${colors.bold(colors.cyan("Pre-Commit Hook Already Installed"))}\n`);
      console.log(`  ${colors.bold("Target Hook:")} ${colors.cyan(result.hookPath)}`);
      console.log(`  ${colors.bold("Action:")}      Runs ${colors.cyan("context-cli doctor")} automatically on every commit.`);
      console.log(`  ${colors.bold("Integrity:")}   Guarantees zero-drift manifest and lockfile state before commits.\n`);
      return 0;
    }

    if (result.action === "preview") {
      console.log(`\n${badges.info("HOOK PREVIEW")} ${colors.bold("Pre-Commit Hook Installation Preview")}\n`);
      console.log(`  ${colors.bold("Target Hook:")} ${colors.cyan(result.hookPath)}`);
      console.log(`  ${colors.bold("Current Status:")} ${result.status}`);
      console.log(`  ${colors.bold("Proposed Script:")}\n${colors.dim(result.script)}\n`);
      return 0;
    }

    const title = result.action === "overwritten"
      ? "Git Pre-Commit Hook Overwritten Successfully"
      : "Git Pre-Commit Hook Installed Successfully";

    console.log(`\n${badges.done("HOOK")} ${colors.bold(colors.green(title))}\n`);
    console.log(`  ${colors.bold("Target Hook:")} ${colors.cyan(result.hookPath)}`);
    console.log(`  ${colors.bold("Action:")}      Runs ${colors.cyan("context-cli doctor")} automatically on git commit.`);
    console.log(`  ${colors.bold("Health Gate:")} Checks factory integrity (manifest, lock, rule structure).\n`);
    return 0;
  }

  throw new Error(`Unknown hook subcommand: "${subCommand}". Supported: hook install, hook status, hook preview`);
}
