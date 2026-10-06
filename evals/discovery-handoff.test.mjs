import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();

async function source(path) {
  return readFile(join(root, path), "utf8");
}

describe("AC-01 discovery handoff contract", () => {
  it("keeps a material unknown in a draft context and prevents a brief release", async () => {
    const [context, grill, discovery] = await Promise.all([
      source("skills/productivity/context/SKILL.md"),
      source("skills/productivity/grill/SKILL.md"),
      source("docs/discovery/README.md"),
    ]);

    assert.match(context, /## Access declaration[\s\S]*Exposes to:[\s\S]*`grounding`[\s\S]*`grill`/);
    assert.match(context, /A material unknown keeps the specification `draft`/);
    assert.match(grill, /A brief may be released only when the source context is `ready`/);
    assert.match(discovery, /A material unknown blocks `ready` and brief release/);
  });

  it("requires a provenance-labeled conflicting claim to stay unresolved", async () => {
    const [grounding, grill, discovery] = await Promise.all([
      source("skills/productivity/grounding/SKILL.md"),
      source("skills/productivity/grill/SKILL.md"),
      source("docs/discovery/README.md"),
    ]);

    assert.match(grounding, /## Access declaration[\s\S]*Exposes to:[\s\S]*`grill`/);
    assert.match(grounding, /provenance-labeled claim packet/);
    assert.match(grill, /Conflicting claims remain `unresolved`/);
    assert.match(discovery, /A conflicting claim cannot become an accepted decision without recorded resolution/);
  });

  it("makes grill the sole owner of exactly one released brief", async () => {
    const [context, grill, discovery] = await Promise.all([
      source("skills/productivity/context/SKILL.md"),
      source("skills/productivity/grill/SKILL.md"),
      source("docs/discovery/README.md"),
    ]);

    assert.match(context, /Do not hand the context specification directly to `plan`/);
    assert.match(grill, /sole writer of `docs\/discovery\/<feature>\/record\.md` and `brief\.md`/);
    assert.match(grill, /Release exactly one `brief\.md` per discovery feature/);
    assert.match(discovery, /`brief\.md` is readable only by `plan`/);
  });
});
