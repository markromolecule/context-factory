import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { scaffoldTask } from "../scripts/task-workflow.mjs";

describe("Unit 01.01: scaffoldTask Nested Phase and Unit Structure", () => {
  it("scaffolds nested phase directories and starter units in dryRun mode", async () => {
    const res = await scaffoldTask({
      title: "User Authentication Service",
      type: "feature",
      dryRun: true,
    });

    assert.ok(res.taskId, "taskId must be returned");
    assert.ok(res.taskDirectory, "taskDirectory must be returned");
    assert.ok(Array.isArray(res.files), "files array must be returned");

    // Must have README.md
    assert.ok(
      res.files.some((f) => f.endsWith("README.md")),
      "Must include task README.md"
    );

    // Must NOT have flat phase files like phase-01-discovery-and-scenarios.md
    const flatPhaseFiles = res.files.filter((f) => /\/phase-\d{2}-[a-z0-9-]+\.md$/i.test(f));
    assert.equal(
      flatPhaseFiles.length,
      0,
      `Should not contain flat phase files, found: ${flatPhaseFiles.join(", ")}`
    );

    // Must contain nested phase.md files
    const nestedPhaseFiles = res.files.filter((f) => /\/phase-\d{2}-[a-z0-9-]+\/phase\.md$/i.test(f));
    assert.equal(nestedPhaseFiles.length, 4, "Feature task must generate 4 nested phase.md files");

    // Must contain nested starter unit files
    const starterUnitFiles = res.files.filter((f) => /\/phase-\d{2}-[a-z0-9-]+\/unit-01-[a-z0-9-]+\.md$/i.test(f));
    assert.equal(starterUnitFiles.length, 4, "Feature task must generate 4 starter unit-01-*.md files");
  });

  it("Unit 01.02: interpolates branch, worktree, and topology tables without unparsed braces", async () => {
    const res = await scaffoldTask({
      title: "Data Cache Optimization",
      type: "feature",
      dryRun: true,
    });

    assert.ok(res.renderedFiles, "Must return renderedFiles array");

    const readme = res.renderedFiles.find((f) => f.path.endsWith("README.md"));
    assert.ok(readme, "Must contain README.md");
    assert.match(readme.content, new RegExp(`base_branch:\\s*"task/${res.taskId}-${res.taskSlug}"`));
    assert.match(readme.content, /## Worktree & Branch Topology/);
    assert.match(readme.content, new RegExp(`task/${res.taskId}/phase-01/unit-01-discovery-and-scenarios`));
    assert.match(readme.content, new RegExp(`\\.worktrees/${res.taskId}/phase-01/unit-01-discovery-and-scenarios`));

    const phase1 = res.renderedFiles.find((f) => f.path.includes("phase-01-") && f.path.endsWith("phase.md"));
    assert.ok(phase1, "Must contain phase-01 phase.md");
    assert.match(phase1.content, new RegExp(`phase_branch:\\s*"task/${res.taskFolderName}/phase-01"`));
    assert.match(phase1.content, /## Unit Index & Worktree Allocation/);
    assert.match(phase1.content, new RegExp(`\\.worktrees/${res.taskId}/phase-01/unit-01-discovery-and-scenarios`));

    const unit1 = res.renderedFiles.find((f) => f.path.includes("phase-01-") && f.path.includes("unit-01-"));
    assert.ok(unit1, "Must contain unit-01 file");
    assert.match(unit1.content, new RegExp(`branch:\\s*"task/${res.taskId}/phase-01/unit-01-discovery-and-scenarios"`));
    assert.match(unit1.content, new RegExp(`worktree:\\s*"\\.worktrees/${res.taskId}/phase-01/unit-01-discovery-and-scenarios"`));
    assert.match(unit1.content, new RegExp(`> Worktree: \\.worktrees/${res.taskId}/phase-01/unit-01-discovery-and-scenarios · Branch: task/${res.taskId}/phase-01/unit-01-discovery-and-scenarios`));

    // Verify zero unparsed double braces in any file
    for (const f of res.renderedFiles) {
      const unparsed = f.content.match(/\{\{[^}]+\}\}/g);
      assert.equal(
        unparsed,
        null,
        `File ${f.path} contains unparsed template tags: ${unparsed?.join(", ")}`
      );
    }
  });

  it("Unit 02.01: supports includeUnits: false to suppress unit scaffolding and returns empty units", async () => {
    const res = await scaffoldTask({
      title: "Task Without Units",
      type: "feature",
      dryRun: true,
      includeUnits: false,
    });

    assert.ok(res.baseBranch, "Must return baseBranch");
    assert.deepEqual(res.units, [], "Units array must be empty when includeUnits: false");

    const unitFiles = res.files.filter((f) => f.includes("/unit-"));
    assert.equal(unitFiles.length, 0, "No unit files should be in files list");

    const phaseFiles = res.files.filter((f) => f.endsWith("phase.md"));
    assert.equal(phaseFiles.length, 4, "Phases must still be generated");
  });

  it("Unit 02.01: includes populated units array and baseBranch by default", async () => {
    const res = await scaffoldTask({
      title: "Task With Units",
      type: "feature",
      dryRun: true,
    });

    assert.ok(res.baseBranch);
    assert.equal(res.units.length, 4, "Must return 4 starter units");
    assert.equal(res.units[0].id, "01.01");
    assert.ok(res.units[0].branch.includes("/phase-01/unit-01-"));
    assert.ok(res.units[0].worktree.includes(".worktrees/"));
  });
});

