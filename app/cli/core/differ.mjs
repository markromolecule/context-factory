import {
  createLock,
  filesUnder,
  hashPath,
  manifestPaths,
  readJson,
  readText,
  root,
} from "../../../scripts/context-core.mjs";

/**
 * Computes difference / drift between disk files, context-manifest.json, and context-lock.json.
 */
export async function computeDiff() {
  const manifest = await readJson("context-manifest.json");
  let lock = null;
  try {
    lock = await readJson("context-lock.json");
  } catch {
    lock = null;
  }

  const expectedLock = await createLock(manifest);
  const diskFiles = new Set(await filesUnder("."));
  const expectedPaths = new Set(manifestPaths(manifest));
  const lockedPaths = new Set(lock ? Object.keys(lock.files || {}) : []);

  const modified = [];
  const addedToManifest = [];
  const removedFromManifest = [];
  const untrackedFiles = [];
  const missingFromDisk = [];

  // Check expected manifest paths
  for (const path of expectedPaths) {
    if (!diskFiles.has(path)) {
      missingFromDisk.push(path);
      continue;
    }

    if (!lock) continue;

    const currentHash = `sha256:${await hashPath(path)}`;
    const lockedHash = lock.files?.[path];

    if (!lockedHash) {
      addedToManifest.push(path);
    } else if (lockedHash !== currentHash) {
      modified.push({
        path,
        lockedHash,
        currentHash,
      });
    }
  }

  // Check files in lock that are not in manifest
  for (const path of lockedPaths) {
    if (!expectedPaths.has(path)) {
      removedFromManifest.push(path);
    }
  }

  // Check uninventoried files in standard directories
  const checkDirs = ["rules", "skills", "workflows", "agents", "knowledge", "schemas", "docs/templates", "docs/decisions"];
  for (const dir of checkDirs) {
    try {
      const dirFiles = await filesUnder(dir);
      for (const file of dirFiles) {
        if (!expectedPaths.has(file)) {
          untrackedFiles.push(file);
        }
      }
    } catch {
      // Ignore if directory missing
    }
  }

  const lockDigestMatch = lock && lock.digest === expectedLock.digest;
  const isClean = modified.length === 0
    && addedToManifest.length === 0
    && removedFromManifest.length === 0
    && missingFromDisk.length === 0
    && untrackedFiles.length === 0
    && lockDigestMatch;

  return {
    isClean,
    contextVersion: manifest.contextVersion,
    lockedDigest: lock?.digest ?? null,
    currentDigest: expectedLock.digest,
    lockDigestMatch: Boolean(lockDigestMatch),
    modified,
    addedToManifest,
    removedFromManifest,
    missingFromDisk,
    untrackedFiles,
  };
}
