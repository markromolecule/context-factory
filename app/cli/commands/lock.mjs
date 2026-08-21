import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createLock, readJson, root } from "../../../scripts/context-core.mjs";
import { badges, colors } from "../core/formatter.mjs";

export async function handleLockCommand(args = [], flags = {}) {
  const isCheck = Boolean(flags.check);
  const isJson = Boolean(flags.json);

  const manifest = await readJson("context-manifest.json");
  const expected = await createLock(manifest);

  let actual = null;
  try {
    actual = JSON.parse(await readFile(join(root, "context-lock.json"), "utf8"));
  } catch {
    actual = null;
  }

  const isCurrent = actual && JSON.stringify(actual) === JSON.stringify(expected);

  if (isCheck) {
    if (isJson) {
      console.log(JSON.stringify({ isCurrent, lockedDigest: actual?.digest ?? null, expectedDigest: expected.digest }, null, 2));
      return isCurrent ? 0 : 1;
    }
    if (isCurrent) {
      console.log(`\n${badges.pass()} Context lock is current (${colors.cyan(expected.digest)})\n`);
      return 0;
    }
    console.log(`\n${badges.fail()} Context lock is stale or missing.`);
    console.log(`  Locked:   ${colors.dim(actual?.digest || "none")}`);
    console.log(`  Expected: ${colors.yellow(expected.digest)}`);
    console.log(`  Fix: Run ${colors.bold(colors.cyan("node app/cli/bin/context-cli.mjs lock"))}\n`);
    return 1;
  }

  // Write mode
  await writeFile(join(root, "context-lock.json"), `${JSON.stringify(expected, null, 2)}\n`, "utf8");

  if (isJson) {
    console.log(JSON.stringify({ written: true, digest: expected.digest, filesCount: Object.keys(expected.files).length }, null, 2));
    return 0;
  }

  console.log(`\n${badges.lock()} ${colors.bold(colors.green("Updated context-lock.json"))}`);
  console.log(`  ${colors.bold("Digest:")} ${colors.cyan(expected.digest)}`);
  console.log(`  ${colors.bold("Files:")}  ${colors.white(String(Object.keys(expected.files).length))} canonical paths pinned.\n`);
  return 0;
}
