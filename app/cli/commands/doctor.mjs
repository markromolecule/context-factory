import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { runAllEvaluations } from "../../../evals/run-evals.mjs";
import { createLock, readJson, root } from "../../../scripts/context-core.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleDoctorCommand(args = [], flags = {}) {
  const isJson = Boolean(flags.json);
  const startTime = Date.now();

  // 1. Validator / Linter
  const lintRes = spawnSync(process.execPath, ["scripts/validate-context.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  const lintPassed = lintRes.status === 0;

  // 2. Lock check
  const manifest = await readJson("context-manifest.json");
  const expectedLock = await createLock(manifest);
  let actualLock = null;
  try {
    actualLock = JSON.parse(await readFile(join(root, "context-lock.json"), "utf8"));
  } catch {
    actualLock = null;
  }
  const lockPassed = actualLock && JSON.stringify(actualLock) === JSON.stringify(expectedLock);

  // 3. Evaluations
  const evalReport = await runAllEvaluations({ runUnit: true, runDatasets: true, provider: "mock" });
  const evalsPassed = evalReport.failed === 0;

  const totalDuration = Date.now() - startTime;
  const allPassed = lintPassed && lockPassed && evalsPassed;

  if (isJson) {
    console.log(JSON.stringify({
      healthy: allPassed,
      contextVersion: manifest.contextVersion,
      checks: {
        manifestAndLint: { passed: lintPassed, output: lintRes.stdout?.trim() || lintRes.stderr?.trim() },
        lockSync: { passed: lockPassed, lockedDigest: actualLock?.digest, expectedDigest: expectedLock.digest },
        evaluations: { passed: evalsPassed, total: evalReport.total, passedCount: evalReport.passed, failedCount: evalReport.failed },
      },
      durationMs: totalDuration,
    }, null, 2));
    return allPassed ? 0 : 1;
  }

  console.log(`\n${colors.bold("╔════════════════════════════════════════════════════════════════╗")}`);
  console.log(`  ${colors.bold(colors.cyan("CONTEXT FACTORY DOCTOR DIAGNOSTIC"))}  v${manifest.contextVersion}`);
  console.log(`${colors.bold("╚════════════════════════════════════════════════════════════════╝")}\n`);

  const headers = ["Diagnostic Check", "Result", "Details"];
  const rows = [
    [
      "Manifest & Syntax Lint",
      lintPassed ? badges.pass() : badges.fail(),
      lintPassed ? `${manifest.rules.length} rules, ${manifest.skills.length} skills, ${manifest.workflows.length} workflows verified` : "Lint failures detected",
    ],
    [
      "Lockfile Integrity",
      lockPassed ? badges.pass() : badges.fail(),
      lockPassed ? `Current (${expectedLock.digest.slice(0, 20)}...)` : "Lock is stale or missing. Run `npm run lock`",
    ],
    [
      "Evaluation Suite",
      evalsPassed ? badges.pass() : badges.fail(),
      `${evalReport.passed}/${evalReport.total} evaluations passed in ${evalReport.durationMs}ms`,
    ],
  ];

  console.log(table(headers, rows));
  console.log("");

  if (!lintPassed) {
    console.log(`${colors.bold(colors.red("Lint Output:"))}\n${lintRes.stderr || lintRes.stdout}\n`);
  }

  if (allPassed) {
    console.log(`  ${badges.done("HEALTHY")} ${colors.bold(colors.green("Context Factory is completely synchronized, valid, and healthy."))}\n`);
  } else {
    console.log(`  ${badges.warn("ATTENTION")} ${colors.bold(colors.yellow("Context Factory has findings requiring attention."))}`);
    console.log(`  Remediation: Run ${colors.bold(colors.cyan("npm run sync"))} or review failing evaluations.\n`);
  }

  return allPassed ? 0 : 1;
}
