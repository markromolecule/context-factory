import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { handlePreflightCommand } from "../app/cli/commands/preflight.mjs";
import { handleConformCommand } from "../app/cli/commands/conform.mjs";
import { parseArgs } from "../app/cli/core/options.mjs";
import { loadSchema, assertValid } from "../orchestrator/validator.mjs";

const VALID_HUMAN_WAIVER = {
  id: "waiver-cli-001",
  directiveId: "ts.type-safety.ban-any",
  scope: ["evals/fixtures/typescript-conformance/violating/type-violation.ts"],
  authorizedBy: "lead.architect@example.com",
  authorizedAt: "2026-10-06T12:00:00.000Z",
  rationale: "Approved temporary legacy wrapper.",
  compensatingEvidence: "Covered by isolated adapter integration test.",
  expiresAt: "2026-12-31T23:59:59.000Z",
  status: "active",
};

const AGENT_FORGED_WAIVER = {
  id: "waiver-forged-002",
  directiveId: "ts.type-safety.ban-any",
  scope: ["evals/fixtures/typescript-conformance/violating/type-violation.ts"],
  authorizedBy: "ai-assistant",
  authorizedAt: "2026-10-06T12:00:00.000Z",
  rationale: "Agent attempted self-waiver.",
  compensatingEvidence: "None.",
  status: "active",
};

describe("Unit 03.03: AC-08 Authoritative Preflight CLI Command", () => {
  it("normalizes repeated and comma-delimited --scope values into one exact path list", () => {
    const parsed = parseArgs([
      "preflight",
      "--scope", "src/services/auth.ts,src/controllers/auth.ts",
      "--scope", "src/data/auth-repository.ts",
    ]);

    assert.deepEqual(parsed.flags.scope, [
      "src/services/auth.ts",
      "src/controllers/auth.ts",
      "src/data/auth-repository.ts",
    ]);
  });

  it("records each comma-delimited scope path independently in its receipt", async () => {
    let capturedJson = null;
    const originalLog = console.log;
    console.log = (text) => {
      try { capturedJson = JSON.parse(text); } catch { /* non-JSON output */ }
    };

    try {
      const exitCode = await handlePreflightCommand(
        ["Verify multi-path scope receipt"],
        {
          stack: "typescript",
          scope: "src/services/auth.ts,src/controllers/auth.ts",
          strict: true,
          json: true,
        }
      );

      assert.equal(exitCode, 0);
      assert.deepEqual(capturedJson.scope, ["src/controllers/auth.ts", "src/services/auth.ts"]);
    } finally {
      console.log = originalLog;
    }
  });

  it("exits 0 with valid preflight result when scope and stack are specified", async () => {
    let capturedJson = null;
    const originalLog = console.log;
    console.log = (text) => {
      try {
        capturedJson = JSON.parse(text);
      } catch {
        // Human output
      }
    };

    try {
      const exitCode = await handlePreflightCommand(
        ["Scaffold authentication service"],
        { stack: "typescript", scope: "src/services/auth.ts", json: true }
      );

      assert.equal(exitCode, 0);
      assert.ok(capturedJson);
      assert.equal(capturedJson.status, "PASS");
      assert.equal(capturedJson.stack, "typescript");
      assert.ok(capturedJson.directivesCount > 0);
    } finally {
      console.log = originalLog;
    }
  });

  it("exits 1 on preflight error when requireBinding fails", async () => {
    let capturedJson = null;
    const originalLog = console.log;
    console.log = (text) => {
      try {
        capturedJson = JSON.parse(text);
      } catch {
        // Human output
      }
    };

    try {
      const exitCode = await handlePreflightCommand(
        ["Ambiguous prompt without scope"],
        { strict: true, json: true }
      );

      assert.equal(exitCode, 1);
      assert.ok(capturedJson);
      assert.equal(capturedJson.status, "FAIL");
      assert.match(capturedJson.error, /Preflight failed/);
    } finally {
      console.log = originalLog;
    }
  });

  it("rejects forged agent waiver during preflight", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "preflight-test-"));
    const waiverFile = join(tempDir, "forged-waiver.json");
    await writeFile(waiverFile, JSON.stringify(AGENT_FORGED_WAIVER, null, 2), "utf8");

    try {
      const exitCode = await handlePreflightCommand(
        ["Scaffold service"],
        { stack: "typescript", scope: "src/services/auth.ts", waiver: waiverFile, json: true }
      );

      assert.equal(exitCode, 1);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});

describe("Unit 03.03: AC-08 Authoritative Conformance CLI Command", () => {
  it("exits 0 (PASS) on conforming fixture with human evidence and persists valid report", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "conform-test-"));
    const reportOut = join(tempDir, "report.json");

    try {
      const exitCode = await handleConformCommand(
        [],
        {
          stack: "typescript",
          scope: "evals/fixtures/typescript-conformance/conforming/valid-service.ts",
          humanEvidence: "Reviewed and validated by Lead Dev @sarah.",
          out: reportOut,
          json: true,
        }
      );

      assert.equal(exitCode, 0);

      const persistedReport = JSON.parse(await readFile(reportOut, "utf8"));
      assert.equal(persistedReport.verdict, "PASS");
      assert.ok(persistedReport.summary.passed >= 4);
      assert.equal(persistedReport.summary.failed, 0);

      // Validate against JSON schema contract
      const schema = await loadSchema("conformance-report");
      assertValid(persistedReport, schema);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("exits 1 (FAIL) on deliberate type safety violation", async () => {
    const exitCode = await handleConformCommand(
      [],
      {
        stack: "typescript",
        scope: "evals/fixtures/typescript-conformance/violating/type-violation.ts",
        humanEvidence: "Architecture approved.",
        json: true,
      }
    );

    assert.equal(exitCode, 1);
  });

  it("exits 1 (FAIL) on deliberate runtime validation boundary violation", async () => {
    const exitCode = await handleConformCommand(
      [],
      {
        stack: "typescript",
        scope: "evals/fixtures/typescript-conformance/violating/runtime-violation.ts",
        humanEvidence: "Architecture approved.",
        json: true,
      }
    );

    assert.equal(exitCode, 1);
  });

  it("exits 2 (BLOCKED) on evidence-blocking directive when human evidence is missing", async () => {
    const exitCode = await handleConformCommand(
      [],
      {
        stack: "typescript",
        scope: "evals/fixtures/typescript-conformance/conforming/valid-service.ts",
        // No humanEvidence
        json: true,
      }
    );

    assert.equal(exitCode, 2);
  });

  it("exits 0 (PASS) when active human waiver is applied to deliberate type violation", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "conform-waiver-test-"));
    const waiverFile = join(tempDir, "valid-waiver.json");
    await writeFile(waiverFile, JSON.stringify(VALID_HUMAN_WAIVER, null, 2), "utf8");

    try {
      const exitCode = await handleConformCommand(
        [],
        {
          stack: "typescript",
          scope: "evals/fixtures/typescript-conformance/violating/type-violation.ts",
          humanEvidence: "Architecture approved by staff lead.",
          waiver: waiverFile,
          json: true,
        }
      );

      assert.equal(exitCode, 0);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
