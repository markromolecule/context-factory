import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { frontmatter } from "../../../scripts/context-core.mjs";

const root = process.cwd();
const evidencePath = join(root, "rules/global/evidence-and-claims.md");
const archPath = join(root, "rules/global/architecture-conformance.md");

describe("Unit 03.02: LHG Minimal Input Rule Density Optimization", () => {
  it("rules/global/evidence-and-claims.md is optimized into high-density constraint tables", async () => {
    const content = await readFile(evidencePath, "utf8");
    const meta = frontmatter(content);
    assert.equal(meta.name, "evidence-and-claims");
    assert.equal(meta.alwaysApply, true);

    // Required by evaluation contract assertions
    assert.match(content, /Do not imply unrun checks passed\./);
    assert.match(content, /A task is complete only when required outcomes exist/);

    // High density requirement: contains constraint tables
    assert.match(content, /\|.*Directive.*\|.*Constraint.*\|/i, "Must format directives as constraint table");
    // Directive metadata raises the compact migrated contract budget while preserving a dense table format.
    assert.ok(content.length < 2800, `Expected content length < 2800, received ${content.length}`);
  });

  it("rules/global/architecture-conformance.md is optimized into high-density constraint tables", async () => {
    const content = await readFile(archPath, "utf8");
    const meta = frontmatter(content);
    assert.equal(meta.name, "architecture-conformance");
    assert.equal(meta.alwaysApply, true);

    // High density requirement: contains constraint tables
    assert.match(content, /\|.*Boundary.*\|.*Constraint.*\|/i, "Must format architecture boundaries as constraint table");
    // Directive metadata raises the compact migrated contract budget while preserving a dense table format.
    assert.ok(content.length < 2000, `Expected content length < 2000, received ${content.length}`);
  });
});
