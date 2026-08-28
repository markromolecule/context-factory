import { generateBridge } from "../core/bridge-generator.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleBridgeCommand(args = [], flags = {}) {
  const target = flags.target || args[0] || process.cwd();
  const factoryPath = flags.factoryPath || flags.factory || null;
  const method = flags.method || "submodule";
  const dryRun = Boolean(flags.dryRun);
  const force = Boolean(flags.force || flags.repair);
  const addNpmScripts = flags.npm !== false;

  // Handle IDE profiles (--ide or --agents)
  const ideRaw = flags.ide || flags.i || flags.agents || "all";
  const ide = typeof ideRaw === "string" ? ideRaw.split(",").map((s) => s.trim()) : ["all"];

  const isJson = Boolean(flags.json);

  if (!isJson) {
    console.log(`\n${badges.bridge()} Bridging Context Factory to Host Repository\n`);
    console.log(`  ${colors.bold("Target Directory:")}   ${colors.cyan(target)}`);
    console.log(`  ${colors.bold("Factory Path:")}       ${colors.cyan(factoryPath || "(auto-detected)")}`);
    console.log(`  ${colors.bold("Integration Mode:")}   ${colors.magenta(method)}`);
    console.log(`  ${colors.bold("Target IDEs:")}        ${colors.magenta(ide.join(", "))}`);
    if (flags.repair) console.log(`  ${colors.bold("Action Mode:")}        ${colors.yellow("Repair / Force Re-link")}`);
    if (dryRun) console.log(`  ${colors.bold("Execution Mode:")}     ${badges.dryRun()}`);
    console.log("");
  }

  const result = await generateBridge({
    target,
    factoryPath,
    ide,
    method,
    dryRun,
    force,
    addNpmScripts,
  });

  if (isJson) {
    console.log(JSON.stringify(result, null, 2));
    return 0;
  }

  const headers = ["Target Item", "Type", "Status"];
  const rows = result.files.map((f) => {
    let statusText = f.status;
    if (f.status === "created" || f.status === "would create" || f.status === "updated" || f.status === "would update") {
      statusText = colors.green(f.status);
    } else if (f.status === "overwritten") {
      statusText = colors.yellow(f.status);
    } else if (f.status.startsWith("skipped")) {
      statusText = colors.dim(f.status);
    } else if (f.status.startsWith("failed")) {
      statusText = colors.red(f.status);
    }

    const typeText = f.category === "symlink"
      ? colors.cyan("symlink -> " + (f.target || ""))
      : (f.category === "contract" ? colors.blue("contract") : (f.category === "config" ? colors.magenta("config") : colors.dim("scaffold")));

    return [f.id, typeText, statusText];
  });

  console.log(table(headers, rows));
  console.log("");

  if (result.packageJsonUpdated) {
    console.log(`  ${badges.done()} Injected Context Factory helper scripts into host ${colors.cyan("package.json")}`);
  }

  console.log(`\n${colors.bold(colors.green("Bridge generation complete!"))}`);
  console.log(`\n${colors.bold("Next steps in your host repository:")}`);
  console.log(`  1. Open the host repository root in your AI IDE (Antigravity, Cursor, Windsurf, or Claude Code).`);
  console.log(`  2. Antigravity will automatically index skills & rules from ${colors.cyan(".agents/")}.`);
  console.log(`  3. AI agents will read ${colors.cyan("AGENTS.md")} and route rules via Context Factory.`);
  console.log(`  4. Run ${colors.bold(colors.yellow(`npm run context:resolve "<task description>"`))} to verify rule matching.`);
  console.log(`  5. Scaffolds for ${colors.cyan("docs/tasks/")} and ${colors.cyan("docs/decisions/")} are ready for generated artifacts.\n`);

  return 0;
}
