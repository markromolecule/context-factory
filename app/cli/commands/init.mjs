import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { badges, colors } from "../core/formatter.mjs";
import { handleBridgeCommand } from "./bridge.mjs";

/**
 * Handles interactive and flag-based initialization for a host project.
 */
export async function handleInitCommand(args = [], flags = {}) {
  let target = flags.target || args[0] || null;
  let method = flags.method || null;
  let ide = flags.ide || flags.agents || null;
  const dryRun = Boolean(flags.dryRun);
  const force = Boolean(flags.force);

  const isInteractive = input.isTTY && !flags.quiet && !flags.json && !flags.nonInteractive;

  if (!flags.json) {
    console.log(`\n${badges.init("INIT")} ${colors.bold(colors.cyan("Initialize Context Factory in Project"))}\n`);
  }

  if (isInteractive && (!target || !method || !ide)) {
    const rl = createInterface({ input, output });

    try {
      // 1. Target directory prompt
      if (!target) {
        const defaultTarget = ".";
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

      // 3. IDE profile prompt
      if (!ide) {
        console.log(`\n  ${colors.bold("Select Target IDEs:")}`);
        console.log(`    ${colors.cyan("1)")} All IDEs ${colors.dim("(Antigravity, Cursor, Windsurf, Claude Code, Copilot)")}`);
        console.log(`    ${colors.cyan("2)")} Antigravity & Gemini ${colors.dim("(.agents/ symlinks, AGENTS.md, GEMINI.md)")}`);
        console.log(`    ${colors.cyan("3)")} Cursor ${colors.dim("(.cursorrules, AGENTS.md)")}`);
        console.log(`    ${colors.cyan("4)")} Claude Code ${colors.dim("(CLAUDE.md, AGENTS.md)")}`);
        const answer = await rl.question(`  ${colors.bold("Choice")} ${colors.dim("[1-4, default: 1]")}: `);
        const choice = answer.trim();
        if (choice === "2") {
          ide = "antigravity";
        } else if (choice === "3") {
          ide = "cursor";
        } else if (choice === "4") {
          ide = "claude";
        } else {
          ide = "all";
        }
      }
    } finally {
      rl.close();
    }
  }

  // Fallbacks for non-interactive mode
  target = target || process.cwd();
  method = method || (existsSync(resolve(target, ".git")) ? "submodule" : "linked");
  ide = ide || "all";

  // Delegate directly to bridge command with resolved options
  return handleBridgeCommand(args, {
    ...flags,
    target,
    method,
    ide,
    dryRun,
    force,
  });
}
