import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { issueExecutionPacket, releaseDiscoveryBrief, verifyDiscoveryBrief, verifyExecutionPacket } from "../../../scripts/handoff-contract.mjs";

async function fixture() { const dir = await mkdtemp(join(tmpdir(), "cf-handoff-")); const source = join(dir, "source.md"); await writeFile(source, "---\ntask_branch: feat/PLN-0042-oauth\ntarget_branch: main\nbase_commit: 0123456789012345678901234567890123456789\n---\nready\n"); return { dir, source }; }

async function discoveryFixture() {
  const dir = await mkdtemp(join(tmpdir(), "cf-discovery-"));
  const context = join(dir, "context.md");
  const source = join(dir, "record.md");
  const brief = join(dir, "brief.md");
  const content = "---\ntype: context\nstatus: ready\n---\n# Confirmed context\n";
  await writeFile(context, content);
  const hash = `sha256:${createHash("sha256").update(content).digest("hex")}`;
  await writeFile(source, `---\ntype: discovery-record\nstatus: ready\nsourceContext: ${context}\nsourceContextHash: ${hash}\n---\n# Challenged scenarios and decisions\n`);
  const prepared = {
    contractVersion: 2, status: "draft", sourceContext: { path: context, confirmedByUserOn: "2026-11-07" },
    objective: "Bound the change", actors: ["Maintainer"], scope: ["One seam"], nonGoals: ["Other features"],
    acceptedDecisions: [], acceptanceCriteria: ["The seam is verified"], scenarioCoverage: "Happy path and failure challenged",
    risks: [], remainingAssumptions: [], materialUnknowns: [], readyForPlan: true,
  };
  await writeFile(brief, JSON.stringify(prepared));
  return { dir, context, source, brief, prepared };
}

describe("handoff contract", () => {
  it("blocks a brief after its source changes", async () => { const { dir, source } = await fixture(); const brief = join(dir, "brief.json"); await releaseDiscoveryBrief({ sourcePath: source, briefPath: brief }); assert.equal((await verifyDiscoveryBrief(brief)).valid, true); await writeFile(source, "changed"); assert.match((await verifyDiscoveryBrief(brief)).message, /hash mismatch/); });
  it("releases a prepared brief and detects later context drift", async () => {
    const item = await discoveryFixture();
    try {
      const released = await releaseDiscoveryBrief({ sourcePath: item.source, briefPath: item.brief });
      assert.equal(released.objective, item.prepared.objective);
      assert.equal(released.status, "released");
      assert.equal((await verifyDiscoveryBrief(item.brief)).valid, true);
      await writeFile(item.brief, JSON.stringify({ ...released, objective: "" }));
      assert.match((await verifyDiscoveryBrief(item.brief)).message, /missing its outcome/);
      await writeFile(item.brief, JSON.stringify(released));
      await writeFile(item.context, "---\ntype: context\nstatus: ready\n---\n# Changed context\n");
      assert.match((await verifyDiscoveryBrief(item.brief)).message, /stale or not ready/);
    } finally { await rm(item.dir, { recursive: true, force: true }); }
  });
  it("blocks a draft context and an unconfirmed or unresolved brief", async () => {
    const item = await discoveryFixture();
    try {
      await writeFile(item.context, "---\ntype: context\nstatus: draft\n---\n# Draft\n");
      await assert.rejects(() => releaseDiscoveryBrief({ sourcePath: item.source, briefPath: item.brief }), /not ready/);
      await writeFile(item.context, "---\ntype: context\nstatus: ready\n---\n# Confirmed context\n");
      await writeFile(item.brief, JSON.stringify({ ...item.prepared, sourceContext: { path: item.context } }));
      await assert.rejects(() => releaseDiscoveryBrief({ sourcePath: item.source, briefPath: item.brief }), /confirmed source context/);
      await writeFile(item.brief, JSON.stringify({ ...item.prepared, materialUnknowns: ["Open scope question"] }));
      await assert.rejects(() => releaseDiscoveryBrief({ sourcePath: item.source, briefPath: item.brief }), /material-unknown state/);
    } finally { await rm(item.dir, { recursive: true, force: true }); }
  });
  it("blocks an execution packet after its plan changes", async () => { const { dir, source } = await fixture(); const packet = join(dir, "packet.json"); await issueExecutionPacket({ planPath: source, packetPath: packet, reviewReference: "REV-1", approvalReference: "APR-1" }); await writeFile(source, "changed"); assert.match((await verifyExecutionPacket(packet)).message, /hash mismatch/); });
  it("rejects packets without approval", async () => { const { dir, source } = await fixture(); const packet = join(dir, "packet.json"); await assert.rejects(() => issueExecutionPacket({ planPath: source, packetPath: packet, reviewReference: "REV-1" }), /approval/); });
  it("rejects a tampered approval", async () => { const { dir, source } = await fixture(); const packet = join(dir, "packet.json"); await issueExecutionPacket({ planPath: source, packetPath: packet, reviewReference: "REV-1", approvalReference: "APR-1" }); const body = JSON.parse(await readFile(packet, "utf8")); delete body.approvalReference; await writeFile(packet, JSON.stringify(body)); assert.match((await verifyExecutionPacket(packet)).message, /approval/); });
  it("carries branch identity and rejects branch tampering", async () => { const { dir, source } = await fixture(); const packet = join(dir, "packet.json"); const issued = await issueExecutionPacket({ planPath: source, packetPath: packet, reviewReference: "REV-1", approvalReference: "APR-1" }); assert.equal(issued.taskBranch, "feat/PLN-0042-oauth"); assert.equal(issued.targetBranch, "main"); const body = JSON.parse(await readFile(packet, "utf8")); body.taskBranch = "fix/PLN-0042-other"; await writeFile(packet, JSON.stringify(body)); assert.match((await verifyExecutionPacket(packet)).message, /branch identity/); });
});
