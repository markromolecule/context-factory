import { generateBridge } from "../core/bridge-generator.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleBridgeCommand(args = [], flags = {}) {
  const target = flags.target || args[0] || process.cwd();
  const factoryPath = flags.factoryPath || flags.factory || null;
  const method = flags.method || "submodule";
  const pm = flags.pm || flags.packageManager || null;
  const dryRun = Boolean(flags.dryRun || flags["dry-run"] || flags.preview);
  const force = Boolean(flags.force || flags.repair);
  const addNpmScripts = flags.npm !== false;

  // Handle IDE profiles (--ide or --agents)
  const ideRaw = flags.ide || flags.i || flags.agents || "all";
  const ide = Array.isArray(ideRaw) ? ideRaw : (typeof ideRaw === "string" ? ideRaw.split(",").map((s) => s.trim()) : ["all"]);

  const isJson = Boolean(flags.json);

  if (!isJson) {
    console.log(`\n${badges.bridge()} Bridging Context Factory to Host Repository\n`);
    console.log(`  ${colors.bold("Target Directory:")}   ${colors.cyan(target)}`);
    console.log(`  ${colors.bold("Factory Path:")}       ${colors.cyan(factoryPath || "(auto-detected)")}`);
    console.log(`  ${colors.bold("Integration Mode:")}   ${colors.magenta(method)}`);
    console.log(`  ${colors.bold("Package Manager:")}    ${colors.magenta(pm || "auto-detect (pnpm/npm/yarn/bun)")}`);
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
    packageManager: pm,
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

  console.log(`\n${colors.bold(colors.green(dryRun ? "Bridge preview generated successfully." : "Bridge generation complete!"))}`);
  console.log(`\n${colors.bold("Next step in your host repository:")}`);
  console.log(`  Run ${colors.bold(colors.cyan("context-cli status"))} to verify host readiness and next actions.\n`);

  return 0;
}

