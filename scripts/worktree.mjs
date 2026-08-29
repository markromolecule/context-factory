#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { root } from "./context-core.mjs";

function runGit(command, options = {}) {
  try {
    return execSync(`git ${command}`, {
      cwd: options.cwd || root,
      encoding: "utf8",
      stdio: options.stdio || ["pipe", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    throw new Error(`Git error (${command}): ${stderr}`);
  }
}

/**
 * Creates an isolated git worktree for a concurrent agent.
 */
export async function createWorktree({
  agentId,
  branch = null,
  base = "HEAD",
  targetDir = null,
} = {}) {
  if (!agentId) throw new Error("createWorktree requires an agentId");

  const sanitizedId = agentId.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
  const branchName = branch || `agent/${sanitizedId}`;
  const relativeDir = targetDir || join(".worktrees", sanitizedId);
  const absoluteDir = isAbsolute(relativeDir) ? relativeDir : resolve(root, relativeDir);

  // Check if worktree directory already exists
  if (existsSync(absoluteDir)) {
    throw new Error(`Worktree directory already exists: ${relativeDir}`);
  }

  // Create worktree with new branch
  runGit(`worktree add -b "${branchName}" "${absoluteDir}" "${base}"`);

  return {
    agentId: sanitizedId,
    branch: branchName,
    path: relativeDir.replaceAll("\\", "/"),
    absolutePath: absoluteDir,
    base,
    created: true,
  };
}

/**
 * Lists all active git worktrees.
 */
export async function listWorktrees() {
  const output = runGit("worktree list --porcelain");
  const entries = [];
  const blocks = output.split("\n\n").filter(Boolean);

  for (const block of blocks) {
    const lines = block.split("\n");
    const entry = {};
    for (const line of lines) {
      if (line.startsWith("worktree ")) {
        entry.worktree = line.slice(9).trim();
      } else if (line.startsWith("HEAD ")) {
        entry.head = line.slice(5).trim();
      } else if (line.startsWith("branch ")) {
        entry.branch = line.slice(7).trim().replace(/^refs\/heads\//, "");
      } else if (line === "bare") {
        entry.bare = true;
      } else if (line === "detached") {
        entry.detached = true;
      }
    }
    if (entry.worktree) {
      entry.isRoot = resolve(entry.worktree) === resolve(root);
      const parts = entry.worktree.replaceAll("\\", "/").split("/");
      const wtIndex = parts.indexOf(".worktrees");
      if (wtIndex >= 0 && parts[wtIndex + 1]) {
        entry.agentId = parts[wtIndex + 1];
      }
      entries.push(entry);
    }
  }

  return entries;
}

/**
 * Removes an isolated git worktree and cleans up its branch.
 */
export async function removeWorktree({
  target,
  force = false,
  deleteBranch = true,
} = {}) {
  if (!target) throw new Error("removeWorktree requires an agentId or path");

  const worktrees = await listWorktrees();
  const sanitizedTarget = target.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");

  // Locate worktree entry
  const found = worktrees.find((w) => {
    if (w.isRoot) return false;
    if (w.agentId === sanitizedTarget) return true;
    if (resolve(w.worktree) === resolve(root, target)) return true;
    if (resolve(w.worktree) === resolve(target)) return true;
    return false;
  });

  const absoluteDir = found ? found.worktree : resolve(root, ".worktrees", sanitizedTarget);
  const branchToDelete = found?.branch || (deleteBranch ? `agent/${sanitizedTarget}` : null);

  const forceFlag = force ? " --force" : "";
  try {
    runGit(`worktree remove "${absoluteDir}"${forceFlag}`);
  } catch (err) {
    // If worktree command fails, prune and retry or report
    runGit("worktree prune");
    if (existsSync(absoluteDir)) throw err;
  }

  runGit("worktree prune");

  let branchDeleted = false;
  if (deleteBranch && branchToDelete) {
    try {
      runGit(`branch -D "${branchToDelete}"`);
      branchDeleted = true;
    } catch {
      // Branch may have already been removed or merged
      branchDeleted = false;
    }
  }

  return {
    target,
    path: absoluteDir,
    removed: true,
    branchDeleted,
    branch: branchToDelete,
  };
}

/**
 * Cleans up all agent worktrees under .worktrees/ and their branches.
 */
export async function cleanupWorktrees({ force = true, deleteBranches = true } = {}) {
  const worktrees = await listWorktrees();
  const agentWorktrees = worktrees.filter((w) => !w.isRoot && w.agentId);
  const removed = [];

  for (const wt of agentWorktrees) {
    const res = await removeWorktree({
      target: wt.agentId,
      force,
      deleteBranch: deleteBranches,
    });
    removed.push(res);
  }

  runGit("worktree prune");

  return {
    cleanedCount: removed.length,
    worktrees: removed,
  };
}

// CLI usage and argument routing
if (process.argv[1]?.endsWith("worktree.mjs")) {
  const argv = process.argv.slice(2);
  const command = argv[0] || "list";

  async function main() {
    if (command === "create") {
      const agentId = argv[1];
      if (!agentId) {
        console.error("Usage: node scripts/worktree.mjs create <agent-id> [--branch <name>] [--base <commit>]");
        process.exit(1);
      }
      const branchIdx = argv.indexOf("--branch");
      const branch = branchIdx >= 0 ? argv[branchIdx + 1] : null;
      const baseIdx = argv.indexOf("--base");
      const base = baseIdx >= 0 ? argv[baseIdx + 1] : "HEAD";

      const res = await createWorktree({ agentId, branch, base });
      console.log(`\n Created worktree for ${res.agentId}:`);
      console.log(`  Path:   ${res.path}`);
      console.log(`  Branch: ${res.branch}`);
      console.log(`  Base:   ${res.base}\n`);
      return;
    }

    if (command === "remove" || command === "rm") {
      const target = argv[1];
      if (!target) {
        console.error("Usage: node scripts/worktree.mjs remove <agent-id-or-path> [--force] [--keep-branch]");
        process.exit(1);
      }
      const force = argv.includes("--force");
      const keepBranch = argv.includes("--keep-branch");

      const res = await removeWorktree({
        target,
        force,
        deleteBranch: !keepBranch,
      });
      console.log(`\n Removed worktree at ${res.path} (branch deleted: ${res.branchDeleted})\n`);
      return;
    }

    if (command === "list" || command === "ls") {
      const isJson = argv.includes("--json");
      const list = await listWorktrees();
      if (isJson) {
        console.log(JSON.stringify(list, null, 2));
      } else {
        console.log(`\nActive Git Worktrees (${list.length}):\n`);
        for (const w of list) {
          const type = w.isRoot ? "[ROOT]" : `[AGENT: ${w.agentId || "custom"}]`;
          console.log(`  ${type.padEnd(24)} ${w.worktree}`);
          console.log(`  Branch: ${w.branch || "detached"} (HEAD: ${w.head || "unknown"})\n`);
        }
      }
      return;
    }

    if (command === "cleanup") {
      const keepBranches = argv.includes("--keep-branches");
      const res = await cleanupWorktrees({ force: true, deleteBranches: !keepBranches });
      console.log(`\n Cleaned up ${res.cleanedCount} agent worktrees.\n`);
      return;
    }

    console.error(`Unknown worktree command: ${command}`);
    console.error("Available: create, remove, list, cleanup");
    process.exit(1);
  }

  main().catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
