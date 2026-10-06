import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { resolveContext, root } from "../../../scripts/context-core.mjs";
import { validateWaiver } from "../../../orchestrator/conformance/waiver-policy.mjs";
import { badges, colors } from "../core/formatter.mjs";
import { normalizeScope } from "../core/options.mjs";

export async function handlePreflightCommand(args = [], flags = {}) {
  const isJson = Boolean(flags.json);
  const stack = flags.stack || flags.stacks || undefined;
  const scope = normalizeScope(flags.scope || flags.paths);
  const waiverPath = flags.waiver || null;

  const request = args.join(" ").trim() || (scope.length > 0 ? `Verify scope ${scope.join(", ")}` : "");
  if (!request && !scope) {
    throw new Error("Usage: context-cli preflight \"<prompt>\" [--stack <name>] [--scope <paths>] [--waiver <path>] [--json]");
  }

  try {
    const waivers = [];
    if (waiverPath) {
      const fullWaiverPath = resolve(process.cwd(), waiverPath);
      const waiverContent = JSON.parse(await readFile(fullWaiverPath, "utf8"));
      await validateWaiver(waiverContent);
      waivers.push(waiverContent);
    }

    const selection = await resolveContext(request, {
      stack,
      scope,
      waivers,
    });

    const binding = selection.binding;
    if (!binding) {
      if (flags.strict || flags["require-binding"]) {
        throw new Error("Preflight failed: no deterministic rule binding could be resolved for declared scope.");
      }
    }

    const result = {
      status: "PASS",
      request,
      stack: binding?.stack || stack || "typescript",
      scope: binding?.affectedScope || scope,
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
    };

    if (isJson) {
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }

    console.log(`\n${colors.bold("Context Conformance Preflight")}\n`);
    console.log(`  ${colors.bold("Status:")}         ${badges.pass("PASS")}`);
    console.log(`  ${colors.bold("Stack:")}          ${colors.cyan(result.stack)}`);
    console.log(`  ${colors.bold("Binding ID:")}     ${colors.white(result.bindingId || "none")}`);
    console.log(`  ${colors.bold("Binding Hash:")}   ${colors.dim(result.bindingHash || "none")}`);
    console.log(`  ${colors.bold("Directives:")}     ${colors.magenta(String(result.directivesCount))}`);
    if (result.waiversCount > 0) {
      console.log(`  ${colors.bold("Waivers:")}        ${colors.yellow(String(result.waiversCount))}`);
    }
    console.log("");

    if (result.directives.length > 0) {
      console.log(`${colors.bold("Active Directives:")}`);
      for (const d of result.directives) {
        console.log(`  - [${colors.cyan(d.id)}][${colors.yellow(d.mode)}] ${colors.dim(d.rulePath)}`);
      }
      console.log("");
    }

    return 0;
  } catch (err) {
    if (isJson) {
      console.log(JSON.stringify({ status: "FAIL", error: err.message }, null, 2));
      return 1;
    }
    console.error(`\n${badges.fail("PREFLIGHT ERROR")} ${err.message}\n`);
    return 1;
  }
}
