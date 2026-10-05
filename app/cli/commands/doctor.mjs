import { spawnSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { runAllEvaluations } from "../../../evals/run-evals.mjs";
import { createLock, readJson, root } from "../../../scripts/context-core.mjs";
import { repairBridgeSymlinks, verifySymlinkHealth } from "../core/bridge-generator.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

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

  const isHostRepo = Boolean(bridgeConfig) || existsSync(join(canonicalTarget, ".gitmodules")) || existsSync(join(canonicalTarget, ".agents"));

  // Determine configured IDEs
  let configuredIdes = bridgeConfig?.ides;
  if (!configuredIdes || !Array.isArray(configuredIdes) || configuredIdes.length === 0) {
    if (bridgeConfig?.ides && typeof bridgeConfig.ides === "string") {
      configuredIdes = [bridgeConfig.ides];
    } else {
      configuredIdes = [];
    }
  }

  // If no .context-bridge.json exists and it's context-factory itself, return healthy
  if (!isHostRepo && canonicalTarget === (existsSync(root) ? realpathSync(root) : root)) {
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
    };
  }

  const items = [];
  let healthyCount = 0;
  let missingCount = 0;
  let brokenCount = 0;

  const isAll = configuredIdes.includes("all") || configuredIdes.includes("*");

  // Universal Host Contract: AGENTS.md
  const agentsMdPath = join(canonicalTarget, "AGENTS.md");
  if (existsSync(agentsMdPath)) {
    try {
      const content = await readFile(agentsMdPath, "utf8");
      if (content.includes("Context Factory") && content.includes("SHARED.md")) {
        healthyCount++;
        items.push({ name: "AGENTS.md", ide: "universal", status: "healthy", path: agentsMdPath });
      } else {
        brokenCount++;
        items.push({ name: "AGENTS.md", ide: "universal", status: "invalid contract content", path: agentsMdPath });
      }
    } catch {
      brokenCount++;
      items.push({ name: "AGENTS.md", ide: "universal", status: "unreadable", path: agentsMdPath });
    }
  } else {
    missingCount++;
    items.push({ name: "AGENTS.md", ide: "universal", status: "missing", path: agentsMdPath });
  }

  // Trae rules
  if (isAll || configuredIdes.includes("trae")) {
    const traeRulesPath = join(canonicalTarget, ".trae", "rules", "project_rules.md");
    if (existsSync(traeRulesPath)) {
      try {
        const content = await readFile(traeRulesPath, "utf8");
        if (content.includes("SHARED.md") || content.includes("orchestrator") || content.includes("Context Factory")) {
          healthyCount++;
          items.push({ name: ".trae/rules/project_rules.md", ide: "trae", status: "healthy", path: traeRulesPath });
        } else {
          brokenCount++;
          items.push({ name: ".trae/rules/project_rules.md", ide: "trae", status: "missing orchestrator reference", path: traeRulesPath });
        }
      } catch {
        brokenCount++;
        items.push({ name: ".trae/rules/project_rules.md", ide: "trae", status: "unreadable", path: traeRulesPath });
      }
    } else {
      missingCount++;
      items.push({ name: ".trae/rules/project_rules.md", ide: "trae", status: "missing", path: traeRulesPath });
    }
  }

  // VS Code / Copilot
  if (isAll || configuredIdes.includes("vscode") || configuredIdes.includes("copilot")) {
    const copilotPath = join(canonicalTarget, ".github", "copilot-instructions.md");
    if (existsSync(copilotPath)) {
      try {
        const content = await readFile(copilotPath, "utf8");
        if (content.length > 20) {
          healthyCount++;
          items.push({ name: ".github/copilot-instructions.md", ide: "vscode", status: "healthy", path: copilotPath });
        } else {
          brokenCount++;
          items.push({ name: ".github/copilot-instructions.md", ide: "vscode", status: "empty instructions", path: copilotPath });
        }
      } catch {
        brokenCount++;
        items.push({ name: ".github/copilot-instructions.md", ide: "vscode", status: "unreadable", path: copilotPath });
      }
    } else {
      missingCount++;
      items.push({ name: ".github/copilot-instructions.md", ide: "vscode", status: "missing", path: copilotPath });
    }
  }

  // Cursor rules
  if (isAll || configuredIdes.includes("cursor")) {
    const cursorRulesPath = join(canonicalTarget, ".cursor", "rules", "context-factory.mdc");
    if (existsSync(cursorRulesPath)) {
      try {
        const content = await readFile(cursorRulesPath, "utf8");
        if (content.length > 20) {
          healthyCount++;
          items.push({ name: ".cursor/rules/context-factory.mdc", ide: "cursor", status: "healthy", path: cursorRulesPath });
        } else {
          brokenCount++;
          items.push({ name: ".cursor/rules/context-factory.mdc", ide: "cursor", status: "empty mdc file", path: cursorRulesPath });
        }
      } catch {
        brokenCount++;
        items.push({ name: ".cursor/rules/context-factory.mdc", ide: "cursor", status: "unreadable", path: cursorRulesPath });
      }
    } else {
      missingCount++;
      items.push({ name: ".cursor/rules/context-factory.mdc", ide: "cursor", status: "missing", path: cursorRulesPath });
    }
  }

  // Antigravity / Gemini
  if (isAll || configuredIdes.includes("antigravity") || configuredIdes.includes("gemini")) {
    const geminiMdPath = join(canonicalTarget, "GEMINI.md");
    if (existsSync(geminiMdPath)) {
      try {
        const content = await readFile(geminiMdPath, "utf8");
        if (content.length > 20) {
          healthyCount++;
          items.push({ name: "GEMINI.md", ide: "antigravity", status: "healthy", path: geminiMdPath });
        } else {
          brokenCount++;
          items.push({ name: "GEMINI.md", ide: "antigravity", status: "empty entrypoint", path: geminiMdPath });
        }
      } catch {
        brokenCount++;
        items.push({ name: "GEMINI.md", ide: "antigravity", status: "unreadable", path: geminiMdPath });
      }
    } else {
      missingCount++;
      items.push({ name: "GEMINI.md", ide: "antigravity", status: "missing", path: geminiMdPath });
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
  };
}
