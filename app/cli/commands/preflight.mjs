import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { resolveContext, root } from "../../../scripts/context-core.mjs";
import { assertValid, loadSchema } from "../../../orchestrator/validator.mjs";
import { badges, colors } from "../core/formatter.mjs";
import { normalizeScope } from "../core/options.mjs";

function scopeLanguage(path) {
  const extension = extname(path).toLowerCase();
  if ([".ts", ".tsx", ".mts", ".cts"].includes(extension)) return "typescript";
  if ([".js", ".jsx", ".mjs", ".cjs"].includes(extension)) return "javascript";
  return "other";
}

function isInformationRequest(request) {
  return /^(?:how|what|which|why|where|when|explain|tell me|can you explain)\b/i.test(request.trim());
}

function emitResult(result, isJson) {
  if (isJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    const badge = result.status === "READY" ? badges.pass("READY") : badges.warn(result.status);
    console.log(`\n${colors.bold("Context Selection Preflight")}\n`);
    console.log(`  ${colors.bold("Status:")}         ${badge}`);
    console.log(`  ${colors.bold("Stack:")}          ${colors.cyan(result.stack || "none")}`);
    console.log(`  ${colors.bold("Binding ID:")}     ${colors.white(result.bindingId || "none")}`);
    console.log(`  ${colors.bold("Binding Hash:")}   ${colors.dim(result.bindingHash || "none")}`);
    console.log(`  ${colors.bold("Directives:")}     ${colors.magenta(String(result.directivesCount || 0))}`);
    console.log(`  ${colors.bold("Code verification:")} ${colors.yellow(result.codeVerification)}`);
    if (result.reason) console.log(`  ${colors.bold("Reason:")}         ${result.reason}`);
    if (result.nextAction) console.log(`  ${colors.bold("Next action:")}    ${result.nextAction}`);
    if (result.directives?.length > 0) {
      console.log(`\n${colors.bold("Selected Directives:")}`);
      for (const directive of result.directives) {
        console.log(`  - [${colors.cyan(directive.id)}][${colors.yellow(directive.mode)}] ${colors.dim(directive.rulePath)}`);
      }
    }
    console.log("");
  }
  return result.status === "READY" || result.status === "INFORMATION" ? 0 : 2;
}

export async function handlePreflightCommand(args = [], flags = {}) {
  const isJson = Boolean(flags.json);
  const rawStack = flags.stack || flags.stacks;
  const normalizedStack = typeof rawStack === "string" ? rawStack.toLowerCase() : (Array.isArray(rawStack) ? rawStack[0]?.toLowerCase() : "");
  if (normalizedStack && normalizedStack !== "typescript") {
    const errorMsg = normalizedStack === "laravel"
      ? "Stack 'laravel' was decommissioned in ADR 0036. Context Factory focuses strictly on the TypeScript ecosystem."
      : `Stack '${normalizedStack}' is not supported. Context Factory focuses strictly on the TypeScript ecosystem.`;
    return emitResult({ status: "BLOCKED", reason: errorMsg, nextAction: "Use a supported TypeScript scope.", stack: normalizedStack, bindingId: null, bindingHash: null, directivesCount: 0, codeVerification: "NOT_RUN" }, isJson);
  }
  const stack = "typescript";
  const scope = normalizeScope(flags.scope || flags.paths);
  const waiverPath = flags.waiver || null;

  const request = args.join(" ").trim() || (scope.length > 0 ? `Verify scope ${scope.join(", ")}` : "");
  try {
    const waivers = [];
    if (waiverPath) {
      const fullWaiverPath = resolve(process.cwd(), waiverPath);
      const waiverContent = JSON.parse(await readFile(fullWaiverPath, "utf8"));
      const waiverSchema = await loadSchema("rule-waiver");
      assertValid(waiverContent, waiverSchema);
      waivers.push(waiverContent);
    }

    const selection = await resolveContext(request, {
      stack,
      scope,
      waivers,
    });

    const binding = selection.binding;
    const scopeLanguages = [...new Set(scope.map(scopeLanguage))].sort();
    const result = {
      status: "READY",
      request,
      stack: binding?.stack || stack,
      scope: binding?.affectedScope || scope,
      scopeLanguages,
      bindingId: binding?.id || null,
      bindingHash: binding?.bindingHash || null,
      directivesCount: binding?.directives?.length || 0,
      directives: binding?.directives?.map((d) => ({
        id: d.id,
        mode: d.mode,
        rulePath: d.rulePath,
        contentHash: d.contentHash,
      })) || [],
      waiversCount: waivers.length,
      codeVerification: "NOT_RUN",
      selectionRulePaths: selection.rules.map((rule) => rule.path),
      globalSecurityDirectives: (binding?.directives || [])
        .filter((directive) => directive.rulePath.startsWith("rules/global/") || directive.id.startsWith("cf.sec."))
        .map((directive) => directive.id),
      reason: null,
      nextAction: null,
    };
    if (scope.length === 0 && isInformationRequest(request)) {
      result.status = "INFORMATION";
      result.reason = "Informational request; no material rule binding was compiled.";
      result.nextAction = "Declare --scope when performing material work.";
    } else if (scope.length === 0) {
      result.status = "BLOCKED";
      result.reason = "Affected scope is required for material preflight.";
      result.nextAction = "Pass --scope with the files to be changed.";
    } else if (scopeLanguages.includes("javascript")) {
      result.status = "UNSUPPORTED";
      result.reason = "JavaScript or JSX scope has no TypeScript preflight support.";
      result.nextAction = "Use a TypeScript scope or run applicable global/security checks directly; a JavaScript adapter is unavailable.";
    } else if (!binding || result.directivesCount === 0) {
      result.status = "BLOCKED";
      result.reason = binding ? "No applicable directive coverage for the declared scope." : "No deterministic rule binding for the declared scope.";
      result.nextAction = "Declare supported TypeScript files with applicable directives, then rerun preflight.";
    } else if (scopeLanguages.includes("other")) {
      result.status = "UNSUPPORTED";
      result.reason = "The declared scope includes files outside TypeScript preflight coverage.";
      result.nextAction = "Review non-TypeScript files with their applicable checks separately.";
    }

    return emitResult(result, isJson);
  } catch (err) {
    if (isJson) {
      console.log(JSON.stringify({ status: "FAIL", error: err.message }, null, 2));
      return 1;
    }
    console.error(`\n${badges.fail("PREFLIGHT ERROR")} ${err.message}\n`);
    return 1;
  }
}
