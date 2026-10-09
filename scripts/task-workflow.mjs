import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { frontmatter, readText, root } from "./context-core.mjs";
import {
  createPlanBranchName,
  planFilenameForBranch,
  previewNextPlanId,
  releasePlanIdReservation,
  reserveNextPlanId,
  validatePlanSlug,
} from "./plan-id-reservation.mjs";

const DEFAULT_PHASES = {
  feature: [
    { title: "Phase 1 — Discovery, Scenarios, and Boundary Analysis", slug: "discovery-and-scenarios" },
    { title: "Phase 2 — Architecture, Contracts, and Data Modeling", slug: "architecture-and-contracts" },
    { title: "Phase 3 — Incremental Implementation and Tests", slug: "implementation-and-tests" },
    { title: "Phase 4 — Verification, Quality Gates, and Release", slug: "verification-and-release" },
  ],
  defect: [
    { title: "Phase 1 — Reproduction Test and Root Cause Analysis", slug: "reproduction-test" },
    { title: "Phase 2 — Focused Defect Fix and Invariant Protection", slug: "root-cause-fix" },
    { title: "Phase 3 — Regression Verification and Quality Gate", slug: "regression-verification" },
  ],
  refactor: [
    { title: "Phase 1 — Current State Mapping and Contract Pinning", slug: "boundary-analysis" },
    { title: "Phase 2 — Vertical Slice Refactoring", slug: "vertical-slice-refactoring" },
    { title: "Phase 3 — Comprehensive Integration and Verification", slug: "integration-tests" },
  ],
  migration: [
    { title: "Phase 1 — Schema Modeling and Forward Migration", slug: "schema-and-forward-migration" },
    { title: "Phase 2 — Rollback Script and Data Integrity Check", slug: "rollback-and-data-integrity" },
    { title: "Phase 3 — Consumer Verification and Type Generation", slug: "consumer-verification" },
  ],
};

const BRANCH_TYPE_ALIASES = {
  feature: "feat",
  defect: "fix",
};

const PHASE_PROFILE_BY_BRANCH_TYPE = {
  feat: "feature",
  fix: "defect",
  refactor: "refactor",
  migration: "migration",
  chore: "feature",
  docs: "feature",
  test: "feature",
  perf: "feature",
  build: "feature",
  ci: "feature",
};

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function resolveScaffoldType(type) {
  const branchType = BRANCH_TYPE_ALIASES[type] ?? type;
  const phaseProfile = PHASE_PROFILE_BY_BRANCH_TYPE[branchType];
  if (!phaseProfile) throw new Error(`Unsupported plan type: ${type}`);
  return { branchType, phaseProfile };
}

export async function findNextTaskId(year, month, dayStr, targetDir = process.cwd()) {
  const dayDir = join(targetDir, "docs/tasks", year, month, dayStr);
  let maxId = 0;
  if (existsSync(dayDir)) {
    const entries = await readdir(dayDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const match = entry.name.match(/^(\d{4})-/);
        if (match) {
          const num = Number.parseInt(match[1], 10);
          if (num > maxId) maxId = num;
        }
      }
    }
  }
  return String(maxId + 1).padStart(4, "0");
}

export async function scaffoldTask({ title, type = "feature", customPhases = null, dryRun = false, includeUnits = true, targetDir = process.cwd(), targetBranch }) {
  if (!title) throw new Error("Task title is required");
  const { branchType, phaseProfile } = resolveScaffoldType(type);
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const taskSlug = slugify(title);
  validatePlanSlug(taskSlug);
  const reservation = dryRun ? null : await reserveNextPlanId({ repository: targetDir });
  const taskId = reservation?.id ?? await previewNextPlanId({ repository: targetDir });
  const baseBranch = createPlanBranchName({ type: branchType, id: taskId, slug: taskSlug });
  if (!dryRun) {
    try {
      if (!targetBranch) throw new Error("Specify the intended target base with --base before creating a plan.");
      const current = execFileSync("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], { cwd: targetDir, encoding: "utf8" }).trim();
      if (current !== baseBranch) throw new Error(`Expected task branch ${baseBranch}; current branch is ${current}.`);
      const dirty = execFileSync("git", ["status", "--porcelain"], { cwd: targetDir, encoding: "utf8" }).trim();
      if (dirty) throw new Error(`Plan checkout contains uncommitted changes:\n${dirty}`);
      const base = execFileSync("git", ["rev-parse", targetBranch], { cwd: targetDir, encoding: "utf8" }).trim();
      const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: targetDir, encoding: "utf8" }).trim();
      if (base !== head) throw new Error(`Task branch does not start at target base ${targetBranch} (${base}).`);
    } catch (error) {
      if (reservation) await releasePlanIdReservation({ repository: targetDir, id: reservation.id, owner: reservation.owner });
      throw error;
    }
  }
  let baseCommit = "pending";
  try { baseCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: targetDir, encoding: "utf8" }).trim(); } catch { /* dry-run may target a fixture */ }
  const planFilename = planFilenameForBranch(baseBranch);
  const taskFolderName = planFilename.replace(/\.md$/, "");
  const taskRelativeDir = join("docs/tasks", year, month, dateStr, taskFolderName).replaceAll("\\", "/");
  const taskPlanPath = join("docs/tasks", year, month, dateStr, planFilename).replaceAll("\\", "/");

  let taskTemplate, phaseTemplate, unitTemplate;
  try {
    taskTemplate = await readFile(join(targetDir, "docs/templates/Task.md"), "utf8");
  } catch {
    taskTemplate = await readText("docs/templates/Task.md");
  }
  try {
    phaseTemplate = await readFile(join(targetDir, "docs/templates/Phase.md"), "utf8");
  } catch {
    phaseTemplate = await readText("docs/templates/Phase.md");
  }
  try {
    unitTemplate = await readFile(join(targetDir, "docs/templates/Unit.md"), "utf8");
  } catch {
    unitTemplate = await readText("docs/templates/Unit.md");
  }

  const phases = customPhases ?? DEFAULT_PHASES[phaseProfile];
  const phaseListMarkdown = phases
    .map((p, idx) => {
      const pNum = String(idx + 1).padStart(2, "0");
      return `- [ ] \`phase-${pNum}-${p.slug}/phase.md\` — ${p.title}`;
    })
    .join("\n");

  const renderedTask = taskTemplate
    .replaceAll("{{title}}", title)
    .replaceAll("{{date}}", dateStr)
    .replaceAll("{{task_id}}", taskId)
    .replaceAll("{{task_slug}}", taskSlug)
    .replaceAll("{{task_branch}}", baseBranch)
    .replaceAll("{{base_commit}}", baseCommit)
    .replaceAll("{{target_branch}}", targetBranch || "main")
    .replaceAll(`task/${taskId}-${taskSlug}`, baseBranch)
    .replace(/- \[ \] `phase-01-<feature>\.md`[\s\S]*?- \[ \] `phase-02-<feature>\.md`[^\n]*/, phaseListMarkdown);

  const filesToWrite = [
    {
      path: taskPlanPath,
      content: renderedTask,
    },
  ];

  const units = [];

  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    const pNum = String(i + 1).padStart(2, "0");
    const phaseDirName = `phase-${pNum}-${p.slug}`;
    const phasePath = `${taskRelativeDir}/${phaseDirName}/phase.md`;
    const unitSlug = `unit-01-${p.slug}`;
    const unitTitle = `${p.title} Starter`;
    const unitFilename = `${unitSlug}.md`;

    const renderedPhase = phaseTemplate
      .replaceAll("{{title}}", p.title)
      .replaceAll("{{task_id}}", taskId)
      .replaceAll("{{parent_task}}", taskFolderName)
      .replaceAll("{{phase_number}}", pNum)
      .replaceAll("{{phase_slug}}", p.slug)
      .replaceAll("{{task_branch}}", baseBranch)
      .replaceAll("{{base_commit}}", baseCommit)
      .replaceAll("{{unit_title}}", unitTitle)
      .replaceAll("{{unit_filename}}", unitFilename)
      .replaceAll("{{date}}", dateStr);

    filesToWrite.push({
      path: phasePath,
      content: renderedPhase,
    });

    if (includeUnits) {
      const unitPath = `${taskRelativeDir}/${phaseDirName}/${unitFilename}`;
      const renderedUnit = unitTemplate
        .replaceAll("{{title}}", unitTitle)
        .replaceAll("{{task_id}}", taskId)
        .replaceAll("{{parent_phase}}", phaseDirName)
        .replaceAll("{{unit_id}}", `${pNum}.01`)
        .replaceAll("{{slug}}", p.slug)
        .replaceAll("{{task_branch}}", baseBranch)
        .replaceAll("{{base_commit}}", baseCommit)
        .replaceAll("{{depends_on}}", "none")
        .replaceAll("{{parallelizable_with}}", "none")
        .replaceAll("{{date}}", dateStr);

      filesToWrite.push({
        path: unitPath,
        content: renderedUnit,
      });

      units.push({
        id: `${pNum}.01`,
        path: unitPath,
        branch: baseBranch,
        title: unitTitle,
      });
    }
  }

  try {
    if (!dryRun) {
      for (const file of filesToWrite) {
        const fullPath = join(targetDir, file.path);
        const parentDir = resolve(fullPath, "..");
        await mkdir(parentDir, { recursive: true });
        await writeFile(fullPath, file.content, "utf8");
      }
    }
  } catch (error) {
    if (reservation) await releasePlanIdReservation({ repository: targetDir, id: reservation.id, owner: reservation.owner });
    throw error;
  }

  return {
    taskId,
    taskFolderName,
    taskDirectory: taskRelativeDir,
    taskSlug,
    baseBranch,
    type: branchType,
    planPath: taskPlanPath,
    date: dateStr,
    units,
    files: filesToWrite.map((f) => f.path),
    renderedFiles: filesToWrite,
    dryRun,
    reservation: reservation ? { id: reservation.id, ref: reservation.ref } : null,
  };
}

export async function listTasks(targetDir = process.cwd()) {
  let tasksRoot = join(targetDir, "docs/tasks");
  if (!existsSync(tasksRoot) && targetDir !== root) {
    if (existsSync(join(root, "docs/tasks"))) {
      tasksRoot = join(root, "docs/tasks");
    }
  }
  if (!existsSync(tasksRoot)) return [];

  const taskList = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith(".md") && fullPath !== join(tasksRoot, "README.md")) {
        const content = await readFile(fullPath, "utf8");
        const meta = frontmatter(content);
        if (meta && meta.type === "task") {
          const relativePath = fullPath.replace(targetDir, "").replace(root, "").replace(/^[/\\]/, "").replaceAll("\\", "/");
          taskList.push({
            title: meta.title ?? "Untitled",
            status: meta.status ?? "unknown",
            created: meta.created ?? "",
            path: relativePath,
          });
        }
      }
    }
  }

  await walk(tasksRoot);
  return taskList.sort((a, b) => (b.created || "").localeCompare(a.created || "") || b.path.localeCompare(a.path));
}
