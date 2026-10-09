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

  describe("AC-04: Task checkout and done-check", () => {
    async function writeVersionTwoPlan(directory, { blockers = "- None.", checkoutMode = "branch" } = {}) {
      await mkdir(join(directory, "phase-01"), { recursive: true });
      await writeFile(join(directory, "feat-PLN-0042-oauth-login.md"), `---
title: OAuth login
type: task
status: ready
plan_contract_version: 2
plan_id: PLN-0042
target_branch: master
task_branch: feat/PLN-0042-oauth-login
checkout_mode: ${checkoutMode}
checkout_reason: Clean serial work uses the task branch.
checkout_path:
---
# OAuth login

## Acceptance criteria

| ID | Criterion | Unit | Verification |
| --- | --- | --- | --- |
| AC-01 | Login plan is ready | 01.01 | node --test evals/plan-check.test.mjs |

## Unknowns and blockers

${blockers}

## Risk and dependency register

| Risk | Mitigation |
| --- | --- |
| Contract drift | Run plan check |

## Plan done-check

- [x] Acceptance criteria map to units and verification.
- [x] Blockers are resolved or absent.
- [x] Risks and dependencies are recorded.
- [x] Checkout decision is justified.
`);
      await writeFile(join(directory, "phase-01", "unit-01.md"), `---
unit: "01.01"
depends_on: []
task_branch: feat/PLN-0042-oauth-login
checkout_mode: ${checkoutMode}
checkout_reason: Clean serial work uses the task branch.
checkout_path:
---
# Unit 01.01

## Scope
**In scope:** \`scripts/plan-check.mjs\`

<language_rules>
- \`rules/global/architecture-conformance.md\`: Architecture conformance
</language_rules>
`);
    }

    it("passes a complete serial plan with one task branch", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-plan-ready-"));
      try {
        await writeVersionTwoPlan(tempDir);
        const { stdout } = await execFileAsync("node", [contextCliPath, "plan:check", tempDir]);
        assert.match(stdout, /Done Check:\s+Complete/);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it("fails a plan with a material blocker or invalid checkout mode", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-plan-incomplete-"));
      try {
        await writeVersionTwoPlan(tempDir, { blockers: "- Blocking authority decision remains open." });
        await assert.rejects(
          execFileAsync("node", [contextCliPath, "plan:check", tempDir]),
          (error) => /BLOCKER/i.test(`${error.stdout || ""} ${error.stderr || ""}`)
        );

        await writeVersionTwoPlan(tempDir, { checkoutMode: "unit-worktree" });
        await assert.rejects(
          execFileAsync("node", [contextCliPath, "plan:check", tempDir]),
          (error) => /CHECKOUT/i.test(`${error.stdout || ""} ${error.stderr || ""}`)
        );
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
    it("rejects legacy checkout fields in a new branch-only plan", async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "cf-plan-v3-"));
      try {
        await writeVersionTwoPlan(tempDir);
        const planPath = join(tempDir, "feat-PLN-0042-oauth-login.md");
        const unitPath = join(tempDir, "phase-01", "unit-01.md");
        for (const path of [planPath, unitPath]) {
          const source = await (await import("node:fs/promises")).readFile(path, "utf8");
          await writeFile(path, source.replace("plan_contract_version: 2", "plan_contract_version: 3").replace("checkout_mode: branch\ncheckout_reason: Clean serial work uses the task branch.\ncheckout_path:\n", "base_commit: a123456789012345678901234567890123456789\n"));
        }
        const { stdout } = await execFileAsync("node", [contextCliPath, "plan:check", tempDir]);
        assert.match(stdout, /Done Check:\s+Complete/);
        const source = await (await import("node:fs/promises")).readFile(unitPath, "utf8");
        await writeFile(unitPath, source.replace("base_commit: a123456789012345678901234567890123456789", "base_commit: a123456789012345678901234567890123456789\ncheckout_mode: worktree"));
        await assert.rejects(execFileAsync("node", [contextCliPath, "plan:check", tempDir]), (error) => /CHECKOUT/i.test(`${error.stdout || ""} ${error.stderr || ""}`));
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });
});
