import { readFile, stat } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { sha256 } from "../../scripts/context-core.mjs";

/**
 * Normalizes a SHA-256 hash string to have the required "sha256:" prefix and 64 hex characters.
 */
function normalizeSha256(hash) {
  if (!hash) return null;
  return hash.startsWith("sha256:") ? hash : `sha256:${hash}`;
}

/**
 * Computes a deterministic, content-bound SHA-256 digest over a list of changed file paths.
 * Guarantees that any byte edit on the same path set changes the resulting diffHash (AC-08).
 *
 * @param {{
 *   files?: string[],
 *   cwd?: string
 * }} options
 * @returns {Promise<{
 *   diffHash: string,
 *   entries: Array<{ path: string, sha256?: string, status?: string }>,
 *   count: number
 * }>}
 */
export async function computeChangeIdentity({ files = [], cwd = process.cwd() } = {}) {
  const normalizedPaths = files
    .filter(Boolean)
    .map((f) => {
      const full = isAbsolute(f) ? f : resolve(cwd, f);
      return relative(cwd, full).replaceAll("\\", "/");
    });

  const uniquePaths = Array.from(new Set(normalizedPaths)).sort();

  if (uniquePaths.length === 0) {
    const emptyDigest = normalizeSha256(sha256(JSON.stringify({ empty: true })));
    return {
      diffHash: emptyDigest,
      entries: [],
      count: 0,
    };
  }

  const entries = [];
  for (const relPath of uniquePaths) {
    const fullPath = resolve(cwd, relPath);
    try {
      const fileStat = await stat(fullPath);
      if (fileStat.isFile()) {
        const content = await readFile(fullPath);
        const digest = sha256(content);
        entries.push({
          path: relPath,
          sha256: normalizeSha256(digest),
        });
      } else {
        entries.push({
          path: relPath,
          status: "not_file",
        });
      }
    } catch {
      entries.push({
        path: relPath,
        status: "missing",
      });
    }
  }

  // Canonical serialization for digest computation
  const canonicalPayload = JSON.stringify(entries);
  const diffHash = normalizeSha256(sha256(canonicalPayload));

  return {
    diffHash,
    entries,
    count: entries.length,
  };
}
