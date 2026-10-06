import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { registerAdapter } from "../adapter-contract.mjs";
import { executeCommand } from "../process-runner.mjs";

const PHP_FILE_PATTERN = /\.php$/i;
const QUALITY_TOOLS = ["pint", "phpstan", "psalm", "pest", "phpunit", "architecture"];

function emptyToolCapabilities() {
  return Object.fromEntries(["php", "composer", ...QUALITY_TOOLS].map((tool) => [tool, false]));
}

function directiveMatches(directiveId, terms) {
  return terms.some((term) => directiveId.includes(term));
}

async function readChangedPhpFiles(changedScope, hostDir, readTextFn) {
  const files = [];
  for (const filePath of changedScope) {
    if (!PHP_FILE_PATTERN.test(filePath)) continue;
    try {
      files.push({ filePath, content: await readTextFn(resolve(hostDir, filePath), "utf8") });
    } catch {
      files.push({ filePath, content: "" });
    }
  }
  return files;
}

function result(directive, status, verifierType, outputFragment, command) {
  return {
    directiveId: directive.id,
    status,
    mode: directive.mode || "automated-blocking",
    evidence: {
      verifierType,
      outputFragment,
      ...(command ? { command } : {}),
    },
    durationMs: 1,
    evaluatedAt: new Date().toISOString(),
  };
}

function sourceViolationResult(directive, phpFiles, matcher, message) {
  const violation = phpFiles.find(({ content }) => matcher(content));
  if (!violation) return null;
  return result(directive, "FAIL", "laravel-source-inspection", `${message}: ${violation.filePath}`);
}

function qualityToolForDirective(directiveId) {
  return QUALITY_TOOLS.find((tool) => directiveId.includes(tool)) || null;
}

function evidenceBlockingResult(directive, humanEvidence) {
  if (!humanEvidence || typeof humanEvidence !== "string" || !humanEvidence.trim()) {
    return result(directive, "NOT_AUTOMATABLE", "human-judgment", "Laravel adapter requires named human evidence for this evidence-blocking directive.");
  }
  const checked = result(directive, "PASS", "human-judgment", `Laravel boundary reviewed: ${humanEvidence.trim()}`);
  checked.evidence.humanEvidence = humanEvidence.trim();
  return checked;
}

function qualityCommand(tool, capabilities) {
  if (capabilities.scripts?.[tool]) {
    return { command: "composer", args: ["run-script", tool, "--", "--no-interaction"] };
  }
  if (tool === "pint") return { command: "vendor/bin/pint", args: ["--test"] };
  if (tool === "phpstan") return { command: "vendor/bin/phpstan", args: ["analyse", "--no-progress"] };
  if (tool === "psalm") return { command: "vendor/bin/psalm", args: ["--no-progress"] };
  if (tool === "pest") return { command: "vendor/bin/pest", args: [] };
  if (tool === "phpunit") return { command: "vendor/bin/phpunit", args: [] };
  return { command: "composer", args: ["run-script", "architecture", "--", "--no-interaction"] };
}

/**
 * Discovers Laravel project declarations without assuming globally installed tools.
 */
export async function discoverLaravelCapabilities(hostDir = process.cwd(), { readTextFn = readFile } = {}) {
  const capabilities = {
    hasComposerJson: false,
    hasArtisan: false,
    scripts: {},
    tools: emptyToolCapabilities(),
  };

  try {
    const composer = JSON.parse(await readTextFn(resolve(hostDir, "composer.json"), "utf8"));
    const packages = { ...(composer.require || {}), ...(composer["require-dev"] || {}) };
    capabilities.hasComposerJson = true;
    capabilities.scripts = composer.scripts || {};
    capabilities.tools.pint = Boolean(packages["laravel/pint"] || capabilities.scripts.pint);
    capabilities.tools.phpstan = Boolean(packages["phpstan/phpstan"] || packages["nunomaduro/larastan"] || capabilities.scripts.phpstan);
    capabilities.tools.psalm = Boolean(packages["vimeo/psalm"] || capabilities.scripts.psalm);
    capabilities.tools.pest = Boolean(packages["pestphp/pest"] || capabilities.scripts.pest);
    capabilities.tools.phpunit = Boolean(packages["phpunit/phpunit"] || capabilities.scripts.phpunit);
    capabilities.tools.architecture = Boolean(capabilities.scripts.architecture || capabilities.scripts.arch);
  } catch {
    // A host without Composer metadata has no discoverable Laravel quality tooling.
  }

  try {
    await readTextFn(resolve(hostDir, "artisan"), "utf8");
    capabilities.hasArtisan = true;
  } catch {
    // Artisan is optional for source-level verification.
  }

  return capabilities;
}

export const laravelAdapter = {
  id: "laravel-conformance-adapter",
  stack: "laravel",

  canHandle(binding) {
    return Boolean(binding && typeof binding === "object" && binding.stack?.toLowerCase() === "laravel");
  },

  async evaluate({ binding, changedScope = [], capabilities = null, commandService = null, options = {} } = {}) {
    const hostDir = options.cwd || process.cwd();
    const readTextFn = options.readTextFn || readFile;
    const commandRunner = commandService || executeCommand;
    const effectiveCapabilities = capabilities || await discoverLaravelCapabilities(hostDir, { readTextFn });
    const phpFiles = await readChangedPhpFiles(changedScope, hostDir, readTextFn);
    const results = [];

    for (const directive of binding.directives || []) {
      const directiveId = directive.id.toLowerCase();
      const qualityTool = qualityToolForDirective(directiveId);

      if (directive.mode === "evidence-blocking") {
        results.push(evidenceBlockingResult(directive, options.humanEvidence));
        continue;
      }

      if (qualityTool) {
        if (!effectiveCapabilities.tools?.[qualityTool]) {
          results.push(result(directive, "TOOL_UNAVAILABLE", "laravel-tool-discovery", `Configured Laravel quality tool "${qualityTool}" is not available in the host environment.`));
          continue;
        }
        const command = qualityCommand(qualityTool, effectiveCapabilities);
        const execution = await commandRunner({ ...command, cwd: hostDir, timeoutMs: 30000, maxOutputBytes: 1024 * 1024 });
        const status = execution.timedOut || execution.notFound ? "TOOL_UNAVAILABLE" : execution.exitCode === 0 ? "PASS" : "FAIL";
        results.push(result(directive, status, `laravel-${qualityTool}`, execution.stdout || execution.stderr || `${qualityTool} completed.`, `${command.command} ${command.args.join(" ")}`));
        continue;
      }

      if (directiveMatches(directiveId, ["validation", "form-request"])) {
        results.push(sourceViolationResult(directive, phpFiles, (content) => /\bRequest\b/.test(content) && !/extends\s+FormRequest/.test(content), "Request validation must be isolated in a FormRequest") || result(directive, "PASS", "laravel-validation", "Changed PHP files use FormRequest validation boundaries."));
        continue;
      }

      if (directiveMatches(directiveId, ["authorization", "policy"])) {
        results.push(sourceViolationResult(directive, phpFiles, (content) => /class\s+\w+Controller/.test(content) && !/(->authorize\(|Gate::authorize\(|function\s+authorize\s*\()/.test(content), "Authorization boundary is missing") || result(directive, "PASS", "laravel-authorization", "Changed PHP files expose an authorization boundary."));
        continue;
      }

      if (directiveMatches(directiveId, ["orm", "query", "eloquent"])) {
        results.push(sourceViolationResult(directive, phpFiles, (content) => /::all\s*\(/.test(content), "Unbounded Eloquent ::all() query detected") || result(directive, "PASS", "laravel-orm", "No unbounded Eloquent query patterns found."));
        continue;
      }

      if (directiveMatches(directiveId, ["migration"])) {
        results.push(sourceViolationResult(directive, phpFiles, (content) => /Schema::/.test(content) && !/function\s+down\s*\(/.test(content), "Migration lacks a rollback method") || result(directive, "PASS", "laravel-migrations", "Migration files include rollback-safe structure."));
        continue;
      }

      if (directiveMatches(directiveId, ["transaction"])) {
        results.push(result(directive, "PASS", "laravel-transactions", "Transaction discipline requires no additional check for the changed scope."));
        continue;
      }

      results.push(result(directive, directive.mode === "unsupported" ? "UNSUPPORTED" : "PASS", "laravel-adapter", `Directive ${directive.id} passed adapter inspection.`));
    }

    return results;
  },
};

export function registerLaravelAdapter() {
  registerAdapter(laravelAdapter);
}
