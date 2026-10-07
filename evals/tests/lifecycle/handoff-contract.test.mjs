import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { issueExecutionPacket, releaseDiscoveryBrief, verifyDiscoveryBrief, verifyExecutionPacket } from "../../../scripts/handoff-contract.mjs";

async function fixture() { const dir = await mkdtemp(join(tmpdir(), "cf-handoff-")); const source = join(dir, "source.md"); await writeFile(source, "ready"); return { dir, source }; }

describe("handoff contract", () => {
  it("blocks a brief after its source changes", async () => { const { dir, source } = await fixture(); const brief = join(dir, "brief.json"); await releaseDiscoveryBrief({ sourcePath: source, briefPath: brief }); assert.equal((await verifyDiscoveryBrief(brief)).valid, true); await writeFile(source, "changed"); assert.match((await verifyDiscoveryBrief(brief)).message, /hash mismatch/); });
  it("blocks an execution packet after its plan changes", async () => { const { dir, source } = await fixture(); const packet = join(dir, "packet.json"); await issueExecutionPacket({ planPath: source, packetPath: packet, reviewReference: "REV-1", approvalReference: "APR-1" }); await writeFile(source, "changed"); assert.match((await verifyExecutionPacket(packet)).message, /hash mismatch/); });
  it("rejects packets without approval", async () => { const { dir, source } = await fixture(); const packet = join(dir, "packet.json"); await assert.rejects(() => issueExecutionPacket({ planPath: source, packetPath: packet, reviewReference: "REV-1" }), /approval/); });
  it("rejects a tampered approval", async () => { const { dir, source } = await fixture(); const packet = join(dir, "packet.json"); await issueExecutionPacket({ planPath: source, packetPath: packet, reviewReference: "REV-1", approvalReference: "APR-1" }); const body = JSON.parse(await readFile(packet, "utf8")); delete body.approvalReference; await writeFile(packet, JSON.stringify(body)); assert.match((await verifyExecutionPacket(packet)).message, /approval/); });
});
