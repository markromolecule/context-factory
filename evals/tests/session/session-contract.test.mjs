import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { frontmatter } from "../../../scripts/context-core.mjs";

const root = process.cwd();
const skillPath = join(root, "skills/productivity/session/SKILL.md");
const sharedPath = join(root, "orchestrator/SHARED.md");

describe("Unit 03.01: Session Productivity Skill & Shared Contract", () => {
  it("Skill file exists with valid frontmatter and aliases", async () => {
    await access(skillPath);
    const content = await readFile(skillPath, "utf8");
    const meta = frontmatter(content);
    assert.ok(meta, "Skill must have valid YAML frontmatter");
    assert.equal(meta.name, "session", "Skill name must be 'session'");
    assert.ok(meta.description, "Skill must have description");
    assert.match(meta.description, /\/session/, "Description must mention /session");
    assert.match(meta.description, /\[SESSION\]/, "Description must mention [SESSION]");
  });

  it("Skill documentation covers procedures and commands", async () => {
    const content = await readFile(skillPath, "utf8");
    assert.match(content, /session:save|\/session save/i, "Must document session save command");
    assert.match(content, /session:resume|\/session resume/i, "Must document session resume command");
    assert.match(content, /session:status|\/session status/i, "Must document session status command");
    assert.match(content, /session:clear|\/session clear/i, "Must document session clear command");
    assert.match(content, /60%|saturation/i, "Must document 60% saturation threshold trigger");
  });

  it("orchestrator/SHARED.md mandates session checkpoints at ~60% saturation", async () => {
    const content = await readFile(sharedPath, "utf8");
    const workingSection = content.split("## Working contract")[1]?.split("## Roles")[0] || "";
    const harnessSection = content.split("## Execution & Harness Contract")[1]?.split("## Context maintenance")[0] || "";

    assert.match(
      workingSection,
      /session.*60%|60%.*session|session checkpoint/i,
      "Working contract must mandate session checkpoints when context approaches saturation (~60%)"
    );
    assert.match(
      harnessSection,
      /session.*60%|60%.*session|session checkpoint|SESSION_RESUME/i,
      "Execution & harness contract must specify session state capture and resume mechanics"
    );
  });
});
