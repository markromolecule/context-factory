import { execFile, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const RESERVATION_PREFIX = "refs/context-factory/plan-reservations/";
const ZERO_OID = "0".repeat(40);
export const PLAN_BRANCH_TYPES = Object.freeze([
  "feat", "fix", "refactor", "chore", "docs", "test", "perf", "build", "ci", "migration",
]);

async function git(repository, args, options = {}) {
  return execFileAsync("git", args, { cwd: repository, ...options });
}

async function gitWithInput(repository, args, input) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("git", args, { cwd: repository, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolvePromise({ stdout, stderr });
      else reject(new Error(`git ${args.join(" ")} failed (${code}): ${stderr.trim()}`));
    });
    child.stdin.end(input);
  });
}

function parsePlanId(value) {
  const match = String(value).match(/PLN-(\d{4})/);
  return match ? Number.parseInt(match[1], 10) : null;
}

async function planIdsInDirectory(directory) {
  const ids = new Set();
  let entries = [];
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return ids;
  }

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      for (const id of await planIdsInDirectory(path)) ids.add(id);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const id = parsePlanId(entry.name);
      if (id !== null) ids.add(id);
      const content = await readFile(path, "utf8");
      const contentId = parsePlanId(content);
      if (contentId !== null) ids.add(contentId);
    }
  }
  return ids;
}

async function reservedPlanIds(repository) {
  const { stdout } = await git(repository, ["for-each-ref", "--format=%(refname)", RESERVATION_PREFIX]);
  return new Set(stdout.split("\n").map(parsePlanId).filter((id) => id !== null));
}

async function nextPlanNumber(repository) {
  const used = await planIdsInDirectory(join(repository, "docs", "tasks"));
  for (const id of await reservedPlanIds(repository)) used.add(id);
  return Math.max(0, ...used) + 1;
}

export async function previewNextPlanId({ repository }) {
  return `PLN-${String(await nextPlanNumber(repository)).padStart(4, "0")}`;
}

export function validatePlanSlug(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3 || slug.length > 40) {
    throw new Error("Plan slug must be 3-40 lowercase ASCII letters or digits with single interior hyphens.");
  }
  return slug;
}

export function createPlanBranchName({ type, id, slug }) {
  if (!PLAN_BRANCH_TYPES.includes(type)) {
    throw new Error(`Plan branch type must be one of: ${PLAN_BRANCH_TYPES.join(", ")}.`);
  }
  if (!/^PLN-\d{4}$/.test(id)) throw new Error("Plan ID must use the PLN-NNNN format.");
  return `${type}/${id}-${validatePlanSlug(slug)}`;
}

export function planFilenameForBranch(branchName) {
  if (!/^[a-z]+\/PLN-\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(branchName)) {
    throw new Error("Plan filename requires a valid task branch name.");
  }
  return `${branchName.replace("/", "-")}.md`;
}

export async function reserveNextPlanId({ repository, owner = `pid-${process.pid}-${randomUUID()}`, retries = 32 }) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const id = `PLN-${String(await nextPlanNumber(repository)).padStart(4, "0")}`;
    const ref = `${RESERVATION_PREFIX}${id}`;
    const payload = `${JSON.stringify({ id, owner, reservedAt: new Date().toISOString() })}\n`;
    const { stdout: objectId } = await gitWithInput(repository, ["hash-object", "-w", "--stdin"], payload);
    const oid = objectId.trim();
    try {
      await git(repository, ["update-ref", ref, oid, ZERO_OID]);
      return { id, owner, ref, oid };
    } catch (error) {
      if (attempt === retries - 1) throw new Error(`Could not reserve a plan ID after ${retries} attempts: ${error.message}`);
    }
  }
  throw new Error("Could not reserve a plan ID.");
}

export async function releasePlanIdReservation({ repository, id, owner }) {
  const ref = `${RESERVATION_PREFIX}${id}`;
  let oid;
  try {
    ({ stdout: oid } = await git(repository, ["rev-parse", ref]));
  } catch {
    return false;
  }

  const { stdout: payload } = await git(repository, ["cat-file", "-p", oid.trim()]);
  let reservation;
  try {
    reservation = JSON.parse(payload);
  } catch {
    return false;
  }
  if (reservation.owner !== owner || reservation.id !== id) return false;

  try {
    await git(repository, ["update-ref", "-d", ref, oid.trim()]);
    return true;
  } catch {
    return false;
  }
}
