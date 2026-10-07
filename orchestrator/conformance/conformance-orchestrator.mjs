import { sha256 } from "../../scripts/context-core.mjs";
import { getAdapter } from "./adapter-contract.mjs";
import { computeChangeIdentity } from "./change-identity.mjs";
import { aggregateConformanceResults } from "./evidence-gate.mjs";
import { applyWaiverToResult, findActiveWaiver } from "./waiver-policy.mjs";

/**
 * Normalizes a SHA-256 hash string to have the required "sha256:" prefix and 64 hex characters.
 */
function normalizeSha256(hash) {
  if (!hash) return null;
  if (hash.startsWith("sha256:")) return hash;
  return `sha256:${hash}`;
}

/**
 * High-level Conformance Orchestrator.
 * Coordinates adapter lookup, evaluation, waiver policy application, and evidence gating.
 */
export async function evaluateConformance({
  binding,
  changedScope = [],
  diffHash = null,
  waivers = [],
  capabilities = {},
  commandService = null,
  options = {},
} = {}) {
  if (!binding || typeof binding !== "object") {
    throw new Error("evaluateConformance failed: binding must be a non-null object.");
  }
  if (!binding.id || !binding.bindingHash || !binding.stack) {
    throw new Error("evaluateConformance failed: binding is missing id, bindingHash, or stack.");
  }

  // Deterministic, content-bound diffHash calculation if not provided (AC-08)
  let effectiveDiffHash = diffHash ? normalizeSha256(diffHash) : null;
  if (!effectiveDiffHash) {
    if (changedScope && changedScope.length > 0) {
      const changeId = await computeChangeIdentity({
        files: changedScope,
        cwd: options.cwd || process.cwd(),
      });
      effectiveDiffHash = changeId.diffHash;
    } else {
      effectiveDiffHash = normalizeSha256(sha256(JSON.stringify({ empty: true })));
    }
  }
  const normalizedBindingHash = normalizeSha256(binding.bindingHash);

  const adapter = getAdapter(binding);
  let rawResults = [];

  if (!adapter) {
    // No registered adapter for this stack: mark directives as TOOL_UNAVAILABLE or UNSUPPORTED
    const now = new Date().toISOString();
    rawResults = (binding.directives || []).map((dir) => ({
      directiveId: dir.id,
      status: dir.mode === "unsupported" ? "UNSUPPORTED" : "TOOL_UNAVAILABLE",
      mode: dir.mode,
      evidence: {
        verifierType: "no-adapter-registered",
        outputFragment: `No conformance adapter registered for stack "${binding.stack}".`,
      },
      durationMs: 0,
      evaluatedAt: now,
    }));
  } else {
    // Invoke adapter with timeout guard and timer cleanup
    const timeoutMs = options.timeoutMs || 30000;
    let timer = null;
    try {
      const evaluationPromise = adapter.evaluate({
        binding,
        changedScope,
        capabilities,
        commandService,
        options,
      });

      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Adapter evaluation timed out after ${timeoutMs}ms`)), timeoutMs);
        if (typeof timer.unref === "function") timer.unref();
      });

      rawResults = await Promise.race([evaluationPromise, timeoutPromise]);
    } catch (adapterError) {
      // Graceful error isolation: convert thrown adapter error into failure results
      const now = new Date().toISOString();
      rawResults = (binding.directives || []).map((dir) => ({
        directiveId: dir.id,
        status: "FAIL",
        mode: dir.mode,
        evidence: {
          verifierType: "adapter-error",
          outputFragment: `Adapter "${adapter.id}" threw error: ${adapterError.message}`,
        },
        durationMs: 0,
        evaluatedAt: now,
      }));
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  // Apply active human waivers to non-passing directives
  const finalResults = [];
  const evaluationDate = options.now || new Date();

  for (const r of rawResults) {
    if (r.status !== "PASS" && r.status !== "WAIVED") {
      // Check for matching active human waiver across changed scope or unit scope
      const targetPath = changedScope[0] || binding.affectedScope?.[0] || null;
      const matchingWaiver = await findActiveWaiver({
        waivers,
        directiveId: r.directiveId,
        filePath: targetPath,
        now: evaluationDate,
      });

      if (matchingWaiver) {
        finalResults.push(applyWaiverToResult(r, matchingWaiver));
        continue;
      }
    }
    finalResults.push(r);
  }

  const reportId = options.reportId || `report-${binding.id}-${Date.now()}`;
  return aggregateConformanceResults({
    id: reportId,
    bindingId: binding.id,
    bindingHash: normalizedBindingHash,
    diffHash: effectiveDiffHash,
    results: finalResults,
    generatedAt: new Date().toISOString(),
  });
}

/**
 * Validates report freshness against active binding and diff hashes.
 * Invalidate reports whenever binding or diff hashes change.
 */
export function verifyReportFreshness({ report, currentBindingHash, currentDiffHash }) {
  if (!report || typeof report !== "object") return false;
  if (report.bindingHash !== normalizeSha256(currentBindingHash)) return false;
  if (report.diffHash !== normalizeSha256(currentDiffHash)) return false;
  return true;
}
