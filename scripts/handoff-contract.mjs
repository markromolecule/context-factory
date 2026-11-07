import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { frontmatter, root, sha256 } from "./context-core.mjs";

const VERSION = 1;

function planBriefProblem(brief) {
  if (!brief.objective || !brief.scenarioCoverage || brief.readyForPlan !== true || !Array.isArray(brief.materialUnknowns) || brief.materialUnknowns.length > 0) {
    return "Brief is missing its outcome, scenario coverage, or resolved material-unknown state.";
  }
  for (const field of ["actors", "scope", "nonGoals", "acceptanceCriteria"]) {
    if (!Array.isArray(brief[field]) || brief[field].length === 0) return `Brief needs a non-empty ${field} list.`;
  }
  for (const field of ["acceptedDecisions", "risks", "remainingAssumptions"]) {
    if (!Array.isArray(brief[field])) return `Brief needs a ${field} list.`;
  }
  return null;
}

async function fingerprint(path) {
  const absolutePath = resolve(process.cwd(), path);
  return { path: relative(root, absolutePath), sha256: `sha256:${sha256(await readFile(absolutePath, "utf8"))}` };
}

async function writeArtifact(path, artifact) {
  const absolutePath = resolve(process.cwd(), path);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  return artifact;
}

export async function releaseDiscoveryBrief({ sourcePath, briefPath, owner = "grill" }) {
  if (owner !== "grill") throw new Error("Only grill may release a discovery brief.");
  const record = await readFile(resolve(process.cwd(), sourcePath), "utf8");
  const recordMeta = frontmatter(record);
  let prepared = null;
  try {
    prepared = JSON.parse(await readFile(resolve(process.cwd(), briefPath), "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  if (recordMeta?.type === "discovery-record") {
    if (!prepared || prepared.contractVersion !== 2 || prepared.status !== "draft") {
      throw new Error("Discovery record release requires a prepared contractVersion 2 draft brief.");
    }
    if (recordMeta.status !== "ready" || !recordMeta.sourceContext || !recordMeta.sourceContextHash) {
      throw new Error("Discovery record must be ready and name its source context and hash.");
    }
    const contextPath = resolve(root, recordMeta.sourceContext);
    const context = await readFile(contextPath, "utf8");
    if (frontmatter(context)?.status !== "ready") throw new Error("Source context is not ready.");
    const contextFingerprint = await fingerprint(contextPath);
    const withoutSelfHash = context.replace(/^.*Context content hash:.*\n/m, "");
    const legacyHash = `sha256:${sha256(withoutSelfHash)}`;
    if (![contextFingerprint.sha256, legacyHash].includes(recordMeta.sourceContextHash)) {
      throw new Error("Discovery record source context hash is stale.");
    }
    if (prepared.sourceContext?.path !== recordMeta.sourceContext || !prepared.sourceContext.confirmedByUserOn) {
      throw new Error("Brief must identify its confirmed source context.");
    }
    const problem = planBriefProblem(prepared);
    if (problem) throw new Error(problem);
    prepared.sourceContext = { ...prepared.sourceContext, status: "ready", sha256: contextFingerprint.sha256 };
  } else if (prepared?.status === "released") {
    throw new Error("Mark an existing brief draft before releasing it again.");
  }

  return writeArtifact(briefPath, { ...(prepared ?? {}), version: VERSION, kind: "discovery-brief", owner, status: "released", source: await fingerprint(sourcePath) });
}

export async function issueExecutionPacket({ planPath, packetPath, reviewReference, approvalReference, owner = "plan-review" }) {
  if (owner !== "plan-review") throw new Error("Only plan-review may issue an execution packet.");
  if (!reviewReference || !approvalReference) throw new Error("Execution packet requires review and human approval references.");
  const plan = frontmatter(await readFile(resolve(process.cwd(), planPath), "utf8"));
  if (!plan?.task_branch || !plan?.target_branch) throw new Error("Execution packet requires the plan's task_branch and target_branch.");
  return writeArtifact(packetPath, { version: VERSION, kind: "execution-packet", owner, status: "approved", reviewReference, approvalReference, taskBranch: plan.task_branch, targetBranch: plan.target_branch, baseCommit: plan.base_commit || null, source: await fingerprint(planPath) });
}

export async function verifyHandoff({ artifactPath, kind, owner, requiredStatus }) {
  const absolutePath = resolve(process.cwd(), artifactPath);
  let artifact;
  try { artifact = JSON.parse(await readFile(absolutePath, "utf8")); } catch { return { valid: false, message: `Cannot read handoff artifact ${artifactPath}; reissue it.` }; }
  if (artifact.version !== VERSION || artifact.kind !== kind || artifact.owner !== owner || artifact.status !== requiredStatus) {
    return { valid: false, message: `Invalid ${kind} metadata; reissue it from ${owner}.` };
  }
  if (kind === "execution-packet" && (!artifact.reviewReference || !artifact.approvalReference)) {
    return { valid: false, message: "Execution packet lacks review or human approval reference; obtain approval and reissue it." };
  }
  if (kind === "execution-packet" && (!artifact.taskBranch || !artifact.targetBranch)) {
    return { valid: false, message: "Execution packet lacks task branch or target base; reissue it." };
  }
  let current;
  try { current = await fingerprint(resolve(root, artifact.source.path)); } catch { return { valid: false, message: `Source ${artifact.source.path} is unavailable; reissue the handoff.` }; }
  if (current.sha256 !== artifact.source.sha256) {
    return { valid: false, message: `Source hash mismatch for ${artifact.source.path}; reissue the ${kind}.` };
  }
  if (kind === "discovery-brief" && artifact.contractVersion === 2) {
    const problem = planBriefProblem(artifact);
    if (problem) return { valid: false, message: `${problem} Return to grill.` };
    if (!artifact.sourceContext?.path || !artifact.sourceContext.sha256) {
      return { valid: false, message: "Discovery brief lacks its source context fingerprint; reissue it from grill." };
    }
    const record = frontmatter(await readFile(resolve(root, artifact.source.path), "utf8"));
    if (record?.status !== "ready" || record.sourceContext !== artifact.sourceContext?.path) {
      return { valid: false, message: "Discovery record readiness or context identity changed; reissue the brief." };
    }
    let context;
    try { context = await readFile(resolve(root, artifact.sourceContext.path), "utf8"); } catch { return { valid: false, message: "Source context is unavailable; reissue the brief." }; }
    const contextHash = `sha256:${sha256(context)}`;
    if (frontmatter(context)?.status !== "ready" || contextHash !== artifact.sourceContext.sha256) {
      return { valid: false, message: "Source context is stale or not ready; reissue the brief." };
    }
    if (!artifact.sourceContext.confirmedByUserOn) {
      return { valid: false, message: "Discovery brief is no longer confirmed or plan-ready; return to grill." };
    }
  }
  if (kind === "execution-packet") {
    const plan = frontmatter(await readFile(resolve(root, artifact.source.path), "utf8"));
    if (plan?.task_branch !== artifact.taskBranch || plan?.target_branch !== artifact.targetBranch || (plan?.base_commit || null) !== artifact.baseCommit) {
      return { valid: false, message: "Execution packet branch identity differs from its plan; reissue it." };
    }
  }
  return { valid: true, artifact };
}

export const verifyDiscoveryBrief = (briefPath) => verifyHandoff({ artifactPath: briefPath, kind: "discovery-brief", owner: "grill", requiredStatus: "released" });
export const verifyExecutionPacket = (packetPath) => verifyHandoff({ artifactPath: packetPath, kind: "execution-packet", owner: "plan-review", requiredStatus: "approved" });
