import { existsSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { root } from "../../../scripts/context-core.mjs";
import { repairBridgeSymlinks, verifySymlinkHealth } from "../core/bridge-generator.mjs";
import { badges, colors, table } from "../core/formatter.mjs";
import { syncFactoryInventory } from "../core/indexer.mjs";

export async function handleSyncCommand(args = [], flags = {}) {
  const isJson = Boolean(flags.json);
  const skipMocs = Boolean(flags.noMoc || flags.skipMoc);
  const forceFactory = Boolean(flags.factory || flags.inventory);

  const targetDir = flags.target
    ? (isAbsolute(flags.target) ? flags.target : resolve(process.cwd(), flags.target))
    : process.cwd();

  // Detect whether we are in a host repository or in context-factory root
  const isHostRepo = targetDir !== root;
  const factoryPath = flags.factoryPath || flags.factory || null;

  // 1. If in Context Factory root, or --factory flag explicitly requested:
  if (!isHostRepo || forceFactory) {
    const result = await syncFactoryInventory({ writeLock: true, updateMocs: !skipMocs });

    if (isJson) {
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }

    console.log(`\n${badges.sync()} ${colors.bold(colors.green("Context Factory Synchronized Successfully"))}\n`);
    console.log(`  ${colors.bold("Manifest:")} ${colors.cyan("context-manifest.json")} updated.`);
    console.log(`  ${colors.bold("MOCs:")}     ${colors.cyan(String(result.mocsUpdatedCount))} Obsidian Maps of Content regenerated (Rules, Skills, Workflows, Agents, Decisions, Wiki).`);
    console.log(`  ${colors.bold("Lockfile:")} ${colors.cyan("context-lock.json")} generated (${colors.dim(result.lock?.digest || "unknown")}).\n`);

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

  // 2. If in a host / consumer repository:
  // Synchronize bridge symlinks, skills, contracts, and configs
  const bridgeResult = await repairBridgeSymlinks(targetDir, { factoryPath });
  const healthResult = await verifySymlinkHealth(targetDir);

  if (isJson) {
    console.log(JSON.stringify({
      targetDir,
      factoryPath: bridgeResult.factoryPath,
      method: bridgeResult.method,
      health: healthResult,
      files: bridgeResult.files,
    }, null, 2));
    return healthResult.passed ? 0 : 1;
  }

  console.log(`\n${badges.sync("SYNC")} ${colors.bold(colors.green("Host Repository Bridge Synchronized Successfully"))}\n`);
  console.log(`  ${colors.bold("Host Repository:")}  ${colors.cyan(targetDir)}`);
  console.log(`  ${colors.bold("Factory Source:")}   ${colors.cyan(bridgeResult.factoryPath)}`);
  console.log(`  ${colors.bold("Integration Mode:")} ${colors.magenta(bridgeResult.method)}`);
  console.log(`  ${colors.bold("Symlink Health:")}   ${healthResult.passed ? badges.pass("HEALTHY") : badges.warn("FINDINGS")}`);
  console.log(`  ${colors.bold("Active Symlinks:")}  ${colors.bold(String(healthResult.healthyCount))} of ${healthResult.totalCount} active and verified`);
  console.log("");

  const headers = ["Category", "Status", "Details"];
  const rows = [
    ["Orchestrator Contracts", colors.green("PASS"), "AGENTS.md, GEMINI.md, CLAUDE.md verified"],
    ["Agent Symlinks (.agents/)", healthResult.passed ? colors.green("HEALTHY") : colors.yellow("NEEDS ATTENTION"), `${healthResult.healthyCount} verified links`],
    ["Skills Configuration", existsSync(join(targetDir, ".agents", "skills.json")) ? colors.green("SYNCED") : colors.red("MISSING"), ".agents/skills.json up to date"],
    ["Bridge Configuration", existsSync(join(targetDir, ".context-bridge.json")) ? colors.green("CURRENT") : colors.dim("NONE"), ".context-bridge.json updated"],
  ];

  console.log(table(headers, rows));
  console.log("");

  if (!healthResult.passed) {
    console.log(`  ${colors.yellow("Warning:")} Some symlinks are broken or missing. Run ${colors.cyan("context-cli doctor --repair")} to fix.\n`);
    return 1;
  }

  console.log(`  ${badges.done()} All Context Factory skills and rules are synced and available in ${colors.cyan(".agents/")}.\n`);
  return 0;
}
