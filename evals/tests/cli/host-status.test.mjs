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
      const state = await probeHostState({ hostDir: tempDir, factoryDir: process.cwd() });
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

      const state = await probeHostState({ hostDir: tempDir, factoryDir: process.cwd() });
      assert.equal(state.setup.status, "configured");
      assert.equal(state.setup.method, "submodule");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("maintains distinct states for host setup, factory health, and code conformance (AC-06)", async () => {
    const state = await probeHostState({ hostDir: process.cwd(), factoryDir: process.cwd() });

    // Distinct objects with independent statuses
    assert.ok(state.setup, "has setup state");
    assert.ok(state.health, "has factory health state");
    assert.ok(state.conformance, "has code conformance state");

    // Conformance is distinct and never inferred as PASS from setup or editor presence
    assert.notEqual(state.conformance.status, "PASS", "conformance cannot default to PASS without valid report receipt");
    assert.ok(["no_report", "unconfigured", "pending"].includes(state.conformance.status));
    assert.ok(state.nextCommand, "provides a single next command");
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
});
