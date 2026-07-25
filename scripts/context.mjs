#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import {
  compareSelection,
  createLock,
  hashPath,
  readJson,
  readText,
  resolveContext,
  root,
  sha256,
} from "./context-core.mjs";

function usage() {
  console.log(`Context Factory harness

Usage:
  node scripts/context.mjs resolve <request>
  node scripts/context.mjs bundle <request> [--out <path>]
  node scripts/context.mjs explain <run-id-or-bundle-path>
  node scripts/context.mjs lock [--check]
  node scripts/context.mjs lint
  node scripts/context.mjs eval
  node scripts/context.mjs doctor`);
}

function output(value) {
  console.log(JSON.stringify(value, null, 2));
}

async function runEvaluations({ quiet = false } = {}) {
  const manifest = await readJson("context-manifest.json");
  const results = [];
  for (const path of manifest.evaluations ?? []) {
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
    results.push({ path, name: testCase.name, passed: errors.length === 0, errors });
  }
  const failed = results.filter((result) => !result.passed);
  if (!quiet) {
    for (const result of results) {
      console.log(`${result.passed ? "PASS" : "FAIL"} ${result.name}`);
      for (const error of result.errors) console.log(`  - ${error}`);
    }
    console.log(`${results.length - failed.length}/${results.length} behavioral evaluations passed.`);
  }
  return { passed: failed.length === 0, results };
}

function runValidator({ quiet = false } = {}) {
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

async function checkLock({ write = false } = {}) {
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
    : "Context lock is missing or stale. Run `node scripts/context.mjs lock`.");
  return current;
}

const [command, ...rawArgs] = process.argv.slice(2);

if (!command || command === "help" || command === "--help") {
  usage();
  process.exit(0);
}

if (command === "resolve") {
  const request = rawArgs.join(" ").trim();
  if (!request) throw new Error("resolve requires a request");
  output(await resolveContext(request));
} else if (command === "bundle") {
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
} else if (command === "explain") {
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
    sources: bundle.sources.map(({ path: sourcePath, hash }) => ({ path: sourcePath, hash })),
  });
} else if (command === "lock") {
  if (rawArgs.includes("--check")) {
    if (!await checkLock()) process.exitCode = 1;
  } else {
    await checkLock({ write: true });
  }
} else if (command === "lint") {
  if (!runValidator()) process.exitCode = 1;
} else if (command === "eval") {
  if (!(await runEvaluations()).passed) process.exitCode = 1;
} else if (command === "doctor") {
  const validationPassed = runValidator();
  const lockCurrent = await checkLock();
  const evaluations = await runEvaluations();
  const passed = validationPassed && lockCurrent && evaluations.passed;
  console.log(passed ? "Context Factory is healthy." : "Context Factory has synchronization findings.");
  if (!passed) process.exitCode = 1;
} else {
  usage();
  process.exitCode = 1;
}
