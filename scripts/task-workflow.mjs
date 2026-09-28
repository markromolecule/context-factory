import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { frontmatter, readText, root } from "./context-core.mjs";

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

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export async function findNextTaskId(year, month, dayStr) {
  const dayDir = join(root, "docs/tasks", year, month, dayStr);
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

export async function scaffoldTask({ title, type = "feature", customPhases = null, dryRun = false, includeUnits = true }) {
  if (!title) throw new Error("Task title is required");
  const normalizedType = DEFAULT_PHASES[type] ? type : "feature";
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const taskId = await findNextTaskId(year, month, dateStr);
  const taskSlug = slugify(title);
  const taskFolderName = `${taskId}-task-${taskSlug}`;
  const taskRelativeDir = join("docs/tasks", year, month, dateStr, taskFolderName).replaceAll("\\", "/");
  const taskAbsoluteDir = join(root, taskRelativeDir);

  const taskTemplate = await readText("docs/templates/Task.md");
  const phaseTemplate = await readText("docs/templates/Phase.md");
  const unitTemplate = await readText("docs/templates/Unit.md");

  const phases = customPhases ?? DEFAULT_PHASES[normalizedType];
  const phaseListMarkdown = phases
    .map((p, idx) => {
      const pNum = String(idx + 1).padStart(2, "0");
      return `- [ ] \`phase-${pNum}-${p.slug}/phase.md\` — ${p.title}`;
    })
    .join("\n");

  const topologyRows = phases
    .map((p, idx) => {
      const pNum = String(idx + 1).padStart(2, "0");
      const unitSlug = `unit-01-${p.slug}`;
      const branchName = `task/${taskId}/phase-${pNum}/${unitSlug}`;
      const worktreeDir = `.worktrees/${taskId}/phase-${pNum}/${unitSlug}`;
      const mergeTarget = `task/${taskId}/phase-${pNum}/integration`;
      return `| phase-${pNum} | ${pNum}.01 | ${p.title} Starter | \`${branchName}\` | \`${worktreeDir}\` | \`${mergeTarget}\` | planned |`;
    })
    .join("\n");

  const ledgerRows = [
    ...phases.map((p, idx) => {
      const pNum = String(idx + 1).padStart(2, "0");
      return `| Phase ${pNum} Integration | \`task/${taskId}/phase-${pNum}/integration\` | \`task/${taskId}-${taskSlug}\` | pending | [ ] | \`npm test\` |`;
    }),
    `| Task Base Finalization | \`task/${taskId}-${taskSlug}\` | \`master\` | pending | [ ] | \`node scripts/context.mjs doctor\` |`,
  ].join("\n");

  const renderedTask = taskTemplate
    .replaceAll("{{title}}", title)
    .replaceAll("{{date}}", dateStr)
    .replaceAll("{{task_id}}", taskId)
    .replaceAll("{{task_slug}}", taskSlug)
    .replace(/- \[ \] `phase-01-<feature>\.md`[\s\S]*?- \[ \] `phase-02-<feature>\.md`[^\n]*/, phaseListMarkdown)
    .replace(/\| phase-01 \| 01\.01 \|[\s\S]*?\| planned \|/, topologyRows)
    .replace(/\| Phase 01 Integration \|[\s\S]*?\| `node scripts\/context\.mjs doctor` \|/, ledgerRows);

  const filesToWrite = [
    {
      path: `${taskRelativeDir}/README.md`,
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
    const unitBranch = `task/${taskId}/phase-${pNum}/${unitSlug}`;
    const unitWorktree = `.worktrees/${taskId}/phase-${pNum}/${unitSlug}`;
    const unitTitle = `${p.title} Starter`;
    const unitFilename = `${unitSlug}.md`;

    const renderedPhase = phaseTemplate
      .replaceAll("{{title}}", p.title)
      .replaceAll("{{task_id}}", taskId)
      .replaceAll("{{parent_task}}", taskFolderName)
      .replaceAll("{{phase_number}}", pNum)
      .replaceAll("{{phase_slug}}", p.slug)
      .replaceAll("{{phase_branch}}", `task/${taskFolderName}/phase-${pNum}`)
      .replaceAll("{{unit_title}}", unitTitle)
      .replaceAll("{{unit_filename}}", unitFilename)
      .replaceAll("{{branch}}", unitBranch)
      .replaceAll("{{worktree}}", unitWorktree)
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
        .replaceAll("{{branch}}", unitBranch)
        .replaceAll("{{worktree}}", unitWorktree)
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
        branch: unitBranch,
        worktree: unitWorktree,
        title: unitTitle,
      });
    }
  }

  if (!dryRun) {
    for (const file of filesToWrite) {
      const fullPath = join(root, file.path);
      const parentDir = resolve(fullPath, "..");
      await mkdir(parentDir, { recursive: true });
      await writeFile(fullPath, file.content, "utf8");
    }
  }

  const baseBranch = `task/${taskId}-${taskSlug}`;

  return {
    taskId,
    taskFolderName,
    taskDirectory: taskRelativeDir,
    taskSlug,
    baseBranch,
    type: normalizedType,
    date: dateStr,
    units,
    files: filesToWrite.map((f) => f.path),
    renderedFiles: filesToWrite,
    dryRun,
  };
}

export async function listTasks() {
  const tasksRoot = join(root, "docs/tasks");
  if (!existsSync(tasksRoot)) return [];

  const taskList = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name === "README.md" && fullPath !== join(tasksRoot, "README.md")) {
        const content = await readFile(fullPath, "utf8");
        const meta = frontmatter(content);
        if (meta && meta.type === "task") {
          const relativePath = fullPath.replace(root, "").replace(/^[/\\]/, "").replaceAll("\\", "/");
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
