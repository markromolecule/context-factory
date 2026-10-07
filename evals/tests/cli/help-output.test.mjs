import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { main, showHelp } from "../../../app/cli/bin/context-cli.mjs";

describe("Unit 01.02: Text-first help and output (AC-05)", () => {
  it("renders compact text-first help without mascot (AC-05)", async () => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));

    try {
      showHelp();
      const output = logs.join("\n");

      // No mascot half-blocks or Octo-Agent references
      assert.doesNotMatch(output, /[▀▄]/, "should not contain half-block graphic art");
      assert.doesNotMatch(output, /Octo-Agent|Mascot/i, "should not reference mascot");

      // Displays one-line identity and quality journey
      assert.match(output, /Context Factory CLI/i);
      assert.match(output, /preflight/i);
      assert.match(output, /conform/i);

      // Examples are present
      assert.match(output, /context-cli preflight/);
      assert.match(output, /context-cli conform/);
    } finally {
      console.log = originalLog;
    }
  });

  it("suppresses ANSI color codes under NO_COLOR or --no-color", async () => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));

    const originalNoColor = process.env.NO_COLOR;
    process.env.NO_COLOR = "1";

    try {
      showHelp();
      const output = logs.join("\n");
      assert.doesNotMatch(output, /\x1b\[\d+m/, "should not contain ANSI color codes when NO_COLOR is set");
    } finally {
      if (originalNoColor === undefined) {
        delete process.env.NO_COLOR;
      } else {
        process.env.NO_COLOR = originalNoColor;
      }
      console.log = originalLog;
    }
  });

  it("exposes detailed catalog when --detail or --all is requested", async () => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));

    try {
      showHelp({ detail: true });
      const output = logs.join("\n");

      // Contains detailed command categories
      assert.match(output, /PROJECT BRIDGING & SETUP|CORE MAINTENANCE & HEALTH|AGENT ORCHESTRATION/i);
      assert.doesNotMatch(output, /[▀▄]/, "detailed catalog must also be mascot-free");
    } finally {
      console.log = originalLog;
    }
  });

  it("maintains stable exit codes and flag aliases", async () => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));

    try {
      const exitEmpty = await main([]);
      assert.equal(exitEmpty, 0);

      const exitHelp = await main(["--help"]);
      assert.equal(exitHelp, 0);

      const exitVersion = await main(["--version"]);
      assert.equal(exitVersion, 0);
      assert.match(logs.join("\n"), /context-factory v/);
    } finally {
      console.log = originalLog;
    }
  });
});
