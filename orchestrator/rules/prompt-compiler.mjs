import { isAbsolute } from "node:path";
import { hashPath, readText, sha256 } from "../../scripts/context-core.mjs";

/**
 * Validates that paths are safe within repository boundaries and do not expose sensitive files.
 */
export function assertSafePath(filePath) {
  if (typeof filePath !== "string") return;
  const norm = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
  if (norm.startsWith("../") || norm.includes("/../") || isAbsolute(norm)) {
    throw new Error(`Security violation: unsafe path "${filePath}" outside repository root detected.`);
  }
  if (/(^\.env|\/\.env|id_rsa|credentials|\.pem$|\.key$)/i.test(norm)) {
    throw new Error(`Security violation: attempt to bind sensitive path "${filePath}".`);
  }
}

/**
 * Pure rendering function for compiled <language_rules> block with stable IDs,
 * modes, source provenance, content hashes, and canonical binding digest.
 */
export function renderCompiledDirectives(binding) {
  if (!binding || !Array.isArray(binding.directives) || binding.directives.length === 0) {
    return "";
  }

  // Security guardrails check on paths
  for (const s of binding.affectedScope || []) assertSafePath(s);
  for (const d of binding.directives || []) assertSafePath(d.rulePath);

  const lines = [
    `<language_rules binding="${binding.id}" hash="${binding.bindingHash}" stack="${binding.stack}">`,
    `<!-- Deterministic Rule Binding: ${binding.id} | Hash: ${binding.bindingHash} -->`,
    `<!-- Scope: ${binding.affectedScope.join(", ")} | Stack: ${binding.stack} | Workflow: ${binding.workflow} -->`,
  ];

  if (Array.isArray(binding.waivers) && binding.waivers.length > 0) {
    lines.push(`<!-- Active Waivers: ${binding.waivers.join(", ")} -->`);
  }

  for (const dir of binding.directives) {
    const statement = dir.statement || dir.title || dir.id;
    lines.push(
      `- [directive:${dir.id}][mode:${dir.mode}][rule:${dir.rulePath}][hash:${dir.contentHash}] ${statement}`
    );
  }

  lines.push(`</language_rules>`);
  lines.push(
    `\n> **Precedence Invariant:** If generated code or implementation steps contradict any applicable language rule without an active waiver, the language rule strictly takes precedence.`
  );

  return lines.join("\n");
}

/**
 * Compiles prompt and system prompt payload, ensuring mandatory rule directives
 * are embedded into system prompt prior to custom hooks.
 */
export function compilePrompt({
  request,
  systemPrompt = null,
  selection = null,
  binding = null,
  options = {},
} = {}) {
  const targetBinding = binding ?? selection?.binding ?? null;

  // Fail closed if binding was explicitly required
  if (options.requireBinding) {
    if (!targetBinding) {
      throw new Error("Mandatory rule binding compilation failed: required rule binding is missing or null.");
    }
    if (!Array.isArray(targetBinding.directives) || targetBinding.directives.length === 0) {
      throw new Error("Mandatory rule binding compilation failed: required rule binding contains no directives.");
    }
  }

  // Check declared scopes for security guardrails
  if (options.scope) {
    const scopes = Array.isArray(options.scope) ? options.scope : [options.scope];
    for (const s of scopes) assertSafePath(s);
  }

  const directivesText = targetBinding ? renderCompiledDirectives(targetBinding) : "";

  let compiledSystemPrompt = systemPrompt || "";
  if (directivesText) {
    compiledSystemPrompt = compiledSystemPrompt
      ? `${compiledSystemPrompt.trim()}\n\n${directivesText}`.trim()
      : directivesText;
  }

  return {
    prompt: request,
    systemPrompt: compiledSystemPrompt || null,
    binding: targetBinding,
    directivesText,
  };
}

/**
 * Validates prompt integrity after user hooks have executed.
 * Ensures custom hooks did not remove mandatory directives, anchors, or binding hashes,
 * and detects prompt-authority override attempts.
 */
export function validatePromptIntegrity({ prompt = "", systemPrompt = "", binding = null } = {}) {
  const combined = `${systemPrompt || ""} ${prompt || ""}`;

  // Security check: detect prompt-authority override attempts
  if (/\b(ignore|override|bypass|disregard)\s+(all\s+)?(language[-_ ]rules|enforced[-_ ]rules|rule[-_ ]binding)\b/i.test(combined)) {
    throw new Error(
      `Security violation: prompt authority override attempt detected in prepared prompt.`
    );
  }

  if (!binding) return true;

  if (binding.directives && binding.directives.length > 0) {
    if (!combined.includes("<language_rules") || !combined.includes("</language_rules>")) {
      throw new Error(
        `Prompt integrity violation: mandatory <language_rules> block was removed or corrupted by custom hook.`
      );
    }
  }

  if (!combined.includes(binding.bindingHash)) {
    throw new Error(
      `Prompt integrity violation: mandatory binding hash "${binding.bindingHash}" was removed by custom hook.`
    );
  }

  if (!combined.includes(binding.id)) {
    throw new Error(
      `Prompt integrity violation: mandatory binding ID "${binding.id}" was removed by custom hook.`
    );
  }

  for (const dir of binding.directives || []) {
    if (!combined.includes(dir.id)) {
      throw new Error(
        `Prompt integrity violation: mandatory directive ID "${dir.id}" was removed by custom hook.`
      );
    }
    if (dir.statement && !combined.includes(dir.statement)) {
      throw new Error(`Prompt integrity violation: statement for directive "${dir.id}" was removed or changed.`);
    }
  }

  return true;
}

/**
 * Builds an immutable context bundle containing full source content, hashes, selection, and binding receipt.
 */
export async function buildContextBundle({
  request,
  selection,
  binding = null,
  readTextFn = readText,
  hashPathFn = hashPath,
} = {}) {
  const targetBinding = binding ?? selection?.binding ?? null;
  const sources = [];
  const selectedPaths = selection?.selectedPaths || [];

  for (const path of selectedPaths) {
    assertSafePath(path);
    const content = await readTextFn(path);
    const hash = `sha256:${await hashPathFn(path)}`;
    sources.push({ path, hash, content });
  }

  const runId = sha256(
    JSON.stringify({
      contextVersion: selection?.contextVersion,
      request,
      sources: sources.map(({ path, hash }) => ({ path, hash })),
      bindingHash: targetBinding?.bindingHash ?? null,
    })
  ).slice(0, 16);

  return {
    schemaVersion: 1,
    runId,
    createdFrom: {
      contextVersion: selection?.contextVersion,
      request,
    },
    selection,
    binding: targetBinding,
    claimClasses: ["verified-fact", "assumption", "decision", "unknown", "result"],
    requiredResultEvidence: [
      "acceptance-criterion",
      "implementation-boundary",
      "verification-command",
      "outcome",
    ],
    sources,
  };
}
