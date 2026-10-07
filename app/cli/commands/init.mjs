import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync, readdirSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { badges, colors } from "../core/formatter.mjs";
import {
  checkHostSubmoduleStatus,
  detectInstalledIdes,
  detectPackageManager,
  detectSubmoduleContext,
  parseIdeChoices,
} from "../core/bridge-generator.mjs";
import { handleBridgeCommand } from "./bridge.mjs";
import { installHook } from "./hook.mjs";

/**
 * Handles interactive and flag-based initialization for a host project.
 */
export async function handleInitCommand(args = [], flags = {}) {
  let target = flags.target || args[0] || null;
  let method = flags.method || null;
  let ide = flags.ide || flags.agents || null;
  let pm = flags.pm || flags.packageManager || null;
  const isPreview = Boolean(flags.preview || flags.dryRun || flags["dry-run"]);
  const dryRun = isPreview;
  const force = Boolean(flags.force);
  let installHookFlag = Boolean(flags.hook);
  const isJson = Boolean(flags.json);

  const submodCtx = detectSubmoduleContext(process.cwd());
  const defaultTarget = submodCtx.isInsideSubmodule ? submodCtx.hostDir : ".";
  const resolvedTarget = resolve(process.cwd(), target || defaultTarget);

  const isInteractive = input.isTTY && !flags.quiet && !flags.json && !flags.nonInteractive && !flags["non-interactive"];

  if (!flags.json) {
    console.log(`\n${badges.init("INIT")} ${colors.bold(colors.cyan("Initialize Context Factory in Project"))}\n`);
    if (submodCtx.isInsideSubmodule) {
      console.log(`  ${badges.info("SUBMODULE")} ${colors.dim("Detected execution from inside submodule")} ${colors.cyan(submodCtx.submoduleDirName)} ${colors.dim("-> host target:")} ${colors.cyan(defaultTarget)}\n`);
    }
  }

  // Check missing submodule guidance in host (AC-04)
  const hostSubmodStatus = checkHostSubmoduleStatus(resolvedTarget);
  if (hostSubmodStatus.hasGitModules && hostSubmodStatus.isContextFactorySubmoduled) {
    const expectedSubmoduleDir = join(resolvedTarget, hostSubmodStatus.submodulePath || ".context-factory");
    const isMissingOrEmpty = !existsSync(expectedSubmoduleDir) || (existsSync(expectedSubmoduleDir) && readdirSync(expectedSubmoduleDir).length === 0);
    if (isMissingOrEmpty && !submodCtx.isInsideSubmodule) {
      const recoveryCommand = "git submodule update --init --recursive";
      if (isJson) {
        console.log(JSON.stringify({
          success: false,
          error: "Submodule registered but not initialized.",
          recoveryCommand,
        }, null, 2));
        return 1;
      }
      console.error(`\n${badges.fail()} ${colors.bold(colors.red("Context Factory submodule registered in .gitmodules but not initialized."))}`);
      console.error(`  ${colors.bold("Recovery:")} Run ${colors.cyan(recoveryCommand)} in the host project root.\n`);
      return 1;
    }
  }

  const detectedIdes = detectInstalledIdes(resolvedTarget);

  if (isInteractive && (!target || !method || !ide)) {
    const rl = createInterface({ input, output });

    try {
      // 1. Target directory prompt
      if (!target) {
        const answer = await rl.question(`  ${colors.bold("Project Target Directory")} ${colors.dim(`[default: ${defaultTarget}]`)}: `);
        target = answer.trim() || defaultTarget;
      }

      // 2. Integration method prompt
      if (!method) {
        console.log(`\n  ${colors.bold("Select Integration Method:")}`);
        console.log(`    ${colors.cyan("1)")} Git Submodule ${colors.dim("(Recommended for teams / GitHub repositories)")}`);
        console.log(`    ${colors.cyan("2)")} Shared Local Link ${colors.dim("(Recommended for local multi-repo workspace)")}`);
        const answer = await rl.question(`  ${colors.bold("Choice")} ${colors.dim("[1-2, default: 1]")}: `);
        const choice = answer.trim();
        if (choice === "2" || choice.toLowerCase() === "linked") {
          method = "linked";
        } else {
          method = "submodule";
        }
      }

      // 2b. Hybrid Submodule Assistant
      if (method === "submodule") {
        const isGitRepo = existsSync(resolve(resolvedTarget, ".git"));
        if (isGitRepo && !hostSubmodStatus.isContextFactorySubmoduled && !submodCtx.isInsideSubmodule) {
          console.log(`\n  ${badges.warn("NOTICE")} ${colors.yellow("Context Factory is not yet registered as a git submodule in this project.")}`);
          const addAnswer = await rl.question(`  ${colors.bold("Add submodule now into .context-factory? [Y/n]")} `);
          const shouldAdd = addAnswer.trim().toLowerCase() !== "n";
          if (shouldAdd) {
            try {
              console.log(`  ${colors.dim("Executing git submodule add...")}`);
              const { execSync } = await import("node:child_process");
              execSync("git submodule add https://github.com/markromolecule/context-factory.git .context-factory", {
                cwd: resolvedTarget,
                stdio: "inherit",
              });
              console.log(`  ${badges.done()} Git submodule added successfully.`);
            } catch (err) {
              console.log(`  ${badges.warn("WARNING")} Could not run git command automatically: ${err.message}`);
              console.log(`  ${colors.dim("Run this manually in your host project root:")} ${colors.yellow("git submodule add <repo-url> .context-factory")}\n`);
            }
          } else {
            console.log(`  ${colors.dim("To add manually later, run:")} ${colors.yellow("git submodule add <repo-url> .context-factory")}\n`);
          }
        }
      }

      // 3. IDE profile prompt with smart folder detection and multi-select
      if (!ide) {
        console.log(`\n  ${colors.bold("Select Target Code Editors:")}`);
        if (detectedIdes.length > 0) {
          console.log(`  ${badges.info("DETECTED")} ${colors.dim("Existing editor configurations found:")} ${colors.cyan(detectedIdes.join(", "))}`);
        }
        console.log(`    ${colors.cyan("1)")} VS Code        ${colors.dim("(GitHub Copilot, .vscode config, AGENTS.md)")}`);
        console.log(`    ${colors.cyan("2)")} Antigravity    ${colors.dim("(.agents/ live symlinks, AGENTS.md, GEMINI.md)")}`);
        console.log(`    ${colors.cyan("3)")} Cursor         ${colors.dim("(.cursor/rules/context-factory.mdc, .cursorrules, AGENTS.md)")}`);
        console.log(`    ${colors.cyan("4)")} Trae           ${colors.dim("(.trae/rules/project_rules.md, AGENTS.md)")}`);
        console.log(`    ${colors.cyan("5)")} All IDEs       ${colors.dim("(Bridge for all team editors)")}`);

        const defaultHint = detectedIdes.length > 0 ? detectedIdes.join(",") : "5";
        const answer = await rl.question(`  ${colors.bold("Choice")} ${colors.dim(`[e.g. 1,4 or 5, default: ${defaultHint}]`)}: `);
        ide = parseIdeChoices(answer, detectedIdes);
      }

      // 4. Hook opt-in prompt
      if (!flags.hook) {
        const hookAnswer = await rl.question(`\n  ${colors.bold("Install local git pre-commit quality hook? [y/N]")}: `);
        installHookFlag = hookAnswer.trim().toLowerCase() === "y" || hookAnswer.trim().toLowerCase() === "yes";
      }

      // 5. Package manager prompt
      if (!pm) {
        const detected = detectPackageManager(resolvedTarget);
        console.log(`\n  ${colors.bold("Select Package Manager:")}`);
        console.log(`    ${colors.cyan("1)")} Auto-detect (${detected})`);
        console.log(`    ${colors.cyan("2)")} pnpm`);
        console.log(`    ${colors.cyan("3)")} npm`);
        console.log(`    ${colors.cyan("4)")} yarn`);
        console.log(`    ${colors.cyan("5)")} bun`);
        const answer = await rl.question(`  ${colors.bold("Choice")} ${colors.dim("[1-5, default: 1]")}: `);
        const choice = answer.trim();
        if (choice === "2") pm = "pnpm";
        else if (choice === "3") pm = "npm";
        else if (choice === "4") pm = "yarn";
        else if (choice === "5") pm = "bun";
        else pm = detected;
      }
    } finally {
      rl.close();
    }
  }

  // Non-interactive editor resolution (AC-03)
  if (ide) {
    ide = parseIdeChoices(typeof ide === "string" ? ide : (Array.isArray(ide) ? ide.join(",") : "all"));
  } else if (detectedIdes.length > 0) {
    ide = detectedIdes;
  } else {
    // AC-03: No detected editor requires an interactive choice or explicit --ide in automation
    const err = `No code editor configurations detected in "${resolvedTarget}". Please specify an editor with --ide <vscode|cursor|trae|antigravity|all> (or run interactively).`;
    if (isJson) {
      console.log(JSON.stringify({ success: false, error: err }, null, 2));
      return 1;
    }
    console.error(`\n${badges.fail()} ${colors.bold(colors.red(err))}\n`);
    return 1;
  }

  target = target || (submodCtx.isInsideSubmodule ? submodCtx.hostDir : process.cwd());
  method = method || (existsSync(resolve(target, ".git")) ? "submodule" : "linked");
  pm = pm || detectPackageManager(resolvedTarget);

  // If hook was opted into, install hook
  if (installHookFlag) {
    const hookResult = await installHook({
      targetDir: resolvedTarget,
      dryRun,
      force,
      preview: dryRun,
    });
    if (!hookResult.success && !isJson) {
      console.warn(`  ${badges.warn("HOOK")} ${hookResult.error}`);
    }
  }

  // Delegate directly to bridge command with resolved options
  return handleBridgeCommand(args, {
    ...flags,
    target: resolvedTarget,
    method,
    ide,
    pm,
    dryRun,
    force,
    preview: dryRun,
  });
}
