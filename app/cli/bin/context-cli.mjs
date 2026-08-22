#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { readJson } from "../../../scripts/context-core.mjs";
import { handleBridgeCommand } from "../commands/bridge.mjs";
import { handleBuildCommand } from "../commands/build.mjs";
import { handleDiffCommand } from "../commands/diff.mjs";
import { handleDoctorCommand } from "../commands/doctor.mjs";
import { handleEvalCommand } from "../commands/eval.mjs";
import { handleExportCommand } from "../commands/export.mjs";
import { handleLintCommand } from "../commands/lint.mjs";
import { handleLockCommand } from "../commands/lock.mjs";
import { handlePullCommand } from "../commands/pull.mjs";
import { handleResolveCommand } from "../commands/resolve.mjs";
import { handleRunCommand } from "../commands/run.mjs";
import { handleStatusCommand } from "../commands/status.mjs";
import { handleSyncCommand } from "../commands/sync.mjs";
import { handleTaskCommand } from "../commands/task.mjs";
import { handleValidateCommand } from "../commands/validate.mjs";
import { banner, colors } from "../core/formatter.mjs";
import { parseArgs } from "../core/options.mjs";

export function showHelp() {
  console.log(banner("CONTEXT FACTORY CLI", "Maintain, validate, evaluate, and bridge context-factory"));
  console.log(`
${colors.bold("USAGE:")}
  ${colors.cyan("context-cli")} <command> [options]

${colors.bold("CORE MAINTENANCE COMMANDS:")}
  ${colors.bold(colors.green("bridge"))}       Bridge context-factory into host/consumer repository
  ${colors.bold(colors.green("pull"))}         Pull latest updates (supports host submodule & direct repo)
  ${colors.bold(colors.green("build"))}        Compile all rules, skills, and workflows to bundle
  ${colors.bold(colors.green("lint"))}         Validate manifest, frontmatter, schemas, and links
  ${colors.bold(colors.green("doctor"))}       Run full diagnostic health check (lint, lock, evals)
  ${colors.bold(colors.green("diff"))}         Detect drift and differences against context-lock.json
  ${colors.bold(colors.green("lock"))}         Generate or verify context-lock.json checksums
  ${colors.bold(colors.green("sync"))}         Auto-discover files, update manifest and lockfile
  ${colors.bold(colors.green("eval"))}         Run unit and golden dataset evaluation test suites
  ${colors.bold(colors.green("status"))}       Display factory overview, lock status, and task stats
  ${colors.bold(colors.green("export"))}       Export distribution packages

${colors.bold("AGENT EXECUTION & RESOLUTION:")}
  ${colors.bold(colors.green("resolve"))}      Resolve matching context rules & skills for a prompt
  ${colors.bold(colors.green("run"))}          Execute 3-stage LLM context run (mock/openai/anthropic/gemini)
  ${colors.bold(colors.green("task new"))}     Scaffold new phased task and milestone files
  ${colors.bold(colors.green("task list"))}    List active task plans in docs/tasks/
  ${colors.bold(colors.green("validate"))}     Validate JSON file against registered schema

${colors.bold("COMMON OPTIONS:")}
  ${colors.yellow("--json")}          Output machine-readable JSON
  ${colors.yellow("--quiet")}         Suppress non-error output
  ${colors.yellow("--no-color")}      Disable ANSI terminal colors
  ${colors.yellow("-h, --help")}      Show this help message
  ${colors.yellow("-v, --version")}   Show version information

${colors.bold("EXAMPLES:")}
  ${colors.dim("# Bridge context-factory into your target repository")}
  ${colors.white("context-cli bridge --target ../my-app --method submodule")}

  ${colors.dim("# Pull latest updates for submodule in host repository")}
  ${colors.white("context-cli pull")}

  ${colors.dim("# Compile full factory bundle")}
  ${colors.white("context-cli build --out dist/context-bundle.json")}

  ${colors.dim("# Run doctor diagnostics")}
  ${colors.white("context-cli doctor")}

  ${colors.dim("# Resolve rules for a prompt")}
  ${colors.white('context-cli resolve "implement stripe webhook endpoint"')}

  ${colors.dim("# Run evaluation tests")}
  ${colors.white("context-cli eval --unit")}
`);
}

export async function main(argv = process.argv.slice(2)) {
  const { command, args, flags } = parseArgs(argv);

  if (flags.help || flags.h || (!command && !flags.version && !flags.v)) {
    showHelp();
    return 0;
  }

  if (flags.version || flags.v) {
    try {
      const manifest = await readJson("context-manifest.json");
      console.log(`context-factory v${manifest.contextVersion}`);
    } catch {
      console.log("context-factory v3.7.0");
    }
    return 0;
  }

  switch (command) {
    case "bridge":
    case "connect":
    case "init-bridge":
      return handleBridgeCommand(args, flags);

    case "pull":
    case "update":
    case "fetch":
      return handlePullCommand(args, flags);

    case "build":
    case "compile":
    case "bundle-all":
      return handleBuildCommand(args, flags);

    case "diff":
    case "drift":
      return handleDiffCommand(args, flags);

    case "doctor":
    case "health":
      return handleDoctorCommand(args, flags);

    case "eval":
    case "test":
      return handleEvalCommand(args, flags);

    case "export":
    case "dist":
      return handleExportCommand(args, flags);

    case "lint":
    case "check":
      return handleLintCommand(args, flags);

    case "lock":
    case "freeze":
      return handleLockCommand(args, flags);

    case "resolve":
    case "match":
      return handleResolveCommand(args, flags);

    case "run":
    case "exec":
      return handleRunCommand(args, flags);

    case "status":
    case "info":
      return handleStatusCommand(args, flags);

    case "sync":
    case "refresh":
      return handleSyncCommand(args, flags);

    case "task":
      return handleTaskCommand(args, flags);

    case "validate":
      return handleValidateCommand(args, flags);

    case "help":
      showHelp();
      return 0;

    default:
      console.error(`${colors.red("Error:")} Unknown command "${command}".`);
      console.error(`Run ${colors.cyan("context-cli --help")} for a list of available commands.\n`);
      return 1;
  }
}

// Direct execution check for both direct script invocation and npm link bin alias
const scriptPath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1];
const isDirectExecution = invokedPath && (
  invokedPath.endsWith("context-cli") ||
  invokedPath.endsWith("context-cli.mjs") ||
  invokedPath === scriptPath
);

if (isDirectExecution) {
  main().then((code) => {
    if (code !== 0) process.exit(code);
  }).catch((err) => {
    console.error(`\n${colors.red("Fatal Error:")} ${err.message}\n`);
    process.exit(1);
  });
}
