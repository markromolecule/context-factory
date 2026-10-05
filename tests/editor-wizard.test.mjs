import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { detectInstalledIdes, parseIdeChoices } from "../app/cli/core/bridge-generator.mjs";

describe("Unit 02.02: Installed IDE Folder Scanner & Numbered Multi-Select Onboarding Menu", () => {
  it("detectInstalledIdes scans project directory and detects existing editor configurations", async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), "ide-scan-test-"));
    try {
      // Empty directory has no detected IDEs
      const emptyRes = detectInstalledIdes(tempRoot);
      assert.deepEqual(emptyRes, []);

      // Create .vscode and .trae
      await mkdir(join(tempRoot, ".vscode"), { recursive: true });
      await mkdir(join(tempRoot, ".trae"), { recursive: true });

      const detected = detectInstalledIdes(tempRoot);
      assert.ok(detected.includes("vscode"), "Must detect .vscode");
      assert.ok(detected.includes("trae"), "Must detect .trae");
      assert.equal(detected.includes("cursor"), false, "Cursor should not be detected");
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

  it("parseIdeChoices parses single, multi-select, and fallback options", () => {
    // Single choice
    assert.deepEqual(parseIdeChoices("1"), ["vscode"]);
    assert.deepEqual(parseIdeChoices("2"), ["antigravity"]);
    assert.deepEqual(parseIdeChoices("3"), ["cursor"]);
    assert.deepEqual(parseIdeChoices("4"), ["trae"]);
    assert.deepEqual(parseIdeChoices("5"), ["all"]);

    // Comma and space separated multi-choices
    assert.deepEqual(parseIdeChoices("1, 4"), ["vscode", "trae"]);
    assert.deepEqual(parseIdeChoices("1,3,4"), ["vscode", "cursor", "trae"]);
    assert.deepEqual(parseIdeChoices("2 4"), ["antigravity", "trae"]);

    // Empty input with detected defaults
    assert.deepEqual(parseIdeChoices("", ["vscode", "trae"]), ["vscode", "trae"]);
    assert.deepEqual(parseIdeChoices("", []), ["all"]);

    // Names directly
    assert.deepEqual(parseIdeChoices("vscode,trae"), ["vscode", "trae"]);
  });
});
