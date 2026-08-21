import { syncFactoryInventory } from "../core/indexer.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleSyncCommand(args = [], flags = {}) {
  const isJson = Boolean(flags.json);

  const result = await syncFactoryInventory({ writeLock: true });

  if (isJson) {
    console.log(JSON.stringify(result, null, 2));
    return 0;
  }

  console.log(`\n${badges.sync()} ${colors.bold(colors.green("Context Factory Synchronized Successfully"))}\n`);
  console.log(`  ${colors.bold("Manifest:")} ${colors.cyan("context-manifest.json")} updated.`);
  console.log(`  ${colors.bold("Lockfile:")} ${colors.cyan("context-lock.json")} generated (${colors.dim(result.lock.digest)}).\n`);

  const headers = ["Category", "Count"];
  const rows = [
    ["Rules", String(result.counts.rules)],
    ["Skills", String(result.counts.skills)],
    ["Skill Resources", String(result.counts.skillResources)],
    ["Workflows", String(result.counts.workflows)],
    ["Agents", String(result.counts.agents)],
    ["Knowledge Items", String(result.counts.knowledge)],
    ["Schemas", String(result.counts.schemas)],
    ["Templates", String(result.counts.templates)],
    ["Decisions (ADRs)", String(result.counts.decisions)],
    ["Evaluations", String(result.counts.evaluations)],
    ["Datasets", String(result.counts.datasets)],
    ["Tools", String(result.counts.tools)],
  ];

  console.log(table(headers, rows));
  console.log("");
  return 0;
}
