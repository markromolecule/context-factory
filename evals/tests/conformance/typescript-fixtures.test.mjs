import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import {
  typeScriptAdapter,
  registerTypeScriptAdapter,
} from "../../../orchestrator/conformance/adapters/typescript.mjs";
import { clearAdapters } from "../../../orchestrator/conformance/adapter-contract.mjs";
import { evaluateConformance } from "../../../orchestrator/conformance/conformance-orchestrator.mjs";

const FIXTURES_ROOT = resolve(process.cwd(), "evals/fixtures/typescript");

describe("Unit 03.01: Paired TypeScript Fixtures Matrix (AC-02, AC-05)", () => {
  beforeEach(() => {
    clearAdapters();
    registerTypeScriptAdapter();
  });

  describe("Class 1: Type Safety (ban-any)", () => {
    const directive = {
      id: "ts.type-safety.ban-any",
      mode: "automated-blocking",
    };

    it("passes good fixture with 0 false positives", async () => {
      const goodPath = "evals/fixtures/typescript/good/ban-any.ts";
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [directive], stack: "typescript" },
        changedScope: [goodPath],
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(result.status, "PASS");
      assert.equal(result.evidence.verifierType, "ts-type-checker");
      assert.match(result.evidence.outputFragment, /0 banned any violations found/);
    });

    it("detects deliberate violation on bad fixture with 100% detection", async () => {
      const badPath = "evals/fixtures/typescript/bad/ban-any.ts";
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [directive], stack: "typescript" },
        changedScope: [badPath],
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(result.status, "FAIL");
      assert.equal(result.evidence.verifierType, "ts-type-checker");
      assert.match(result.evidence.outputFragment, /Banned "any" type detected/);
    });
  });

  describe("Class 2: Strict Compiler Settings (strict-compiler)", () => {
    const directive = {
      id: "ts.type-safety.strict-compiler-settings",
      mode: "automated-blocking",
    };

    it("passes good fixture with 0 false positives", async () => {
      const goodPath = "evals/fixtures/typescript/good/strict-compiler.ts";
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [directive], stack: "typescript" },
        changedScope: [goodPath],
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(result.status, "PASS");
      assert.equal(result.evidence.verifierType, "ts-type-checker");
      assert.match(result.evidence.outputFragment, /0 strict compiler violations found/);
    });

    it("detects deliberate violation on bad fixture with 100% detection", async () => {
      const badPath = "evals/fixtures/typescript/bad/strict-compiler.ts";
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [directive], stack: "typescript" },
        changedScope: [badPath],
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(result.status, "FAIL");
      assert.equal(result.evidence.verifierType, "ts-type-checker");
      assert.match(result.evidence.outputFragment, /Strict type mismatch detected/);
    });
  });

  describe("Class 3: Async & Floating Promises (floating-promises)", () => {
    const directive = {
      id: "ts.async.no-floating-promises",
      mode: "automated-blocking",
    };

    it("passes good fixture with 0 false positives", async () => {
      const goodPath = "evals/fixtures/typescript/good/floating-promises.ts";
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [directive], stack: "typescript" },
        changedScope: [goodPath],
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(result.status, "PASS");
      assert.equal(result.evidence.verifierType, "async-promise-linter");
      assert.match(result.evidence.outputFragment, /0 floating promise violations found/);
    });

    it("detects deliberate violation on bad fixture with 100% detection", async () => {
      const badPath = "evals/fixtures/typescript/bad/floating-promises.ts";
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [directive], stack: "typescript" },
        changedScope: [badPath],
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(result.status, "FAIL");
      assert.equal(result.evidence.verifierType, "async-promise-linter");
      assert.match(result.evidence.outputFragment, /Floating promise detected/);
    });
  });

  describe("Class 4: Boundary Validation (boundary-validation)", () => {
    const directive = {
      id: "ts.runtime-validation.zero-trust-boundaries",
      mode: "automated-blocking",
    };

    it("passes good fixture with 0 false positives", async () => {
      const goodPath = "evals/fixtures/typescript/good/boundary-validation.ts";
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [directive], stack: "typescript" },
        changedScope: [goodPath],
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(result.status, "PASS");
      assert.equal(result.evidence.verifierType, "runtime-validation-linter");
      assert.match(result.evidence.outputFragment, /All boundary data parsing conforms/);
    });

    it("detects deliberate violation on bad fixture with 100% detection", async () => {
      const badPath = "evals/fixtures/typescript/bad/boundary-validation.ts";
      const [result] = await typeScriptAdapter.evaluate({
        binding: { directives: [directive], stack: "typescript" },
        changedScope: [badPath],
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(result.status, "FAIL");
      assert.equal(result.evidence.verifierType, "runtime-validation-linter");
      assert.match(result.evidence.outputFragment, /Unvalidated boundary cast detected/);
    });
  });

  describe("Complete Multi-Class Conformance Evaluation (AC-05)", () => {
    const multiBinding = {
      id: "bind-paired-suite",
      bindingHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      stack: "typescript",
      directives: [
        { id: "ts.type-safety.ban-any", mode: "automated-blocking" },
        { id: "ts.type-safety.strict-compiler-settings", mode: "automated-blocking" },
        { id: "ts.async.no-floating-promises", mode: "automated-blocking" },
        { id: "ts.runtime-validation.zero-trust-boundaries", mode: "automated-blocking" },
      ],
    };

    it("achieves 100% PASS across all 4 positive fixtures", async () => {
      const allGoodFiles = [
        "evals/fixtures/typescript/good/ban-any.ts",
        "evals/fixtures/typescript/good/strict-compiler.ts",
        "evals/fixtures/typescript/good/floating-promises.ts",
        "evals/fixtures/typescript/good/boundary-validation.ts",
      ];

      const report = await evaluateConformance({
        binding: multiBinding,
        changedScope: allGoodFiles,
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(report.verdict, "PASS");
      assert.equal(report.summary.failed, 0);
      assert.equal(report.summary.passed, 4);
    });

    it("achieves 100% defect detection across all 4 negative fixtures", async () => {
      const allBadFiles = [
        "evals/fixtures/typescript/bad/ban-any.ts",
        "evals/fixtures/typescript/bad/strict-compiler.ts",
        "evals/fixtures/typescript/bad/floating-promises.ts",
        "evals/fixtures/typescript/bad/boundary-validation.ts",
      ];

      const report = await evaluateConformance({
        binding: multiBinding,
        changedScope: allBadFiles,
        capabilities: { fixtureMode: true, tools: {} },
      });

      assert.equal(report.verdict, "FAIL");
      assert.equal(report.summary.failed, 4);
      assert.equal(report.summary.passed, 0);
    });
  });
});
