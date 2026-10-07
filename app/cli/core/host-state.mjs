import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { createLock, readJson, root } from "../../../scripts/context-core.mjs";

/**
 * Parses .gitmodules in host directory to detect Context Factory submodule configuration.
 *
 * @param {string} hostDir
 * @returns {Promise<{ hasSubmoduleConfig: boolean, submodulePath: string | null }>}
 */
async function inspectGitmodules(hostDir) {
  const gitmodulesPath = join(hostDir, ".gitmodules");
  if (!existsSync(gitmodulesPath)) {
    return { hasSubmoduleConfig: false, submodulePath: null };
  }

  try {
    const content = await readFile(gitmodulesPath, "utf8");
    if (!content.includes("context-factory")) {
      return { hasSubmoduleConfig: false, submodulePath: null };
    }

    const match = content.match(/path\s*=\s*(.+)/);
    const submodulePath = match ? match[1].trim() : ".context-factory";
    return { hasSubmoduleConfig: true, submodulePath };
  } catch {
    return { hasSubmoduleConfig: false, submodulePath: null };
  }
}

/**
 * Finds the latest conformance report file if one exists.
 *
 * @param {string} searchDir
 * @returns {Promise<object | null>}
 */
async function findLatestConformanceReport(searchDir) {
  const runsDir = join(searchDir, ".context-runs");
  if (!existsSync(runsDir)) {
    return null;
  }

  try {
    const entries = await readdir(runsDir, { recursive: true });
    const reportFiles = entries.filter((entry) => entry.endsWith("conformance-report.json"));
    if (reportFiles.length === 0) {
      return null;
    }

    // Pick first available report file for receipt inspection
    const reportPath = join(runsDir, reportFiles[0]);
    const reportContent = await readFile(reportPath, "utf8");
    return JSON.parse(reportContent);
  } catch {
    return null;
  }
}

/**
 * Probes host setup, factory health, and code conformance as distinct, actionable states.
 *
 * @param {object} [options]
 * @param {string} [options.hostDir] Host project root directory
 * @param {string} [options.factoryDir] Context Factory directory
 * @returns {Promise<{
 *   setup: { status: string, reason: string, nextCommand: string, method?: string, installedIdes?: string[] },
 *   health: { status: string, isCurrent: boolean, reason: string, nextCommand: string | null, digest?: string },
 *   conformance: { status: string, reason: string, nextCommand: string, reportId?: string },
 *   nextCommand: string
 * }>}
 */
export async function probeHostState(options = {}) {
  const hostDir = resolve(options.hostDir || process.cwd());
  const factoryDir = resolve(options.factoryDir || root);

  // 1. Host Setup Probe
  let setupState = {
    status: "unconfigured",
    reason: "Context Factory is not bridged into host repository",
    nextCommand: "context-cli init",
    method: null,
    installedIdes: [],
  };

  const gitmodulesInfo = await inspectGitmodules(hostDir);
  if (gitmodulesInfo.hasSubmoduleConfig && gitmodulesInfo.submodulePath) {
    const targetSubmoduleDir = join(hostDir, gitmodulesInfo.submodulePath);
    const isCheckedOut = existsSync(join(targetSubmoduleDir, "context-manifest.json")) ||
      existsSync(join(targetSubmoduleDir, ".git"));

    if (!isCheckedOut) {
      setupState = {
        status: "missing_submodule",
        reason: "Context Factory submodule directory is missing or uninitialized",
        nextCommand: "git submodule update --init --recursive",
        method: "submodule",
        installedIdes: [],
      };
    }
  }

  const bridgeConfigPath = join(hostDir, ".context-bridge.json");
  if (setupState.status !== "missing_submodule" && existsSync(bridgeConfigPath)) {
    try {
      const bridgeData = JSON.parse(await readFile(bridgeConfigPath, "utf8"));
      setupState = {
        status: "configured",
        reason: "Host project is bridged with Context Factory",
        nextCommand: "context-cli status",
        method: bridgeData.method || "submodule",
        installedIdes: bridgeData.installedIdes || [],
      };
    } catch {
      setupState = {
        status: "invalid_bridge",
        reason: "Corrupted .context-bridge.json configuration found",
        nextCommand: "context-cli repair",
        method: null,
        installedIdes: [],
      };
    }
  } else if (setupState.status !== "missing_submodule" && hostDir === factoryDir) {
    setupState = {
      status: "factory_native",
      reason: "Operating directly inside Context Factory root",
      nextCommand: "context-cli doctor",
      method: "native",
      installedIdes: [],
    };
  }

  // 2. Factory Health Probe
  let healthState = {
    status: "healthy",
    isCurrent: true,
    reason: "Factory lock and manifest synchronized",
    nextCommand: null,
    digest: null,
  };

  try {
    const manifestPath = join(factoryDir, "context-manifest.json");
    const lockPath = join(factoryDir, "context-lock.json");

    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
      const expectedLock = await createLock(manifest);
      let actualLock = null;
      if (existsSync(lockPath)) {
        actualLock = JSON.parse(await readFile(lockPath, "utf8"));
      }

      const isCurrent = Boolean(actualLock && JSON.stringify(actualLock) === JSON.stringify(expectedLock));
      healthState = {
        status: isCurrent ? "healthy" : "drift",
        isCurrent,
        reason: isCurrent ? "Manifest and lockfile are synchronized" : "Drift detected between manifest and context-lock.json",
        nextCommand: isCurrent ? null : "context-cli lock",
        digest: expectedLock.digest,
      };
    }
  } catch (err) {
    healthState = {
      status: "error",
      isCurrent: false,
      reason: `Failed to inspect factory health: ${err.message}`,
      nextCommand: "context-cli doctor --repair",
      digest: null,
    };
  }

  // 3. Code Conformance Probe (Never inferred from editor or doctor)
  let conformanceState = {
    status: "no_report",
    reason: "No authoritative code-conformance report found for current changes",
    nextCommand: 'context-cli conform "<task-description>"',
    reportId: null,
  };

  const latestReport = await findLatestConformanceReport(factoryDir) || await findLatestConformanceReport(hostDir);
  if (latestReport) {
    conformanceState = {
      status: latestReport.verdict || "UNKNOWN",
      reason: `Conformance verdict is ${latestReport.verdict || "UNKNOWN"} (report: ${latestReport.reportId || "unidentified"})`,
      nextCommand: latestReport.verdict === "PASS" ? "context-cli status" : 'context-cli conform "<task-description>"',
      reportId: latestReport.reportId || null,
    };
  }

  // 4. Determine Single Next Action
  let nextCommand = "context-cli doctor";
  if (setupState.status === "missing_submodule") {
    nextCommand = setupState.nextCommand;
  } else if (setupState.status === "unconfigured") {
    nextCommand = setupState.nextCommand;
  } else if (setupState.status === "invalid_bridge") {
    nextCommand = setupState.nextCommand;
  } else if (healthState.status === "drift") {
    nextCommand = healthState.nextCommand;
  } else if (conformanceState.status !== "PASS") {
    nextCommand = conformanceState.nextCommand;
  }

  return {
    setup: setupState,
    health: healthState,
    conformance: conformanceState,
    nextCommand,
  };
}
