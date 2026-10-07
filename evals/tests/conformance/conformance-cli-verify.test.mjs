import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { handleConformCommand } from "../../../app/cli/commands/conform.mjs";
import { computeChangeIdentity } from "../../../orchestrator/conformance/change-identity.mjs";

describe("Unit 03.02: Conformance CLI verification commands and fatal out handling (AC-07, AC-08, AC-09)", () => {
  it("verifies authoritative PASS conformance report via 'conform verify' subcommand (AC-07)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-conform-verify-pass-"));
    try {
      const codeFile = join(tempDir, "auth.ts");
      await writeFile(codeFile, "export const auth = true;\n", "utf8");

      const changeId = await computeChangeIdentity({ files: ["auth.ts"], cwd: tempDir });
      const bindingHash = "sha256:1111111111111111111111111111111111111111111111111111111111111111";

      const validReport = {
        id: "report-auth-pass-001",
        bindingId: "binding-auth-001",
        bindingHash,
        diffHash: changeId.diffHash,
        verdict: "PASS",
        summary: { passed: 10, failed: 0, waived: 0, notAutomatable: 0, toolUnavailable: 0, unsupported: 0, total: 10 },
        results: [],
        generatedAt: new Date().toISOString(),
      };

      const reportPath = join(tempDir, "conformance-report.json");
      await writeFile(reportPath, JSON.stringify(validReport, null, 2), "utf8");

      // Verify command passes with exit code 0
      const exitCode = await handleConformCommand(["verify", reportPath], {
        binding: bindingHash,
        scope: ["auth.ts"],
        target: tempDir,
        json: true,
      });

      assert.equal(exitCode, 0);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("fails verification with exit code 1 when report file is missing (AC-08)", async () => {
    const exitCode = await handleConformCommand(["verify", "/non/existent/path/report.json"], {
      json: true,
    });
    assert.equal(exitCode, 1);
  });

  it("fails verification with exit code 1 when report verdict is not PASS (AC-08)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-conform-verify-fail-"));
    try {
      const failedReport = {
        id: "report-fail-002",
        bindingId: "binding-002",
        bindingHash: "sha256:2222222222222222222222222222222222222222222222222222222222222222",
        diffHash: "sha256:3333333333333333333333333333333333333333333333333333333333333333",
        verdict: "FAIL",
        summary: { passed: 5, failed: 1, waived: 0, notAutomatable: 0, toolUnavailable: 0, unsupported: 0, total: 6 },
        results: [],
        generatedAt: new Date().toISOString(),
      };

      const reportPath = join(tempDir, "report.json");
      await writeFile(reportPath, JSON.stringify(failedReport), "utf8");

      const exitCode = await handleConformCommand(["verify", reportPath], { json: true });
      assert.equal(exitCode, 1);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("fails verification when report diffHash is stale due to same-path content edits (AC-08)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-conform-verify-stale-"));
    try {
      const codeFile = join(tempDir, "auth.ts");
      await writeFile(codeFile, "const v1 = 1;\n", "utf8");

      const oldChangeId = await computeChangeIdentity({ files: ["auth.ts"], cwd: tempDir });
      const bindingHash = "sha256:4444444444444444444444444444444444444444444444444444444444444444";

      const report = {
        id: "report-stale-003",
        bindingId: "binding-003",
        bindingHash,
        diffHash: oldChangeId.diffHash,
        verdict: "PASS",
        summary: { passed: 5, failed: 0, waived: 0, notAutomatable: 0, toolUnavailable: 0, unsupported: 0, total: 5 },
        results: [],
        generatedAt: new Date().toISOString(),
      };

      const reportPath = join(tempDir, "report.json");
      await writeFile(reportPath, JSON.stringify(report), "utf8");

      // Now mutate codeFile on disk
      await writeFile(codeFile, "const v2 = 2;\n", "utf8");

      const exitCode = await handleConformCommand(["verify", reportPath], {
        binding: bindingHash,
        scope: ["auth.ts"],
        target: tempDir,
        json: true,
      });

      assert.equal(exitCode, 1);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("makes artifact persistence failure fatal when --out is specified (AC-08)", async () => {
    const invalidDestination = "/dev/null/impossible-directory/report.json";

    const exitCode = await handleConformCommand(["Verify fatal out"], {
      stack: "typescript",
      scope: ["evals/fixtures/typescript-conformance/passing/clean-code.ts"],
      out: invalidDestination,
      json: true,
    });

    // Must NOT swallow write error; returns error exit code (1 or 2)
    assert.notEqual(exitCode, 0);
  });

  it("blocks with exit code 2 when required human evidence is missing (AC-09)", async () => {
    const exitCode = await handleConformCommand(["Verify evidence required"], {
      stack: "typescript",
      scope: ["evals/fixtures/typescript-conformance/passing/clean-code.ts"],
      json: true,
      // humanEvidence is explicitly omitted
    });

    // Evidence-blocking directives require human evidence; without it, verdict is BLOCKED (exit code 2)
    assert.equal(exitCode, 2);
  });
});
