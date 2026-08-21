import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createLock, readJson, root } from "../../../scripts/context-core.mjs";
import { listTasks } from "../../../scripts/task-workflow.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleStatusCommand(args = [], flags = {}) {
  const manifest = await readJson("context-manifest.json");
  const expectedLock = await createLock(manifest);

  let actualLock = null;
  try {
    actualLock = JSON.parse(await readFile(join(root, "context-lock.json"), "utf8"));
  } catch {
    actualLock = null;
  }

  const isLockCurrent = actualLock && JSON.stringify(actualLock) === JSON.stringify(expectedLock);
  const tasks = await listTasks();

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
    }, null, 2));
    return 0;
  }

  console.log(`\n${colors.bold("╔════════════════════════════════════════════════════════════════╗")}`);
  console.log(`  ${colors.bold(colors.cyan("CONTEXT FACTORY STATUS"))}  v${manifest.contextVersion}`);
  console.log(`${colors.bold("╚════════════════════════════════════════════════════════════════╝")}\n`);

  console.log(`  ${colors.bold("Lock Status:")}     ${isLockCurrent ? badges.pass("LOCKED & CURRENT") : badges.warn("DRIFT DETECTED")}`);
  console.log(`  ${colors.bold("Master Digest:")}   ${colors.dim(expectedLock.digest)}`);
  console.log(`  ${colors.bold("Entrypoint:")}      ${colors.white(manifest.entrypoint)}`);
  console.log(`  ${colors.bold("Active Tasks:")}    ${colors.yellow(String(tasks.length))}`);
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
  return 0;
}
