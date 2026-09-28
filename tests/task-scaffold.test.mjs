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
});
