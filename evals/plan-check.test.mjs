import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const contextCliPath = join(process.cwd(), "scripts/context.mjs");

describe("CLI Harness: node scripts/context.mjs plan:check", () => {
  it("Case 1: valid task plan exits 0 with PASS output", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-plan-valid-"));
    const phaseDir = join(tempDir, "phase-01");
    await mkdir(phaseDir, { recursive: true });

    await writeFile(
      join(phaseDir, "unit-01.md"),
      `---
unit: "01.01"
depends_on: []
---
# Unit 01.01

## Scope
**In scope:** \`src/moduleA.js\`
`
    );

    await writeFile(
      join(phaseDir, "unit-02.md"),
      `---
unit: "01.02"
depends_on: []
---
# Unit 01.02

## Scope
**In scope:** \`src/moduleB.js\`
`
    );

    try {
      const { stdout } = await execFileAsync("node", [contextCliPath, "plan:check", tempDir]);
      assert.match(stdout, /PASS/);
      assert.match(stdout, /Units Found:\s+2/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("Case 2: cyclic task plan exits 1 with cycle trace", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-plan-cyclic-"));
    const phaseDir = join(tempDir, "phase-01");
    await mkdir(phaseDir, { recursive: true });

    await writeFile(
      join(phaseDir, "unit-01.md"),
      `---
unit: "01.01"
depends_on: ["01.02"]
---
# Unit 01.01

## Scope
**In scope:** \`src/moduleA.js\`
`
    );

    await writeFile(
      join(phaseDir, "unit-02.md"),
      `---
unit: "01.02"
depends_on: ["01.01"]
---
# Unit 01.02

## Scope
**In scope:** \`src/moduleB.js\`
`
    );

    try {
      await execFileAsync("node", [contextCliPath, "plan:check", tempDir]);
      assert.fail("Expected process to exit with non-zero code");
    } catch (error) {
      assert.equal(error.code, 1);
      const combinedOutput = `${error.stdout || ""} ${error.stderr || ""}`;
      assert.match(combinedOutput, /Dependency cycle\(s\) detected/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("Case 3: overlapping parallel units exit 1 with colliding file names", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-plan-overlap-"));
    const phaseDir = join(tempDir, "phase-01");
    await mkdir(phaseDir, { recursive: true });

    await writeFile(
      join(phaseDir, "unit-01.md"),
      `---
unit: "01.01"
depends_on: []
---
# Unit 01.01

## Scope
**In scope:** \`src/shared-config.json\`
`
    );

    await writeFile(
      join(phaseDir, "unit-02.md"),
      `---
unit: "01.02"
depends_on: []
---
# Unit 01.02

## Scope
**In scope:** \`src/shared-config.json\`
`
    );

    try {
      await execFileAsync("node", [contextCliPath, "plan:check", tempDir]);
      assert.fail("Expected process to exit with non-zero code");
    } catch (error) {
      assert.equal(error.code, 1);
      const combinedOutput = `${error.stdout || ""} ${error.stderr || ""}`;
      assert.match(combinedOutput, /Scope overlap detected between parallel units/);
      assert.match(combinedOutput, /src\/shared-config\.json/);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("Case 4: outputs JSON report when --json flag is provided", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-plan-json-"));
    const phaseDir = join(tempDir, "phase-01");
    await mkdir(phaseDir, { recursive: true });

    await writeFile(
      join(phaseDir, "unit-01.md"),
      `---
unit: "01.01"
depends_on: []
---
# Unit 01.01

## Scope
**In scope:** \`src/moduleA.js\`
`
    );

    try {
      const { stdout } = await execFileAsync("node", [contextCliPath, "plan:check", tempDir, "--json"]);
      const parsed = JSON.parse(stdout);
      assert.equal(parsed.valid, true);
      assert.equal(parsed.unitCount, 1);
      assert.deepEqual(parsed.topologicalOrder, ["01.01"]);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
