import { writeFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { runAllEvaluations, runDatasetEvaluations, runUnitEvaluations } from "../../../evals/run-evals.mjs";
import { root } from "../../../scripts/context-core.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleEvalCommand(args = [], flags = {}) {
  const onlyUnit = Boolean(flags.unit);
  const onlyDatasets = Boolean(flags.datasets);
  const isJson = Boolean(flags.json);
  const quiet = Boolean(flags.quiet);
  const provider = flags.provider || "mock";
  const model = flags.model || undefined;
  const filterQuery = flags.filter || args[0] || null;
  const savePath = flags.save || null;

  const runUnit = onlyUnit || (!onlyUnit && !onlyDatasets);
  const runDatasets = onlyDatasets || (!onlyUnit && !onlyDatasets);

  let report;
  if (runUnit && !runDatasets) {
    report = await runUnitEvaluations();
  } else if (!runUnit && runDatasets) {
    report = await runDatasetEvaluations({ provider, model });
  } else {
    report = await runAllEvaluations({ runUnit: true, runDatasets: true, provider, model });
  }

  // Filter if requested
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    report.results = report.results.filter((r) => r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q));
    report.total = report.results.length;
    report.passed = report.results.filter((r) => r.passed).length;
    report.failed = report.total - report.passed;
  }

  if (savePath) {
    const destination = isAbsolute(savePath) ? savePath : resolve(root, savePath);
    await writeFile(destination, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
    return report.failed > 0 ? 1 : 0;
  }

  if (!quiet) {
    console.log(`\n${colors.bold(`--- Context Factory Evaluation Suite [${report.suite}] ---`)}\n`);
    const headers = ["Result", "Test Case", "Suite", "Duration"];
    const rows = report.results.map((r) => [
      r.passed ? badges.pass("PASS") : badges.fail("FAIL"),
      colors.bold(r.name) + colors.dim(` (${r.id})`),
      r.path.includes("datasets") ? colors.magenta("dataset") : colors.cyan("unit"),
      `${r.durationMs}ms`,
    ]);

    console.log(table(headers, rows));
    console.log("");

    const failedCases = report.results.filter((r) => !r.passed);
    if (failedCases.length > 0) {
      console.log(`${colors.bold(colors.red("Failures:"))}\n`);
      for (const fc of failedCases) {
        console.log(`  ${badges.fail()} ${colors.bold(fc.name)}:`);
        for (const err of fc.errors) {
          console.log(`    - ${colors.yellow(err)}`);
        }
      }
      console.log("");
    }

    const summaryBadge = report.failed === 0 ? badges.pass("SUITE PASSED") : badges.fail("SUITE FAILED");
    console.log(`  ${summaryBadge} ${colors.bold(String(report.passed))}/${colors.bold(String(report.total))} passed (${report.durationMs}ms).\n`);
  }

  return report.failed > 0 ? 1 : 0;
}
