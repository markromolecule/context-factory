import { spawnSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { runAllEvaluations } from "../../../evals/run-evals.mjs";
import { createLock, readJson, root } from "../../../scripts/context-core.mjs";
import { repairBridgeSymlinks, verifySymlinkHealth } from "../core/bridge-generator.mjs";
import { badges, colors, table } from "../core/formatter.mjs";
import { listAdapters } from "../../../orchestrator/conformance/adapter-contract.mjs";
import { registerTypeScriptAdapter } from "../../../orchestrator/conformance/adapters/typescript.mjs";
import { registerLaravelAdapter } from "../../../orchestrator/conformance/adapters/laravel.mjs";

export async function handleDoctorCommand(args = [], flags = {}) {
  const isJson = Boolean(flags.json);
  const repair = Boolean(flags.repair || flags.fix || flags.r);
  let canonicalTarget = flags.target ? (isAbsolute(flags.target) ? flags.target : resolve(process.cwd(), flags.target)) : process.cwd();
  try {
    if (existsSync(canonicalTarget)) canonicalTarget = realpathSync(canonicalTarget);
  } catch {}
  const targetDir = canonicalTarget;

  let canonicalRoot = root;
  try {
    if (existsSync(root)) canonicalRoot = realpathSync(root);
  } catch {}

  const startTime = Date.now();

  // Detect host repo vs factory submodule
  let hostDir = targetDir;
  let factoryDir = canonicalRoot;
  let isHostRepo = false;

  if (targetDir !== canonicalRoot && existsSync(join(targetDir, ".context-bridge.json"))) {
    isHostRepo = true;
    hostDir = targetDir;
    try {
      const bridgeJson = JSON.parse(await readFile(join(targetDir, ".context-bridge.json"), "utf8"));
      if (bridgeJson.factoryPath) {
        const candidate = resolve(targetDir, bridgeJson.factoryPath);
        if (existsSync(join(candidate, "context-manifest.json"))) {
          factoryDir = candidate;
        }
      }
    } catch {}
  } else if (targetDir !== canonicalRoot && existsSync(join(targetDir, ".gitmodules"))) {
    isHostRepo = true;
    hostDir = targetDir;
  } else if (targetDir !== canonicalRoot && existsSync(join(targetDir, ".agents"))) {
    isHostRepo = true;
    hostDir = targetDir;
  } else if (existsSync(join(dirname(targetDir), ".context-bridge.json")) || existsSync(join(dirname(targetDir), ".gitmodules"))) {
    // targetDir is a submodule inside host repo (e.g. sentinel/context-factory)
    isHostRepo = true;
    hostDir = dirname(targetDir);
    factoryDir = targetDir;
  }

  // Ensure factoryDir is valid
  if (!existsSync(join(factoryDir, "context-manifest.json"))) {
    if (existsSync(join(targetDir, "context-factory", "context-manifest.json"))) {
      factoryDir = join(targetDir, "context-factory");
    } else if (existsSync(join(targetDir, ".context-factory", "context-manifest.json"))) {
      factoryDir = join(targetDir, ".context-factory");
    } else {
      factoryDir = canonicalRoot;
    }
  }

  const symlinkTarget = isHostRepo ? hostDir : (existsSync(join(targetDir, ".agents")) ? targetDir : root);

  // If repair requested upfront, repair bridge symlinks before running checks
  let repairResult = null;
  if (repair) {
    repairResult = await repairBridgeSymlinks(symlinkTarget, flags);
  }

  // 1. Validator / Linter (run against factoryDir)
  const lintRes = spawnSync(process.execPath, ["scripts/validate-context.mjs"], {
    cwd: factoryDir,
    encoding: "utf8",
  });
  const lintPassed = lintRes.status === 0;

  // 2. Lock check
  let manifest;
  try {
    manifest = JSON.parse(await readFile(join(factoryDir, "context-manifest.json"), "utf8"));
  } catch {
    manifest = await readJson("context-manifest.json");
  }
  const expectedLock = await createLock(manifest, factoryDir);
  let actualLock = null;
  try {
    actualLock = JSON.parse(await readFile(join(factoryDir, "context-lock.json"), "utf8"));
  } catch {
    actualLock = null;
  }
  const lockPassed = actualLock && JSON.stringify(actualLock) === JSON.stringify(expectedLock);

  // 3. Symlink Health Check
  let symlinkHealth = await verifySymlinkHealth(symlinkTarget);
  let symlinkPassed = symlinkHealth.passed;

  // 4. Editor Configuration Health Check
  let editorHealth = await auditEditorConfigurations(symlinkTarget);
  let editorPassed = editorHealth.passed;

  // If symlinks or editor artifacts failed and repair was requested, recheck
  if ((!symlinkPassed || !editorPassed) && repair) {
    repairResult = await repairBridgeSymlinks(symlinkTarget, flags);
    symlinkHealth = await verifySymlinkHealth(symlinkTarget);
    symlinkPassed = symlinkHealth.passed;
    editorHealth = await auditEditorConfigurations(symlinkTarget);
    editorPassed = editorHealth.passed;
  }

  // 5. Evaluations
  const evalReport = await runAllEvaluations({ runUnit: true, runDatasets: true, provider: "mock" });
  const evalsPassed = evalReport.failed === 0;

  const totalDuration = Date.now() - startTime;
  const allPassed = lintPassed && lockPassed && symlinkPassed && editorPassed && evalsPassed;

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
        editorIntegrity: {
          passed: editorPassed,
          configuredIdes: editorHealth.configuredIdes,
          healthyCount: editorHealth.healthyCount,
          brokenCount: editorHealth.brokenCount,
          missingCount: editorHealth.missingCount,
          items: editorHealth.items,
          fullyEnforcedFromFilesAlone: false,
        },
        enforcementCapabilities: {
          passed: true,
          supportedStacks: editorHealth.enforcementCapabilities.supportedStacks,
          unsupportedStacks: editorHealth.enforcementCapabilities.unsupportedStacks,
          adapters: editorHealth.enforcementCapabilities.adapters,
          enforcementMode: editorHealth.enforcementCapabilities.enforcementMode,
          fullyEnforcedFromFilesAlone: false,
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
        ? `${symlinkHealth.healthyCount}/${symlinkHealth.totalCount || 6} symlink & agent configs verified healthy`
        : `${symlinkHealth.brokenCount} broken, ${symlinkHealth.missingCount} missing. Run \`context-cli doctor --repair\``,
    ],
    [
      "Editor Artifact Integrity",
      editorPassed ? badges.pass() : badges.fail(),
      editorPassed
        ? (editorHealth.totalCount > 0
            ? `${editorHealth.healthyCount}/${editorHealth.totalCount} editor configurations verified (${editorHealth.configuredIdes.join(", ") || "native"})`
            : "No external editors configured")
        : `${editorHealth.missingCount} missing, ${editorHealth.brokenCount} broken. Run \`context-cli doctor --repair\``,
    ],
    [
      "Conformance Enforcement",
      badges.pass(),
      `Adapters: ${editorHealth.enforcementCapabilities.supportedStacks.join(", ")} (ready) | Stacks: ${editorHealth.enforcementCapabilities.unsupportedStacks.join(", ")} (unsupported)`,
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

  if (!editorPassed) {
    console.log(`${colors.bold(colors.yellow("Editor Artifact Details:"))}`);
    for (const item of editorHealth.items) {
      if (item.status !== "healthy") {
        console.log(`  - [${item.ide}] ${colors.red(item.name)}: ${item.status} (${colors.dim(item.path)})`);
      }
    }
    console.log(`  ${colors.bold("Auto-fix:")} Run ${colors.cyan("context-cli doctor --repair")} to restore editor rules.\n`);
  }

  if (allPassed) {
    console.log(`  ${badges.done("HEALTHY")} ${colors.bold(colors.green("Context Factory is completely synchronized, valid, and healthy."))}\n`);
  } else {
    console.log(`  ${badges.warn("ATTENTION")} ${colors.bold(colors.yellow("Context Factory has findings requiring attention."))}`);
    console.log(`  Remediation: Run ${colors.bold(colors.cyan("context-cli doctor --repair"))} or ${colors.bold(colors.cyan("npm run sync"))}.\n`);
  }

  return allPassed ? 0 : 1;
}

/**
 * Inspects an editor instruction file's contents for required authoritative gates.
 */
export function inspectBridgeFileContent(content) {
  const missingGates = [];
  if (!content.includes("SHARED.md")) missingGates.push("shared-contract (SHARED.md)");
  if (!content.includes("resolve")) missingGates.push("resolve command");
  if (!content.includes("preflight")) missingGates.push("preflight command");
  if (!content.includes("conform")) missingGates.push("conform command");
  const lower = content.toLowerCase();
  const hasFailClosed = lower.includes("fail") || lower.includes("blocked") || lower.includes("self-attestation");
  if (!hasFailClosed) missingGates.push("fail-closed gate");

  return {
    valid: missingGates.length === 0,
    missingGates,
  };
}

/**
 * Audit enforcement capabilities independently of instruction file existence (AC-09, SC-07).
 */
export async function auditEnforcementCapabilities() {
  try {
    registerTypeScriptAdapter();
    registerLaravelAdapter();
  } catch {}
  const registeredAdapters = listAdapters();
  const supportedStacks = registeredAdapters.map((a) => a.stack);
  const knownStacks = ["typescript", "laravel", "flutter"];
  const unsupportedStacks = knownStacks.filter((s) => !supportedStacks.includes(s));

  return {
    adapters: registeredAdapters.map((a) => ({
      id: a.id,
      stack: a.stack,
      status: "ready",
    })),
    supportedStacks,
    unsupportedStacks,
    enforcementMode: "repository-cli",
    instructionOnlyProfiles: true,
    fullyEnforcedFromFilesAlone: false,
  };
}

/**
 * Audits a single editor bridge instruction file.
 */
async function auditBridgeProfileFile(canonicalTarget, relPath, ide) {
  const fullPath = join(canonicalTarget, relPath);
  if (!existsSync(fullPath)) {
    return { name: relPath, ide, status: "missing", path: fullPath };
  }
  try {
    const content = await readFile(fullPath, "utf8");
    if (!content || content.trim().length < 20) {
      return { name: relPath, ide, status: "empty instructions", path: fullPath };
    }
    const gateCheck = inspectBridgeFileContent(content);
    if (!gateCheck.valid) {
      return {
        name: relPath,
        ide,
        status: `weakened contract: missing ${gateCheck.missingGates.join(", ")}`,
        path: fullPath,
        missingGates: gateCheck.missingGates,
      };
    }
    return { name: relPath, ide, status: "healthy", path: fullPath };
  } catch {
    return { name: relPath, ide, status: "unreadable", path: fullPath };
  }
}

/**
 * Audit editor configuration integrity in a host repository or factory.
 * Verifies existence, valid contents, and contract links for configured editors.
 */
export async function auditEditorConfigurations(targetDir = process.cwd()) {
  let canonicalTarget = targetDir;
  try {
    if (existsSync(targetDir)) canonicalTarget = realpathSync(targetDir);
  } catch {}

  let bridgeConfig = null;
  try {
    const raw = await readFile(join(canonicalTarget, ".context-bridge.json"), "utf8");
    bridgeConfig = JSON.parse(raw);
  } catch {}

  const isContextFactory = existsSync(join(canonicalTarget, "context-manifest.json")) && !bridgeConfig;
  const isHostRepo = !isContextFactory && (Boolean(bridgeConfig) || existsSync(join(canonicalTarget, ".gitmodules")) || existsSync(join(canonicalTarget, ".agents")));

  // Determine configured IDEs
  let configuredIdes = bridgeConfig?.ides;
  if (!configuredIdes || !Array.isArray(configuredIdes) || configuredIdes.length === 0) {
    if (bridgeConfig?.ides && typeof bridgeConfig.ides === "string") {
      configuredIdes = [bridgeConfig.ides];
    } else {
      configuredIdes = [];
    }
  }

  const enforcement = await auditEnforcementCapabilities();

  // If no .context-bridge.json exists and it's context-factory itself, return healthy
  if (isContextFactory) {
    return {
      passed: true,
      isHostRepo: false,
      configuredIdes: ["factory-native"],
      healthyCount: 1,
      missingCount: 0,
      brokenCount: 0,
      totalCount: 1,
      items: [
        { name: "AGENTS.md", ide: "universal", status: "healthy", path: join(canonicalTarget, "AGENTS.md") },
      ],
      enforcementCapabilities: enforcement,
      fullyEnforcedFromFilesAlone: false,
      enforcementSummary: "Factory-native environment; CLI conformance gates authoritative.",
    };
  }

  const items = [];
  const isAll = configuredIdes.includes("all") || configuredIdes.includes("*");

  // 1. Universal Host Contract: AGENTS.md
  items.push(await auditBridgeProfileFile(canonicalTarget, "AGENTS.md", "universal"));

  // 2. Trae rules
  if (isAll || configuredIdes.includes("trae")) {
    items.push(await auditBridgeProfileFile(canonicalTarget, join(".trae", "rules", "project_rules.md"), "trae"));
  }

  // 3. VS Code / Copilot
  if (isAll || configuredIdes.includes("vscode") || configuredIdes.includes("copilot")) {
    items.push(await auditBridgeProfileFile(canonicalTarget, join(".github", "copilot-instructions.md"), "vscode"));
  }

  // 4. Cursor rules
  if (isAll || configuredIdes.includes("cursor")) {
    items.push(await auditBridgeProfileFile(canonicalTarget, join(".cursor", "rules", "context-factory.mdc"), "cursor"));
  }

  // 5. Antigravity / Gemini
  if (isAll || configuredIdes.includes("antigravity") || configuredIdes.includes("gemini")) {
    items.push(await auditBridgeProfileFile(canonicalTarget, "GEMINI.md", "antigravity"));
  }

  // 6. Claude Code
  if (isAll || configuredIdes.includes("claude")) {
    items.push(await auditBridgeProfileFile(canonicalTarget, "CLAUDE.md", "claude"));
  }

  // 7. Codex
  if (isAll || configuredIdes.includes("codex")) {
    items.push(await auditBridgeProfileFile(canonicalTarget, "CODEX.md", "codex"));
  }

  // 8. Windsurf
  if (isAll || configuredIdes.includes("windsurf")) {
    items.push(await auditBridgeProfileFile(canonicalTarget, ".windsurfrules", "windsurf"));
  }

  let healthyCount = 0;
  let missingCount = 0;
  let brokenCount = 0;

  for (const item of items) {
    if (item.status === "healthy") {
      healthyCount++;
    } else if (item.status === "missing") {
      missingCount++;
    } else {
      brokenCount++;
    }
  }

  const totalCount = items.length;
  const passed = totalCount > 0 ? (missingCount === 0 && brokenCount === 0) : true;

  return {
    passed,
    isHostRepo,
    configuredIdes,
    healthyCount,
    missingCount,
    brokenCount,
    totalCount,
    items,
    enforcementCapabilities: enforcement,
    fullyEnforcedFromFilesAlone: false,
    enforcementSummary: `Instruction profiles provide procedural guidance only; authoritative enforcement relies on repository CLI (${enforcement.supportedStacks.join(", ")} ready).`,
  };
}
