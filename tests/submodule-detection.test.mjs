import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { detectSubmoduleContext, checkHostSubmoduleStatus } from "../app/cli/core/bridge-generator.mjs";

describe("Unit 02.01: Submodule Environment Auto-Detection and Hybrid Assistant", () => {
  it("detectSubmoduleContext identifies when CWD is inside a submodule directory", async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), "submod-test-"));
    try {
      // Mock host repo structure
      await mkdir(join(tempRoot, ".git"), { recursive: true });
      await writeFile(
        join(tempRoot, ".gitmodules"),
        '[submodule ".context-factory"]\n  path = .context-factory\n  url = https://github.com/test/context-factory.git\n'
      );

      // Mock submodule inside host repo
      const submodDir = join(tempRoot, ".context-factory");
      await mkdir(submodDir, { recursive: true });

      // Run detection from inside submodule
      const insideRes = detectSubmoduleContext(submodDir);
      assert.equal(insideRes.isInsideSubmodule, true, "Must detect execution from inside submodule");
      assert.equal(insideRes.hostDir, "..", "Host directory must default to ..");
      assert.equal(insideRes.submoduleDirName, ".context-factory");

      // Run detection from host repo root
      const hostRes = detectSubmoduleContext(tempRoot);
      assert.equal(hostRes.isInsideSubmodule, false, "Must detect execution from host root");
      assert.equal(hostRes.hasSubmodule, true, "Must detect existing submodule folder");
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

  it("checkHostSubmoduleStatus inspects host .gitmodules accurately", async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), "gitmod-test-"));
    try {
      // Host without gitmodules
      const noModRes = checkHostSubmoduleStatus(tempRoot);
      assert.equal(noModRes.hasGitModules, false);
      assert.equal(noModRes.isContextFactorySubmoduled, false);

      // Host with gitmodules containing context-factory
      await writeFile(
        join(tempRoot, ".gitmodules"),
        '[submodule ".context-factory"]\n  path = .context-factory\n  url = https://github.com/example/context-factory.git\n'
      );
      const modRes = checkHostSubmoduleStatus(tempRoot);
      assert.equal(modRes.hasGitModules, true);
      assert.equal(modRes.isContextFactorySubmoduled, true);
      assert.equal(modRes.submodulePath, ".context-factory");
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });
});
