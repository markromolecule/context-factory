import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveContext } from "../../../scripts/context-core.mjs";

describe("Unit 03.01: Resolver Boundaries and Host Guidance (AC-03, AC-07)", () => {
  it("routes actionable requests to expected canonical workflows with transparent reasons", async () => {
    // Feature delivery
    const featRes = await resolveContext("implement user profile avatar upload and storage feature");
    assert.equal(featRes.workflow?.path, "skills/workflows/feature-delivery/SKILL.md");
    assert.ok(featRes.workflow?.reason, "workflow must have an inspectable reason");
    assert.equal(
      featRes.skills.some((s) => s.path.startsWith("skills/workflow-entries/")),
      false,
      "skills must not contain adapter wrapper entries"
    );

    // Defect resolution
    const bugRes = await resolveContext("Fix the checkout defect that charges an order twice when the request is retried");
    assert.equal(bugRes.workflow?.path, "skills/workflows/defect-resolution/SKILL.md");
    assert.ok(bugRes.workflow?.reason, "workflow must have an inspectable reason");
    assert.equal(
      bugRes.skills.some((s) => s.path.startsWith("skills/workflow-entries/")),
      false,
      "skills must not contain adapter wrapper entries"
    );

    // Context maintenance
    const maintRes = await resolveContext("maintain context factory rules and sync manifest");
    assert.equal(maintRes.workflow?.path, "skills/workflows/context-maintenance/SKILL.md");
    assert.ok(maintRes.workflow?.reason, "workflow must have an inspectable reason");
    assert.equal(
      maintRes.skills.some((s) => s.path.startsWith("skills/workflow-entries/")),
      false,
      "skills must not contain adapter wrapper entries"
    );

    // Context maintenance alternative phrasing
    const maintRes2 = await resolveContext("update context factory rules and synchronize manifest");
    assert.equal(maintRes2.workflow?.path, "skills/workflows/context-maintenance/SKILL.md");
    assert.ok(maintRes2.workflow?.reason, "workflow must have an inspectable reason");
    assert.equal(
      maintRes2.skills.some((s) => s.path.startsWith("skills/workflow-entries/")),
      false,
      "skills must not contain adapter wrapper entries"
    );
  });

  it("avoids forcing lifecycle workflows on direct questions and factual queries", async () => {
    // Direct question about plan check
    const planCheckRes = await resolveContext("how do I run plan check?");
    assert.equal(planCheckRes.workflow, null, "how do I run plan check must not force a delivery workflow");

    // Factual query about manifest
    const manifestRes = await resolveContext("What context version is declared in the manifest?");
    assert.equal(manifestRes.workflow, null, "manifest factual query must not force a workflow");

    // Question asking which workflow to use
    const whichRes = await resolveContext("Which workflow should I use for database changes?");
    assert.equal(whichRes.workflow, null, "question about workflow recommendation must not force a workflow");

    // Question asking how a workflow operates
    const explainRes = await resolveContext("How does the defect resolution workflow operate?");
    assert.equal(explainRes.workflow, null, "question explaining workflow operation must not force a workflow");

    // Question listing workflows
    const listRes = await resolveContext("What workflows are available in the repository?");
    assert.equal(listRes.workflow, null, "question asking for available workflows must not force a workflow");
  });

  it("avoids unjustified confident workflow selection on ambiguous requests", async () => {
    // Ambiguous code change with no clear action or target
    const ambigCode = await resolveContext("some general code changes");
    assert.equal(ambigCode.workflow, null, "ambiguous code changes must not select a confident winner");

    // Ambiguous database mention without action
    const ambigDb = await resolveContext("maybe look at the database");
    assert.equal(ambigDb.workflow, null, "vague database mention must not select database-migration");

    // Ambiguous architecture query without action
    const ambigArch = await resolveContext("general thoughts on architecture");
    assert.equal(ambigArch.workflow, null, "general architecture query must not select architecture-change");
  });

  it("routes Claude Code and Codex native host workflow commands deterministically", async () => {
    // Claude Code native invocation (/workflow-<slug>)
    const claudeFeat = await resolveContext("/workflow-feature-delivery add export to CSV button");
    assert.equal(claudeFeat.workflow?.path, "skills/workflows/feature-delivery/SKILL.md");
    assert.ok(claudeFeat.workflow?.reason.includes("feature-delivery"));
    assert.equal(claudeFeat.skills.some((s) => s.path.startsWith("skills/workflow-entries/")), false);

    const claudeBug = await resolveContext("/workflow-defect-resolution login button not working");
    assert.equal(claudeBug.workflow?.path, "skills/workflows/defect-resolution/SKILL.md");
    assert.ok(claudeBug.workflow?.reason.includes("defect-resolution"));
    assert.equal(claudeBug.skills.some((s) => s.path.startsWith("skills/workflow-entries/")), false);

    // Codex native invocation ($workflow-<slug>)
    const codexFeat = await resolveContext("$workflow-feature-delivery add users table");
    assert.equal(codexFeat.workflow?.path, "skills/workflows/feature-delivery/SKILL.md", "Codex command must route to feature-delivery, not context-maintenance");
    assert.ok(codexFeat.workflow?.reason.includes("feature-delivery"));
    assert.equal(codexFeat.skills.some((s) => s.path.startsWith("skills/workflow-entries/")), false);

    const codexArch = await resolveContext("$workflow-architecture-change decouple auth provider");
    assert.equal(codexArch.workflow?.path, "skills/workflows/architecture-change/SKILL.md");
    assert.ok(codexArch.workflow?.reason.includes("architecture-change"));
    assert.equal(codexArch.skills.some((s) => s.path.startsWith("skills/workflow-entries/")), false);

    // All 12 canonical slugs via Claude Code and Codex syntax
    const allSlugs = [
      "architecture-change",
      "code-review-and-optimization",
      "commit-push-release",
      "context-maintenance",
      "database-migration",
      "defect-resolution",
      "dependency-upgrade",
      "docs",
      "feature-delivery",
      "new-project-delivery",
      "release-readiness",
      "security-sensitive-change",
    ];

    for (const slug of allSlugs) {
      const claude = await resolveContext(`/workflow-${slug} sample prompt`);
      assert.equal(claude.workflow?.path, `skills/workflows/${slug}/SKILL.md`, `Claude /workflow-${slug} must resolve correctly`);

      const codex = await resolveContext(`$workflow-${slug} sample prompt`);
      assert.equal(codex.workflow?.path, `skills/workflows/${slug}/SKILL.md`, `Codex $workflow-${slug} must resolve correctly`);
    }
  });

  it("preserves backward compatibility with legacy aliases and bracket prefixes", async () => {
    const legacyAliases = [
      { cmd: "/fix regression in parser", expected: "skills/workflows/defect-resolution/SKILL.md" },
      { cmd: "/arch update system boundaries", expected: "skills/workflows/architecture-change/SKILL.md" },
      { cmd: "/migrate add user indexes", expected: "skills/workflows/database-migration/SKILL.md" },
      { cmd: "/sec audit authentication flow", expected: "skills/workflows/security-sensitive-change/SKILL.md" },
      { cmd: "/optimize query performance", expected: "skills/workflows/code-review-and-optimization/SKILL.md" },
      { cmd: "/deps upgrade lodash", expected: "skills/workflows/dependency-upgrade/SKILL.md" },
      { cmd: "/ship deploy release tag", expected: "skills/workflows/commit-push-release/SKILL.md" },
      { cmd: "/release verify release readiness", expected: "skills/workflows/release-readiness/SKILL.md" },
      { cmd: "/sync update manifest and lockfile", expected: "skills/workflows/context-maintenance/SKILL.md" },
      { cmd: "/new-project build greenfield service", expected: "skills/workflows/new-project-delivery/SKILL.md" },
      { cmd: "/doc generate system report", expected: "skills/workflows/docs/SKILL.md" },
      { cmd: "/plan scaffold new service", expected: "skills/workflows/feature-delivery/SKILL.md" },
      { cmd: "[BUG] crash on null token", expected: "skills/workflows/defect-resolution/SKILL.md" },
      { cmd: "[ADR] storage format choice", expected: "skills/workflows/architecture-change/SKILL.md" },
    ];

    for (const { cmd, expected } of legacyAliases) {
      const res = await resolveContext(cmd);
      assert.equal(res.workflow?.path, expected, `${cmd} must resolve to ${expected}`);
    }
  });

  it("never includes workflow entry adapter wrappers in selected skills", async () => {
    const requests = [
      "workflow defect resolution",
      "explain the feature delivery workflow",
      "fix broken login button",
      "implement user profile",
      "maintain context factory",
      "some general code changes",
      "/workflow-defect-resolution fix error",
    ];

    for (const req of requests) {
      const res = await resolveContext(req);
      const adapterSkills = res.skills.filter((s) => s.path.startsWith("skills/workflow-entries/"));
      assert.deepEqual(
        adapterSkills,
        [],
        `Request "${req}" must not include workflow entry adapters in skills, got: ${adapterSkills.map((s) => s.path).join(", ")}`
      );
    }
  });
});
