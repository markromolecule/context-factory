import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  registerAdapter,
  clearAdapters,
  getAdapter,
} from "../../../orchestrator/conformance/adapter-contract.mjs";
import {
  validateWaiver,
  isHumanAuthority,
  matchesWaiverScope,
} from "../../../orchestrator/conformance/waiver-policy.mjs";
import {
  evaluateDirectiveEvidence,
  aggregateConformanceResults,
} from "../../../orchestrator/conformance/evidence-gate.mjs";
import {
  evaluateConformance,
  verifyReportFreshness,
} from "../../../orchestrator/conformance/conformance-orchestrator.mjs";

const HASH_64_A = "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const HASH_64_B = "sha256:fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210";

const sampleBinding = {
  id: "bind-ts-service-001",
  bindingHash: HASH_64_A,
  stack: "typescript",
  affectedScope: ["src/services/auth.ts"],
  directives: [
    {
      id: "ts.type-safety.ban-any",
      mode: "automated-blocking",
      rulePath: "rules/typescript/common/type-safety.md",
      contentHash: HASH_64_B,
    },
    {
      id: "ts.architecture.module-boundary",
      mode: "evidence-blocking",
      rulePath: "rules/typescript/common/explicit-boundaries.md",
      contentHash: HASH_64_B,
    },
    {
      id: "ts.style.naming",
      mode: "advisory",
      rulePath: "rules/typescript/common/type-safety.md",
      contentHash: HASH_64_B,
    },
  ],
};

const validHumanWaiver = {
  id: "waiver-001",
  directiveId: "ts.type-safety.ban-any",
  scope: ["src/services/auth.ts"],
  authorizedBy: "senior.engineer@example.com",
  authorizedAt: "2026-10-06T10:00:00.000Z",
  rationale: "Interfacing with untyped legacy C++ addon requires explicit any wrapper.",
  compensatingEvidence: "Covered by 100% end-to-end integration tests in evals/auth.test.mjs.",
  expiresAt: "2026-12-31T23:59:59.000Z",
  status: "active",
};

describe("Unit 03.01: AC-06 Waiver Policy & Authority Verification", () => {
  it("passes valid human-authorized waiver with specific scope and compensating evidence", async () => {
    const valid = await validateWaiver(validHumanWaiver);
    assert.equal(valid, true);
  });

  it("strictly rejects agent or self-approved authorization (D-03, AC-06, SC-06)", async () => {
    assert.equal(isHumanAuthority("ai-assistant"), false);
    assert.equal(isHumanAuthority("copilot"), false);
    assert.equal(isHumanAuthority("context-factory-agent"), false);
    assert.equal(isHumanAuthority("self-approved"), false);
    assert.equal(isHumanAuthority("alex.developer@example.com"), true);

    const agentWaiver = {
      ...validHumanWaiver,
      id: "waiver-agent-bad",
      authorizedBy: "ai-copilot",
    };

    await assert.rejects(
      async () => validateWaiver(agentWaiver),
      /Only named human maintainers may authorize waivers/
    );
  });

  it("rejects expired waivers and past expiresAt timestamps", async () => {
    const expiredWaiver = {
      ...validHumanWaiver,
      id: "waiver-expired",
      status: "expired",
    };

    await assert.rejects(
      async () => validateWaiver(expiredWaiver),
      /is not active/
    );

    const pastExpiryWaiver = {
      ...validHumanWaiver,
      id: "waiver-past-date",
      expiresAt: "2020-01-01T00:00:00.000Z",
    };

    await assert.rejects(
      async () => validateWaiver(pastExpiryWaiver, { now: new Date("2026-10-06T12:00:00.000Z") }),
      /has expired/
    );
  });

  it("rejects overly broad wildcard scope and missing compensating evidence", async () => {
    const wildcardWaiver = {
      ...validHumanWaiver,
      id: "waiver-wildcard",
      scope: ["*"],
    };

    await assert.rejects(
      async () => validateWaiver(wildcardWaiver),
      /overly broad wildcard scope/
    );

    const noEvidenceWaiver = {
      ...validHumanWaiver,
      id: "waiver-no-evidence",
      compensatingEvidence: "   ",
    };

    await assert.rejects(
      async () => validateWaiver(noEvidenceWaiver),
      /must document non-empty compensating evidence/
    );
  });

  it("verifies exact scope matching and prevents scope bleeding", () => {
    assert.equal(matchesWaiverScope(["src/services/auth.ts"], "src/services/auth.ts"), true);
    assert.equal(matchesWaiverScope(["src/services/auth.ts"], "src/services/user.ts"), false);
    assert.equal(matchesWaiverScope(["src/legacy/*"], "src/legacy/parser.ts"), true);
    assert.equal(matchesWaiverScope(["src/legacy/*"], "src/modern/parser.ts"), false);
  });
});

describe("Unit 03.01: AC-05 Evidence Gate & State Aggregation", () => {
  it("preserves distinct states: PASS, FAIL, WAIVED, NOT_AUTOMATABLE, TOOL_UNAVAILABLE, UNSUPPORTED", async () => {
    const now = new Date().toISOString();
    const results = [
      {
        directiveId: "d1",
        status: "PASS",
        mode: "automated-blocking",
        evidence: { verifierType: "tsc", exitCode: 0 },
        evaluatedAt: now,
      },
      {
        directiveId: "d2",
        status: "FAIL",
        mode: "automated-blocking",
        evidence: { verifierType: "tsc", exitCode: 1, outputFragment: "Type error" },
        evaluatedAt: now,
      },
      {
        directiveId: "d3",
        status: "WAIVED",
        mode: "automated-blocking",
        evidence: { verifierType: "human-waiver", waiverId: "w1" },
        evaluatedAt: now,
      },
      {
        directiveId: "d4",
        status: "NOT_AUTOMATABLE",
        mode: "advisory",
        evidence: { verifierType: "manual" },
        evaluatedAt: now,
      },
      {
        directiveId: "d5",
        status: "TOOL_UNAVAILABLE",
        mode: "automated-blocking",
        evidence: { verifierType: "missing-tool" },
        evaluatedAt: now,
      },
      {
        directiveId: "d6",
        status: "UNSUPPORTED",
        mode: "unsupported",
        evidence: { verifierType: "none" },
        evaluatedAt: now,
      },
    ];

    const report = await aggregateConformanceResults({
      bindingId: "test-bind",
      bindingHash: HASH_64_A,
      diffHash: HASH_64_B,
      results,
    });

    assert.equal(report.summary.passed, 1);
    assert.equal(report.summary.failed, 1);
    assert.equal(report.summary.waived, 1);
    assert.equal(report.summary.notAutomatable, 1);
    assert.equal(report.summary.toolUnavailable, 1);
    assert.equal(report.summary.unsupported, 1);
    assert.equal(report.summary.total, 6);
    assert.equal(report.verdict, "FAIL"); // Failing blocking directive causes FAIL
  });

  it("causes BLOCKED verdict when an automated tool is unavailable (never downgraded to advisory)", async () => {
    const now = new Date().toISOString();
    const results = [
      {
        directiveId: "d1",
        status: "TOOL_UNAVAILABLE",
        mode: "automated-blocking",
        evidence: { verifierType: "missing-tool", outputFragment: "tsc not found" },
        evaluatedAt: now,
      },
    ];

    const report = await aggregateConformanceResults({
      bindingId: "test-bind",
      bindingHash: HASH_64_A,
      diffHash: HASH_64_B,
      results,
    });

    assert.equal(report.verdict, "BLOCKED");
    assert.equal(report.summary.toolUnavailable, 1);
  });

  it("SC-05: requires named human evidence for evidence-blocking directives", async () => {
    const now = new Date().toISOString();

    // Missing human evidence -> BLOCKED
    const missingEvidenceResult = {
      directiveId: "d-arch-01",
      status: "PASS",
      mode: "evidence-blocking",
      evidence: { verifierType: "human-judgment" }, // lacks humanEvidence string
      evaluatedAt: now,
    };

    const evalMissing = evaluateDirectiveEvidence(missingEvidenceResult);
    assert.equal(evalMissing.satisfied, false);
    assert.equal(evalMissing.isBlocked, true);

    // With named human evidence -> SATISFIED
    const withEvidenceResult = {
      directiveId: "d-arch-01",
      status: "PASS",
      mode: "evidence-blocking",
      evidence: {
        verifierType: "human-judgment",
        humanEvidence: "Reviewed and approved by Staff Architect @sam: boundaries conform to ADR-0029.",
      },
      evaluatedAt: now,
    };

    const evalWithEvidence = evaluateDirectiveEvidence(withEvidenceResult);
    assert.equal(evalWithEvidence.satisfied, true);
  });

  it("calculates enforced coverage excluding unsupported and advisory rules", async () => {
    const now = new Date().toISOString();
    const results = [
      {
        directiveId: "d-block-1",
        status: "PASS",
        mode: "automated-blocking",
        evidence: { verifierType: "tool", exitCode: 0 },
        evaluatedAt: now,
      },
      {
        directiveId: "d-adv-1",
        status: "FAIL",
        mode: "advisory",
        evidence: { verifierType: "lint" },
        evaluatedAt: now,
      },
      {
        directiveId: "d-unsupp-1",
        status: "UNSUPPORTED",
        mode: "unsupported",
        evidence: { verifierType: "none" },
        evaluatedAt: now,
      },
    ];

    const report = await aggregateConformanceResults({
      bindingId: "test-bind",
      bindingHash: HASH_64_A,
      diffHash: HASH_64_B,
      results,
    });

    assert.equal(report.verdict, "PASS"); // Advisory fail does not block
    assert.equal(report._enforcedCoverage.enforcedTotal, 1);
    assert.equal(report._enforcedCoverage.enforcedPassed, 1);
    assert.equal(report._enforcedCoverage.coveragePercentage, 100);
  });
});

describe("Unit 03.01: Adapter Port Contract & Inversion (LSP / DIP)", () => {
  beforeEach(() => {
    clearAdapters();
  });

  it("registers valid adapter and resolves by stack", () => {
    const mockAdapter = {
      id: "mock-ts-adapter",
      stack: "typescript",
      canHandle: (binding) => binding.stack === "typescript",
      evaluate: async () => [],
    };

    registerAdapter(mockAdapter);
    assert.equal(getAdapter("typescript"), mockAdapter);
    assert.equal(getAdapter({ stack: "typescript" }), mockAdapter);
    assert.equal(getAdapter("laravel"), null);
  });

  it("substitutes fake adapter and derives PASS report with valid schema", async () => {
    const fakeAdapter = {
      id: "fake-adapter",
      stack: "typescript",
      canHandle: () => true,
      evaluate: async ({ binding }) => {
        const now = new Date().toISOString();
        return binding.directives.map((d) => ({
          directiveId: d.id,
          status: "PASS",
          mode: d.mode,
          evidence: {
            verifierType: "mock-verifier",
            exitCode: 0,
            outputFragment: "All checks passed.",
            humanEvidence: d.mode === "evidence-blocking" ? "Human review completed by senior engineer" : undefined,
          },
          durationMs: 15,
          evaluatedAt: now,
        }));
      },
    };

    registerAdapter(fakeAdapter);

    const report = await evaluateConformance({
      binding: sampleBinding,
      changedScope: ["src/services/auth.ts"],
      diffHash: HASH_64_B,
    });

    assert.equal(report.verdict, "PASS");
    assert.equal(report.summary.passed, 3);
    assert.equal(report.summary.failed, 0);
  });

  it("converts thrown adapter error into graceful FAIL report without crash", async () => {
    const crashingAdapter = {
      id: "crashing-adapter",
      stack: "typescript",
      canHandle: () => true,
      evaluate: async () => {
        throw new Error("Unexpected crash inside adapter subprocess");
      },
    };

    registerAdapter(crashingAdapter);

    const report = await evaluateConformance({
      binding: sampleBinding,
      changedScope: ["src/services/auth.ts"],
      diffHash: HASH_64_B,
    });

    assert.equal(report.verdict, "FAIL");
    assert.ok(report.results.every((r) => r.status === "FAIL"));
    assert.match(report.results[0].evidence.outputFragment, /Unexpected crash inside adapter/);
  });

  it("applies active human waiver to failing directive and flips verdict to PASS", async () => {
    const failingAdapter = {
      id: "failing-adapter",
      stack: "typescript",
      canHandle: () => true,
      evaluate: async ({ binding }) => {
        const now = new Date().toISOString();
        return [
          {
            directiveId: "ts.type-safety.ban-any",
            status: "FAIL",
            mode: "automated-blocking",
            evidence: { verifierType: "tsc", exitCode: 1, outputFragment: "Found unexpected any" },
            evaluatedAt: now,
          },
          {
            directiveId: "ts.architecture.module-boundary",
            status: "PASS",
            mode: "evidence-blocking",
            evidence: { verifierType: "human-judgment", humanEvidence: "Approved by arch lead" },
            evaluatedAt: now,
          },
        ];
      },
    };

    registerAdapter(failingAdapter);

    // Without waiver: FAIL
    const reportNoWaiver = await evaluateConformance({
      binding: sampleBinding,
      changedScope: ["src/services/auth.ts"],
      diffHash: HASH_64_B,
      waivers: [],
    });
    assert.equal(reportNoWaiver.verdict, "FAIL");

    // With active human waiver: PASS (WAIVED)
    const reportWithWaiver = await evaluateConformance({
      binding: sampleBinding,
      changedScope: ["src/services/auth.ts"],
      diffHash: HASH_64_B,
      waivers: [validHumanWaiver],
    });

    assert.equal(reportWithWaiver.verdict, "PASS");
    assert.equal(reportWithWaiver.summary.waived, 1);
    assert.equal(reportWithWaiver.summary.failed, 0);
    assert.equal(reportWithWaiver.results.find((r) => r.directiveId === "ts.type-safety.ban-any").status, "WAIVED");
  });
});

describe("Unit 03.01: Report Freshness & Hash Invalidation", () => {
  it("verifies report freshness against binding and diff hashes", () => {
    const report = {
      bindingHash: HASH_64_A,
      diffHash: HASH_64_B,
    };

    assert.equal(verifyReportFreshness({ report, currentBindingHash: HASH_64_A, currentDiffHash: HASH_64_B }), true);
    assert.equal(verifyReportFreshness({ report, currentBindingHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000", currentDiffHash: HASH_64_B }), false);
    assert.equal(verifyReportFreshness({ report, currentBindingHash: HASH_64_A, currentDiffHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000" }), false);
  });
});
