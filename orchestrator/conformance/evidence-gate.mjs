import { assertValid, loadSchema } from "../validator.mjs";

/**
 * Checks whether evidence provided for a directive satisfies its gating requirements.
 */
export function evaluateDirectiveEvidence(result) {
  const { mode, status, evidence } = result;

  switch (mode) {
    case "automated-blocking":
      if (status === "PASS") {
        if (!evidence || !evidence.verifierType) {
          return { satisfied: false, reason: "automated-blocking PASS requires valid verifierType evidence" };
        }
        return { satisfied: true };
      }
      if (status === "WAIVED") {
        if (!evidence || !evidence.waiverId) {
          return { satisfied: false, reason: "WAIVED result requires waiverId" };
        }
        return { satisfied: true };
      }
      if (status === "TOOL_UNAVAILABLE") {
        return { satisfied: false, reason: "Required tool is unavailable on host environment", isBlocked: true };
      }
      if (status === "NOT_AUTOMATABLE") {
        if (evidence?.humanEvidence) {
          return { satisfied: true };
        }
        return { satisfied: false, reason: "Automated check not automatable and lacks human compensating evidence", isBlocked: true };
      }
      return { satisfied: false, reason: `Directive failed automated check (status: ${status})` };

    case "evidence-blocking":
      if (status === "WAIVED") {
        return { satisfied: true };
      }
      if (status === "PASS") {
        if (!evidence?.humanEvidence || typeof evidence.humanEvidence !== "string" || !evidence.humanEvidence.trim()) {
          return { satisfied: false, reason: "evidence-blocking directive requires non-empty humanEvidence", isBlocked: true };
        }
        return { satisfied: true };
      }
      if (status === "NOT_AUTOMATABLE") {
        return { satisfied: false, reason: "evidence-blocking directive requires named human evidence", isBlocked: true };
      }
      return { satisfied: false, reason: `evidence-blocking directive evaluated with failing status: ${status}` };

    case "advisory":
      // Advisory directives do not block progression
      return { satisfied: true, advisory: true };

    case "unsupported":
      // Unsupported directives are recorded but not enforced
      return { satisfied: true, unsupported: true };

    default:
      return { satisfied: false, reason: `Unrecognized directive mode: ${mode}` };
  }
}

/**
 * Aggregates an array of ConformanceResult objects into a validated ConformanceReport.
 */
export async function aggregateConformanceResults({
  id,
  bindingId,
  bindingHash,
  diffHash,
  results = [],
  generatedAt = new Date().toISOString(),
}) {
  const summary = {
    passed: 0,
    failed: 0,
    waived: 0,
    notAutomatable: 0,
    toolUnavailable: 0,
    unsupported: 0,
    total: results.length,
  };

  let hasFailures = false;
  let hasBlocked = false;
  let enforcedTotal = 0;
  let enforcedPassed = 0;

  for (const r of results) {
    // Tally distinct states
    switch (r.status) {
      case "PASS":
        summary.passed += 1;
        break;
      case "FAIL":
        summary.failed += 1;
        break;
      case "WAIVED":
        summary.waived += 1;
        break;
      case "NOT_AUTOMATABLE":
        summary.notAutomatable += 1;
        break;
      case "TOOL_UNAVAILABLE":
        summary.toolUnavailable += 1;
        break;
      case "UNSUPPORTED":
        summary.unsupported += 1;
        break;
      default:
        summary.failed += 1;
    }

    // Check enforcement for blocking modes
    const isEnforced = r.mode === "automated-blocking" || r.mode === "evidence-blocking";
    if (isEnforced) {
      enforcedTotal += 1;
      const evalOutcome = evaluateDirectiveEvidence(r);

      if (evalOutcome.satisfied) {
        enforcedPassed += 1;
      } else {
        if (evalOutcome.isBlocked) {
          hasBlocked = true;
        } else {
          hasFailures = true;
        }
      }
    }
  }

  // Determine overall verdict
  let verdict = "PASS";
  if (hasFailures) {
    verdict = "FAIL";
  } else if (hasBlocked) {
    verdict = "BLOCKED";
  }

  const report = {
    id: id || `report-${bindingId}-${Date.now()}`,
    bindingId,
    bindingHash,
    diffHash,
    verdict,
    summary,
    results,
    generatedAt,
  };

  // Add metadata for enforced coverage without mutating schema-constrained root
  report._enforcedCoverage = {
    enforcedTotal,
    enforcedPassed,
    coveragePercentage: enforcedTotal > 0 ? Math.round((enforcedPassed / enforcedTotal) * 100) : 100,
  };

  // Validate against JSON schema (removing transient metadata during validation)
  const schema = await loadSchema("conformance-report");
  const cleanReport = {
    id: report.id,
    bindingId: report.bindingId,
    bindingHash: report.bindingHash,
    diffHash: report.diffHash,
    verdict: report.verdict,
    summary: report.summary,
    results: report.results,
    generatedAt: report.generatedAt,
  };
  assertValid(cleanReport, schema);

  return report;
}
