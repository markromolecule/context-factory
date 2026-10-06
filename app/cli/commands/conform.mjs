import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { resolveContext, root, sha256 } from "../../../scripts/context-core.mjs";
import { evaluateConformance } from "../../../orchestrator/conformance/conformance-orchestrator.mjs";
import { registerTypeScriptAdapter } from "../../../orchestrator/conformance/adapters/typescript.mjs";
import { validateWaiver } from "../../../orchestrator/conformance/waiver-policy.mjs";
import { badges, colors } from "../core/formatter.mjs";

export async function handleConformCommand(args = [], flags = {}) {
  // Ensure TypeScript adapter is registered at composition root
  registerTypeScriptAdapter();

  const isJson = Boolean(flags.json);
  const stack = flags.stack || flags.stacks || "typescript";
  const scope = flags.scope || flags.paths || null;
  const waiverPath = flags.waiver || null;
  const humanEvidence = flags["human-evidence"] || flags.humanEvidence || flags.evidence || null;
  const outPath = flags.out || flags.output || null;

  const request = args.join(" ").trim() || (scope ? `Verify conformance for ${scope}` : "");
  if (!request && !scope) {
    throw new Error("Usage: context-cli conform \"<prompt>\" [--stack <name>] [--scope <paths>] [--waiver <path>] [--human-evidence <text>] [--out <path>] [--json]");
  }

  try {
    const waivers = [];
    if (waiverPath) {
      const fullWaiverPath = resolve(process.cwd(), waiverPath);
      const waiverContent = JSON.parse(await readFile(fullWaiverPath, "utf8"));
      await validateWaiver(waiverContent);
      waivers.push(waiverContent);
    }

    const changedScope = scope ? (Array.isArray(scope) ? scope : [scope]) : [];
    const selection = await resolveContext(request, {
      stack,
      scope: changedScope,
      waivers,
    });

    const binding = selection.binding;
    if (!binding) {
      throw new Error(`Conformance evaluation failed: no rule binding could be resolved for stack "${stack}". Declared scope required.`);
    }

    const report = await evaluateConformance({
      binding,
      changedScope,
      waivers,
      options: {
        humanEvidence,
      },
    });

    // Persist report artifact
    const destination = outPath
      ? (isAbsolute(outPath) ? outPath : resolve(process.cwd(), outPath))
      : join(root, ".context-runs", report.id, "conformance-report.json");

    try {
      await mkdir(resolve(destination, ".."), { recursive: true });
      await writeFile(destination, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    } catch {
      // Non-fatal if filesystem persistence fails
    }

    if (isJson) {
      console.log(JSON.stringify(report, null, 2));
      if (report.verdict === "PASS") return 0;
      if (report.verdict === "FAIL") return 1;
      return 2; // BLOCKED
    }

    const verdictBadge = report.verdict === "PASS"
      ? badges.pass("PASS")
      : report.verdict === "FAIL"
        ? badges.fail("FAIL")
        : badges.warn("BLOCKED");

    console.log(`\n${colors.bold("Context Conformance Enforcement Report")}\n`);
    console.log(`  ${colors.bold("Verdict:")}        ${verdictBadge}`);
    console.log(`  ${colors.bold("Report ID:")}      ${colors.cyan(report.id)}`);
    console.log(`  ${colors.bold("Binding ID:")}     ${colors.white(report.bindingId)}`);
    console.log(`  ${colors.bold("Binding Hash:")}   ${colors.dim(report.bindingHash)}`);
    console.log(`  ${colors.bold("Diff Hash:")}      ${colors.dim(report.diffHash)}`);
    console.log(`  ${colors.bold("Summary:")}        Passed: ${colors.green(String(report.summary.passed))} | Failed: ${colors.red(String(report.summary.failed))} | Waived: ${colors.yellow(String(report.summary.waived))} | Blocked: ${colors.magenta(String(report.summary.notAutomatable + report.summary.toolUnavailable))}`);
    console.log("");

    if (report.results?.length > 0) {
      console.log(`${colors.bold("Evaluated Directives:")}`);
      for (const r of report.results) {
        const statusColor = r.status === "PASS" || r.status === "WAIVED" ? colors.green : colors.red;
        console.log(`  - [${statusColor(r.status)}][${colors.yellow(r.mode)}] ${colors.cyan(r.directiveId)}`);
        if (r.evidence?.outputFragment && r.status !== "PASS") {
          console.log(`    ${colors.dim(r.evidence.outputFragment)}`);
        }
      }
      console.log("");
    }

    if (report.verdict === "PASS") return 0;
    if (report.verdict === "FAIL") return 1;
    return 2;
  } catch (err) {
    if (isJson) {
      console.log(JSON.stringify({ verdict: "BLOCKED", error: err.message }, null, 2));
      return 2;
    }
    console.error(`\n${badges.fail("CONFORMANCE ERROR")} ${err.message}\n`);
    return 1;
  }
}
