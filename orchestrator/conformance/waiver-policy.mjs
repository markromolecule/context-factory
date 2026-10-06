import { assertValid, loadSchema } from "../validator.mjs";

const AGENT_AUTHORITY_PATTERNS = [
  /\b(agent|ai|bot|llm|copilot|assistant|auto|system|generator|reviewer)\b/i,
  /\b(self-approved|unauthorized|context-factory)\b/i,
];

/**
 * Checks if the authorizedBy field represents a human identity and not an agent.
 */
export function isHumanAuthority(authorizedBy) {
  if (typeof authorizedBy !== "string" || !authorizedBy.trim()) {
    return false;
  }
  const normalized = authorizedBy.trim();
  for (const pattern of AGENT_AUTHORITY_PATTERNS) {
    if (pattern.test(normalized)) {
      return false;
    }
  }
  return true;
}

/**
 * Validates a single waiver object against schema and strict human-governance rules.
 */
export async function validateWaiver(waiver, { now = new Date() } = {}) {
  const schema = await loadSchema("rule-waiver");
  assertValid(waiver, schema);

  const errors = [];

  // Authority check (D-03, AC-06, SC-06): Human maintainer only, no agent/self approval
  if (!isHumanAuthority(waiver.authorizedBy)) {
    errors.push(
      `Waiver "${waiver.id}" has invalid authorization: "${waiver.authorizedBy}". Only named human maintainers may authorize waivers; agents cannot self-approve.`
    );
  }

  // Active status check
  if (waiver.status !== "active") {
    errors.push(`Waiver "${waiver.id}" is not active (current status: "${waiver.status}").`);
  }

  // Expiration check
  if (waiver.expiresAt) {
    const expiryTime = new Date(waiver.expiresAt).getTime();
    const currentTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
    if (Number.isNaN(expiryTime)) {
      errors.push(`Waiver "${waiver.id}" has malformed expiresAt date: "${waiver.expiresAt}".`);
    } else if (expiryTime <= currentTime) {
      errors.push(`Waiver "${waiver.id}" has expired (expired at ${waiver.expiresAt}).`);
    }
  }

  // Scope check: no unbounded wildcards
  if (Array.isArray(waiver.scope)) {
    if (waiver.scope.includes("*") || waiver.scope.includes("**")) {
      errors.push(`Waiver "${waiver.id}" has overly broad wildcard scope. Scope must be file or path specific.`);
    }
  } else {
    errors.push(`Waiver "${waiver.id}" must define an array of scope paths.`);
  }

  // Compensating evidence check
  if (typeof waiver.compensatingEvidence !== "string" || !waiver.compensatingEvidence.trim()) {
    errors.push(`Waiver "${waiver.id}" must document non-empty compensating evidence.`);
  }

  // Rationale check
  if (typeof waiver.rationale !== "string" || !waiver.rationale.trim()) {
    errors.push(`Waiver "${waiver.id}" must document non-empty rationale.`);
  }

  if (errors.length > 0) {
    const error = new Error(`Waiver validation failed:\n- ${errors.join("\n- ")}`);
    error.errors = errors;
    throw error;
  }

  return true;
}

/**
 * Checks if a specific file path is matched by a waiver's declared scope paths.
 */
export function matchesWaiverScope(waiverScope, filePath) {
  if (!Array.isArray(waiverScope) || typeof filePath !== "string") return false;
  const normalizedFile = filePath.replaceAll("\\", "/").replace(/^\.\//, "");

  for (const s of waiverScope) {
    const normalizedScope = s.replaceAll("\\", "/").replace(/^\.\//, "");
    if (normalizedScope === normalizedFile) return true;
    if (normalizedScope.endsWith("/*") && normalizedFile.startsWith(normalizedScope.slice(0, -2))) return true;
    if (normalizedScope.endsWith("/") && normalizedFile.startsWith(normalizedScope)) return true;
  }
  return false;
}

/**
 * Finds an active, valid human waiver matching a directive ID and target file path.
 */
export async function findActiveWaiver({ waivers = [], directiveId, filePath, now = new Date() }) {
  if (!Array.isArray(waivers) || waivers.length === 0 || !directiveId) return null;

  for (const waiver of waivers) {
    if (waiver.directiveId !== directiveId) continue;

    try {
      await validateWaiver(waiver, { now });
      if (filePath && !matchesWaiverScope(waiver.scope, filePath)) {
        continue;
      }
      return waiver;
    } catch {
      // Waiver is invalid or expired
      continue;
    }
  }

  return null;
}

/**
 * Applies an active human waiver to a failing or blocked conformance result.
 */
export function applyWaiverToResult(result, waiver) {
  return {
    ...result,
    status: "WAIVED",
    evidence: {
      verifierType: "human-waiver",
      waiverId: waiver.id,
      humanEvidence: waiver.compensatingEvidence,
      outputFragment: `Waived by ${waiver.authorizedBy}: ${waiver.rationale}`,
    },
    evaluatedAt: new Date().toISOString(),
  };
}
