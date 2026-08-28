import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { runAllEvaluations } from "../../../evals/run-evals.mjs";
import { createLock, readJson, root } from "../../../scripts/context-core.mjs";
import { repairBridgeSymlinks, verifySymlinkHealth } from "../core/bridge-generator.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleDoctorCommand(args = [], flags = {}) {
  const isJson = Boolean(flags.json);
  const repair = Boolean(flags.repair || flags.fix || flags.r);
  const targetDir = flags.target ? (isAbsolute(flags.target) ? flags.target : resolve(process.cwd(), flags.target)) : process.cwd();
  const startTime = Date.now();

  const isHostRepo = targetDir !== root && existsSync(join(targetDir, ".context-bridge.json"));

  // If repair requested upfront, repair bridge symlinks before running checks
  let repairResult = null;
  if (repair) {
    repairResult = await repairBridgeSymlinks(targetDir, flags);
  }

  // 1. Validator / Linter (run against root if in factory or target if specified)
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

  // 3. Symlink Health Check
  const symlinkHealth = await verifySymlinkHealth(targetDir);
  let symlinkPassed = symlinkHealth.passed;

  // If symlinks failed and repair wasn't run yet, but auto-repair is enabled
  if (!symlinkPassed && repair) {
    repairResult = await repairBridgeSymlinks(targetDir, flags);
    const recheck = await verifySymlinkHealth(targetDir);
    symlinkPassed = recheck.passed;
  }

  // 4. Evaluations
  const evalReport = await runAllEvaluations({ runUnit: true, runDatasets: true, provider: "mock" });
  const evalsPassed = evalReport.failed === 0;

  const totalDuration = Date.now() - startTime;
  const allPassed = lintPassed && lockPassed && symlinkPassed && evalsPassed;

  if (isJson) {
    console.log(JSON.stringify({
      healthy: allPassed,
      contextVersion: manifest.contextVersion,
      targetDir,
      isHostRepo,
      repaired: Boolean(repairResult),
      checks: {
        manifestAndLint: { passed: lintPassed, output: lintRes.stdout?.trim() || lintRes.stderr?.trim() },
        lockSync: { passed: lockPassed, lockedDigest: actualLock?.digest, expectedDigest: expectedLock.digest },
        symlinkIntegrity: {
          passed: symlinkPassed,
          hasDotAgents: symlinkHealth.hasDotAgents,
          healthyCount: symlinkHealth.healthyCount,
          brokenCount: symlinkHealth.brokenCount,
          missingCount: symlinkHealth.missingCount,
          links: symlinkHealth.links,
        },
        evaluations: { passed: evalsPassed, total: evalReport.total, passedCount: evalReport.passed, failedCount: evalReport.failed },
      },
      durationMs: totalDuration,
    }, null, 2));
    return allPassed ? 0 : 1;
  }

  console.log(`\n${colors.bold("╔════════════════════════════════════════════════════════════════╗")}`);
  console.log(`  ${colors.bold(colors.cyan("CONTEXT FACTORY DOCTOR DIAGNOSTIC"))}  v${manifest.contextVersion}`);
  console.log(`${colors.bold("╚════════════════════════════════════════════════════════════════╝")}\n`);

  if (repairResult) {
    console.log(`  ${badges.done("REPAIRED")} Re-linked bridge and symlink artifacts in ${colors.cyan(targetDir)}\n`);
  }

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
      ".agents Symlink Integrity",
      symlinkPassed ? badges.pass() : badges.fail(),
      symlinkPassed
        ? `${symlinkHealth.healthyCount}/6 symlinks verified healthy`
        : `${symlinkHealth.brokenCount} broken, ${symlinkHealth.missingCount} missing. Run \`context-cli doctor --repair\``,
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

  if (!symlinkPassed) {
    console.log(`${colors.bold(colors.yellow("Symlink Details:"))}`);
    for (const link of symlinkHealth.links) {
      if (link.status !== "healthy") {
        console.log(`  - ${colors.red(link.name)}: ${link.status} (path: ${colors.dim(link.path)})`);
      }
    }
    console.log(`  ${colors.bold("Auto-fix:")} Run ${colors.cyan("context-cli doctor --repair")} to restore links.\n`);
  }

  if (allPassed) {
    console.log(`  ${badges.done("HEALTHY")} ${colors.bold(colors.green("Context Factory is completely synchronized, valid, and healthy."))}\n`);
  } else {
    console.log(`  ${badges.warn("ATTENTION")} ${colors.bold(colors.yellow("Context Factory has findings requiring attention."))}`);
    console.log(`  Remediation: Run ${colors.bold(colors.cyan("context-cli doctor --repair"))} or ${colors.bold(colors.cyan("npm run sync"))}.\n`);
  }

  return allPassed ? 0 : 1;
}
