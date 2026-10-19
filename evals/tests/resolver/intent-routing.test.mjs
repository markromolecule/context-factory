import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveContext } from "../../../scripts/context-core.mjs";

const knowledge = (selection) => selection.selectedPaths.filter((path) => path.startsWith("knowledge/"));
const paths = (entries) => entries.map((entry) => entry.path);

describe("Unit 02.01: intent and knowledge routing", () => {
  it("keeps a direct workflow question small and selects one relevant procedure", async () => {
    const selection = await resolveContext("What is the plan workflow?");
    assert.equal(selection.workflow, null);
    assert.deepEqual(paths(selection.skills), ["skills/productivity/plan/SKILL.md"]);
    assert.deepEqual(knowledge(selection), []);
    assert.ok(paths(selection.rules).includes("rules/global/evidence-and-claims.md"));
    assert.ok(selection.budget.estimatedTokens <= 9000, String(selection.budget.estimatedTokens));
    assert.equal(selection.budget.intent, "direct-question");
    assert.equal(selection.budget.totalStatus, "optimal");
  });

  it("keeps investigation context smaller than the direct-question baseline", async () => {
    const selection = await resolveContext("Investigate why the order service fails", {
      stack: "typescript", scope: ["src/order.ts"],
    });
    assert.equal(selection.workflow, null);
    assert.deepEqual(knowledge(selection), []);
    assert.ok(paths(selection.rules).includes("rules/global/evidence-and-claims.md"));
    assert.ok(selection.budget.estimatedTokens <= 8000, String(selection.budget.estimatedTokens));
    assert.equal(selection.budget.intent, "investigation");
  });

  it("keeps defect workflow and security obligations without all knowledge", async () => {
    const selection = await resolveContext("Fix authorization bug in order service", {
      stack: "typescript", scope: ["src/order.ts"],
    });
    assert.equal(selection.workflow?.path, "skills/workflows/defect-resolution/SKILL.md");
    assert.ok(paths(selection.rules).includes("rules/global/security-guardrails.md"));
    assert.ok(paths(selection.rules).includes("rules/global/evidence-and-claims.md"));
    assert.deepEqual(knowledge(selection), []);
    assert.deepEqual(paths(selection.skills), ["skills/engineering/security/SKILL.md"]);
    assert.ok(selection.budget.estimatedTokens <= 16000, String(selection.budget.estimatedTokens));
    assert.equal(selection.budget.intent, "defect");
    assert.ok(selection.rules.every((entry) => entry.reason));
  });

  it("routes an explicit plan trigger to its procedure within a plan budget", async () => {
    const selection = await resolveContext("/plan TypeScript payment feature");
    assert.equal(selection.workflow?.path, "skills/workflows/feature-delivery/SKILL.md");
    assert.deepEqual(paths(selection.skills), ["skills/productivity/plan/SKILL.md"]);
    assert.deepEqual(knowledge(selection), []);
    assert.ok(selection.budget.estimatedTokens <= 14000, String(selection.budget.estimatedTokens));
    assert.equal(selection.budget.intent, "plan");
  });

  it("routes an explicit execute trigger to execute without unrelated planning skills", async () => {
    const selection = await resolveContext("/execute approved plan for order service", {
      stack: "typescript", scope: ["src/order.ts"],
    });
    assert.deepEqual(paths(selection.skills), ["skills/engineering/execute/SKILL.md"]);
    assert.deepEqual(knowledge(selection), []);
    assert.ok(selection.budget.estimatedTokens <= 16000, String(selection.budget.estimatedTokens));
    assert.equal(selection.budget.intent, "execution");
  });

  it("keeps an unscoped feature request within a material budget while retaining global gates", async () => {
    const selection = await resolveContext("Deliver a new user profile dashboard feature with notification preferences");
    assert.equal(selection.workflow?.path, "skills/workflows/feature-delivery/SKILL.md");
    assert.ok(paths(selection.rules).includes("rules/global/architecture-conformance.md"));
    assert.ok(paths(selection.rules).includes("rules/global/code-quality.md"));
    assert.ok(paths(selection.skills).includes("skills/productivity/plan/SKILL.md"));
    assert.deepEqual(knowledge(selection), []);
    assert.ok(selection.budget.estimatedTokens <= 18000, String(selection.budget.estimatedTokens));
  });

  it("loads only named canonical principles on demand", async () => {
    const selection = await resolveContext("Explain KISS and YAGNI");
    assert.deepEqual(knowledge(selection), [
      "knowledge/principles/kiss.md",
      "knowledge/principles/yagni.md",
    ]);
  });

  it("keeps an explicit workflow trigger", async () => {
    const selection = await resolveContext("/workflow-feature-delivery build a feature", {
      stack: "typescript", scope: ["src/feature.ts"],
    });
    assert.equal(selection.workflow?.path, "skills/workflows/feature-delivery/SKILL.md");
  });
});
