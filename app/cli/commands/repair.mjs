import { existsSync, realpathSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { root } from "../../../scripts/context-core.mjs";
import { repairBridgeSymlinks, verifySymlinkHealth } from "../core/bridge-generator.mjs";
import { badges, colors, table } from "../core/formatter.mjs";
import { syncFactoryInventory } from "../core/indexer.mjs";
import { handleDoctorCommand } from "./doctor.mjs";

/**
 * Handles the `context-cli repair` command.
 * Auto-repairs broken/missing symlinks, regenerates missing editor configurations,
 * restores bridge connections, and executes a full health audit.
 */
export async function handleRepairCommand(args = [], flags = {}) {
  const isJson = Boolean(flags.json);
  let canonicalTarget = flags.target || args[0] || process.cwd();
  if (!isAbsolute(canonicalTarget)) {
    canonicalTarget = resolve(process.cwd(), canonicalTarget);
  }
  try {
    if (existsSync(canonicalTarget)) canonicalTarget = realpathSync(canonicalTarget);
  } catch {}
  const targetDir = canonicalTarget;

  let canonicalRoot = root;
  try {
    if (existsSync(root)) canonicalRoot = realpathSync(root);
  } catch {}

  const isHostRepo = targetDir !== canonicalRoot;

  if (!isJson && !flags.quiet) {
    console.log(`\n${badges.sync("REPAIR")} ${colors.bold(colors.green("Context Factory Self-Healing & Bridge Repair"))}\n`);
    console.log(`  ${colors.bold("Target Directory:")}   ${colors.cyan(targetDir)}`);
    console.log(`  ${colors.bold("Target Type:")}        ${colors.magenta(isHostRepo ? "Host Repository" : "Context Factory Root")}`);
    console.log(`  ${colors.bold("Auto-Repair Mode:")}   ${colors.yellow("Active (live re-link & contract sync)")}\n`);
  }

  // 1. If in Context Factory root, repair .agents and refresh manifest/lock if needed
  if (!isHostRepo) {
    try {
      await repairBridgeSymlinks(root, { force: true, ...flags });
      if (flags.sync || flags.inventory) {
        await syncFactoryInventory({ writeLock: true });
      }
    } catch (err) {
      if (!isJson) {
        console.warn(`  ${colors.yellow("Warning during root repair:")} ${err.message}`);
      }
    }
  } else {
    // 2. In host repository: perform aggressive bridge symlink & editor repair
    try {
      const bridgeResult = await repairBridgeSymlinks(targetDir, {
        force: true,
        addNpmScripts: true,
        ...flags,
      });

      if (!isJson && !flags.quiet) {
        console.log(`  ${badges.done("HEALED")} Re-linked bridge and symlink artifacts:`);
        console.log(`    - Integration method: ${colors.magenta(bridgeResult.method)}`);
        console.log(`    - Factory source:     ${colors.cyan(bridgeResult.factoryPath)}`);
        console.log(`    - Total items synced: ${colors.bold(String(bridgeResult.files?.length || 0))}\n`);
      }
    } catch (err) {
      if (!isJson) {
        console.error(`  ${badges.fail("ERROR")} Failed repairing bridge artifacts: ${err.message}\n`);
      }
      if (isJson) {
        console.log(JSON.stringify({ success: false, error: err.message }, null, 2));
      }
      return 1;
    }
  }

  // 3. Delegate to doctor diagnostics with repair flag enabled to print full health table
  const doctorFlags = {
    ...flags,
    repair: true,
    target: targetDir,
  };

  return handleDoctorCommand(args, doctorFlags);
}
