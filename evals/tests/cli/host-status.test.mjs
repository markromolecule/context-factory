import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { probeHostState } from "../../../app/cli/core/host-state.mjs";
import { handleStatusCommand } from "../../../app/cli/commands/status.mjs";

describe("Unit 01.01: Host state and actionable status (AC-04, AC-06)", () => {
  it("probes unconfigured host when no bridge is present", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-host-unconfigured-"));
    try {
      const state = await probeHostState({ hostDir: tempDir, factoryDir: tempDir });
      assert.equal(state.setup.status, "unconfigured");
      assert.match(state.setup.reason, /not bridged|unconfigured/i);
      assert.match(state.nextCommand, /context-cli init/);
      assert.notEqual(state.conformance.status, "PASS");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("detects missing submodule in host repository and returns git submodule update recovery (AC-04)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-host-missing-submodule-"));
    try {
      // Create .gitmodules in host referencing context-factory
      await writeFile(
        join(tempDir, ".gitmodules"),
        '[submodule ".context-factory"]\n\tpath = .context-factory\n\turl = https://github.com/example/context-factory.git\n',
        "utf8"
      );

      const state = await probeHostState({ hostDir: tempDir, factoryDir: join(tempDir, ".context-factory") });
      assert.equal(state.setup.status, "missing_submodule");
      assert.match(state.setup.reason, /submodule/i);
      assert.equal(state.setup.nextCommand, "git submodule update --init --recursive");
      assert.equal(state.nextCommand, "git submodule update --init --recursive");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("reports configured host when .context-bridge.json exists", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-host-configured-"));
    try {
      await writeFile(
        join(tempDir, ".context-bridge.json"),
        JSON.stringify({ schemaVersion: 1, method: "submodule", installedIdes: ["vscode"] }, null, 2),
        "utf8"
      );

      const state = await probeHostState({ hostDir: tempDir, factoryDir: tempDir });
      assert.equal(state.setup.status, "configured");
      assert.equal(state.setup.method, "submodule");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("maintains distinct states for host setup, factory health, and code conformance (AC-06)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-host-distinct-"));
    try {
      const state = await probeHostState({ hostDir: tempDir, factoryDir: tempDir });

      // Distinct objects with independent statuses
      assert.ok(state.setup, "has setup state");
      assert.ok(state.health, "has factory health state");
      assert.ok(state.conformance, "has code conformance state");

      // Conformance is distinct and never inferred as PASS without valid report receipt
      assert.equal(state.conformance.status, "no_report");
      assert.ok(state.nextCommand, "provides a single next command");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("reflects PASS conformance verdict when report receipt is present", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-host-report-"));
    try {
      const runsDir = join(tempDir, ".context-runs", "run-1");
      await mkdir(runsDir, { recursive: true });
      await writeFile(
        join(runsDir, "conformance-report.json"),
        JSON.stringify({ reportId: "rep-1", verdict: "PASS" }, null, 2),
        "utf8"
      );
      const state = await probeHostState({ hostDir: tempDir, factoryDir: tempDir });
      assert.equal(state.conformance.status, "PASS");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("handleStatusCommand returns structured JSON with backward compatibility and host state", async () => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));

    try {
      const exitCode = await handleStatusCommand([], { json: true });
      assert.equal(exitCode, 0);
      assert.equal(logs.length, 1);

      const output = JSON.parse(logs[0]);
      // Backward-compatible fields
      assert.ok(output.contextVersion);
      assert.ok(output.counts);
      assert.ok(output.counts.rules > 0);
      assert.ok(output.lock);

      // New distinct states under host
      assert.ok(output.host);
      assert.ok(output.host.setup);
      assert.ok(output.host.health);
      assert.ok(output.host.conformance);
      assert.ok(output.host.nextCommand);
    } finally {
      console.log = originalLog;
    }
  });

  it("handleStatusCommand renders host overview by default and details on --detail", async () => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));

    try {
      // Default view: shows host overview & next action
      const defaultExit = await handleStatusCommand([], {});
      assert.equal(defaultExit, 0);
      const defaultOutput = logs.join("\n");
      assert.match(defaultOutput, /Host Setup|Factory Health|Code Conformance/i);
      assert.match(defaultOutput, /Next Action/i);

      // Detail view: includes inventory breakdown
      logs.length = 0;
      const detailExit = await handleStatusCommand([], { detail: true });
      assert.equal(detailExit, 0);
      const detailOutput = logs.join("\n");
      assert.match(detailOutput, /Context Inventory/i);
      assert.match(detailOutput, /Engineering Rules/i);
    } finally {
      console.log = originalLog;
    }
  });

  it("does not adopt factory report into a host repository that has no report (AC-09)", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "cf-test-host-isolated-"));
    const factoryDir = await mkdtemp(join(tmpdir(), "cf-test-factory-isolated-"));
    try {
      // Factory has a PASS report
      const factoryRuns = join(factoryDir, ".context-runs", "run-factory");
      await mkdir(factoryRuns, { recursive: true });
      await writeFile(
        join(factoryRuns, "conformance-report.json"),
        JSON.stringify({ reportId: "fac-1", verdict: "PASS", hostRoot: factoryDir }, null, 2),
        "utf8"
      );

      // Host has no reports
      const state = await probeHostState({ hostDir, factoryDir });
      assert.equal(state.conformance.status, "no_report", "Host must not adopt factory-local report");
      assert.notEqual(state.conformance.status, "PASS");
    } finally {
      await rm(hostDir, { recursive: true, force: true });
      await rm(factoryDir, { recursive: true, force: true });
    }
  });

  it("rejects a foreign report with mismatched hostRoot (AC-09)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-foreign-"));
    try {
      const runsDir = join(tempDir, ".context-runs", "run-foreign");
      await mkdir(runsDir, { recursive: true });
      await writeFile(
        join(runsDir, "conformance-report.json"),
        JSON.stringify({ reportId: "rep-f", verdict: "PASS", hostRoot: "/other/host/repo" }, null, 2),
        "utf8"
      );

      const state = await probeHostState({ hostDir: tempDir, factoryDir: tempDir });
      assert.equal(state.conformance.status, "foreign", "Must reject foreign hostRoot");
      assert.match(state.conformance.reason, /host/i);
      assert.notEqual(state.conformance.status, "PASS");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("rejects a stale report with mismatched revision (AC-09)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-stale-"));
    try {
      const runsDir = join(tempDir, ".context-runs", "run-stale");
      await mkdir(runsDir, { recursive: true });
      await writeFile(
        join(runsDir, "conformance-report.json"),
        JSON.stringify({ reportId: "rep-s", verdict: "PASS", hostRoot: tempDir, revision: "commit-abc1" }, null, 2),
        "utf8"
      );

      const state = await probeHostState({ hostDir: tempDir, factoryDir: tempDir, revision: "commit-xyz9" });
      assert.equal(state.conformance.status, "stale", "Must reject mismatched revision");
      assert.match(state.conformance.reason, /revision/i);
      assert.notEqual(state.conformance.status, "PASS");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("rejects a report with mismatched scope (AC-09)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-scope-"));
    try {
      const runsDir = join(tempDir, ".context-runs", "run-scope");
      await mkdir(runsDir, { recursive: true });
      await writeFile(
        join(runsDir, "conformance-report.json"),
        JSON.stringify({ reportId: "rep-sc", verdict: "PASS", hostRoot: tempDir, scope: ["src/a.ts"] }, null, 2),
        "utf8"
      );

      const state = await probeHostState({ hostDir: tempDir, factoryDir: tempDir, scope: ["src/b.ts"] });
      assert.equal(state.conformance.status, "scope_mismatch", "Must reject mismatched scope");
      assert.match(state.conformance.reason, /scope/i);
      assert.notEqual(state.conformance.status, "PASS");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("rejects a report with mismatched binding (AC-09)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-binding-"));
    try {
      const runsDir = join(tempDir, ".context-runs", "run-bind");
      await mkdir(runsDir, { recursive: true });
      await writeFile(
        join(runsDir, "conformance-report.json"),
        JSON.stringify({ reportId: "rep-b", verdict: "PASS", hostRoot: tempDir, bindingHash: "sha256:aaa111" }, null, 2),
        "utf8"
      );

      const state = await probeHostState({ hostDir: tempDir, factoryDir: tempDir, binding: "sha256:bbb222" });
      assert.equal(state.conformance.status, "binding_mismatch", "Must reject mismatched binding");
      assert.match(state.conformance.reason, /binding/i);
      assert.notEqual(state.conformance.status, "PASS");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("accepts matching report identity tuple and returns PASS (AC-09)", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "cf-test-match-"));
    try {
      const runsDir = join(tempDir, ".context-runs", "run-ok");
      await mkdir(runsDir, { recursive: true });
      await writeFile(
        join(runsDir, "conformance-report.json"),
        JSON.stringify({
          reportId: "rep-ok",
          verdict: "PASS",
          hostRoot: tempDir,
          scope: ["src/feature.ts"],
          bindingHash: "sha256:bind123",
          revision: "rev-456",
          timestamp: new Date().toISOString(),
        }, null, 2),
        "utf8"
      );

      const state = await probeHostState({
        hostDir: tempDir,
        factoryDir: tempDir,
        scope: ["src/feature.ts"],
        binding: "sha256:bind123",
        revision: "rev-456",
      });
      assert.equal(state.conformance.status, "PASS", "Must accept matching identity tuple");
      assert.equal(state.conformance.reportId, "rep-ok");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
