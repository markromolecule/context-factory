import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { root } from "../../../scripts/context-core.mjs";
import { badges, colors } from "../core/formatter.mjs";
import { handleDoctorCommand } from "./doctor.mjs";

function runGit(args, cwd) {
  const res = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
  });
  return {
    status: res.status,
    stdout: res.stdout?.trim() || "",
    stderr: res.stderr?.trim() || "",
  };
}

export async function handlePullCommand(args = [], flags = {}) {
  const targetDir = flags.target ? (isAbsolute(flags.target) ? flags.target : resolve(process.cwd(), flags.target)) : process.cwd();
  const isJson = Boolean(flags.json);
  const runDoctorAfter = flags.doctor !== false;
  const useRebase = Boolean(flags.rebase);
  const branch = flags.branch || null;

  console.log(`\n${badges.sync("PULL")} Pulling latest Context Factory updates\n`);

  // Detect whether target is a host repository with a bridge/submodule or the factory itself
  let isHostRepo = false;
  let factorySubmodulePath = null;
  let bridgeConfig = null;

  try {
    const bridgePath = join(targetDir, ".context-bridge.json");
    bridgeConfig = JSON.parse(await readFile(bridgePath, "utf8"));
    if (bridgeConfig.factoryPath) {
      isHostRepo = true;
      factorySubmodulePath = bridgeConfig.factoryPath;
    }
  } catch {
    // No .context-bridge.json
  }

  if (!isHostRepo) {
    try {
      const gitModules = await readFile(join(targetDir, ".gitmodules"), "utf8");
      if (gitModules.includes("context-factory")) {
        isHostRepo = true;
        // Try finding path
        const match = gitModules.match(/path\s*=\s*(.+)/);
        if (match) factorySubmodulePath = match[1].trim();
      }
    } catch {
      // No .gitmodules
    }
  }

  let pullResult;
  let repoCwd;

  if (isHostRepo) {
    const subPath = factorySubmodulePath || ".context-factory";
    repoCwd = targetDir;
    console.log(`  ${colors.bold("Host Repository:")}  ${colors.cyan(targetDir)}`);
    console.log(`  ${colors.bold("Submodule Path:")}   ${colors.cyan(subPath)}`);
    console.log(`  ${colors.bold("Strategy:")}         ${colors.magenta(useRebase ? "submodule update --rebase" : "submodule update --merge")}\n`);

    const gitArgs = ["submodule", "update", "--remote", useRebase ? "--rebase" : "--merge", subPath];
    pullResult = runGit(gitArgs, repoCwd);
  } else {
    // Direct pull inside context-factory repository
    repoCwd = root;
    console.log(`  ${colors.bold("Working Directory:")} ${colors.cyan(repoCwd)}`);
    console.log(`  ${colors.bold("Strategy:")}          ${colors.magenta("git pull")}\n`);

    const gitArgs = ["pull"];
    if (useRebase) gitArgs.push("--rebase");
    if (branch) gitArgs.push("origin", branch);
    pullResult = runGit(gitArgs, repoCwd);
  }

  if (pullResult.status !== 0) {
    console.error(`\n${badges.fail()} ${colors.bold(colors.red("Git pull failed:"))}`);
    if (pullResult.stderr) console.error(`  ${colors.yellow(pullResult.stderr)}`);
    if (pullResult.stdout) console.log(`  ${pullResult.stdout}`);
    console.log("");
    return 1;
  }

  const isUpToDate = pullResult.stdout.includes("Already up to date")
    || pullResult.stdout.includes("up to date")
    || pullResult.stdout === "";

  if (isUpToDate) {
    console.log(`  ${badges.pass("UP TO DATE")} Context Factory is already at the latest version.`);
  } else {
    console.log(`  ${badges.done("UPDATED")} ${colors.bold(colors.green("Successfully pulled latest changes:"))}`);
    console.log(`  ${colors.dim(pullResult.stdout)}\n`);
  }

  // Post-pull doctor diagnostics
  let doctorPassed = true;
  if (runDoctorAfter) {
    console.log(`\n${colors.bold("--- Verifying Context Factory Health After Pull ---")}`);
    const docCode = await handleDoctorCommand([], { json: isJson });
    doctorPassed = docCode === 0;
  }

  if (isHostRepo && !isUpToDate) {
    console.log(`\n${colors.bold("Tip for Host Repository:")}`);
    console.log(`  Commit the updated submodule pointer in your host git tree:`);
    console.log(`  ${colors.cyan(`git add ${factorySubmodulePath || ".context-factory"}`)}`);
    console.log(`  ${colors.cyan(`git commit -m "chore(context): update context-factory submodule"`)}\n`);
  }

  return (pullResult.status === 0 && doctorPassed) ? 0 : 1;
}
