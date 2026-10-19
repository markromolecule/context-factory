import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { releaseDiscoveryBrief } from "../../scripts/handoff-contract.mjs";

const execFileAsync = promisify(execFile);
const cli = join(process.cwd(), "scripts/context.mjs");
const rule = "rules/global/evidence-and-claims.md";
const branch = "refactor/PLN-0042-layout-check";
const baseCommit = "a".repeat(40);

async function fixture({ blockers = "- None for planning.", checked = true } = {}) {
  const directory = await mkdtemp(join(tmpdir(), "cf-plan-layout-"));
  const name = "refactor-PLN-0042-layout-check";
  const taskDir = join(directory, name);
  const planPath = join(directory, `${name}.md`);
  const sourcePath = join(directory, "discovery.md");
  const briefPath = join(directory, "brief.json");
  const phaseDir = join(taskDir, "phase-01");
  const hash = createHash("sha256").update(await readFile(rule, "utf8")).digest("hex");
  await mkdir(phaseDir, { recursive: true });
  await writeFile(sourcePath, "# Released discovery\n");
  await releaseDiscoveryBrief({ sourcePath, briefPath });
  await writeFile(planPath, `---
title: Layout check
type: task
plan_contract_version: 3
plan_id: PLN-0042
target_branch: master
task_branch: ${branch}
base_commit: ${baseCommit}
discovery_brief: brief.json
---

# Layout check

## Acceptance criteria

| ID | Criterion | Unit | Verification |
| --- | --- | --- | --- |
| AC-01 | Layout is checked | 01.01 | node --test tests/cli/plan-check-layout.test.mjs |

## Unknowns and blockers

${blockers}

## Risk and dependency register

| Risk | Mitigation |
| --- | --- |
| Missing master | Fail closed |

## Plan done-check

- [x] Acceptance criteria map to a unit and command.
- [x] Blockers are resolved for planning.
- [x] Risks and dependencies are recorded.
- [${checked ? "x" : " "}] The task branch and base checkout were verified.
`);
  await writeFile(join(phaseDir, "unit-01.md"), `---
type: unit
unit: "01.01"
task_branch: ${branch}
base_commit: ${baseCommit}
depends_on: []
---

# Unit 01.01

## Scope

**In scope:** \`scripts/plan-check.mjs\`

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] ${rule} contentHash:sha256:${hash}
</language_rules>
`);
  return { directory, taskDir, planPath, sourcePath, briefPath };
}

async function check(taskDir) {
  try {
    const { stdout } = await execFileAsync("node", [cli, "plan:check", taskDir, "--json"]);
    return { code: 0, report: JSON.parse(stdout) };
  } catch (error) {
    return { code: error.code, report: JSON.parse(error.stdout) };
  }
}

describe("plan:check scaffolded sibling master", () => {
  it("checks the v3 done-check and released brief through the public CLI", async () => {
    const item = await fixture();
    try {
      const result = await check(item.taskDir);
      assert.equal(result.code, 0);
      assert.equal(result.report.doneCheck.applicable, true);
      assert.equal(result.report.doneCheck.valid, true);
      assert.equal(result.report.handoff.applicable, true);
      assert.equal(result.report.handoff.valid, true);
    } finally {
      await rm(item.directory, { recursive: true, force: true });
    }
  });

  it("fails on a missing or stale brief", async () => {
    const item = await fixture();
    try {
      await rm(item.briefPath);
      let result = await check(item.taskDir);
      assert.equal(result.code, 1);
      assert.equal(result.report.handoff.valid, false);
      await releaseDiscoveryBrief({ sourcePath: item.sourcePath, briefPath: item.briefPath });
      await writeFile(item.sourcePath, "# Changed discovery\n");
      result = await check(item.taskDir);
      assert.equal(result.code, 1);
      assert.equal(result.report.handoff.valid, false);
    } finally {
      await rm(item.directory, { recursive: true, force: true });
    }
  });

  it("fails on an unresolved blocker or incomplete done-check", async () => {
    const blocked = await fixture({ blockers: "- Blocking decision remains open." });
    const unchecked = await fixture({ checked: false });
    try {
      for (const item of [blocked, unchecked]) {
        const result = await check(item.taskDir);
        assert.equal(result.code, 1);
        assert.equal(result.report.doneCheck.applicable, true);
        assert.equal(result.report.doneCheck.valid, false);
      }
    } finally {
      await rm(blocked.directory, { recursive: true, force: true });
      await rm(unchecked.directory, { recursive: true, force: true });
    }
  });

  it("fails closed when the scaffolded master is absent or ambiguous", async () => {
    const item = await fixture();
    try {
      await writeFile(join(item.taskDir, "README.md"), await readFile(item.planPath, "utf8"));
      assert.equal((await check(item.taskDir)).code, 1);
      await rm(join(item.taskDir, "README.md"));
      await rm(item.planPath);
      assert.equal((await check(item.taskDir)).code, 1);
    } finally {
      await rm(item.directory, { recursive: true, force: true });
    }
  });
});
