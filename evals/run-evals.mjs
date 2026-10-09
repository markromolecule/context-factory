#!/usr/bin/env node
import { compareSelection, filesUnder, readJson, readText, resolveContext } from "../scripts/context-core.mjs";
import { executeRun } from "../orchestrator/runner.mjs";
import { assertValid, loadSchema } from "../orchestrator/validator.mjs";
import { evaluateConformance } from "../orchestrator/conformance/conformance-orchestrator.mjs";
import { registerTypeScriptAdapter } from "../orchestrator/conformance/adapters/typescript.mjs";
import { validateWaiver } from "../orchestrator/conformance/waiver-policy.mjs";
import { inspectBridgeFileContent } from "../app/cli/commands/doctor.mjs";

export async function runUnitEvaluations() {
  const startTime = Date.now();
  const manifest = await readJson("context-manifest.json");
  const results = [];

  for (const path of manifest.evaluations ?? []) {
    const caseStart = Date.now();
    const testCase = await readJson(path);
    const selection = await resolveContext(testCase.request, testCase.options ?? {});
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
      details: {
        type: testCase.type ?? "routing-selection-only",
      },
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

  registerTypeScriptAdapter();

  for (const path of datasetPaths) {
    const caseStart = Date.now();
    const dataset = await readJson(path);
    const errors = [];
    let runRes = null;

    if (dataset.adversarial) {
      switch (dataset.adversarialClass) {
        case "missing-binding": {
          try {
            runRes = await executeRun({
              request: dataset.request,
              provider,
              model,
              requireBinding: dataset.requireBinding ?? true,
              scope: dataset.scope ?? [],
              stack: dataset.stack,
            });
            if (runRes.status !== "error" && runRes.status !== "rejected") {
              errors.push("Expected execution to be rejected for missing binding, but run succeeded.");
            }
          } catch (err) {
            if (dataset.expectedErrorMatch && !err.message.includes(dataset.expectedErrorMatch)) {
              errors.push(`Expected error matching "${dataset.expectedErrorMatch}", got: ${err.message}`);
            }
          }
          break;
        }

        case "wrong-stack": {
          const selection = await resolveContext(dataset.request, {
            stack: dataset.stack,
            scope: dataset.scope,
          });
          const binding = (selection?.binding && selection.binding.directives?.length > 0) ? selection.binding : {
            id: `binding-${dataset.stack}`,
            bindingHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
            stack: dataset.stack,
            directives: [{ id: "mock/directive", mode: "automated-blocking" }],
          };
          const report = await evaluateConformance({
            binding,
            changedScope: dataset.scope,
          });
          const verdict = report.verdict || report.summary?.status;
          if (verdict !== dataset.expectedConformance?.expectedStatus) {
            errors.push(`Expected conformance status "${dataset.expectedConformance?.expectedStatus}", got "${verdict}"`);
          }
          if (dataset.expectedConformance?.expectedVerifierType) {
            const hasVerifier = report.results.some(
              (r) => r.evidence?.verifierType === dataset.expectedConformance.expectedVerifierType
            );
            if (!hasVerifier) {
              errors.push(`Expected verifierType "${dataset.expectedConformance.expectedVerifierType}"`);
            }
          }
          break;
        }

        case "stale-hash": {
          const selection = await resolveContext(dataset.request, {
            stack: dataset.stack,
            scope: dataset.scope,
          });
          const binding = selection?.binding ? { ...selection.binding, bindingHash: dataset.tamperedBindingHash } : null;
          if (!binding) {
            errors.push("Failed to resolve base binding for stale-hash evaluation.");
          } else {
            const expectedHash = selection.binding.bindingHash;
            if (binding.bindingHash === expectedHash) {
              errors.push("Binding hash was not tampered.");
            }
          }
          break;
        }

        case "code-violation": {
          const selection = await resolveContext(dataset.request, {
            stack: dataset.stack,
            scope: dataset.scope,
          });
          if (!selection?.binding) {
            errors.push("Failed to resolve binding for code-violation evaluation.");
          } else {
            const report = await evaluateConformance({
              binding: selection.binding,
              changedScope: dataset.scope,
            });
            const verdict = report.verdict || report.summary?.status;
            if (verdict !== dataset.expectedConformance?.expectedStatus) {
              errors.push(`Expected status "${dataset.expectedConformance?.expectedStatus}", got "${verdict}"`);
            }
            if (dataset.expectedConformance?.expectedViolatedDirective) {
              const found = report.results.some(
                (r) => r.directiveId === dataset.expectedConformance.expectedViolatedDirective && r.status === "FAIL"
              );
              if (!found) {
                errors.push(`Expected violation on directive "${dataset.expectedConformance.expectedViolatedDirective}"`);
              }
            }
          }
          break;
        }

        case "forged-waiver": {
          try {
            await validateWaiver(dataset.waiver);
            errors.push("Expected waiver validation failure for forged waiver, but it passed.");
          } catch (err) {
            if (dataset.expectedErrorMatch && !err.message.includes(dataset.expectedErrorMatch)) {
              errors.push(`Expected error matching "${dataset.expectedErrorMatch}", got: ${err.message}`);
            }
          }
          break;
        }

        case "tool-unavailable": {
          const selection = await resolveContext(dataset.request, {
            stack: dataset.stack,
            scope: dataset.scope,
          });
          const binding = selection?.binding || {
            id: "binding-tool-unavail",
            bindingHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
            stack: dataset.stack,
            directives: [{ id: "mock/directive", mode: "automated-blocking" }],
          };
          const mockCommandService = {
            which: () => null,
            exec: () => ({ status: 127, stdout: "", stderr: "command not found" }),
          };
          const report = await evaluateConformance({
            binding,
            changedScope: dataset.scope,
            commandService: mockCommandService,
            capabilities: { tscAvailable: false, biomeAvailable: false, eslintAvailable: false, tools: { tsc: false, eslint: false } },
            options: { toolUnavailable: true },
          });
          const verdict = report.verdict || report.summary?.status;
          if (verdict !== "BLOCKED" && verdict !== "FAIL") {
            errors.push(`Expected tool unavailable gate to block, but got: ${verdict}`);
          }
          if (!report.summary || report.summary.toolUnavailable === 0) {
            errors.push("Expected report summary to record toolUnavailable count > 0");
          }
          break;
        }

        case "prompt-stripping": {
          const runRes = await executeRun({
            request: dataset.request,
            provider,
            model,
            stack: dataset.stack,
            scope: dataset.scope,
            hooks: {
              onPromptPrepare: () => ({ prompt: "Stripped prompt with no directives", systemPrompt: "Stripped system prompt" }),
            },
          });
          if (runRes.status !== "error") {
            errors.push("Expected prompt stripping integrity error, but executeRun succeeded.");
          } else if (dataset.expectedErrorMatch) {
            const hasMatch = runRes.validationErrors?.some((e) => e.includes(dataset.expectedErrorMatch));
            if (!hasMatch) {
              errors.push(`Expected error matching "${dataset.expectedErrorMatch}", got: ${runRes.validationErrors?.join(", ")}`);
            }
          }
          break;
        }

        case "bridge-omission": {
          const weakenedBridge = `# Bridge Instructions\n- resolve: node scripts/context.mjs resolve\n`;
          const inspection = inspectBridgeFileContent(weakenedBridge);
          if (inspection.valid) {
            errors.push("Expected inspection to reject weakened bridge, but it returned valid.");
          }
          break;
        }

        default:
          errors.push(`Unknown adversarialClass: ${dataset.adversarialClass}`);
      }
    } else {
      // Standard workflow evaluation dataset
      runRes = await executeRun({
        request: dataset.request,
        provider,
        model,
        fixture: dataset.goldenOutput ? { output: dataset.goldenOutput } : null,
      });

      if (runRes.status === "error") {
        errors.push(`Execution error: ${runRes.validationErrors?.join(", ") || "Unknown error"}`);
      }

      // Check context selection matches dataset expectation
      if (dataset.expected) {
        const selection = await resolveContext(dataset.request);
        const selErrors = compareSelection(selection, dataset.expected);
        errors.push(...selErrors);
      }

      // Verify golden output fields if specified
      if (dataset.goldenOutput && typeof dataset.goldenOutput === "object") {
        for (const [key, val] of Object.entries(dataset.goldenOutput)) {
          if (runRes.output?.[key] !== val) {
            errors.push(`golden output mismatch on "${key}": expected ${JSON.stringify(val)}, got ${JSON.stringify(runRes.output?.[key])}`);
          }
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
        runId: runRes?.runId ?? null,
        provider: runRes?.provider ?? provider,
        tokens: runRes?.tokens ?? null,
        adversarialClass: dataset.adversarialClass ?? null,
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
