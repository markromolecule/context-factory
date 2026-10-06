import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const contextCliPath = join(process.cwd(), "scripts/context.mjs");
const fixturesRoot = join(process.cwd(), "evals/fixtures/plans/rule-bindings");

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

<language_rules>
- \`rules/global/architecture-conformance.md\`: Architecture conformance
- \`rules/global/evidence-and-claims.md\`: Evidence and claims
</language_rules>
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

<language_rules>
- \`rules/global/architecture-conformance.md\`: Architecture conformance
- \`rules/global/evidence-and-claims.md\`: Evidence and claims
</language_rules>
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

<language_rules>
- \`rules/global/architecture-conformance.md\`: Architecture conformance
</language_rules>
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

<language_rules>
- \`rules/global/architecture-conformance.md\`: Architecture conformance
</language_rules>
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

<language_rules>
- \`rules/global/architecture-conformance.md\`: Architecture conformance
</language_rules>
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

<language_rules>
- \`rules/global/architecture-conformance.md\`: Architecture conformance
</language_rules>
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

<language_rules>
- \`rules/global/architecture-conformance.md\`: Architecture conformance
</language_rules>
`
    );

    try {
      const { stdout } = await execFileAsync("node", [contextCliPath, "plan:check", tempDir, "--json"]);
      const parsed = JSON.parse(stdout);
      assert.equal(parsed.valid, true);
      assert.equal(parsed.unitCount, 1);
      assert.equal(parsed.languageRules.valid, true);
      assert.deepEqual(parsed.topologicalOrder, ["01.01"]);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  describe("AC-04: Fail-Closed Language Rule Conformance", () => {
    it("passes valid plan fixture with code 0", async () => {
      const fixtureDir = join(fixturesRoot, "valid");
      const { stdout } = await execFileAsync("node", [contextCliPath, "plan:check", fixtureDir]);
      assert.match(stdout, /PASS/);
      assert.match(stdout, /Language Rules:\s+All units declare valid/);
    });

    it("fails missing language rules fixture with code 1", async () => {
      const fixtureDir = join(fixturesRoot, "missing");
      try {
        await execFileAsync("node", [contextCliPath, "plan:check", fixtureDir]);
        assert.fail("Expected plan:check to exit non-zero for missing rules");
      } catch (err) {
        assert.equal(err.code, 1);
        const combined = `${err.stdout || ""} ${err.stderr || ""}`;
        assert.match(combined, /\[MISSING\]/i);
        assert.match(combined, /missing a <language_rules> block/i);
      }
    });

    it("fails template placeholder fixture with code 1", async () => {
      const fixtureDir = join(fixturesRoot, "placeholder");
      try {
        await execFileAsync("node", [contextCliPath, "plan:check", fixtureDir]);
        assert.fail("Expected plan:check to exit non-zero for placeholder rules");
      } catch (err) {
        assert.equal(err.code, 1);
        const combined = `${err.stdout || ""} ${err.stderr || ""}`;
        assert.match(combined, /\[PLACEHOLDER\]/i);
        assert.match(combined, /template placeholder text/i);
      }
    });

    it("fails nonexistent rule fixture with code 1", async () => {
      const fixtureDir = join(fixturesRoot, "nonexistent");
      try {
        await execFileAsync("node", [contextCliPath, "plan:check", fixtureDir]);
        assert.fail("Expected plan:check to exit non-zero for nonexistent rule");
      } catch (err) {
        assert.equal(err.code, 1);
        const combined = `${err.stdout || ""} ${err.stderr || ""}`;
        assert.match(combined, /\[NONEXISTENT\]/i);
        assert.match(combined, /nonexistent rule file/i);
      }
    });

    it("fails wrong-stack rule fixture with code 1", async () => {
      const fixtureDir = join(fixturesRoot, "wrong-stack");
      try {
        await execFileAsync("node", [contextCliPath, "plan:check", fixtureDir]);
        assert.fail("Expected plan:check to exit non-zero for wrong-stack rule");
      } catch (err) {
        assert.equal(err.code, 1);
        const combined = `${err.stdout || ""} ${err.stderr || ""}`;
        assert.match(combined, /\[WRONG-STACK\]/i);
        assert.match(combined, /does not match/i);
      }
    });

    it("fails irrelevant rule fixture with code 1", async () => {
      const fixtureDir = join(fixturesRoot, "irrelevant");
      try {
        await execFileAsync("node", [contextCliPath, "plan:check", fixtureDir]);
        assert.fail("Expected plan:check to exit non-zero for irrelevant rule");
      } catch (err) {
        assert.equal(err.code, 1);
        const combined = `${err.stdout || ""} ${err.stderr || ""}`;
        assert.match(combined, /\[IRRELEVANT\]/i);
        assert.match(combined, /does not match applicability paths/i);
      }
    });

    it("fails stale hash fixture with code 1", async () => {
      const fixtureDir = join(fixturesRoot, "stale");
      try {
        await execFileAsync("node", [contextCliPath, "plan:check", fixtureDir]);
        assert.fail("Expected plan:check to exit non-zero for stale hash");
      } catch (err) {
        assert.equal(err.code, 1);
        const combined = `${err.stdout || ""} ${err.stderr || ""}`;
        assert.match(combined, /\[STALE\]/i);
        assert.match(combined, /stale hash/i);
      }
    });

    it("fails contradictory step fixture without waiver with code 1", async () => {
      const fixtureDir = join(fixturesRoot, "contradictory");
      try {
        await execFileAsync("node", [contextCliPath, "plan:check", fixtureDir]);
        assert.fail("Expected plan:check to exit non-zero for contradictory step without waiver");
      } catch (err) {
        assert.equal(err.code, 1);
        const combined = `${err.stdout || ""} ${err.stderr || ""}`;
        assert.match(combined, /\[CONTRADICTORY\]/i);
        assert.match(combined, /without an authorized waiver/i);
      }
    });
  });
});
