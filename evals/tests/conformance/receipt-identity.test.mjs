import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { computeChangeIdentity } from "../../../orchestrator/conformance/change-identity.mjs";
import { verifyConformanceReport } from "../../../orchestrator/conformance/report-verifier.mjs";

describe("Unit 03.01: Content-bound changed-code SHA-256 identity and strict verifier (AC-07, AC-08)", () => {
  it("computes deterministic SHA-256 digest over file content bytes", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-change-id-"));
    try {
      const file1 = join(tempDir, "file1.ts");
      const file2 = join(tempDir, "file2.ts");
      await writeFile(file1, "export const a = 1;\n", "utf8");
      await writeFile(file2, "export const b = 2;\n", "utf8");

      const id1 = await computeChangeIdentity({ files: ["file1.ts", "file2.ts"], cwd: tempDir });
      assert.ok(id1.diffHash.startsWith("sha256:"));
      assert.equal(id1.entries.length, 2);

      // Recomputing with same content yields identical hash
      const id2 = await computeChangeIdentity({ files: ["file2.ts", "file1.ts"], cwd: tempDir });
      assert.equal(id2.diffHash, id1.diffHash);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("produces a different diffHash when same-path files have byte edits (AC-08)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-change-id-edit-"));
    try {
      const file1 = join(tempDir, "target.ts");
      await writeFile(file1, "const value = 'v1';\n", "utf8");

      const idBefore = await computeChangeIdentity({ files: ["target.ts"], cwd: tempDir });

      // Modify 1 byte in the file
      await writeFile(file1, "const value = 'v2';\n", "utf8");

      const idAfter = await computeChangeIdentity({ files: ["target.ts"], cwd: tempDir });

      // Diff hash MUST be different to detect same-path content edits
      assert.notEqual(idAfter.diffHash, idBefore.diffHash);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("handles missing files and empty scopes deterministically", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-change-id-empty-"));
    try {
      const emptyId = await computeChangeIdentity({ files: [], cwd: tempDir });
      assert.ok(emptyId.diffHash.startsWith("sha256:"));

      const missingId = await computeChangeIdentity({ files: ["non-existent.ts"], cwd: tempDir });
      assert.ok(missingId.diffHash.startsWith("sha256:"));
      assert.equal(missingId.entries[0].status, "missing");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("verifier rejects non-existent report file (AC-08)", async () => {
    const verification = await verifyConformanceReport({
      reportPath: "/path/to/non-existent-report.json",
    });
    assert.equal(verification.valid, false);
    assert.equal(verification.reason, "missing_report");
  });

  it("verifier rejects report with non-PASS verdict (FAIL or BLOCKED) (AC-08)", async () => {
    const failedReport = {
      id: "report-001",
      bindingId: "bind-001",
      bindingHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      diffHash: "sha256:fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
      verdict: "FAIL",
      summary: { passed: 0, failed: 1, waived: 0, notAutomatable: 0, toolUnavailable: 0, unsupported: 0, total: 1 },
      results: [],
      generatedAt: new Date().toISOString(),
    };

    const verification = await verifyConformanceReport({ report: failedReport });
    assert.equal(verification.valid, false);
    assert.equal(verification.reason, "non_pass_verdict");
  });

  it("verifier rejects report with stale binding hash (AC-08)", async () => {
    const report = {
      id: "report-002",
      bindingId: "bind-002",
      bindingHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      diffHash: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      verdict: "PASS",
      summary: { passed: 10, failed: 0, waived: 0, notAutomatable: 0, toolUnavailable: 0, unsupported: 0, total: 10 },
      results: [],
      generatedAt: new Date().toISOString(),
    };

    const verification = await verifyConformanceReport({
      report,
      expectedBindingHash: "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
    });

    assert.equal(verification.valid, false);
    assert.equal(verification.reason, "stale_binding");
  });

  it("verifier rejects report when current scoped files have same-path content edits (AC-08)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-verify-stale-diff-"));
    try {
      const filePath = join(tempDir, "code.ts");
      await writeFile(filePath, "const oldCode = 1;\n", "utf8");

      const oldIdentity = await computeChangeIdentity({ files: ["code.ts"], cwd: tempDir });

      const report = {
        id: "report-003",
        bindingId: "bind-003",
        bindingHash: "sha256:1111111111111111111111111111111111111111111111111111111111111111",
        diffHash: oldIdentity.diffHash,
        verdict: "PASS",
        summary: { passed: 5, failed: 0, waived: 0, notAutomatable: 0, toolUnavailable: 0, unsupported: 0, total: 5 },
        results: [],
        generatedAt: new Date().toISOString(),
      };

      // Now edit file after report was created
      await writeFile(filePath, "const newCode = 2;\n", "utf8");

      const verification = await verifyConformanceReport({
        report,
        expectedBindingHash: report.bindingHash,
        expectedScope: ["code.ts"],
        cwd: tempDir,
      });

      assert.equal(verification.valid, false);
      assert.equal(verification.reason, "stale_diff_hash");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("verifier accepts current authoritative PASS report matching active binding and content identity (AC-07)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-verify-valid-"));
    try {
      const filePath = join(tempDir, "code.ts");
      await writeFile(filePath, "const authoritative = true;\n", "utf8");

      const currentIdentity = await computeChangeIdentity({ files: ["code.ts"], cwd: tempDir });
      const bindingHash = "sha256:2222222222222222222222222222222222222222222222222222222222222222";

      const report = {
        id: "report-004",
        bindingId: "bind-004",
        bindingHash,
        diffHash: currentIdentity.diffHash,
        verdict: "PASS",
        summary: { passed: 5, failed: 0, waived: 0, notAutomatable: 0, toolUnavailable: 0, unsupported: 0, total: 5 },
        results: [],
        generatedAt: new Date().toISOString(),
      };

      const verification = await verifyConformanceReport({
        report,
        expectedBindingHash: bindingHash,
        expectedScope: ["code.ts"],
        cwd: tempDir,
      });

      assert.equal(verification.valid, true);
      assert.equal(verification.verdict, "PASS");
      assert.equal(verification.diffHash, currentIdentity.diffHash);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
