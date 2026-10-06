import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { root, sha256 } from "./context-core.mjs";

const VERSION = 1;

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
  return writeArtifact(briefPath, { version: VERSION, kind: "discovery-brief", owner, status: "released", source: await fingerprint(sourcePath) });
}

export async function issueExecutionPacket({ planPath, packetPath, reviewReference, approvalReference, owner = "plan-review" }) {
  if (owner !== "plan-review") throw new Error("Only plan-review may issue an execution packet.");
  if (!reviewReference || !approvalReference) throw new Error("Execution packet requires review and human approval references.");
  return writeArtifact(packetPath, { version: VERSION, kind: "execution-packet", owner, status: "approved", reviewReference, approvalReference, source: await fingerprint(planPath) });
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
  let current;
  try { current = await fingerprint(resolve(root, artifact.source.path)); } catch { return { valid: false, message: `Source ${artifact.source.path} is unavailable; reissue the handoff.` }; }
  if (current.sha256 !== artifact.source.sha256) {
    return { valid: false, message: `Source hash mismatch for ${artifact.source.path}; reissue the ${kind}.` };
  }
  return { valid: true, artifact };
}

export const verifyDiscoveryBrief = (briefPath) => verifyHandoff({ artifactPath: briefPath, kind: "discovery-brief", owner: "grill", requiredStatus: "released" });
export const verifyExecutionPacket = (packetPath) => verifyHandoff({ artifactPath: packetPath, kind: "execution-packet", owner: "plan-review", requiredStatus: "approved" });
