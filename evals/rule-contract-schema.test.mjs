import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateSchema, loadSchema, ValidationError, assertValid } from "../orchestrator/validator.mjs";

describe("Unit 01.01: Schema and Validation Contracts", () => {
  describe("Extended Draft-07 Validator Primitives", () => {
    it("enforces string minLength", () => {
      const schema = { type: "string", minLength: 1 };
      assert.equal(validateSchema("", schema).valid, false);
      assert.equal(validateSchema("valid", schema).valid, true);
    });

    it("enforces string pattern regex", () => {
      const schema = { type: "string", pattern: "^[a-z]+-[0-9]+$" };
      assert.equal(validateSchema("invalid_string", schema).valid, false);
      assert.equal(validateSchema("rule-123", schema).valid, true);
    });

    it("enforces array uniqueItems", () => {
      const schema = { type: "array", items: { type: "string" }, uniqueItems: true };
      assert.equal(validateSchema(["a", "b", "a"], schema).valid, false);
      assert.equal(validateSchema(["a", "b", "c"], schema).valid, true);
    });

    it("enforces object additionalProperties: false", () => {
      const schema = {
        type: "object",
        properties: {
          allowed: { type: "string" }
        },
        additionalProperties: false
      };
      assert.equal(validateSchema({ allowed: "yes", forbidden: "no" }, schema).valid, false);
      assert.equal(validateSchema({ allowed: "yes" }, schema).valid, true);
    });

    it("enforces const keyword value equality", () => {
      const schema = { const: "exact-value" };
      assert.equal(validateSchema("wrong-value", schema).valid, false);
      assert.equal(validateSchema("exact-value", schema).valid, true);
    });
  });

  describe("Contract: rule-descriptor.schema.json", () => {
    it("accepts canonical rule descriptor", async () => {
      const schema = await loadSchema("rule-descriptor.schema.json");
      const validDescriptor = {
        id: "cf-rule-typescript-type-safety",
        rulePath: "rules/typescript/common/type-safety.md",
        title: "TypeScript Strict Type Safety",
        stack: "typescript",
        description: "Enforce strict types and prevent any leakage.",
        sourceHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        version: 1,
        directives: [
          {
            id: "cf-dir-no-explicit-any",
            title: "No Explicit Any",
            mode: "automated-blocking",
            statement: "Never use the any type in public APIs or exported interfaces.",
            contentHash: "sha256:abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
            verifier: {
              type: "typechecker",
              command: "npm run typecheck"
            },
            applicability: {
              paths: ["**/*.ts", "**/*.tsx"],
              layers: ["common", "services"],
              workflows: ["feature-delivery", "refactor"]
            }
          }
        ]
      };
      const result = validateSchema(validDescriptor, schema);
      assert.equal(result.valid, true, `Expected valid descriptor, got: ${result.errors.join(", ")}`);
    });

    it("rejects unknown fields via additionalProperties: false", async () => {
      const schema = await loadSchema("rule-descriptor.schema.json");
      const invalid = {
        id: "cf-rule-test",
        rulePath: "rules/test.md",
        title: "Test Rule",
        stack: "global",
        sourceHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        directives: [],
        rogueProperty: "forbidden"
      };
      const result = validateSchema(invalid, schema);
      assert.equal(result.valid, false);
      assert.match(result.errors.join("; "), /additional property "rogueProperty"/i);
    });

    it("rejects invalid enforcement modes", async () => {
      const schema = await loadSchema("rule-descriptor.schema.json");
      const invalid = {
        id: "cf-rule-test",
        rulePath: "rules/test.md",
        title: "Test Rule",
        stack: "global",
        sourceHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        directives: [
          {
            id: "cf-dir-test",
            title: "Test Directive",
            mode: "optional-suggestion", // invalid mode
            statement: "Do something",
            contentHash: "sha256:abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
          }
        ]
      };
      const result = validateSchema(invalid, schema);
      assert.equal(result.valid, false);
    });
  });

  describe("Contract: rule-binding.schema.json", () => {
    it("accepts canonical rule binding manifest", async () => {
      const schema = await loadSchema("rule-binding.schema.json");
      const validBinding = {
        id: "binding-20261006-0001",
        taskId: "0001",
        phase: "01",
        unit: "01.01",
        stack: "typescript",
        workflow: "feature-delivery",
        affectedScope: ["src/services/user.ts", "src/models/user.ts"],
        directives: [
          {
            id: "cf-dir-no-explicit-any",
            rulePath: "rules/typescript/common/type-safety.md",
            mode: "automated-blocking",
            contentHash: "sha256:abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
          }
        ],
        waivers: [],
        bindingHash: "sha256:1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff",
        createdAt: "2026-10-06T12:00:00.000Z"
      };
      const result = validateSchema(validBinding, schema);
      assert.equal(result.valid, true, `Expected valid binding, got: ${result.errors.join(", ")}`);
    });

    it("rejects binding with missing required bindingHash or affectedScope", async () => {
      const schema = await loadSchema("rule-binding.schema.json");
      const invalid = {
        id: "binding-20261006-0001",
        taskId: "0001",
        phase: "01",
        unit: "01.01",
        stack: "typescript",
        workflow: "feature-delivery",
        directives: []
      };
      const result = validateSchema(invalid, schema);
      assert.equal(result.valid, false);
    });
  });

  describe("Contract: rule-waiver.schema.json", () => {
    it("accepts canonical human-authorized rule waiver", async () => {
      const schema = await loadSchema("rule-waiver.schema.json");
      const validWaiver = {
        id: "waiver-0001-01",
        directiveId: "cf-dir-no-explicit-any",
        scope: ["src/legacy/compat.ts"],
        authorizedBy: "lead-architect",
        authorizedAt: "2026-10-06T12:00:00.000Z",
        rationale: "Interfacing with un-typed third-party SDK pending upstream type release.",
        compensatingEvidence: "Automated schema runtime validation in adapter layer via Zod.",
        expiresAt: "2026-11-06T00:00:00.000Z",
        status: "active"
      };
      const result = validateSchema(validWaiver, schema);
      assert.equal(result.valid, true, `Expected valid waiver, got: ${result.errors.join(", ")}`);
    });

    it("rejects waiver with blank authorizedBy string (AC-06 / D-03)", async () => {
      const schema = await loadSchema("rule-waiver.schema.json");
      const invalid = {
        id: "waiver-0001-01",
        directiveId: "cf-dir-no-explicit-any",
        scope: ["src/legacy/compat.ts"],
        authorizedBy: "", // blank authority must fail
        authorizedAt: "2026-10-06T12:00:00.000Z",
        rationale: "Some rationale",
        compensatingEvidence: "Some evidence",
        expiresAt: "2026-11-06T00:00:00.000Z",
        status: "active"
      };
      const result = validateSchema(invalid, schema);
      assert.equal(result.valid, false);
      assert.match(result.errors.join("; "), /minLength/i);
    });

    it("rejects waiver missing compensating evidence or rationale", async () => {
      const schema = await loadSchema("rule-waiver.schema.json");
      const invalid = {
        id: "waiver-0001-01",
        directiveId: "cf-dir-no-explicit-any",
        scope: ["src/legacy/compat.ts"],
        authorizedBy: "maintainer",
        authorizedAt: "2026-10-06T12:00:00.000Z",
        status: "active"
      };
      const result = validateSchema(invalid, schema);
      assert.equal(result.valid, false);
    });
  });

  describe("Contract: conformance-result.schema.json", () => {
    const validStatuses = [
      "PASS",
      "FAIL",
      "WAIVED",
      "NOT_AUTOMATABLE",
      "TOOL_UNAVAILABLE",
      "UNSUPPORTED"
    ];

    for (const status of validStatuses) {
      it(`accepts canonical conformance result with status ${status}`, async () => {
        const schema = await loadSchema("conformance-result.schema.json");
        const validResult = {
          directiveId: "cf-dir-no-explicit-any",
          status,
          mode: "automated-blocking",
          evidence: {
            verifierType: "typechecker",
            command: "npm run typecheck",
            exitCode: status === "FAIL" ? 1 : 0,
            outputFragment: status === "FAIL" ? "error TS2322: Type 'any' not assignable" : "0 errors"
          },
          durationMs: 120,
          evaluatedAt: "2026-10-06T12:05:00.000Z"
        };
        const res = validateSchema(validResult, schema);
        assert.equal(res.valid, true, `Status ${status} should be valid, errors: ${res.errors.join(", ")}`);
      });
    }

    it("rejects non-canonical status such as SUCCESS or SKIPPED", async () => {
      const schema = await loadSchema("conformance-result.schema.json");
      const invalid = {
        directiveId: "cf-dir-no-explicit-any",
        status: "SUCCESS",
        mode: "automated-blocking",
        evidence: { verifierType: "typechecker" },
        evaluatedAt: "2026-10-06T12:05:00.000Z"
      };
      const res = validateSchema(invalid, schema);
      assert.equal(res.valid, false);
      assert.match(res.errors.join("; "), /enum/i);
    });
  });

  describe("Contract: conformance-report.schema.json", () => {
    it("accepts canonical conformance report", async () => {
      const schema = await loadSchema("conformance-report.schema.json");
      const validReport = {
        id: "report-20261006-0001",
        bindingId: "binding-20261006-0001",
        bindingHash: "sha256:1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff",
        diffHash: "sha256:9999888877776666555544443333222211110000ffffeeeeddddccccbbbbaaaa",
        verdict: "PASS",
        summary: {
          passed: 1,
          failed: 0,
          waived: 0,
          notAutomatable: 0,
          toolUnavailable: 0,
          unsupported: 0,
          total: 1
        },
        results: [
          {
            directiveId: "cf-dir-no-explicit-any",
            status: "PASS",
            mode: "automated-blocking",
            evidence: {
              verifierType: "typechecker",
              command: "npm run typecheck",
              exitCode: 0,
              outputFragment: "Found 0 errors."
            },
            evaluatedAt: "2026-10-06T12:05:00.000Z"
          }
        ],
        generatedAt: "2026-10-06T12:05:01.000Z"
      };
      const res = validateSchema(validReport, schema);
      assert.equal(res.valid, true, `Report should be valid: ${res.errors.join(", ")}`);
    });

    it("rejects conformance report with invalid verdict", async () => {
      const schema = await loadSchema("conformance-report.schema.json");
      const invalid = {
        id: "report-20261006-0001",
        bindingId: "binding-20261006-0001",
        bindingHash: "sha256:1111",
        diffHash: "sha256:2222",
        verdict: "APPROVED", // invalid verdict
        summary: { passed: 0, failed: 0, waived: 0, notAutomatable: 0, toolUnavailable: 0, unsupported: 0, total: 0 },
        results: [],
        generatedAt: "2026-10-06T12:05:01.000Z"
      };
      const res = validateSchema(invalid, schema);
      assert.equal(res.valid, false);
      assert.match(res.errors.join("; "), /verdict/i);
    });
  });
});
