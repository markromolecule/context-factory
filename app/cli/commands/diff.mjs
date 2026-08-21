import { computeDiff } from "../core/differ.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleDiffCommand(args = [], flags = {}) {
  const isJson = Boolean(flags.json);
  const diff = await computeDiff();

  if (isJson) {
    console.log(JSON.stringify(diff, null, 2));
    return diff.isClean ? 0 : 1;
  }

  console.log(`\n${colors.bold("--- Context Factory Drift & Difference Report ---")}\n`);
  console.log(`  ${colors.bold("Context Version:")}  ${colors.white(diff.contextVersion)}`);
  console.log(`  ${colors.bold("Locked Digest:")}    ${diff.lockedDigest ? colors.dim(diff.lockedDigest) : colors.red("None (missing lock)")}`);
  console.log(`  ${colors.bold("Current Digest:")}   ${colors.dim(diff.currentDigest)}`);
  console.log(`  ${colors.bold("Lock Status:")}      ${diff.lockDigestMatch ? badges.pass("SYNCED") : badges.warn("DRIFT DETECTED")}`);
  console.log("");

  if (diff.isClean) {
    console.log(`  ${badges.pass()} All canonical context files match context-lock.json. No drift detected.\n`);
    return 0;
  }

  const headers = ["Status", "File Path", "Details"];
  const rows = [];

  for (const m of diff.modified) {
    rows.push([badges.warn("MODIFIED"), colors.yellow(m.path), `Hash mismatch: ${m.currentHash.slice(0, 16)}...`]);
  }
  for (const a of diff.addedToManifest) {
    rows.push([badges.info("ADDED"), colors.green(a), "Present on disk, absent in lock"]);
  }
  for (const r of diff.removedFromManifest) {
    rows.push([badges.fail("REMOVED"), colors.red(r), "In lockfile but removed from manifest"]);
  }
  for (const u of diff.untrackedFiles) {
    rows.push([badges.warn("UNTRACKED"), colors.yellow(u), "File exists on disk but not in context-manifest.json"]);
  }
  for (const mis of diff.missingFromDisk) {
    rows.push([badges.fail("MISSING"), colors.red(mis), "Listed in manifest but missing on disk"]);
  }

  if (rows.length > 0) {
    console.log(table(headers, rows));
    console.log("");
    console.log(`  ${colors.bold("Fix:")} Run ${colors.bold(colors.cyan("npm run sync"))} or ${colors.bold(colors.cyan("node app/cli/bin/context-cli.mjs sync"))} to reconcile.\n`);
  }

  return 1;
}
