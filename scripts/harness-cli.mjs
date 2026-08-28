#!/usr/bin/env node
import { isAbsolute, join, resolve } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { hashPath, readText, resolveContext, root, sha256 } from "./context-core.mjs";
import { executeRun } from "../orchestrator/runner.mjs";
import { loadSchema, validateSchema } from "../orchestrator/validator.mjs";
import { handleDoctorCommand } from "../app/cli/commands/doctor.mjs";
import { handleEvalCommand } from "../app/cli/commands/eval.mjs";
import { handleInitCommand } from "../app/cli/commands/init.mjs";
import { handleLintCommand } from "../app/cli/commands/lint.mjs";
import { handleLockCommand } from "../app/cli/commands/lock.mjs";
import { handleResolveCommand } from "../app/cli/commands/resolve.mjs";
import { handleTaskCommand } from "../app/cli/commands/task.mjs";
import { parseArgs } from "../app/cli/core/options.mjs";

export function usage() {
  console.log(`Context Factory Harness CLI

Usage:
  node scripts/harness-cli.mjs init [<target>] [--ide <name>] [--method <submodule|linked>]
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
  node scripts/harness-cli.mjs doctor [--repair]`);
}

function output(value) {
  console.log(JSON.stringify(value, null, 2));
}

export async function handleCli(argv = process.argv.slice(2)) {
  const { command, args: parsedArgs, flags } = parseArgs(argv);

  if (!command || command === "help" || command === "--help") {
    usage();
    return 0;
  }

  if (command === "init") {
    return handleInitCommand(parsedArgs, flags);
  }

  if (command === "resolve") {
    return handleResolveCommand(parsedArgs, flags);
  }

  if (command === "bundle") {
    const rawArgs = argv.slice(1);
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
    const rawArgs = argv.slice(1);
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
    return handleTaskCommand(["new", ...parsedArgs], flags);
  }

  if (command === "task:list") {
    return handleTaskCommand(["list", ...parsedArgs], flags);
  }

  if (command === "run") {
    const rawArgs = argv.slice(1);
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
    const rawArgs = argv.slice(1);
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
    return handleEvalCommand(parsedArgs, flags);
  }

  if (command === "lock") {
    return handleLockCommand(parsedArgs, flags);
  }

  if (command === "lint") {
    return handleLintCommand(parsedArgs, flags);
  }

  if (command === "doctor") {
    return handleDoctorCommand(parsedArgs, flags);
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
