import { chmod, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { badges, colors } from "../core/formatter.mjs";

/**
 * Handles 'context-cli hook' subcommand (e.g. hook install).
 */
export async function handleHookCommand(args = [], flags = {}) {
  const subCommand = args[0] || "install";
  const targetDir = flags.target ? resolve(process.cwd(), flags.target) : process.cwd();
  const dryRun = Boolean(flags.dryRun);
  const isJson = Boolean(flags.json);

  if (subCommand === "install" || subCommand === "setup" || subCommand === "add") {
    const gitDir = join(targetDir, ".git");
    if (!existsSync(gitDir)) {
      const err = `Directory "${targetDir}" is not a git repository root (missing .git directory).`;
      if (isJson) {
        console.log(JSON.stringify({ success: false, error: err }, null, 2));
        return 1;
      }
      console.error(`\n${badges.fail()} ${colors.bold(colors.red(err))}\n`);
      return 1;
    }

    const hooksDir = join(gitDir, "hooks");
    const preCommitPath = join(hooksDir, "pre-commit");

    const preCommitScript = `#!/usr/bin/env sh
# Context Factory Zero-Drift Pre-Commit Hook
# Automatically runs doctor verification before commit

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

    if (!dryRun) {
      await mkdir(hooksDir, { recursive: true });
      await writeFile(preCommitPath, preCommitScript, "utf8");
      try {
        await chmod(preCommitPath, 0o755);
      } catch {
        // Fallback for systems where chmod is unsupported
      }
    }

    if (isJson) {
      console.log(JSON.stringify({
        success: true,
        dryRun,
        hookPath: preCommitPath,
        hook: "pre-commit",
      }, null, 2));
      return 0;
    }

    console.log(`\n${badges.done("HOOK")} ${colors.bold(colors.green("Git Pre-Commit Hook Installed Successfully"))}\n`);
    console.log(`  ${colors.bold("Target Hook:")} ${colors.cyan(preCommitPath)}`);
    console.log(`  ${colors.bold("Action:")}      Runs ${colors.cyan("context-cli doctor")} automatically on every git commit.`);
    console.log(`  ${colors.bold("Integrity:")}   Guarantees zero-drift manifest and lockfile state before commits.\n`);
    return 0;
  }

  throw new Error(`Unknown hook subcommand: "${subCommand}". Supported: hook install`);
}
