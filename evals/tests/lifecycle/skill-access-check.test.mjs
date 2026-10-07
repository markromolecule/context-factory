import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { lintSkillAccess, parseAccessDeclaration } from "../../../scripts/skill-access-check.mjs";

const declaration = (body = "") => `# Execute

## Access declaration

- **Reads:** reviewed execution packets.
- **Writes:** execution evidence.
- **Exposes to:** nobody.

${body}`;

describe("skill access declarations", () => {
  it("rejects a positive forbidden execute read with path and line", () => {
    const result = lintSkillAccess({ skill: "execute", path: "skills/engineering/execute/SKILL.md", content: declaration("Read docs/tasks/PLN-0003/plan.md before starting.") });
    assert.equal(result.valid, false);
    assert.deepEqual(result.diagnostics.at(-1), { path: "skills/engineering/execute/SKILL.md", line: 9, message: "execute positively reads forbidden source docs/tasks/" });
  });

  it("allows an explicit prohibition on reading docs/tasks", () => {
    const result = lintSkillAccess({ skill: "execute", content: declaration("Do not read docs/tasks/ directly; use the reviewed packet.") });
    assert.equal(result.valid, true);
  });

  it("rejects a malformed declaration", () => {
    const result = parseAccessDeclaration("## Access declaration\n\n- **Reads:** packets.", "fixture.md");
    assert.equal(result.valid, false);
    assert.match(result.diagnostics[0].message, /Writes/);
  });
});
