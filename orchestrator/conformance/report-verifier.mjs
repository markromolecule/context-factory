import { readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { computeChangeIdentity } from "./change-identity.mjs";

function normalizeSha256(hash) {
  if (!hash) return null;
  return hash.startsWith("sha256:") ? hash : `sha256:${hash}`;
}

/**
 * Independently audits a conformance report artifact for authoritative CI acceptance (AC-07, AC-08).
 * Rejects missing reports, non-PASS verdicts, failing/blocked summaries, stale bindings, and same-path content edits.
 *
 * @param {{
 *   report?: any,
 *   reportPath?: string,
 *   expectedBindingHash?: string,
 *   expectedScope?: string[],
 *   cwd?: string,
 *   maxAgeMs?: number
 * }} options
 * @returns {Promise<{
 *   valid: boolean,
 *   reason?: string,
 *   verdict?: string,
 *   reportId?: string,
 *   bindingHash?: string,
 *   diffHash?: string,
 *   error?: string
 * }>}
 */
export async function verifyConformanceReport({
  report = null,
  reportPath = null,
  expectedBindingHash = null,
  expectedScope = null,
  cwd = process.cwd(),
  maxAgeMs = null,
} = {}) {
  let activeReport = report;

  if (reportPath) {
    const fullPath = isAbsolute(reportPath) ? reportPath : resolve(cwd, reportPath);
    try {
      const raw = await readFile(fullPath, "utf8");
      activeReport = JSON.parse(raw);
    } catch (readError) {
      if (readError.code === "ENOENT") {
        return {
          valid: false,
          reason: "missing_report",
          error: `Conformance report artifact not found at "${fullPath}".`,
        };
      }
      return {
        valid: false,
        reason: "invalid_report_file",
        error: `Could not read/parse conformance report artifact: ${readError.message}`,
      };
    }
  }

  if (!activeReport || typeof activeReport !== "object") {
    return {
      valid: false,
      reason: "invalid_report",
      error: "Conformance report must be a non-null object.",
    };
  }

  // 1. Structural contract check
  if (!activeReport.id || !activeReport.verdict || !activeReport.bindingHash || !activeReport.diffHash) {
    return {
      valid: false,
      reason: "invalid_report_structure",
      error: "Report is missing required header properties (id, verdict, bindingHash, or diffHash).",
    };
  }

  // 2. Verdict check (AC-08: Rejects non-PASS verdicts)
  if (activeReport.verdict !== "PASS") {
    return {
      valid: false,
      reason: "non_pass_verdict",
      verdict: activeReport.verdict,
      reportId: activeReport.id,
      error: `Report verdict is "${activeReport.verdict}" (must be "PASS").`,
    };
  }

  // 3. Unresolved directives check (AC-08)
  if (activeReport.summary) {
    const { failed = 0, notAutomatable = 0, toolUnavailable = 0 } = activeReport.summary;
    if (failed > 0 || notAutomatable > 0 || toolUnavailable > 0) {
      return {
        valid: false,
        reason: "unresolved_directives",
        verdict: activeReport.verdict,
        reportId: activeReport.id,
        error: `Report summary contains unresolved directives (failed: ${failed}, blocked: ${notAutomatable}, toolUnavailable: ${toolUnavailable}).`,
      };
    }
  }

  // 4. Stale binding check (AC-08)
  if (expectedBindingHash) {
    const normalizedExpected = normalizeSha256(expectedBindingHash);
    const normalizedActual = normalizeSha256(activeReport.bindingHash);
    if (normalizedActual !== normalizedExpected) {
      return {
        valid: false,
        reason: "stale_binding",
        verdict: activeReport.verdict,
        reportId: activeReport.id,
        error: `Report binding hash (${normalizedActual}) does not match expected active rule binding (${normalizedExpected}).`,
      };
    }
  }

  // 5. Same-path content freshness check (AC-08)
  if (expectedScope && Array.isArray(expectedScope)) {
    const currentIdentity = await computeChangeIdentity({ files: expectedScope, cwd });
    const normalizedReportDiff = normalizeSha256(activeReport.diffHash);
    if (normalizedReportDiff !== currentIdentity.diffHash) {
      return {
        valid: false,
        reason: "stale_diff_hash",
        verdict: activeReport.verdict,
        reportId: activeReport.id,
        error: `Report diffHash (${normalizedReportDiff}) does not match current change content identity (${currentIdentity.diffHash}). Files may have been modified after report generation.`,
      };
    }
  }

  // 6. Expiration check
  if (maxAgeMs && activeReport.generatedAt) {
    const genTime = new Date(activeReport.generatedAt).getTime();
    if (Number.isFinite(genTime) && Date.now() - genTime > maxAgeMs) {
      return {
        valid: false,
        reason: "expired",
        verdict: activeReport.verdict,
        reportId: activeReport.id,
        error: `Report was generated at ${activeReport.generatedAt} and exceeds maximum allowed age of ${maxAgeMs}ms.`,
      };
    }
  }

  return {
    valid: true,
    reportId: activeReport.id,
    verdict: activeReport.verdict,
    bindingHash: activeReport.bindingHash,
    diffHash: activeReport.diffHash,
  };
}
