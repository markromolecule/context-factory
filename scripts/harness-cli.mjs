#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import {
  createLock,
  hashPath,
  readJson,
  readText,
  resolveContext,
  root,
  sha256,
} from "./context-core.mjs";
import { listTasks, scaffoldTask } from "./task-workflow.mjs";
import { executeRun } from "../orchestrator/runner.mjs";
import { assertValid, loadSchema, validateSchema } from "../orchestrator/validator.mjs";
import { runAllEvaluations } from "../evals/run-evals.mjs";

export function usage() {
  console.log(`Context Factory Harness CLI

Usage:
  node scripts/harness-cli.mjs resolve <request>
  node scripts/harness-cli.mjs bundle <request> [--out <path>]
  node scripts/harness-cli.mjs explain <run-id-or-bundle-path>
  node scripts/harness-cli.mjs run <request> [--provider <mock|openai|anthropic|gemini>] [--model <name>] [--schema <name>]
  node scripts/harness-cli.mjs task:new <title> [--type <feature|defect|refactor|migration>] [--dry-run]
  node scripts/harness-cli.mjs task:list [--json]
  node scripts/harness-cli.mjs validate <file-path> --schema <schema-name>
  node scripts/harness-cli.mjs eval [--unit] [--datasets] [--json] [--quiet] [--provider <name>]
  node scripts/harness-cli.mjs lock [--check]
  node scripts/harness-cli.mjs lint
  node scripts/harness-cli.mjs doctor`);
}

function output(value) {
  console.log(JSON.stringify(value, null, 2));
}

export function runValidator({ quiet = false } = {}) {
  const result = spawnSync(process.execPath, ["scripts/validate-context.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  if (!quiet || result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
  return result.status === 0;
}

export async function checkLock({ write = false } = {}) {
  const expected = await createLock();
  let actual = null;
  try {
    actual = JSON.parse(await readFile(join(root, "context-lock.json"), "utf8"));
  } catch {
    // Reported below.
  }
  const current = actual && JSON.stringify(actual) === JSON.stringify(expected);
  if (write) {
    await writeFile(join(root, "context-lock.json"), `${JSON.stringify(expected, null, 2)}\n`);
    console.log(`Wrote context-lock.json (${expected.digest}).`);
    return true;
  }
  console.log(current
    ? `Context lock is current (${expected.digest}).`
    : "Context lock is missing or stale. Run `node scripts/harness-cli.mjs lock`.");
  return current;
}

export async function handleCli(argv = process.argv.slice(2)) {
  const [command, ...rawArgs] = argv;

  if (!command || command === "help" || command === "--help") {
    usage();
    return 0;
  }

  if (command === "resolve") {
    const request = rawArgs.join(" ").trim();
    if (!request) throw new Error("resolve requires a request");
    output(await resolveContext(request));
    return 0;
  }

  if (command === "bundle") {
    const outIndex = rawArgs.indexOf("--out");
    const outArg = outIndex >= 0 ? rawArgs[outIndex + 1] : null;
    const requestArgs = outIndex >= 0 ? rawArgs.slice(0, outIndex) : rawArgs;
    const request = requestArgs.join(" ").trim();
    if (!request) throw new Error("bundle requires a request");
    if (outIndex >= 0 && !outArg) throw new Error("--out requires a path");

    const selection = await resolveContext(request);
    const sources = [];
    for (const path of selection.selectedPaths) {
      sources.push({
        path,
        hash: `sha256:${await hashPath(path)}`,
        content: await readText(path),
      });
    }
    const runId = sha256(JSON.stringify({
      contextVersion: selection.contextVersion,
      request,
      sources: sources.map(({ path, hash }) => ({ path, hash })),
    })).slice(0, 16);
    const bundle = {
      schemaVersion: 1,
      runId,
      createdFrom: {
        contextVersion: selection.contextVersion,
        request,
      },
      selection,
      claimClasses: ["verified-fact", "assumption", "decision", "unknown", "result"],
      requiredResultEvidence: ["acceptance-criterion", "implementation-boundary", "verification-command", "outcome"],
      sources,
    };
    const destination = outArg
      ? (isAbsolute(outArg) ? outArg : resolve(root, outArg))
      : join(root, ".context-runs", runId, "bundle.json");
    await mkdir(resolve(destination, ".."), { recursive: true });
    await writeFile(destination, `${JSON.stringify(bundle, null, 2)}\n`, { flag: "wx" })
      .catch(async (error) => {
        if (error.code !== "EEXIST") throw error;
        const existing = JSON.parse(await readFile(destination, "utf8"));
        if (JSON.stringify(existing) !== JSON.stringify(bundle)) {
          throw new Error(`immutable bundle conflict at ${destination}`);
        }
      });
    output({ runId, path: destination, sourceCount: sources.length });
    return 0;
  }

  if (command === "explain") {
    const target = rawArgs[0];
    if (!target) throw new Error("explain requires a run ID or bundle path");
    const path = target.includes("/") || target.endsWith(".json")
      ? (isAbsolute(target) ? target : resolve(root, target))
      : join(root, ".context-runs", target, "bundle.json");
    const bundle = JSON.parse(await readFile(path, "utf8"));
    output({
      runId: bundle.runId,
      request: bundle.createdFrom.request,
      contextVersion: bundle.createdFrom.contextVersion,
      workflow: bundle.selection.workflow,
      rules: bundle.selection.rules,
      skills: bundle.selection.skills,
      taste: bundle.selection.taste,
      sources: bundle.sources.map(({ path: sourcePath, hash }) => ({ path: sourcePath, hash })),
    });
    return 0;
  }

  if (command === "task:new") {
    const typeIndex = rawArgs.indexOf("--type");
    const type = typeIndex >= 0 ? rawArgs[typeIndex + 1] : "feature";
    const dryRun = rawArgs.includes("--dry-run");
    const titleArgs = typeIndex >= 0
      ? [...rawArgs.slice(0, typeIndex), ...rawArgs.slice(typeIndex + 2)].filter((arg) => arg !== "--dry-run")
      : rawArgs.filter((arg) => arg !== "--dry-run");
    const title = titleArgs.join(" ").trim();
    if (!title) throw new Error("task:new requires a task title");

    const result = await scaffoldTask({ title, type, dryRun });
    if (dryRun) {
      console.log(`[DRY RUN] Would scaffold task: ${result.taskDirectory}`);
    } else {
      console.log(`Scaffolded task ${result.taskId} (${result.type}) at ${result.taskDirectory}:`);
      for (const file of result.files) {
        console.log(`  - ${file}`);
      }
    }
    return 0;
  }

  if (command === "task:list") {
    const tasks = await listTasks();
    if (rawArgs.includes("--json")) {
      output(tasks);
    } else {
      console.log(`\n--- Context Factory Tasks (${tasks.length}) ---`);
      for (const t of tasks) {
        console.log(`[${t.status.toUpperCase()}] ${t.title} (${t.created}) -> ${t.path}`);
      }
      console.log("");
    }
    return 0;
  }

  if (command === "run") {
    const providerIndex = rawArgs.indexOf("--provider");
    const provider = providerIndex >= 0 ? rawArgs[providerIndex + 1] : "mock";
    const modelIndex = rawArgs.indexOf("--model");
    const model = modelIndex >= 0 ? rawArgs[modelIndex + 1] : "mock-v1";
    const schemaIndex = rawArgs.indexOf("--schema");
    const schema = schemaIndex >= 0 ? rawArgs[schemaIndex + 1] : null;

    const requestTokens = rawArgs.filter((arg, idx) => {
      if (providerIndex >= 0 && (idx === providerIndex || idx === providerIndex + 1)) return false;
      if (modelIndex >= 0 && (idx === modelIndex || idx === modelIndex + 1)) return false;
      if (schemaIndex >= 0 && (idx === schemaIndex || idx === schemaIndex + 1)) return false;
      return true;
    });
    const request = requestTokens.join(" ").trim();
    if (!request) throw new Error("run requires a request prompt");

    const result = await executeRun({ request, provider, model, schema });
    output(result);
    return result.status === "error" ? 1 : 0;
  }

  if (command === "validate") {
    const schemaIndex = rawArgs.indexOf("--schema");
    if (schemaIndex < 0 || !rawArgs[schemaIndex + 1]) {
      throw new Error("validate requires --schema <schema-name>");
    }
    const schemaName = rawArgs[schemaIndex + 1];
    const filePath = rawArgs.find((arg, idx) => idx !== schemaIndex && idx !== schemaIndex + 1);
    if (!filePath) throw new Error("validate requires a target file path");

    const fileContent = JSON.parse(await readText(filePath));
    const schema = await loadSchema(schemaName);
    const result = validateSchema(fileContent, schema);

    if (result.valid) {
      console.log(`PASS: ${filePath} conforms to ${schemaName}`);
      return 0;
    }
    console.error(`FAIL: ${filePath} failed schema validation:`);
    for (const err of result.errors) console.error(`  - ${err}`);
    return 1;
  }

  if (command === "eval") {
    const onlyUnit = rawArgs.includes("--unit");
    const onlyDatasets = rawArgs.includes("--datasets");
    const isJson = rawArgs.includes("--json");
    const quiet = rawArgs.includes("--quiet");
    const providerIndex = rawArgs.indexOf("--provider");
    const provider = providerIndex >= 0 ? rawArgs[providerIndex + 1] : "mock";

    const runUnit = onlyUnit || (!onlyUnit && !onlyDatasets);
    const runDatasets = onlyDatasets || (!onlyUnit && !onlyDatasets);

    const report = await runAllEvaluations({ runUnit, runDatasets, provider });

    if (isJson) {
      output(report);
    } else if (!quiet) {
      console.log(`\n--- Context Factory Evaluation Suite [${report.suite}] ---`);
      for (const r of report.results) {
        console.log(`${r.passed ? "PASS" : "FAIL"} [${r.id}] ${r.name} (${r.durationMs}ms)`);
        for (const err of r.errors) console.log(`  - ${err}`);
      }
      console.log(`\nSummary: ${report.passed}/${report.total} evaluations passed in ${report.durationMs}ms.\n`);
    }

    return report.failed > 0 ? 1 : 0;
  }

  if (command === "lock") {
    if (rawArgs.includes("--check")) {
      const isCurrent = await checkLock();
      return isCurrent ? 0 : 1;
    }
    await checkLock({ write: true });
    return 0;
  }

  if (command === "lint") {
    const passed = runValidator();
    return passed ? 0 : 1;
  }

  if (command === "doctor") {
    const validationPassed = runValidator();
    const lockCurrent = await checkLock();
    const evalReport = await runAllEvaluations({ runUnit: true, runDatasets: true, provider: "mock" });
    const evalsPassed = evalReport.failed === 0;

    console.log(`\nEvaluations summary: ${evalReport.passed}/${evalReport.total} evaluations passed.`);
    const passed = validationPassed && lockCurrent && evalsPassed;
    console.log(passed ? "Context Factory is healthy." : "Context Factory has synchronization findings.");
    return passed ? 0 : 1;
  }

  usage();
  return 1;
}

if (process.argv[1]?.endsWith("harness-cli.mjs")) {
  handleCli().then((code) => {
    if (code !== 0) process.exit(code);
  }).catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
