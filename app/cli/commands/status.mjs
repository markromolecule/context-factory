import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createLock, readJson, root } from "../../../scripts/context-core.mjs";
import { listTasks } from "../../../scripts/task-workflow.mjs";
import { badges, colors, table } from "../core/formatter.mjs";
import { probeHostState } from "../core/host-state.mjs";

export async function handleStatusCommand(args = [], flags = {}) {
  const manifest = await readJson("context-manifest.json");
  const expectedLock = await createLock(manifest);

  let actualLock = null;
  try {
    actualLock = JSON.parse(await readFile(join(root, "context-lock.json"), "utf8"));
  } catch {
    actualLock = null;
  }

  const isLockCurrent = Boolean(actualLock && JSON.stringify(actualLock) === JSON.stringify(expectedLock));
  const tasks = await listTasks();
  const hostState = await probeHostState({ hostDir: process.cwd(), factoryDir: root });

  if (flags.json) {
    console.log(JSON.stringify({
      contextVersion: manifest.contextVersion,
      schemaVersion: manifest.schemaVersion,
      lock: { isCurrent: isLockCurrent, digest: expectedLock.digest },
      counts: {
        rules: manifest.rules.length,
        skills: manifest.skills.length,
        workflows: manifest.workflows.length,
        agents: (manifest.agents || []).length,
        knowledge: manifest.knowledge.length,
        schemas: manifest.schemas.length,
        decisions: manifest.decisions.length,
        evaluations: manifest.evaluations.length,
        datasets: (manifest.datasets || []).length,
        tasks: tasks.length,
      },
      host: hostState,
    }, null, 2));
    return 0;
  }

  console.log(`\n${colors.bold("╔════════════════════════════════════════════════════════════════╗")}`);
  console.log(`  ${colors.bold(colors.cyan("CONTEXT FACTORY STATUS"))}  v${manifest.contextVersion}`);
  console.log(`${colors.bold("╚════════════════════════════════════════════════════════════════╝")}\n`);

  console.log(`  ${colors.bold("Host Setup:")}       ${hostState.setup.status === "configured" || hostState.setup.status === "factory_native" ? badges.pass(hostState.setup.status.toUpperCase()) : badges.warn(hostState.setup.status.toUpperCase())}  ${colors.dim(hostState.setup.reason)}`);
  console.log(`  ${colors.bold("Factory Health:")}   ${hostState.health.isCurrent ? badges.pass("HEALTHY") : badges.warn("DRIFT DETECTED")}  ${colors.dim(hostState.health.reason)}`);
  console.log(`  ${colors.bold("Code Conformance:")} ${hostState.conformance.status === "PASS" ? badges.pass("PASS") : badges.info(hostState.conformance.status.toUpperCase())}  ${colors.dim(hostState.conformance.reason)}`);
  console.log(`  ${colors.bold("Active Tasks:")}     ${colors.yellow(String(tasks.length))}`);
  if (hostState.nextCommand) {
    console.log(`\n  ${colors.bold("Next Action:")}      ${colors.cyan(hostState.nextCommand)}`);
  }
  console.log("");

  const showDetail = Boolean(flags.detail || flags.d);
  if (showDetail) {
    console.log(`  ${colors.bold("Master Digest:")}   ${colors.dim(expectedLock.digest)}`);
    console.log(`  ${colors.bold("Entrypoint:")}      ${colors.white(manifest.entrypoint)}`);
    console.log("");

    const headers = ["Context Inventory", "Count"];
    const rows = [
      ["Engineering Rules", String(manifest.rules.length)],
      ["Procedural Skills", String(manifest.skills.length)],
      ["Delivery Workflows", String(manifest.workflows.length)],
      ["Subagents & Prompts", String((manifest.agents || []).length)],
      ["Knowledge Items", String(manifest.knowledge.length)],
      ["JSON Schemas", String(manifest.schemas.length)],
      ["Architecture Decisions (ADRs)", String(manifest.decisions.length)],
      ["Evaluation Test Cases", String(manifest.evaluations.length)],
      ["Golden Datasets", String((manifest.datasets || []).length)],
    ];

    console.log(table(headers, rows));
    console.log("");
  } else {
    console.log(`  ${colors.dim("Run with --detail (-d) to inspect context inventory counts.")}\n`);
  }

  return 0;
}
