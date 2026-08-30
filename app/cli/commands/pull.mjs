import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { root } from "../../../scripts/context-core.mjs";
import { badges, colors } from "../core/formatter.mjs";
import { repairBridgeSymlinks } from "../core/bridge-generator.mjs";
import { handleDoctorCommand } from "./doctor.mjs";

/**
 * Execute a git command synchronously in target working directory.
 */
export function runGit(args, cwd) {
  try {
    const res = spawnSync("git", args, {
      cwd,
      encoding: "utf8",
    });
    return {
      status: res.status ?? 1,
      stdout: res.stdout?.trim() || "",
      stderr: res.stderr?.trim() || "",
    };
  } catch (error) {
    return {
      status: 1,
      stdout: "",
      stderr: error.message || String(error),
    };
  }
}

/**
 * Verify if a directory is inside a git working tree.
 */
export function isGitRepo(cwd) {
  if (!cwd || !existsSync(cwd)) return false;
  const res = runGit(["rev-parse", "--is-inside-work-tree"], cwd);
  return res.status === 0 && res.stdout === "true";
}

/**
 * Get available git remotes for a repository.
 */
export function getGitRemotes(cwd) {
  const res = runGit(["remote"], cwd);
  if (res.status !== 0 || !res.stdout) return [];
  return res.stdout.split("\n").map((r) => r.trim()).filter(Boolean);
}

/**
 * Get the current checked out branch or null if in detached HEAD.
 */
export function getCurrentBranch(cwd) {
  const res = runGit(["branch", "--show-current"], cwd);
  if (res.status === 0 && res.stdout) {
    return res.stdout;
  }
  const abbrevRes = runGit(["rev-parse", "--abbrev-ref", "HEAD"], cwd);
  if (abbrevRes.status === 0 && abbrevRes.stdout && abbrevRes.stdout !== "HEAD") {
    return abbrevRes.stdout;
  }
  return null;
}

/**
 * Detect the default remote branch (e.g. master or main) from upstream remote.
 */
export function detectRemoteDefaultBranch(cwd, remote = "origin") {
  // Check if remote HEAD symref is configured
  const symRes = runGit(["symbolic-ref", `refs/remotes/${remote}/HEAD`], cwd);
  if (symRes.status === 0 && symRes.stdout) {
    const match = symRes.stdout.match(/refs\/remotes\/[^/]+\/(.+)/);
    if (match) return match[1];
  }

  // Probe remote branches
  const branchRes = runGit(["branch", "-r"], cwd);
  if (branchRes.status === 0 && branchRes.stdout) {
    const lines = branchRes.stdout.split("\n").map((l) => l.trim());
    if (lines.includes(`${remote}/master`)) return "master";
    if (lines.includes(`${remote}/main`)) return "main";
  }

  return "master";
}

/**
 * Perform a complete, robust Git fetch and pull inside a git repository directory.
 */
export function pullInGitDirectory(repoDir, {
  remote = null,
  branch = null,
  useRebase = false,
  autostash = false,
  force = false,
  isSubmodule = false,
} = {}) {
  if (!isGitRepo(repoDir)) {
    return {
      status: 1,
      stdout: "",
      stderr: `Directory is not a valid git repository: ${repoDir}`,
      branch: branch || "master",
      remote: remote || "origin",
    };
  }

  // 1. Resolve remote
  const availableRemotes = getGitRemotes(repoDir);
  const targetRemote = remote || (availableRemotes.includes("origin") ? "origin" : availableRemotes[0]) || "origin";

  // 2. Fetch latest refs, tags, and commits from remote
  const fetchRes = runGit(["fetch", targetRemote, "--tags", "--prune"], repoDir);
  if (fetchRes.status !== 0) {
    return {
      status: fetchRes.status,
      stdout: fetchRes.stdout,
      stderr: `Failed to fetch from remote "${targetRemote}": ${fetchRes.stderr}`,
      branch: branch || "master",
      remote: targetRemote,
    };
  }

  // 3. Resolve target branch
  const currentBranch = getCurrentBranch(repoDir);
  const targetBranch = branch || currentBranch || detectRemoteDefaultBranch(repoDir, targetRemote) || "master";

  // 4. Handle detached HEAD state (common in submodules and CI checkouts)
  if (!currentBranch) {
    if (isSubmodule || force) {
      // Switch or checkout the target branch
      const checkoutRes = runGit(["checkout", targetBranch], repoDir);
      if (checkoutRes.status !== 0) {
        // Create local branch tracking remote branch if checkout failed
        runGit(["checkout", "-B", targetBranch, `${targetRemote}/${targetBranch}`], repoDir);
      }
    }
  }

  // 5. Execute git pull
  const pullArgs = ["pull"];
  if (useRebase) pullArgs.push("--rebase");
  if (autostash) pullArgs.push("--autostash");
  pullArgs.push(targetRemote, targetBranch);

  const pullResult = runGit(pullArgs, repoDir);

  return {
    status: pullResult.status,
    stdout: pullResult.stdout,
    stderr: pullResult.stderr,
    branch: targetBranch,
    remote: targetRemote,
    fetchOutput: fetchRes.stdout || fetchRes.stderr,
  };
}

export async function handlePullCommand(args = [], flags = {}) {
  const targetDir = flags.target ? (isAbsolute(flags.target) ? flags.target : resolve(process.cwd(), flags.target)) : process.cwd();
  const isJson = Boolean(flags.json);
  const runDoctorAfter = flags.doctor !== false;
  const useRebase = Boolean(flags.rebase);
  const autostash = Boolean(flags.autostash);
  const force = Boolean(flags.force);
  const branch = flags.branch || null;
  const remote = flags.remote || null;

  if (!isJson) {
    console.log(`\n${badges.sync("PULL")} Pulling latest Context Factory updates\n`);
  }

  // Detect whether target is a host repository with a bridge/submodule or the factory itself
  let isHostRepo = false;
  let factorySubmodulePath = null;
  let bridgeConfig = null;
  let integrationMethod = "submodule";

  // 1. Check local .gitmodules first (if host repo embeds context-factory as a git submodule)
  try {
    const gitModules = await readFile(join(targetDir, ".gitmodules"), "utf8");
    if (gitModules.includes("context-factory")) {
      isHostRepo = true;
      integrationMethod = "submodule";
      const match = gitModules.match(/path\s*=\s*(.+)/);
      if (match) {
        const p = match[1].trim();
        if (existsSync(join(targetDir, p))) {
          factorySubmodulePath = p;
        }
      }
    }
  } catch {
    // No .gitmodules
  }

  // 2. Check .context-bridge.json if not resolved from .gitmodules
  if (!factorySubmodulePath) {
    try {
      const bridgePath = join(targetDir, ".context-bridge.json");
      bridgeConfig = JSON.parse(await readFile(bridgePath, "utf8"));
      if (bridgeConfig.factoryPath && bridgeConfig.factoryPath !== ".") {
        isHostRepo = true;
        factorySubmodulePath = bridgeConfig.factoryPath;
        integrationMethod = bridgeConfig.integrationMethod || "submodule";
      }
    } catch {
      // No .context-bridge.json
    }
  }

  let pullResult;
  let repoCwd;
  let subPath = null;

  if (isHostRepo) {
    subPath = factorySubmodulePath || ".context-factory";
    const absFactoryPath = resolve(targetDir, subPath);
    repoCwd = targetDir;

    if (!isJson) {
      console.log(`  ${colors.bold("Host Repository:")}  ${colors.cyan(targetDir)}`);
      console.log(`  ${colors.bold("Factory Path:")}     ${colors.cyan(subPath)}`);
      console.log(`  ${colors.bold("Integration Mode:")} ${colors.magenta(integrationMethod)}`);
      console.log(`  ${colors.bold("Strategy:")}         ${colors.magenta(useRebase ? "git pull --rebase" : "git pull --merge")}\n`);
    }

    if (integrationMethod === "subtree") {
      // Subtree pull
      const subtreeArgs = ["subtree", "pull", "--prefix", subPath, remote || "origin", branch || "master", "--squash"];
      pullResult = runGit(subtreeArgs, repoCwd);
      pullResult.branch = branch || "master";
      pullResult.remote = remote || "origin";
    } else if (integrationMethod === "submodule") {
      // Submodule sync and init first
      runGit(["submodule", "sync", "--recursive", subPath], repoCwd);
      runGit(["submodule", "update", "--init", "--recursive", subPath], repoCwd);

      // Direct pull inside submodule directory to guarantee latest GitHub commits
      if (existsSync(absFactoryPath)) {
        pullResult = pullInGitDirectory(absFactoryPath, {
          remote,
          branch,
          useRebase,
          autostash,
          force,
          isSubmodule: true,
        });
      }

      // Update host superproject submodule tracking index
      const submoduleArgs = ["submodule", "update", "--remote", "--init", "--recursive", useRebase ? "--rebase" : "--merge", subPath];
      const hostSubResult = runGit(submoduleArgs, repoCwd);
      if (!pullResult || pullResult.status !== 0) {
        pullResult = hostSubResult;
      }
    } else {
      // Standalone clone or directory
      if (existsSync(absFactoryPath) && isGitRepo(absFactoryPath)) {
        pullResult = pullInGitDirectory(absFactoryPath, {
          remote,
          branch,
          useRebase,
          autostash,
          force,
        });
      } else {
        pullResult = {
          status: 1,
          stdout: "",
          stderr: `Factory path "${subPath}" is not a git repository and cannot be updated via git pull.`,
          branch: branch || "master",
          remote: remote || "origin",
        };
      }
    }
  } else {
    // Direct pull inside context-factory repository
    repoCwd = isGitRepo(targetDir) ? targetDir : root;

    if (!isJson) {
      console.log(`  ${colors.bold("Working Directory:")} ${colors.cyan(repoCwd)}`);
      console.log(`  ${colors.bold("Strategy:")}          ${colors.magenta(useRebase ? "git pull --rebase" : "git pull")}\n`);
    }

    pullResult = pullInGitDirectory(repoCwd, {
      remote,
      branch,
      useRebase,
      autostash,
      force,
    });
  }

  if (pullResult.status !== 0) {
    if (isJson) {
      console.log(JSON.stringify({
        success: false,
        error: pullResult.stderr || "Git pull failed",
        stdout: pullResult.stdout,
        targetDir,
      }, null, 2));
      return 1;
    }

    console.error(`\n${badges.fail()} ${colors.bold(colors.red("Git pull failed:"))}`);
    if (pullResult.stderr) console.error(`  ${colors.yellow(pullResult.stderr)}`);
    if (pullResult.stdout) console.log(`  ${pullResult.stdout}`);
    console.log("");
    if (pullResult.stderr?.includes("uncommitted changes") || pullResult.stderr?.includes("would be overwritten")) {
      console.log(`  ${colors.bold("Tip:")} Stash your local changes before pulling, or run:`);
      console.log(`  ${colors.cyan("context-cli pull --autostash")}\n`);
    }
    return 1;
  }

  const combinedOutput = `${pullResult.stdout}\n${pullResult.stderr}`;
  const isUpToDate = combinedOutput.includes("Already up to date")
    || combinedOutput.includes("up to date")
    || combinedOutput.includes("Current branch is up to date")
    || (pullResult.stdout === "" && !combinedOutput.includes("Updating") && !combinedOutput.includes("Fast-forward"));

  if (!isJson) {
    if (isUpToDate) {
      console.log(`  ${badges.pass("UP TO DATE")} Context Factory is already at the latest version (${pullResult.remote}/${pullResult.branch}).`);
    } else {
      console.log(`  ${badges.done("UPDATED")} ${colors.bold(colors.green("Successfully pulled latest changes from GitHub:"))}`);
      if (pullResult.stdout) console.log(`  ${colors.dim(pullResult.stdout)}`);
      console.log("");
    }
  }

  // Post-pull symlink repair for host repos
  if (isHostRepo) {
    try {
      await repairBridgeSymlinks(targetDir);
      if (!isJson) {
        console.log(`  ${badges.done("SYNCED")} Auto-healed .agents/ symlinks in host repository.`);
      }
    } catch {
      // Ignored if non-fatal
    }
  }

  // Post-pull doctor diagnostics
  let doctorPassed = true;
  if (runDoctorAfter) {
    const doctorTarget = isHostRepo ? targetDir : repoCwd;
    if (!isJson) {
      console.log(`\n${colors.bold("--- Verifying Context Factory Health After Pull ---")}`);
    }
    const docCode = await handleDoctorCommand([], { json: isJson, target: doctorTarget });
    doctorPassed = docCode === 0;
  }

  if (isHostRepo && !isUpToDate && !isJson) {
    console.log(`\n${colors.bold("Tip for Host Repository:")}`);
    console.log(`  Commit the updated submodule pointer in your host git tree:`);
    console.log(`  ${colors.cyan(`git add ${subPath || ".context-factory"}`)}`);
    console.log(`  ${colors.cyan(`git commit -m "chore(context): update context-factory submodule"`)}\n`);
  }

  if (isJson) {
    console.log(JSON.stringify({
      success: pullResult.status === 0 && doctorPassed,
      isUpToDate,
      remote: pullResult.remote,
      branch: pullResult.branch,
      targetDir,
      doctorPassed,
      stdout: pullResult.stdout,
    }, null, 2));
  }

  return (pullResult.status === 0 && doctorPassed) ? 0 : 1;
}
