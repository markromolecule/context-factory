import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handleConformCommand } from "../../../app/cli/commands/conform.mjs";
import { handlePreflightCommand } from "../../../app/cli/commands/preflight.mjs";
import { handleResolveCommand } from "../../../app/cli/commands/resolve.mjs";
import { resolveContext } from "../../../scripts/context-core.mjs";

describe("Decommissioned Stack Conformance (ADR 0036)", () => {
  it("conform command fails closed with exit code 2 (BLOCKED) for --stack laravel", async () => {
    let capturedLog = "";
    let capturedErr = "";
    const originalLog = console.log;
    const originalErr = console.error;

    try {
      console.log = (msg) => { capturedLog += String(msg) + "\n"; };
      console.error = (msg) => { capturedErr += String(msg) + "\n"; };

      const exitCode = await handleConformCommand([], { stack: "laravel" });
      assert.strictEqual(exitCode, 2, "conform --stack laravel must return exit code 2");
      assert.match(capturedErr, /ADR 0036/, "conform diagnostic must cite ADR 0036");
      assert.match(capturedErr, /decommissioned/i, "conform diagnostic must state laravel is decommissioned");
    } finally {
      console.log = originalLog;
      console.error = originalErr;
    }
  });

  it("conform command emits structured BLOCKED verdict in JSON mode for --stack laravel", async () => {
    let capturedLog = "";
    const originalLog = console.log;

    try {
      console.log = (msg) => { capturedLog += String(msg) + "\n"; };

      const exitCode = await handleConformCommand([], { stack: "laravel", json: true });
      assert.strictEqual(exitCode, 2, "conform --stack laravel --json must return exit code 2");
      const parsed = JSON.parse(capturedLog);
      assert.strictEqual(parsed.verdict, "BLOCKED");
      assert.strictEqual(parsed.status, "BLOCKED");
      assert.match(parsed.error, /ADR 0036/);
    } finally {
      console.log = originalLog;
    }
  });

  it("preflight command fails closed with exit code 2 (BLOCKED) for --stack laravel", async () => {
    let capturedErr = "";
    const originalErr = console.error;

    try {
      console.error = (msg) => { capturedErr += String(msg) + "\n"; };

      const exitCode = await handlePreflightCommand([], { stack: "laravel" });
      assert.strictEqual(exitCode, 2, "preflight --stack laravel must return exit code 2");
      assert.match(capturedErr, /ADR 0036/, "preflight diagnostic must cite ADR 0036");
    } finally {
      console.error = originalErr;
    }
  });

  it("preflight command emits structured BLOCKED status in JSON mode for --stack laravel", async () => {
    let capturedLog = "";
    const originalLog = console.log;

    try {
      console.log = (msg) => { capturedLog += String(msg) + "\n"; };

      const exitCode = await handlePreflightCommand([], { stack: "laravel", json: true });
      assert.strictEqual(exitCode, 2, "preflight --stack laravel --json must return exit code 2");
      const parsed = JSON.parse(capturedLog);
      assert.strictEqual(parsed.status, "BLOCKED");
      assert.match(parsed.error, /ADR 0036/);
    } finally {
      console.log = originalLog;
    }
  });

  it("resolve command fails closed with exit code 2 (BLOCKED) for --stack laravel", async () => {
    let capturedErr = "";
    const originalErr = console.error;

    try {
      console.error = (msg) => { capturedErr += String(msg) + "\n"; };

      const exitCode = await handleResolveCommand(["create order"], { stack: "laravel" });
      assert.strictEqual(exitCode, 2, "resolve --stack laravel must return exit code 2");
      assert.match(capturedErr, /ADR 0036/, "resolve diagnostic must cite ADR 0036");
    } finally {
      console.error = originalErr;
    }
  });

  it("resolveContext throws informative decommissioned error when stack is laravel", async () => {
    await assert.rejects(
      async () => {
        await resolveContext("implement order logic", { stack: "laravel" });
      },
      (err) => {
        assert.match(err.message, /ADR 0036/);
        assert.match(err.message, /decommissioned/i);
        return true;
      }
    );
  });
});
