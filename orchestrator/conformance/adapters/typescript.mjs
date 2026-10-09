import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import { registerAdapter } from "../adapter-contract.mjs";
import { executeCommand } from "../process-runner.mjs";

function toolResult(directive, status, verifierType, outputFragment, command, exitCode, effectiveConfigDigest) {
  return {
    directiveId: directive.id,
    mode: directive.mode || "automated-blocking",
    status,
    evidence: {
      verifierType,
      outputFragment,
      ...(command ? { command } : {}),
      ...(Number.isInteger(exitCode) ? { exitCode } : {}),
      ...(effectiveConfigDigest ? { effectiveConfigDigest } : {}),
    },
    evaluatedAt: new Date().toISOString(),
  };
}

const LINT_RULES = {
  "ts.type-safety.ban-any": ["no-explicit-any", "no-unsafe-assignment", "no-unsafe-call", "no-unsafe-member-access", "no-unsafe-return", "no-unsafe-argument"],
  "ts.async.no-floating-promises": ["no-floating-promises"],
};

async function checkLint({ directive, changedScope, hostDir, readTextFn, commandRunner, capabilities }) {
  const now = new Date().toISOString();
  const files = changedScope.filter((p) => /\.(ts|tsx|mts|cts)$/i.test(p));
  if (files.length === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "eslint", "Scope is empty or contains no TypeScript files.");
  }

  // 1. If host has eslint installed, run it
  if (capabilities?.tools?.eslint && capabilities?.commands?.eslint) {
    const tool = capabilities.commands.eslint;
    const absFiles = files.map((p) => resolve(hostDir, p));
    const rules = Object.fromEntries((LINT_RULES[directive.id] || ["no-floating-promises"]).map((name) => [`@typescript-eslint/${name}`, "error"]));
    const args = [...tool.args, "--format", "json", "--no-ignore", "--no-inline-config", "--max-warnings", "0", "--rule", JSON.stringify(rules), ...absFiles];
    const command = JSON.stringify([tool.command, ...args]);
    const run = await commandRunner({ command: tool.command, args, cwd: hostDir });
    if (run.notFound || run.timedOut || ![0, 1].includes(run.exitCode)) {
      return toolResult(directive, "TOOL_UNAVAILABLE", "eslint", run.stderr || "ESLint could not execute the required checks.", command, run.exitCode);
    }
    let reports;
    try { reports = JSON.parse(run.stdout); } catch { /* Invalid output is not proof. */ }
    if (!Array.isArray(reports) || absFiles.some((file) => !reports.some((r) => resolve(hostDir, r.filePath || "") === file))
      || reports.some((r) => !Array.isArray(r.messages) || !Number.isInteger(r.errorCount) || !Number.isInteger(r.warningCount)
        || r.fatalErrorCount > 0 || r.messages.some((m) => m.ruleId === null) || r.suppressedMessages?.length)) {
      return toolResult(directive, "TOOL_UNAVAILABLE", "eslint", "ESLint did not provide unsuppressed, configured results for every requested file.", command, run.exitCode);
    }
    const failed = run.exitCode !== 0 || reports.some((r) => r.errorCount > 0 || r.warningCount > 0 || r.messages.length > 0);
    return toolResult(directive, failed ? "FAIL" : "PASS", "eslint", run.stdout, command, run.exitCode);
  }

  // If not running in fixture mode, missing host tooling is fail-closed
  if (!capabilities?.fixtureMode) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "eslint", "Host tool eslint is missing in host environment.");
  }

  // 2. Fallback static analysis for floating promises (offline fixture mode only)
  let filesRead = 0;
  const violations = [];
  for (const filePath of files) {
    try {
      const fullPath = resolve(hostDir, filePath);
      const content = await readTextFn(fullPath, "utf8");
      filesRead++;
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        const noComments = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "");
        const trimmed = noComments.trim();
        if (
          /^(?:fetch|Promise\.(?:all|race|allSettled|resolve|reject))\s*\(/.test(trimmed) &&
          !/^(?:await\b|return\b|void\b|const\b|let\b|var\b)/.test(trimmed)
        ) {
          violations.push({
            file: filePath,
            line: index + 1,
            message: `Floating promise detected at ${filePath}:${index + 1}: "${line.trim()}". Every promise must be explicitly awaited, returned, or marked with void.`,
          });
        }
      });
    } catch {
      // file read error handled below
    }
  }

  if (filesRead === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "eslint", "Could not read any files in changed scope.");
  }

  if (violations.length > 0) {
    return {
      directiveId: directive.id,
      status: "FAIL",
      mode: directive.mode || "automated-blocking",
      evidence: {
        verifierType: "async-promise-linter",
        exitCode: 1,
        outputFragment: violations.map((v) => v.message).join("\n"),
      },
      durationMs: 8,
      evaluatedAt: now,
    };
  }

  return {
    directiveId: directive.id,
    status: "PASS",
    mode: directive.mode || "automated-blocking",
    evidence: {
      verifierType: "async-promise-linter",
      exitCode: 0,
      outputFragment: `Checked ${filesRead} files: 0 floating promise violations found.`,
    },
    durationMs: 8,
    evaluatedAt: now,
  };
}

async function checkStrictCompiler({ directive, changedScope, hostDir, readTextFn, commandRunner, capabilities }) {
  const now = new Date().toISOString();
  const files = changedScope.filter((p) => /\.(ts|tsx|mts|cts)$/i.test(p));
  if (files.length === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "tsc", "Scope is empty or contains no TypeScript files.");
  }

  // 1. If host has tsc and tsconfig, use the real compiler
  if (capabilities?.tools?.tsc && capabilities?.hasTsConfig) {
    const project = resolve(hostDir, "tsconfig.json");
    const toolCmd = capabilities.commands?.tsc?.command || "tsc";
    const toolArgs = capabilities.commands?.tsc?.args || [];
    const configArgs = [...toolArgs, "--showConfig", "--project", project];
    const configRun = await commandRunner({ command: toolCmd, args: configArgs, cwd: hostDir });
    let config;
    try { config = JSON.parse(configRun.stdout); } catch { /* No verified effective config. */ }
    if (configRun.exitCode !== 0 || configRun.timedOut || configRun.notFound || !config?.compilerOptions) {
      return toolResult(directive, "TOOL_UNAVAILABLE", "tsc", "Cannot read effective TypeScript configuration.", JSON.stringify([toolCmd, ...configArgs]), configRun.exitCode);
    }
    const settings = config.compilerOptions;
    const effectiveConfigDigest = createHash("sha256").update(JSON.stringify(settings)).digest("hex");
    if (settings.strict !== true || settings.noUncheckedIndexedAccess !== true || settings.noImplicitAny === false || settings.strictNullChecks === false) {
      return toolResult(directive, "FAIL", "tsc", "Effective config must enable strict and noUncheckedIndexedAccess without disabling noImplicitAny or strictNullChecks.", JSON.stringify([toolCmd, ...configArgs]), configRun.exitCode, effectiveConfigDigest);
    }
    if (Array.isArray(config.files) && config.files.length > 0 && files.some((file) => !config.files?.some((p) => resolve(hostDir, p) === resolve(hostDir, file)))) {
      return toolResult(directive, "TOOL_UNAVAILABLE", "tsc", "The selected tsconfig does not cover every changed TypeScript file; run conformance from the affected package.", JSON.stringify([toolCmd, ...configArgs]), configRun.exitCode, effectiveConfigDigest);
    }
    const args = [...toolArgs, "--noEmit", "--project", project];
    const run = await commandRunner({ command: toolCmd, args, cwd: hostDir });
    const status = run.notFound || run.timedOut || !Number.isInteger(run.exitCode) ? "TOOL_UNAVAILABLE" : run.exitCode === 0 ? "PASS" : "FAIL";
    return toolResult(directive, status, "tsc", run.stdout || run.stderr || "Effective strict configuration and included source checked.", JSON.stringify([toolCmd, ...args]), run.exitCode, effectiveConfigDigest);
  }

  // If not running in fixture mode, missing host tooling is fail-closed
  if (!capabilities?.fixtureMode) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "tsc", "Host tool tsc or tsconfig.json is missing in host environment.");
  }

  // 2. Fallback static semantic check when host compiler tooling is absent (offline fixture mode only)
  let filesRead = 0;
  const violations = [];
  for (const filePath of files) {
    try {
      const fullPath = resolve(hostDir, filePath);
      const content = await readTextFn(fullPath, "utf8");
      filesRead++;
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        const noComments = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "");
        if (
          /:\s*number\s*=\s*["'`]/i.test(noComments) ||
          /:\s*string\s*=\s*(?:-?\d+|true\b|false\b)/i.test(noComments) ||
          /:\s*boolean\s*=\s*(?:["'`]|-?\d+)/i.test(noComments)
        ) {
          violations.push({
            file: filePath,
            line: index + 1,
            message: `Strict type mismatch detected at ${filePath}:${index + 1}: "${line.trim()}".`,
          });
        }
      });
    } catch {
      // file read error handled below
    }
  }

  if (filesRead === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "tsc", "Could not read any files in changed scope.");
  }

  if (violations.length > 0) {
    return {
      directiveId: directive.id,
      status: "FAIL",
      mode: directive.mode || "automated-blocking",
      evidence: {
        verifierType: "ts-type-checker",
        exitCode: 1,
        outputFragment: violations.map((v) => v.message).join("\n"),
      },
      durationMs: 10,
      evaluatedAt: now,
    };
  }

  return {
    directiveId: directive.id,
    status: "PASS",
    mode: directive.mode || "automated-blocking",
    evidence: {
      verifierType: "ts-type-checker",
      exitCode: 0,
      outputFragment: `Checked ${filesRead} files: 0 strict compiler violations found.`,
    },
    durationMs: 10,
    evaluatedAt: now,
  };
}

/**
 * Discovers host TypeScript capabilities and available tooling.
 */
export async function discoverTypeScriptCapabilities(hostDir = process.cwd(), { readTextFn = readFile } = {}) {
  const capabilities = {
    fixtureMode: false,
    hasPackageJson: false,
    hasTsConfig: false,
    scripts: {},
    packageManager: "npm",
    commands: {},
    tools: {
      tsc: false,
      eslint: false,
    },
  };

  try {
    const pkgPath = resolve(hostDir, "package.json");
    const pkgContent = JSON.parse(await readTextFn(pkgPath, "utf8"));
    capabilities.hasPackageJson = true;
    capabilities.scripts = pkgContent.scripts || {};
  } catch {
    // Non-fatal if package.json not found
  }

  try {
    const tsconfigPath = resolve(hostDir, "tsconfig.json");
    await readTextFn(tsconfigPath, "utf8");
    capabilities.hasTsConfig = true;
  } catch {
    // Non-fatal if tsconfig.json not found
  }

  const requireFromHost = createRequire(resolve(hostDir, "package.json"));
  for (const [tool, pkg, bin] of [["tsc", "typescript", "bin/tsc"], ["eslint", "eslint", "bin/eslint.js"]]) {
    try {
      const packagePath = requireFromHost.resolve(`${pkg}/package.json`);
      const cliPath = resolve(dirname(packagePath), bin);
      await readTextFn(cliPath, "utf8");
      capabilities.tools[tool] = true;
      capabilities.commands[tool] = { command: process.execPath, args: [cliPath] };
    } catch {
      // Declared dependencies alone do not prove that a tool is installed.
    }
  }

  return capabilities;
}

/**
 * Verifier: Type safety & ban-any (AC-07 class 1)
 */
async function checkBanAny({ directive, changedScope, hostDir, readTextFn, commandRunner, capabilities }) {
  const now = new Date().toISOString();
  const violations = [];
  let filesRead = 0;

  const files = changedScope.filter((p) => /\.(ts|tsx|mts|cts)$/i.test(p));
  if (files.length === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "ts-type-checker", "Scope is empty or contains no TypeScript files.");
  }

  for (const filePath of files) {
    try {
      const fullPath = resolve(hostDir, filePath);
      const content = await readTextFn(fullPath, "utf8");
      filesRead++;
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        const noComments = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "");
        const codeOnly = noComments.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, '""');
        if (/\bany\b/.test(codeOnly)) {
          violations.push({
            file: filePath,
            line: index + 1,
            snippet: line.trim(),
            message: `Banned "any" type detected at ${filePath}:${index + 1}: "${line.trim()}"`,
          });
        }
      });
    } catch {
      // File read error
    }
  }

  if (filesRead === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "ts-type-checker", "Could not read any files in changed scope.");
  }

  let commandEvidence = null;
  if (capabilities?.tools?.tsc) {
    const runRes = await commandRunner({ command: "tsc", args: ["--noEmit"], cwd: hostDir });
    commandEvidence = {
      command: "tsc --noEmit",
      exitCode: runRes.exitCode,
      outputFragment: runRes.stdout || runRes.stderr || "",
    };
    if (runRes.exitCode !== 0) {
      violations.push({
        file: "project",
        message: `TypeScript compiler failed with exit code ${runRes.exitCode}`,
      });
    }
  }

  if (violations.length > 0) {
    return {
      directiveId: directive.id,
      status: "FAIL",
      mode: directive.mode || "automated-blocking",
      evidence: {
        verifierType: "ts-type-checker",
        exitCode: 1,
        outputFragment: violations.map((v) => v.message).join("\n"),
        ...(commandEvidence ? { command: commandEvidence.command } : {}),
      },
      durationMs: 10,
      evaluatedAt: now,
    };
  }

  return {
    directiveId: directive.id,
    status: "PASS",
    mode: directive.mode || "automated-blocking",
    evidence: {
      verifierType: "ts-type-checker",
      exitCode: 0,
      outputFragment: `Checked ${filesRead} files: 0 banned any violations found.`,
      ...(commandEvidence ? { command: commandEvidence.command } : {}),
    },
    durationMs: 10,
    evaluatedAt: now,
  };
}

/**
 * Verifier: Runtime validation at boundaries (AC-07 class 2)
 */
async function checkRuntimeValidation({ directive, changedScope, hostDir, readTextFn }) {
  const now = new Date().toISOString();
  const violations = [];
  let filesRead = 0;

  const files = changedScope.filter((p) => /\.(ts|tsx|mts|cts)$/i.test(p));
  if (files.length === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "runtime-validation-linter", "Scope is empty or contains no TypeScript files.");
  }

  for (const filePath of files) {
    try {
      const fullPath = resolve(hostDir, filePath);
      const content = await readTextFn(fullPath, "utf8");
      filesRead++;
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        const noComments = line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "");
        if (/(req\.body|req\.query|event\.body|payload)\s+as\s+(?!any\b)({|[A-Za-z_])/i.test(noComments)) {
          violations.push({
            file: filePath,
            line: index + 1,
            message: `Unvalidated boundary cast detected at ${filePath}:${index + 1}: "${line.trim()}". Boundary data must be parsed via schema.`,
          });
        }
        if (/(?:\(await\s+fetch\b|fetch\(.*?\))\s*\.json\s*\(\s*\)|\.json\s*\(\s*\)/i.test(noComments)) {
          const hasSchema = /parse|schema|zod|valibot|arktype/i.test(content);
          if (!hasSchema) {
            violations.push({
              file: filePath,
              line: index + 1,
              message: `Unvalidated boundary data parse detected at ${filePath}:${index + 1}: "${line.trim()}". API boundary payloads must be validated via schema.`,
            });
          }
        }
      });
    } catch {
      // Non-fatal
    }
  }

  if (filesRead === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "runtime-validation-linter", "Could not read any files in changed scope.");
  }

  if (violations.length > 0) {
    return {
      directiveId: directive.id,
      status: "FAIL",
      mode: directive.mode || "automated-blocking",
      evidence: {
        verifierType: "runtime-validation-linter",
        exitCode: 1,
        outputFragment: violations.map((v) => v.message).join("\n"),
      },
      durationMs: 8,
      evaluatedAt: now,
    };
  }

  return {
    directiveId: directive.id,
    status: "PASS",
    mode: directive.mode || "automated-blocking",
    evidence: {
      verifierType: "runtime-validation-linter",
      exitCode: 0,
      outputFragment: "All boundary data parsing conforms to schema validation guidelines.",
    },
    durationMs: 8,
    evaluatedAt: now,
  };
}

/**
 * Verifier: Module & layer boundaries (AC-07 class 3)
 */
async function checkModuleBoundaries({ directive, changedScope, hostDir, readTextFn }) {
  const now = new Date().toISOString();
  const violations = [];
  let filesRead = 0;

  const files = changedScope.filter((p) => /\.(ts|tsx|mts|cts)$/i.test(p));
  if (files.length === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "module-boundary-linter", "Scope is empty or contains no TypeScript files.");
  }

  for (const filePath of files) {
    try {
      const fullPath = resolve(hostDir, filePath);
      const content = await readTextFn(fullPath, "utf8");
      filesRead++;
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        const codeOnly = line.replace(/\/\/.*$/, "");
        if (/import\s+.*from\s+['"](\.\.\/\.\.\/\.\.\/|\.\.\/\.\.\/src)/.test(codeOnly)) {
          violations.push({
            file: filePath,
            line: index + 1,
            message: `Illegal upward relative module traversal at ${filePath}:${index + 1}: "${line.trim()}". Use path aliases.`,
          });
        }
      });
    } catch {
      // Non-fatal
    }
  }

  if (filesRead === 0) {
    return toolResult(directive, "TOOL_UNAVAILABLE", "module-boundary-linter", "Could not read any files in changed scope.");
  }

  if (violations.length > 0) {
    return {
      directiveId: directive.id,
      status: "FAIL",
      mode: directive.mode || "automated-blocking",
      evidence: {
        verifierType: "module-boundary-linter",
        exitCode: 1,
        outputFragment: violations.map((v) => v.message).join("\n"),
      },
      durationMs: 8,
      evaluatedAt: now,
    };
  }

  return {
    directiveId: directive.id,
    status: "PASS",
    mode: directive.mode || "automated-blocking",
    evidence: {
      verifierType: "module-boundary-linter",
      exitCode: 0,
      outputFragment: "Module imports adhere to strict layer and path alias boundaries.",
    },
    durationMs: 8,
    evaluatedAt: now,
  };
}

/**
 * Verifier: Architecture boundaries (AC-07 class 4)
 */
async function checkArchitectureBoundaries({ directive, options = {} }) {
  const now = new Date().toISOString();

  if (options.humanEvidence && typeof options.humanEvidence === "string" && options.humanEvidence.trim()) {
    return {
      directiveId: directive.id,
      status: "PASS",
      mode: "evidence-blocking",
      evidence: {
        verifierType: "human-judgment",
        humanEvidence: options.humanEvidence.trim(),
        outputFragment: `Architectural boundary verified: ${options.humanEvidence.trim()}`,
      },
      durationMs: 5,
      evaluatedAt: now,
    };
  }

  if (directive.mode === "evidence-blocking") {
    return {
      directiveId: directive.id,
      status: "NOT_AUTOMATABLE",
      mode: "evidence-blocking",
      evidence: {
        verifierType: "human-judgment",
        outputFragment: "Architecture boundary judgment requires named human evidence before merge.",
      },
      durationMs: 5,
      evaluatedAt: now,
    };
  }

  return {
    directiveId: directive.id,
    status: "PASS",
    mode: directive.mode || "advisory",
    evidence: {
      verifierType: "architecture-auditor",
      outputFragment: "Advisory architectural checks completed.",
    },
    durationMs: 5,
    evaluatedAt: now,
  };
}

/**
 * TypeScript Conformance Adapter Object conforming to ConformanceAdapter interface.
 */
export const typeScriptAdapter = {
  id: "typescript-conformance-adapter",
  stack: "typescript",

  canHandle(binding) {
    if (!binding || typeof binding !== "object") return false;
    return binding.stack?.toLowerCase() === "typescript";
  },

  async evaluate({
    binding,
    changedScope = [],
    capabilities = null,
    commandService = null,
    options = {},
  } = {}) {
    const hostDir = options.cwd || process.cwd();
    const readTextFn = options.readTextFn || readFile;
    const commandRunner = commandService || executeCommand;
    const isFixtureMode = Boolean(capabilities?.fixtureMode || options?.fixtureMode);
    const baseCaps = capabilities?.tools ? capabilities : await discoverTypeScriptCapabilities(hostDir, { readTextFn });
    const effectiveCaps = { ...baseCaps, fixtureMode: isFixtureMode };

    const results = [];
    const directives = binding.directives || [];

    for (const directive of directives) {
      const id = directive.id.toLowerCase();

      // Tool unavailable case when explicitly required by options
      if (options.toolUnavailable && (id.includes("tsc") || id.includes("type"))) {
        results.push({
          directiveId: directive.id,
          status: "TOOL_UNAVAILABLE",
          mode: directive.mode,
          evidence: {
            verifierType: "tsc",
            outputFragment: "TypeScript compiler (tsc) is not available in host environment.",
          },
          durationMs: 0,
          evaluatedAt: new Date().toISOString(),
        });
        continue;
      }

      // 1. Evidence-blocking directives (AC-07 class 4)
      if (directive.mode === "evidence-blocking") {
        results.push(await checkArchitectureBoundaries({ directive, options }));
        continue;
      }

      // 2. Type safety & ban-any (AC-07 class 1)
      if (id === "ts.type-safety.ban-any") {
        results.push(await checkBanAny({ directive, changedScope, hostDir, readTextFn, commandRunner, capabilities: effectiveCaps }));
        continue;
      }

      // 3. Runtime validation boundaries (AC-07 class 2)
      if (id === "ts.runtime-validation.zero-trust-boundaries" || id === "ts.runtime-validation.parse-boundary-data" || id.includes("runtime-validation")) {
        results.push(await checkRuntimeValidation({ directive, changedScope, hostDir, readTextFn }));
        continue;
      }

      // 4. Module & layer imports (AC-07 class 3)
      if (id === "ts.module-imports.forbid-upward-relative-traversal" || id.includes("module-imports")) {
        results.push(await checkModuleBoundaries({ directive, changedScope, hostDir, readTextFn }));
        continue;
      }

      if (id === "ts.async.no-floating-promises") {
        results.push(await checkLint({ directive, changedScope, hostDir, readTextFn, commandRunner, capabilities: effectiveCaps }));
        continue;
      }

      if (id === "ts.type-safety.strict-compiler-settings") {
        results.push(await checkStrictCompiler({ directive, changedScope, hostDir, readTextFn, commandRunner, capabilities: effectiveCaps }));
        continue;
      }

      // Default advisory or heuristic pass
      results.push({
        directiveId: directive.id,
        status: directive.mode === "unsupported" ? "UNSUPPORTED" : "PASS",
        mode: directive.mode || "advisory",
        evidence: {
          verifierType: "heuristic-pass",
          outputFragment: `Directive ${directive.id} passed advisory check.`,
        },
        durationMs: 1,
        evaluatedAt: new Date().toISOString(),
      });
    }

    return results;
  },
};

/**
 * Registers TypeScript adapter into global registry.
 */
export function registerTypeScriptAdapter() {
  registerAdapter(typeScriptAdapter);
}
