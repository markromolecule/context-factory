import { generateBridge } from "../core/bridge-generator.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleBridgeCommand(args = [], flags = {}) {
  const target = flags.target || args[0] || process.cwd();
  const factoryPath = flags.factoryPath || flags.factory || null;
  const method = flags.method || "submodule";
  const dryRun = Boolean(flags.dryRun);
  const force = Boolean(flags.force);
  const addNpmScripts = flags.npm !== false;

  let agentProfiles = ["all"];
  if (flags.agents) {
    agentProfiles = typeof flags.agents === "string" ? flags.agents.split(",").map((s) => s.trim()) : ["all"];
  }

  console.log(`\n${badges.bridge()} Bridging Context Factory to Host Repository\n`);
  console.log(`  ${colors.bold("Target Directory:")}   ${colors.cyan(target)}`);
  console.log(`  ${colors.bold("Factory Path:")}       ${colors.cyan(factoryPath || "(auto-detected)")}`);
  console.log(`  ${colors.bold("Integration Mode:")}   ${colors.magenta(method)}`);
  if (dryRun) console.log(`  ${colors.bold("Execution Mode:")}    ${badges.dryRun()}`);
  console.log("");

  const result = await generateBridge({
    target,
    factoryPath,
    agentProfiles,
    method,
    dryRun,
    force,
    addNpmScripts,
  });

  const headers = ["Target File", "Status"];
  const rows = result.files.map((f) => {
    let statusText = f.status;
    if (f.status === "created" || f.status === "would create") statusText = colors.green(f.status);
    else if (f.status === "overwritten") statusText = colors.yellow(f.status);
    else if (f.status.startsWith("skipped")) statusText = colors.dim(f.status);
    return [f.id, statusText];
  });

  console.log(table(headers, rows));
  console.log("");

  if (result.packageJsonUpdated) {
    console.log(`  ${badges.done()} Injected Context Factory helper scripts into host ${colors.cyan("package.json")}`);
  }

  console.log(`\n${colors.bold(colors.green("Bridge generation complete!"))}`);
  console.log(`\n${colors.bold("Next steps in your host repository:")}`);
  console.log(`  1. Open the host repository root in your AI IDE (Antigravity, Cursor, Windsurf, or Claude Code).`);
  console.log(`  2. AI agents will automatically pick up ${colors.cyan("AGENTS.md")} and route rules via the factory.`);
  console.log(`  3. Run ${colors.bold(colors.yellow(`npm run context:resolve "<task description>"`))} to verify rule matching.`);
  console.log(`  4. Scaffolds for ${colors.cyan("docs/tasks/")} and ${colors.cyan("docs/decisions/")} are ready for generated artifacts.\n`);

  return 0;
}
