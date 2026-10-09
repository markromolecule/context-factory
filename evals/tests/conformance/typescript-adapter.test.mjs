import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import {
  typeScriptAdapter,
  discoverTypeScriptCapabilities,
  registerTypeScriptAdapter,
} from "../../../orchestrator/conformance/adapters/typescript.mjs";
import { executeCommand } from "../../../orchestrator/conformance/process-runner.mjs";
import { clearAdapters, getAdapter } from "../../../orchestrator/conformance/adapter-contract.mjs";
import { evaluateConformance } from "../../../orchestrator/conformance/conformance-orchestrator.mjs";

const FIXTURES_DIR = resolve(process.cwd(), "evals/fixtures/typescript-conformance");

describe("False PASS regressions", () => {
  for (const [id, source] of [
    ["ts.type-safety.strict-compiler-settings", 'export const n: number = "wrong";'],
    ["ts.async.no-floating-promises", 'fetch("/api/save");'],
    ["ts.runtime-validation.parse-boundary-data", 'export async function load() { return (await fetch("/api/user")).json(); }'],
    ["ts.type-safety.ban-any", 'type Unsafe = any;'],
  ]) {
    it(`never passes ${id} without its verifier`, async () => {
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [{ id, mode: "automated-blocking" }] },
        changedScope: ["src/example.ts"], capabilities: { tools: {} },
        options: { readTextFn: async () => source, humanEvidence: "Test reviewer approved architecture only" },
      });
      assert.ok(["TOOL_UNAVAILABLE", "UNSUPPORTED", "FAIL"].includes(result.status), JSON.stringify(result));
    });
  }

  it("does not pass unreadable or empty source scope", async () => {
    for (const changedScope of [[], ["src/missing.ts"]]) {
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [{ id: "ts.type-safety.ban-any", mode: "automated-blocking" }] },
        changedScope, capabilities: { tools: {} },
        options: { readTextFn: async () => { throw new Error("unreadable"); } },
      });
      assert.notEqual(result.status, "PASS");
    }
  });
});

const baseBinding = {
  id: "bind-ts-pilot",
  bindingHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  stack: "typescript",
  affectedScope: [],
  directives: [
    {
      id: "ts.type-safety.ban-any",
      mode: "automated-blocking",
      rulePath: "rules/typescript/common/type-safety.md",
      contentHash: "sha256:fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
    },
    {
      id: "ts.runtime-validation.zero-trust-boundaries",
      mode: "automated-blocking",
      rulePath: "rules/typescript/common/runtime-validation.md",
      contentHash: "sha256:fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
    },
    {
      id: "ts.module-imports.forbid-upward-relative-traversal",
      mode: "automated-blocking",
      rulePath: "rules/typescript/common/module-and-imports.md",
      contentHash: "sha256:fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
    },
    {
      id: "ts.architecture.module-boundary",
      mode: "evidence-blocking",
      rulePath: "rules/typescript/common/explicit-boundaries.md",
      contentHash: "sha256:fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
    },
  ],
};

describe("Unit 03.02: AC-07 TypeScript Conformance Adapter & 4 Violation Classes", () => {
  beforeEach(() => {
    clearAdapters();
    registerTypeScriptAdapter();
  });

  it("passes conforming TypeScript fixture across all automated classes", async () => {
    const validFile = "evals/fixtures/typescript-conformance/conforming/valid-service.ts";
    const report = await evaluateConformance({
      binding: baseBinding,
      changedScope: [validFile],
      options: {
        humanEvidence: "Reviewed and confirmed explicit boundary signatures by lead developer.",
      },
    });

    assert.equal(report.verdict, "PASS");
    assert.equal(report.summary.failed, 0);

    const typeResult = report.results.find((r) => r.directiveId === "ts.type-safety.ban-any");
    assert.equal(typeResult.status, "PASS");

    const runtimeResult = report.results.find((r) => r.directiveId === "ts.runtime-validation.zero-trust-boundaries");
    assert.equal(runtimeResult.status, "PASS");

    const moduleResult = report.results.find((r) => r.directiveId === "ts.module-imports.forbid-upward-relative-traversal");
    assert.equal(moduleResult.status, "PASS");

    const archResult = report.results.find((r) => r.directiveId === "ts.architecture.module-boundary");
    assert.equal(archResult.status, "PASS");
  });

  it("detects deliberate type safety violation (class 1: ban-any)", async () => {
    const violatingFile = "evals/fixtures/typescript-conformance/violating/type-violation.ts";
    const report = await evaluateConformance({
      binding: baseBinding,
      changedScope: [violatingFile],
      options: {
        humanEvidence: "Architecture approved",
      },
    });

    assert.equal(report.verdict, "FAIL");
    const typeResult = report.results.find((r) => r.directiveId === "ts.type-safety.ban-any");
    assert.equal(typeResult.status, "FAIL");
    assert.match(typeResult.evidence.outputFragment, /Banned "any" type detected/);
  });

  it("detects deliberate runtime validation violation (class 2: zero-trust-boundaries)", async () => {
    const violatingFile = "evals/fixtures/typescript-conformance/violating/runtime-violation.ts";
    const report = await evaluateConformance({
      binding: baseBinding,
      changedScope: [violatingFile],
      options: {
        humanEvidence: "Architecture approved",
      },
    });

    assert.equal(report.verdict, "FAIL");
    const runtimeResult = report.results.find((r) => r.directiveId === "ts.runtime-validation.zero-trust-boundaries");
    assert.equal(runtimeResult.status, "FAIL");
    assert.match(runtimeResult.evidence.outputFragment, /Unvalidated boundary cast detected/);
  });

  it("detects deliberate module boundary violation (class 3: upward-relative-traversal)", async () => {
    const violatingFile = "evals/fixtures/typescript-conformance/violating/boundary-violation.ts";
    const report = await evaluateConformance({
      binding: baseBinding,
      changedScope: [violatingFile],
      options: {
        humanEvidence: "Architecture approved",
      },
    });

    assert.equal(report.verdict, "FAIL");
    const moduleResult = report.results.find((r) => r.directiveId === "ts.module-imports.forbid-upward-relative-traversal");
    assert.equal(moduleResult.status, "FAIL");
    assert.match(moduleResult.evidence.outputFragment, /Illegal upward relative module traversal/);
  });

  it("blocks architecture boundary without human evidence (class 4: evidence-blocking)", async () => {
    const validFile = "evals/fixtures/typescript-conformance/conforming/valid-service.ts";
    const report = await evaluateConformance({
      binding: baseBinding,
      changedScope: [validFile],
      // No humanEvidence passed
    });

    assert.equal(report.verdict, "BLOCKED");
    const archResult = report.results.find((r) => r.directiveId === "ts.architecture.module-boundary");
    assert.equal(archResult.status, "NOT_AUTOMATABLE");
    assert.match(archResult.evidence.outputFragment, /requires named human evidence/);
  });
});

describe("Unit 03.02: Host Tool Discovery & TOOL_UNAVAILABLE Semantics", () => {
  it("discovers host capabilities without assuming global tools exist", async () => {
    const capabilities = await discoverTypeScriptCapabilities(process.cwd());
    assert.equal(typeof capabilities.hasPackageJson, "boolean");
    assert.equal(typeof capabilities.hasTsConfig, "boolean");
    assert.equal(typeof capabilities.tools, "object");
  });

  it("reports TOOL_UNAVAILABLE when tool is missing and cannot count as enforced/passed", async () => {
    const results = await typeScriptAdapter.evaluate({
      binding: baseBinding,
      changedScope: ["src/services/user.ts"],
      options: {
        toolUnavailable: true,
      },
    });

    const unavailableResult = results.find((r) => r.status === "TOOL_UNAVAILABLE");
    assert.ok(unavailableResult, "Must have at least one TOOL_UNAVAILABLE result");
    assert.match(unavailableResult.evidence.outputFragment, /not available in host environment/);
  });
});

describe("Unit 03.02: Security - Subprocess Injection Safety", () => {
  it("executes commands via safe argv arrays and neutralizes shell injection tokens", async () => {
    // Attempting command injection via shell characters
    const injectionToken = "; echo 'hacked' ;";
    const res = await executeCommand({
      command: "node",
      args: ["-e", `console.log(process.argv[1])`, injectionToken],
    });

    assert.equal(res.exitCode, 0);
    // The injection string was passed purely as a literal argument, NOT executed by shell
    assert.equal(res.stdout.trim(), "; echo 'hacked' ;");
  });

  it("handles non-existent binary safely without throwing unhandled exception", async () => {
    const res = await executeCommand({
      command: "non-existent-binary-9999",
      args: ["--version"],
    });

    assert.equal(res.notFound, true);
    assert.equal(res.exitCode, 127);
  });
});

describe("Unit 03.02: Architectural Inversion & Composition Root", () => {
  it("orchestrator has no hardcoded stack imports and resolves adapter dynamically", () => {
    clearAdapters();
    assert.equal(getAdapter("typescript"), null);

    registerTypeScriptAdapter();
    assert.equal(getAdapter("typescript"), typeScriptAdapter);
  });
});
