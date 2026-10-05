import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { badges, colors } from "../core/formatter.mjs";
import {
  checkHostSubmoduleStatus,
  detectInstalledIdes,
  detectPackageManager,
  detectSubmoduleContext,
  parseIdeChoices,
} from "../core/bridge-generator.mjs";
import { handleBridgeCommand } from "./bridge.mjs";

/**
 * Handles interactive and flag-based initialization for a host project.
 */
export async function handleInitCommand(args = [], flags = {}) {
  let target = flags.target || args[0] || null;
  let method = flags.method || null;
  let ide = flags.ide || flags.agents || null;
  let pm = flags.pm || flags.packageManager || null;
  const dryRun = Boolean(flags.dryRun);
  const force = Boolean(flags.force);

  const submodCtx = detectSubmoduleContext(process.cwd());
  const defaultTarget = submodCtx.isInsideSubmodule ? submodCtx.hostDir : ".";

  const isInteractive = input.isTTY && !flags.quiet && !flags.json && !flags.nonInteractive;

  if (!flags.json) {
    console.log(`\n${badges.init("INIT")} ${colors.bold(colors.cyan("Initialize Context Factory in Project"))}\n`);
    if (submodCtx.isInsideSubmodule) {
      console.log(`  ${badges.info("SUBMODULE")} ${colors.dim("Detected execution from inside submodule")} ${colors.cyan(submodCtx.submoduleDirName)} ${colors.dim("-> host target:")} ${colors.cyan(defaultTarget)}\n`);
    }
  }

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
        const resolvedTarget = resolve(process.cwd(), target || defaultTarget);
        const isGitRepo = existsSync(resolve(resolvedTarget, ".git"));
        const hostSubmodStatus = checkHostSubmoduleStatus(resolvedTarget);

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
        const resolvedTarget = resolve(process.cwd(), target || defaultTarget);
        const detectedIdes = detectInstalledIdes(resolvedTarget);

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

      // 4. Package manager prompt
      if (!pm) {
        const detected = detectPackageManager(resolve(process.cwd(), target || "."));
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

  // Fallbacks for non-interactive mode
  target = target || (submodCtx.isInsideSubmodule ? submodCtx.hostDir : process.cwd());
  method = method || (existsSync(resolve(target, ".git")) ? "submodule" : "linked");
  ide = ide || "all";
  pm = pm || detectPackageManager(resolve(process.cwd(), target));

  // Delegate directly to bridge command with resolved options
  return handleBridgeCommand(args, {
    ...flags,
    target,
    method,
    ide,
    pm,
    dryRun,
    force,
  });
}
