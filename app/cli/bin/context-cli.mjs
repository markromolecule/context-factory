#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { readJson } from "../../../scripts/context-core.mjs";
import { handleBridgeCommand } from "../commands/bridge.mjs";
import { handleBuildCommand } from "../commands/build.mjs";
import { handleDiffCommand } from "../commands/diff.mjs";
import { handleDoctorCommand } from "../commands/doctor.mjs";
import { handleEvalCommand } from "../commands/eval.mjs";
import { handleExportCommand } from "../commands/export.mjs";
import { handleHookCommand } from "../commands/hook.mjs";
import { handleInitCommand } from "../commands/init.mjs";
import { handleLintCommand } from "../commands/lint.mjs";
import { handleLockCommand } from "../commands/lock.mjs";
import { handlePreflightCommand } from "../commands/preflight.mjs";
import { handleConformCommand } from "../commands/conform.mjs";
import { handlePullCommand } from "../commands/pull.mjs";
import { handleRepairCommand } from "../commands/repair.mjs";
import { handleResolveCommand } from "../commands/resolve.mjs";
import { handleRunCommand } from "../commands/run.mjs";
import { handleSessionCommand } from "../commands/session.mjs";
import { handleStatusCommand } from "../commands/status.mjs";
import { handleSyncCommand } from "../commands/sync.mjs";
import { handleTaskCommand } from "../commands/task.mjs";
import { handleValidateCommand } from "../commands/validate.mjs";
import { banner, colors, commandCard, quickStartCard } from "../core/formatter.mjs";
import { parseArgs } from "../core/options.mjs";

export function showHelp() {
  console.log(banner("CONTEXT FACTORY CLI", "Maintain, validate, evaluate, and bridge context-factory"));
  console.log();

  console.log(quickStartCard([
    ["1. Bridge", "context-cli init", "Interactive setup to bridge Context Factory into your repo"],
    ["2. Validate", "context-cli doctor", "Run full diagnostic health check across rules & skills"],
    ["3. Sync", "context-cli sync", "Auto-discover context files, refresh manifest and lockfile"],
    ["4. Plan", "context-cli task new", "Scaffold phased task, milestones, and unit execution files"],
    ["5. Checkpoint", "context-cli session save", "Save state before context window reaches saturation (>60%)"],
  ]));
  console.log();

  console.log(`${colors.bold("USAGE:")}
  ${colors.cyan("context-cli")} <command> [options]
`);

  console.log(commandCard("PROJECT BRIDGING & SETUP", [
    ["init", "Interactive setup to bridge Context Factory into a project"],
    ["bridge", "Bridge context-factory into host repository", "(--ide, --method, --pm)"],
    ["repair", "Auto-repair broken symlinks, bridges, and editor rules", "([target])"],
    ["pull", "Pull latest updates & auto-heal symlinks", "(submodule or git repo)"],
    ["hook", "Install or manage zero-drift git pre-commit hook", "(hook install)"],
  ], { icon: "📦", badgeColor: "cyan" }));
  console.log();

  console.log(commandCard("CORE MAINTENANCE & HEALTH", [
    ["doctor", "Run full diagnostic health check", "(--repair to auto-fix)"],
    ["sync", "Auto-discover files, update manifest and lockfile"],
    ["diff", "Detect drift and differences against context-lock.json"],
    ["lock", "Generate or verify context-lock.json checksums"],
    ["lint", "Validate manifest, frontmatter, schemas, and links"],
    ["build", "Compile all rules, skills, and workflows to bundle"],
    ["eval", "Run unit and golden dataset evaluation test suites", "(--unit)"],
    ["status", "Display factory overview, lock status, and task stats"],
    ["export", "Export distribution packages"],
  ], { icon: "🛠️", badgeColor: "blue" }));
  console.log();

  console.log(commandCard("AGENT ORCHESTRATION & EXECUTION", [
    ["resolve", "Resolve matching context rules & skills for a prompt"],
    ["run", "Execute 3-stage LLM context run", "(mock/openai/anthropic/gemini)"],
    ["task new", "Scaffold new phased task and milestone files", '"<title>"'],
    ["task list", "List active task plans in docs/tasks/"],
    ["validate", "Validate JSON file against registered schema"],
  ], { icon: "🤖", badgeColor: "green" }));
  console.log();

  console.log(commandCard("SESSION CHECKPOINTS & RESUME (LHG)", [
    ["session save", "Save compact checkpoint to .context/sessions/ and .tmp/"],
    ["session resume", "Load and output cold-start prompt for saved session"],
    ["session status", "List all saved session checkpoints", "(alias: session list)"],
    ["session clear", "Delete saved session checkpoints", "(--all to clear all)"],
  ], { icon: "⏱️", badgeColor: "yellow" }));
  console.log();

  console.log(`${colors.bold("COMMON OPTIONS:")}
  ${colors.yellow("--json")}          Output machine-readable JSON
  ${colors.yellow("--quiet")}         Suppress non-error output
  ${colors.yellow("--no-color")}      Disable ANSI terminal colors
  ${colors.yellow("-h, --help")}      Show this help message
  ${colors.yellow("-v, --version")}   Show version information
`);

  console.log(`${colors.bold("EXAMPLES:")}
  ${colors.dim("# Bridge context-factory into your target repository")}
  ${colors.white("context-cli bridge --target ../my-app --method submodule")}

  ${colors.dim("# Pull latest updates for submodule in host repository")}
  ${colors.white("context-cli pull")}

  ${colors.dim("# Run doctor diagnostics")}
  ${colors.white("context-cli doctor")}

  ${colors.dim("# Resolve rules for a prompt")}
  ${colors.white('context-cli resolve "implement stripe webhook endpoint"')}

  ${colors.dim("# Save session checkpoint before context saturation (>60%)")}
  ${colors.white('context-cli session save --name task-0001-phase-1')}

  ${colors.dim("# Resume latest session in fresh context window")}
  ${colors.white("context-cli session resume")}
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
    case "init":
    case "setup":
    case "new-project":
      return handleInitCommand(args, flags);

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

    case "repair":
    case "fix":
      return handleRepairCommand(args, flags);

    case "eval":
    case "test":
      return handleEvalCommand(args, flags);

    case "export":
    case "dist":
      return handleExportCommand(args, flags);

    case "hook":
    case "hooks":
    case "pre-commit":
      return handleHookCommand(args, flags);

    case "lint":
    case "check":
      return handleLintCommand(args, flags);

    case "lock":
    case "freeze":
      return handleLockCommand(args, flags);

    case "resolve":
    case "match":
      return handleResolveCommand(args, flags);

    case "preflight":
      return handlePreflightCommand(args, flags);

    case "conform":
    case "conformance":
      return handleConformCommand(args, flags);

    case "run":
    case "exec":
      return handleRunCommand(args, flags);

    case "session":
    case "session:save":
    case "session:resume":
    case "session:status":
    case "session:list":
    case "session:clear":
    case "save-session":
    case "resume-session": {
      let subCmd = args;
      if (command === "session:save" || command === "save-session") subCmd = ["save", ...args];
      else if (command === "session:resume" || command === "resume-session") subCmd = ["resume", ...args];
      else if (command === "session:status" || command === "session:list") subCmd = ["status", ...args];
      else if (command === "session:clear") subCmd = ["clear", ...args];
      return handleSessionCommand(subCmd, flags);
    }

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
