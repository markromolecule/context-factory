import { spawnSync } from "node:child_process";
import { badges, colors } from "../core/formatter.mjs";
import { root } from "../../../scripts/context-core.mjs";

export async function handleLintCommand(args = [], flags = {}) {
  const quiet = Boolean(flags.quiet);
  const isJson = Boolean(flags.json);

  const result = spawnSync(process.execPath, ["scripts/validate-context.mjs"], {
    cwd: root,
    encoding: "utf8",
  });

  const passed = result.status === 0;

  if (isJson) {
    console.log(JSON.stringify({
      valid: passed,
      exitCode: result.status,
      stdout: result.stdout?.trim() || "",
      stderr: result.stderr?.trim() || "",
    }, null, 2));
    return passed ? 0 : 1;
  }

  if (passed) {
    if (!quiet) {
      console.log(`\n${badges.pass()} ${colors.bold(colors.green("Context Factory lint passed."))}`);
      if (result.stdout) console.log(`  ${colors.dim(result.stdout.trim())}\n`);
    }
    return 0;
  }

  console.log(`\n${badges.fail()} ${colors.bold(colors.red("Context Factory lint failed:"))}\n`);
  if (result.stderr) console.error(result.stderr);
  if (result.stdout && !result.stderr) console.log(result.stdout);
  console.log("");
  return 1;
}
