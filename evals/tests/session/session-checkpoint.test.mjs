import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { access, readFile, rm } from "node:fs/promises";
import {
  saveSessionState,
  resumeSessionState,
  inspectSessionStatus,
  clearSessionState,
  countTokens,
} from "../../../scripts/session-core.mjs";
import { resolveContext } from "../../../scripts/context-core.mjs";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const cliPath = join(root, "scripts/context.mjs");
const briefingPath = join(root, ".tmp/SESSION_RESUME.md");

describe("Session Checkpoint & LHG Minimal Input E2E Suite", () => {
  const testSessionId = `test-session-${Date.now()}`;

  after(async () => {
    try {
      await clearSessionState({ sessionId: testSessionId });
    } catch {
      // Ignore
    }
  });

  describe("Core Engine Lifecycle & Dual-Layer Storage", () => {
    it("saveSessionState creates valid machine state and ultra-compact briefing", async () => {
      const state = await saveSessionState({
        sessionId: testSessionId,
        taskId: "0001",
        phase: "04",
        unit: "04.01",
        goal: "Validate E2E session state persistence and release readiness",
        branch: "task/0001/phase-04/unit-01-evaluations-and-release",
        worktree: ".worktrees/0001/phase-04/unit-01-evaluations-and-release",
        status: "passing",
        activeDecisions: ["0025-lhg-minimal-input-and-session-state-primitives"],
        contextBudget: {
          estimatedTokens: 350,
          budgetLimit: 1500,
          utilizationPercent: 23,
        },
      });

      assert.ok(state, "State should be returned");
      assert.equal(state.sessionId, testSessionId);
      assert.equal(state.data.taskPointer.taskId, "0001");
      assert.equal(state.data.taskPointer.phase, "04");
      assert.equal(state.data.taskPointer.unit, "04.01");

      // Verify machine state exists on disk
      const diskSessionPath = join(root, ".context/sessions", `${testSessionId}.json`);
      await access(diskSessionPath);
      const rawSession = JSON.parse(await readFile(diskSessionPath, "utf8"));
      assert.equal(rawSession.sessionId, testSessionId);

      // Verify briefing exists and is under 1,500 tokens
      await access(briefingPath);
      const briefingContent = await readFile(briefingPath, "utf8");
      assert.match(briefingContent, /Session Resume Briefing/i);
      assert.match(briefingContent, /0001/);
      const briefingTokens = countTokens(briefingContent);
      assert.ok(briefingTokens < 1500, `Briefing tokens (${briefingTokens}) must be < 1,500`);
    });

    it("resumeSessionState restores saved state accurately", async () => {
      const resumed = await resumeSessionState(testSessionId);
      assert.ok(resumed, "Resumed state should be defined");
      assert.equal(resumed.sessionId, testSessionId);
      assert.equal(resumed.taskPointer.taskId, "0001");
      assert.equal(resumed.taskPointer.phase, "04");
      assert.equal(resumed.taskPointer.unit, "04.01");
      assert.equal(resumed.verificationState.status, "passing");
    });

    it("inspectSessionStatus returns active session entry", async () => {
      const status = await inspectSessionStatus();
      assert.ok(status, "Status should be returned");
      assert.ok(Array.isArray(status.sessions), "Sessions array required");
      const found = status.sessions.find((s) => s.sessionId === testSessionId);
      assert.ok(found, "Saved session must be listed in status");
      assert.equal(found.taskPointer?.taskId, "0001");
    });

    it("clearSessionState removes machine state and cleans resume briefing", async () => {
      const cleared = await clearSessionState({ sessionId: testSessionId });
      assert.equal(cleared.clearedId, testSessionId);

      // Verify file is removed
      const diskSessionPath = join(root, ".context/sessions", `${testSessionId}.json`);
      let exists = true;
      try {
        await access(diskSessionPath);
      } catch {
        exists = false;
      }
      assert.equal(exists, false, "Session state file should be deleted");
    });
  });

  describe("Context Token Budget Fencing", () => {
    it("resolveContext includes budget metrics and densityStatus", async () => {
      const result = await resolveContext("Build user authentication flow");
      assert.ok(result.budget, "Budget property must be present in resolved context");
      assert.equal(typeof result.budget.estimatedTokens, "number");
      assert.equal(typeof result.budget.ruleAndSkillTokens, "number");
      assert.equal(typeof result.budget.maxRecommendedRuleTokens, "number");
      assert.ok(["optimal", "warning"].includes(result.budget.densityStatus));
    });
  });

  describe("CLI Harness Subcommands Integration", () => {
    it("executes session:save, session:status, session:resume, session:clear via CLI", async () => {
      // 1. Save
      const saveCmd = await execFileAsync("node", [
        cliPath,
        "session:save",
        "--status",
        "passing",
        "--name",
        "cli-test-session",
      ]);
      assert.match(saveCmd.stdout, /SAVED|Session checkpoint saved/i);

      // 2. Status
      const statusCmd = await execFileAsync("node", [cliPath, "session:status"]);
      assert.match(statusCmd.stdout, /Saved Sessions/i);
      assert.match(statusCmd.stdout, /cli-test-session/);

      // 3. Resume
      const resumeCmd = await execFileAsync("node", [cliPath, "session:resume"]);
      assert.match(resumeCmd.stdout, /RESUME|Resuming Session/i);

      // 4. Clear
      const clearCmd = await execFileAsync("node", [cliPath, "session:clear", "cli-test-session"]);
      assert.match(clearCmd.stdout, /CLEARED|Session checkpoint cleared/i);
    });
  });
});
