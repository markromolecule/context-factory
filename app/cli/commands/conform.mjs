import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { resolveContext, root, sha256 } from "../../../scripts/context-core.mjs";
import { evaluateConformance } from "../../../orchestrator/conformance/conformance-orchestrator.mjs";
import { registerTypeScriptAdapter } from "../../../orchestrator/conformance/adapters/typescript.mjs";
import { validateWaiver } from "../../../orchestrator/conformance/waiver-policy.mjs";
import { verifyConformanceReport } from "../../../orchestrator/conformance/report-verifier.mjs";
import { badges, colors } from "../core/formatter.mjs";
import { normalizeScope } from "../core/options.mjs";

export async function handleConformCommand(args = [], flags = {}) {
  // Ensure stack adapters are registered at the composition root.
  registerTypeScriptAdapter();

  const isJson = Boolean(flags.json);
  const stack = flags.stack || flags.stacks || "typescript";
  const normalizedStack = typeof stack === "string" ? stack.toLowerCase() : (Array.isArray(stack) ? stack[0]?.toLowerCase() : "");
  if (normalizedStack === "laravel") {
    const errorMsg = "Stack 'laravel' was decommissioned in ADR 0036. Context Factory focuses strictly on the TypeScript ecosystem.";
    if (isJson) {
      console.log(JSON.stringify({ verdict: "BLOCKED", status: "BLOCKED", error: errorMsg }, null, 2));
      return 2;
    }
    console.error(`\n${badges.warn("BLOCKED")} ${errorMsg}\n`);
    return 2;
  }
  const scope = normalizeScope(flags.scope || flags.paths);
  const waiverPath = flags.waiver || null;
  const humanEvidence = flags["human-evidence"] || flags.humanEvidence || flags.evidence || null;
  const outPath = flags.out || flags.output || null;

  // Subcommand 'verify': context-cli conform verify <reportPath> (AC-07, AC-08)
  const isVerify = args[0] === "verify" || Boolean(flags.verify);
  if (isVerify) {
    const reportTarget = args[0] === "verify" ? (args[1] || flags.report) : (flags.verify === true ? (args[0] || flags.report) : flags.verify);
    const expectedBindingHash = flags.binding || flags.bindingHash || null;
    const expectedScope = scope.length > 0 ? scope : null;
    const cwd = flags.target ? resolve(process.cwd(), flags.target) : process.cwd();

    const verification = await verifyConformanceReport({
      reportPath: reportTarget,
      expectedBindingHash,
      expectedScope,
      cwd,
    });

    if (isJson) {
      console.log(JSON.stringify(verification, null, 2));
      return verification.valid ? 0 : 1;
    }

    if (verification.valid) {
      console.log(`\n${badges.pass("CONFORMANCE RECEIPT VALID")} Report: ${colors.cyan(verification.reportId)}\n`);
      console.log(`  ${colors.bold("Verdict:")}      ${colors.green("PASS")}`);
      console.log(`  ${colors.bold("Binding Hash:")} ${colors.dim(verification.bindingHash)}`);
      console.log(`  ${colors.bold("Diff Hash:")}    ${colors.dim(verification.diffHash)}\n`);
      return 0;
    }

    console.error(`\n${badges.fail("CONFORMANCE RECEIPT REJECTED")} ${colors.bold(colors.red(verification.error))}\n`);
    console.error(`  ${colors.bold("Rejection Reason:")} ${colors.yellow(verification.reason)}\n`);
    return 1;
  }

  const request = args.join(" ").trim() || (scope.length > 0 ? `Verify conformance for ${scope.join(", ")}` : "");
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

    const changedScope = scope;
    const selection = await resolveContext(request, {
      stack,
      scope: changedScope,
      waivers,
    });

    const binding = selection.binding;
    if (!binding) {
      throw new Error(`Conformance evaluation failed: no rule binding could be resolved for stack "${stack}". Declared scope required.`);
    }

    const isFixtureMode = Boolean(
      flags.fixtureMode ||
      flags["fixture-mode"] ||
      (changedScope.length > 0 && changedScope.every((p) => p.includes("fixtures/")))
    );

    const report = await evaluateConformance({
      binding,
      changedScope,
      waivers,
      capabilities: isFixtureMode ? { fixtureMode: true } : null,
      options: {
        humanEvidence,
        fixtureMode: isFixtureMode,
      },
    });

    // Persist report artifact (AC-08: Fatal persistence if --out or strict is requested)
    const destination = outPath
      ? (isAbsolute(outPath) ? outPath : resolve(process.cwd(), outPath))
      : join(root, ".context-runs", report.id, "conformance-report.json");

    try {
      await mkdir(resolve(destination, ".."), { recursive: true });
      await writeFile(destination, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    } catch (writeError) {
      if (outPath || flags.strict) {
        throw new Error(`Failed to persist conformance report to "${destination}": ${writeError.message}`);
      }
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
