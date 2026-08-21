import { listTasks, scaffoldTask } from "../../../scripts/task-workflow.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleTaskCommand(args = [], flags = {}) {
  const subCommand = args[0] || "list";

  if (subCommand === "new" || subCommand === "create") {
    const type = flags.type || "feature";
    const dryRun = Boolean(flags.dryRun);
    const titleArgs = args.slice(1);
    const title = titleArgs.join(" ").trim();

    if (!title) {
      throw new Error("Usage: context-cli task new \"<task title>\" [--type <feature|defect|refactor|migration>] [--dry-run]");
    }

    const result = await scaffoldTask({ title, type, dryRun });

    if (flags.json) {
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }

    if (dryRun) {
      console.log(`\n${badges.dryRun()} Would scaffold task at: ${colors.cyan(result.taskDirectory)}\n`);
    } else {
      console.log(`\n${badges.done()} Scaffolded task ${colors.bold(result.taskId)} (${colors.magenta(result.type)})\n`);
      console.log(`  ${colors.bold("Directory:")} ${colors.cyan(result.taskDirectory)}`);
      console.log(`  ${colors.bold("Files created:")}`);
      for (const f of result.files) {
        console.log(`    - ${colors.white(f)}`);
      }
      console.log("");
    }
    return 0;
  }

  if (subCommand === "list" || !subCommand) {
    const tasks = await listTasks();

    if (flags.json) {
      console.log(JSON.stringify(tasks, null, 2));
      return 0;
    }

    console.log(`\n${colors.bold(`Context Factory Tasks (${tasks.length})`)}\n`);
    if (tasks.length === 0) {
      console.log(`  ${colors.dim("No active tasks found in docs/tasks/.")}\n`);
      return 0;
    }

    const headers = ["Status", "Task Title", "Created", "Path"];
    const rows = tasks.map((t) => [
      t.status.toUpperCase() === "DONE" ? badges.pass("DONE") : badges.info("ACTIVE"),
      colors.bold(t.title),
      colors.dim(t.created),
      colors.cyan(t.path),
    ]);

    console.log(table(headers, rows));
    console.log("");
    return 0;
  }

  throw new Error(`Unknown task subcommand: "${subCommand}". Supported: task new, task list`);
}
