#!/usr/bin/env node
import { compareSelection, filesUnder, readJson, readText, resolveContext } from "../scripts/context-core.mjs";
import { executeRun } from "../orchestrator/runner.mjs";
import { assertValid, loadSchema } from "../orchestrator/validator.mjs";

export async function runUnitEvaluations() {
  const startTime = Date.now();
  const manifest = await readJson("context-manifest.json");
  const results = [];

  for (const path of manifest.evaluations ?? []) {
    const caseStart = Date.now();
    const testCase = await readJson(path);
    const selection = await resolveContext(testCase.request);
    const errors = compareSelection(selection, testCase.expected);

    for (const assertion of testCase.contractAssertions ?? []) {
      const source = await readText(assertion.path);
      for (const fragment of assertion.includes ?? []) {
        if (!source.includes(fragment)) {
          errors.push(`contract ${assertion.path} is missing: ${fragment}`);
        }
      }
    }

    results.push({
      id: path.split("/").at(-1).replace(/\.json$/, ""),
      name: testCase.name,
      path,
      passed: errors.length === 0,
      durationMs: Date.now() - caseStart,
      errors,
    });
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;

  return {
    suite: "unit",
    total: results.length,
    passed,
    failed,
    durationMs: Date.now() - startTime,
    results,
    generatedAt: new Date().toISOString(),
  };
}

export async function runDatasetEvaluations({ provider = "mock", model } = {}) {
  const startTime = Date.now();
  const datasetPaths = (await filesUnder("evals/datasets")).filter((p) => p.endsWith(".json"));
  const results = [];

  for (const path of datasetPaths) {
    const caseStart = Date.now();
    const dataset = await readJson(path);
    const errors = [];

    // Run execution with mock/provider
    const runRes = await executeRun({
      request: dataset.request,
      provider,
      model,
      fixture: dataset.goldenOutput ? { output: dataset.goldenOutput } : null,
    });

    if (runRes.status === "error") {
      errors.push(`Execution error: ${runRes.validationErrors.join(", ")}`);
    }

    // Check context selection matches dataset expectation
    const selection = await resolveContext(dataset.request);
    const selErrors = compareSelection(selection, dataset.expected);
    errors.push(...selErrors);

    // Verify golden output fields if specified
    if (dataset.goldenOutput && typeof dataset.goldenOutput === "object") {
      for (const [key, val] of Object.entries(dataset.goldenOutput)) {
        if (runRes.output?.[key] !== val) {
          errors.push(`golden output mismatch on "${key}": expected ${JSON.stringify(val)}, got ${JSON.stringify(runRes.output?.[key])}`);
        }
      }
    }

    results.push({
      id: dataset.id ?? path.split("/").at(-1).replace(/\.json$/, ""),
      name: dataset.name,
      path,
      passed: errors.length === 0,
      durationMs: Date.now() - caseStart,
      errors,
      details: {
        runId: runRes.runId,
        provider: runRes.provider,
        tokens: runRes.tokens,
      },
    });
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;

  return {
    suite: "datasets",
    total: results.length,
    passed,
    failed,
    durationMs: Date.now() - startTime,
    results,
    generatedAt: new Date().toISOString(),
  };
}

export async function runAllEvaluations({ runUnit = true, runDatasets = true, provider = "mock", model } = {}) {
  const combinedResults = [];
  let totalDuration = 0;

  if (runUnit) {
    const unitReport = await runUnitEvaluations();
    combinedResults.push(...unitReport.results);
    totalDuration += unitReport.durationMs;
  }

  if (runDatasets) {
    const datasetsReport = await runDatasetEvaluations({ provider, model });
    combinedResults.push(...datasetsReport.results);
    totalDuration += datasetsReport.durationMs;
  }

  const passed = combinedResults.filter((r) => r.passed).length;
  const failed = combinedResults.length - passed;

  const report = {
    suite: runUnit && runDatasets ? "all" : (runUnit ? "unit" : "datasets"),
    total: combinedResults.length,
    passed,
    failed,
    durationMs: totalDuration,
    results: combinedResults,
    generatedAt: new Date().toISOString(),
  };

  const schema = await loadSchema("evaluation-report");
  assertValid(report, schema);

  return report;
}

// Direct CLI invocation
if (process.argv[1]?.endsWith("run-evals.mjs")) {
  const args = process.argv.slice(2);
  const onlyUnit = args.includes("--unit");
  const onlyDatasets = args.includes("--datasets");
  const isJson = args.includes("--json");
  const quiet = args.includes("--quiet");
  const providerIndex = args.indexOf("--provider");
  const provider = providerIndex >= 0 ? args[providerIndex + 1] : "mock";

  const runUnit = onlyUnit || (!onlyUnit && !onlyDatasets);
  const runDatasets = onlyDatasets || (!onlyUnit && !onlyDatasets);

  const report = await runAllEvaluations({ runUnit, runDatasets, provider });

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
  } else if (!quiet) {
    console.log(`\n--- Context Factory Evaluation Suite [${report.suite}] ---`);
    for (const r of report.results) {
      console.log(`${r.passed ? "PASS" : "FAIL"} [${r.id}] ${r.name} (${r.durationMs}ms)`);
      for (const err of r.errors) {
        console.log(`  - ${err}`);
      }
    }
    console.log(`\nSummary: ${report.passed}/${report.total} evaluations passed in ${report.durationMs}ms.\n`);
  }

  if (report.failed > 0) {
    process.exit(1);
  }
}
