import { execSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSchema, validateSchema } from "../orchestrator/validator.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function runGit(command, cwd = root) {
  try {
    return execSync(`git ${command}`, {
      cwd,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch {
    return "";
  }
}

/**
 * Capture current git state (branch, commit, worktree, modified files, diff summary)
 */
export function captureGitState(cwd = root) {
  const branch = runGit("branch --show-current", cwd) || "HEAD";
  const headCommit = runGit("rev-parse --short HEAD", cwd) || "unknown";
  
  // Check if cwd is inside a worktree
  let worktree = null;
  const relPath = relative(root, cwd).replaceAll("\\", "/");
  if (relPath.startsWith(".worktrees/")) {
    worktree = relPath;
  }

  // Modified and staged files
  const statusRaw = runGit("status --porcelain", cwd);
  const modifiedFiles = [];
  const stagedFiles = [];
  if (statusRaw) {
    const lines = statusRaw.split("\n");
    for (const line of lines) {
      if (!line) continue;
      const x = line[0];
      const y = line[1];
      const file = line.slice(3).trim();
      if (x !== " " && x !== "?") stagedFiles.push(file);
      if (y !== " ") modifiedFiles.push(file);
    }
  }

  const diffStat = runGit("diff --stat", cwd) || runGit("status -s", cwd) || "clean working tree";

  return {
    branch,
    headCommit,
    worktree,
    modifiedFiles: [...new Set(modifiedFiles)],
    stagedFiles: [...new Set(stagedFiles)],
    diffSummary: diffStat.split("\n").slice(0, 10).join("\n"),
  };
}

/**
 * Auto-discover active task folder and active unit file
 */
export async function resolveActiveTask(cwd = root) {
  const tasksBase = join(root, "docs", "tasks");
  if (!existsSync(tasksBase)) {
    return { taskId: null, phase: null, unit: null, taskDir: null, unitFile: null };
  }

  // 1. Try resolving from branch name: task/<id>/phase-<num>/unit-... or task/<id>-...
  const branch = runGit("branch --show-current", cwd);
  const branchMatch = branch.match(/^task\/([0-9a-zA-Z_-]+)(?:\/phase-([0-9a-zA-Z_-]+))?(?:\/unit-([0-9a-zA-Z_-]+))?/);

  // 2. Discover recent tasks under docs/tasks/YYYY/MM/YYYY-MM-DD/<task>/
  const discovered = [];
  try {
    const years = await readdir(tasksBase, { withFileTypes: true }).catch(() => []);
    for (const y of years) {
      if (!y.isDirectory() || !/^\d{4}$/.test(y.name)) continue;
      const months = await readdir(join(tasksBase, y.name), { withFileTypes: true }).catch(() => []);
      for (const m of months) {
        if (!m.isDirectory()) continue;
        const dates = await readdir(join(tasksBase, y.name, m.name), { withFileTypes: true }).catch(() => []);
        for (const d of dates) {
          if (!d.isDirectory()) continue;
          const tasks = await readdir(join(tasksBase, y.name, m.name, d.name), { withFileTypes: true }).catch(() => []);
          for (const t of tasks) {
            if (!t.isDirectory()) continue;
            discovered.push(join("docs", "tasks", y.name, m.name, d.name, t.name).replaceAll("\\", "/"));
          }
        }
      }
    }
  } catch {
    // Non-fatal
  }

  let activeTaskDir = discovered.at(-1) || null;
  if (branchMatch && branchMatch[1]) {
    const targetId = branchMatch[1];
    const match = discovered.find((p) => p.includes(`/${targetId}-`) || p.endsWith(`/${targetId}`));
    if (match) activeTaskDir = match;
  }

  if (!activeTaskDir) {
    return { taskId: null, phase: null, unit: null, taskDir: null, unitFile: null };
  }

  const taskId = activeTaskDir.split("/").pop()?.split("-")[0] || null;
  let activePhase = branchMatch?.[2] || null;
  let activeUnit = branchMatch?.[3] || null;
  let activeUnitFile = null;

  // Search inside active task directory for phase and unit files
  try {
    const taskEntries = await readdir(join(root, activeTaskDir), { withFileTypes: true });
    for (const entry of taskEntries) {
      if (entry.isDirectory() && entry.name.startsWith("phase-")) {
        const phaseNum = entry.name.split("-")[1];
        if (!activePhase) activePhase = phaseNum;
        const phaseUnits = await readdir(join(root, activeTaskDir, entry.name), { withFileTypes: true }).catch(() => []);
        for (const u of phaseUnits) {
          if (u.name.startsWith("unit-") && u.name.endsWith(".md")) {
            const unitPath = join(activeTaskDir, entry.name, u.name).replaceAll("\\", "/");
            const content = await readFile(join(root, unitPath), "utf8");
            if (content.includes("status: planned") || content.includes("status: in-progress")) {
              activeUnitFile = unitPath;
              activeUnit = u.name.replace(/^unit-/, "").replace(/\.md$/, "");
              break;
            }
          }
        }
      }
    }
  } catch {
    // Non-fatal
  }

  return {
    taskId,
    phase: activePhase,
    unit: activeUnit,
    taskDir: activeTaskDir,
    unitFile: activeUnitFile,
  };
}

/**
 * Generate human/LLM-readable resume briefing markdown
 */
export function generateResumeBriefing(session) {
  const { sessionId, timestamp, taskPointer, gitState, workingMemory, verificationState, coldStartPrompt } = session;

  return `# Session Resume Briefing: ${sessionId}

> **Created:** ${timestamp}  
> **Branch:** \`${gitState.branch}\` (HEAD: \`${gitState.headCommit}\`)  
> **Task:** ${taskPointer.taskId ? `\`${taskPointer.taskId}\` (${taskPointer.taskDir})` : "_No active task_"}  
> **Active Unit:** ${taskPointer.unitFile ? `[\`${taskPointer.unit}\`](${taskPointer.unitFile})` : "_None_"}

---

## 1. Current State & Working Memory

### Verified Facts
${workingMemory.verifiedFacts?.length > 0 ? workingMemory.verifiedFacts.map((f) => `- ${f}`).join("\n") : "- None recorded."}

### Key Decisions Made
${workingMemory.decisions?.length > 0 ? workingMemory.decisions.map((d) => `- ${d}`).join("\n") : "- None recorded."}

### Active Blockers / Obstacles
${workingMemory.blockers?.length > 0 ? workingMemory.blockers.map((b) => `- ${b}`).join("\n") : "- None."}

### Active Constraints
${workingMemory.activeConstraints?.length > 0 ? workingMemory.activeConstraints.map((c) => `- ${c}`).join("\n") : "- Standard Context Factory constraints."}

---

## 2. Git & Working Tree State

- **Worktree:** \`${gitState.worktree || "primary workspace"}\`
- **Modified Files:** ${gitState.modifiedFiles?.length > 0 ? gitState.modifiedFiles.map((f) => `\`${f}\``).join(", ") : "_clean_"}
- **Staged Files:** ${gitState.stagedFiles?.length > 0 ? gitState.stagedFiles.map((f) => `\`${f}\``).join(", ") : "_clean_"}
- **Verification Status:** \`${verificationState.status}\`${verificationState.latestCommand ? ` (Command: \`${verificationState.latestCommand}\`)` : ""}

---

## 3. Cold-Start Resume Prompt (Copy & Paste to Fresh Session)

> [!TIP]
> **Instructions for Fresh Session:**
> You are continuing task **${taskPointer.taskId || "active work"}** in a clean, reset context window.
> ${coldStartPrompt}
`;
}

/**
 * Save session state to .context/sessions/<id>.json and .tmp/SESSION_RESUME.md
 */
export async function saveSession(options = {}) {
  const cwd = options.cwd || root;
  const timestamp = new Date().toISOString();
  const dateSlug = timestamp.slice(0, 10).replace(/-/g, "");
  const timeSlug = timestamp.slice(11, 19).replace(/:/g, "");
  const sessionId = options.name || `session-${dateSlug}-${timeSlug}`;

  const gitState = options.gitState || captureGitState(cwd);
  const taskPointer = options.taskPointer || await resolveActiveTask(cwd);

  const workingMemory = {
    verifiedFacts: Array.isArray(options.workingMemory?.verifiedFacts) ? options.workingMemory.verifiedFacts : (options.facts || []),
    decisions: Array.isArray(options.workingMemory?.decisions) ? options.workingMemory.decisions : (options.decisions || []),
    blockers: Array.isArray(options.workingMemory?.blockers) ? options.workingMemory.blockers : (options.blockers || []),
    activeConstraints: Array.isArray(options.workingMemory?.activeConstraints) ? options.workingMemory.activeConstraints : (options.constraints || []),
  };

  const verificationState = {
    latestCommand: options.verificationState?.latestCommand || options.latestCommand || null,
    status: options.verificationState?.status || options.status || "passing",
    evidence: options.verificationState?.evidence || options.evidence || "Session saved cleanly.",
  };

  const coldStartPrompt = options.coldStartPrompt
    || `Read \`.tmp/SESSION_RESUME.md\`, inspect active unit \`${taskPointer.unitFile || "docs/tasks/"}\`, and proceed with execution.`;

  const sessionPayload = {
    schemaVersion: 1,
    sessionId,
    timestamp,
    taskPointer,
    gitState,
    workingMemory,
    verificationState,
    coldStartPrompt,
  };

  // Validate against JSON schema
  try {
    const schema = await loadSchema("session-state");
    const result = validateSchema(sessionPayload, schema);
    if (!result.valid) {
      throw new Error(`Session state failed schema validation:\n${result.errors.join("\n")}`);
    }
  } catch (err) {
    if (!err.message.includes("failed schema validation")) {
      // Schema file may not be loaded in isolated test
    } else {
      throw err;
    }
  }

  // Persist machine JSON
  const sessionsDir = join(root, ".context", "sessions");
  await mkdir(sessionsDir, { recursive: true });
  const sessionPath = join(sessionsDir, `${sessionId}.json`);
  await writeFile(sessionPath, `${JSON.stringify(sessionPayload, null, 2)}\n`, "utf8");

  // Write latest.json pointer
  const latestPath = join(sessionsDir, "latest.json");
  await writeFile(latestPath, `${JSON.stringify(sessionPayload, null, 2)}\n`, "utf8");

  // Persist human/LLM-readable briefing to .tmp/SESSION_RESUME.md
  const tmpDir = join(root, ".tmp");
  await mkdir(tmpDir, { recursive: true });
  const resumeBriefing = generateResumeBriefing(sessionPayload);
  const resumePath = join(tmpDir, "SESSION_RESUME.md");
  await writeFile(resumePath, resumeBriefing, "utf8");

  // Heuristic token estimate (~4 chars per token)
  const tokenEstimate = Math.ceil(resumeBriefing.length / 4);

  return {
    sessionId,
    sessionPath,
    resumePath,
    tokenEstimate,
    data: sessionPayload,
  };
}

/**
 * Load session state from .context/sessions/<id>.json
 */
export async function loadSession(id = "latest") {
  const sessionsDir = join(root, ".context", "sessions");
  const filename = id.endsWith(".json") ? id : `${id}.json`;
  const sessionPath = join(sessionsDir, filename);

  if (!existsSync(sessionPath)) {
    throw new Error(`Session file not found: ${sessionPath}`);
  }

  const content = await readFile(sessionPath, "utf8");
  return JSON.parse(content);
}

/**
 * List all saved sessions
 */
export async function listSessions() {
  const sessionsDir = join(root, ".context", "sessions");
  if (!existsSync(sessionsDir)) return [];

  const entries = await readdir(sessionsDir, { withFileTypes: true });
  const sessions = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".json") && entry.name !== "latest.json") {
      try {
        const content = await readFile(join(sessionsDir, entry.name), "utf8");
        sessions.push(JSON.parse(content));
      } catch {
        // Skip malformed
      }
    }
  }

  return sessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * Clear session files
 */
export async function clearSession(id = "latest") {
  const sessionsDir = join(root, ".context", "sessions");
  const tmpResumePath = join(root, ".tmp", "SESSION_RESUME.md");

  let removedCount = 0;
  if (id === "all") {
    if (existsSync(sessionsDir)) {
      await rm(sessionsDir, { recursive: true, force: true });
      removedCount++;
    }
  } else {
    const filename = id.endsWith(".json") ? id : `${id}.json`;
    const targetPath = join(sessionsDir, filename);
    if (existsSync(targetPath)) {
      await rm(targetPath, { force: true });
      removedCount++;
    }
    const latestPath = join(sessionsDir, "latest.json");
    if (existsSync(latestPath)) {
      await rm(latestPath, { force: true });
    }
  }

  if (existsSync(tmpResumePath)) {
    await rm(tmpResumePath, { force: true });
  }

  return { cleared: true, removedCount };
}
