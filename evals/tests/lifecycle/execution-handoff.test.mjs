import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, `file://${process.cwd()}/`), "utf8");

describe("reviewed execution handoff", () => {
  it("requires a verified packet and forbids direct task-plan reads", async () => {
    const execute = await read("skills/engineering/execute/SKILL.md");
    assert.match(execute, /handoff:verify-packet/);
    assert.match(execute, /Do not read `docs\/tasks\//);
    assert.doesNotMatch(execute, /worktree remove --force/);
  });
  it("preserves dirty worktrees and retains checkpoints", async () => {
    const execute = await read("skills/engineering/execute/SKILL.md");
    assert.match(execute, /residual paths and stop/);
    assert.match(execute, /Stop after every ready batch and phase/);
  });
  it("makes plan-review issue only approved packets", async () => {
    const review = await read("skills/productivity/plan-review/SKILL.md");
    assert.match(review, /handoff:issue-packet/);
    assert.match(review, /missing approval.*stops review/i);
  });
});
