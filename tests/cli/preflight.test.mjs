import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const cli = resolve(root, "app/cli/bin/context-cli.mjs");
const harness = resolve(root, "scripts/context.mjs");

function preflight(args, entry = cli) {
  const run = spawnSync(process.execPath, [entry, "preflight", ...args, "--json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(run.signal, null, run.stderr);
  return { code: run.status, result: JSON.parse(run.stdout) };
}

describe("Unit 01.03: preflight selection states", () => {
  it("blocks an empty material invocation", () => {
    const { code, result } = preflight([]);
    assert.equal(code, 2);
    assert.equal(result.status, "BLOCKED");
    assert.equal(result.bindingId, null);
  });

  it("blocks a material request with no affected scope, even without --require-binding", () => {
    const { code, result } = preflight(["implement a service", "--stack", "typescript"]);
    assert.equal(code, 2);
    assert.equal(result.status, "BLOCKED");
    assert.equal(result.bindingId, null);
    assert.match(result.reason, /scope/i);
    assert.match(result.nextAction, /--scope/);
    assert.equal(result.codeVerification, "NOT_RUN");
  });

  it("returns an information-only receipt for a direct question", () => {
    const { code, result } = preflight(["what is a hook?", "--stack", "typescript"]);
    assert.equal(code, 0);
    assert.equal(result.status, "INFORMATION");
    assert.equal(result.bindingId, null);
    assert.equal(result.codeVerification, "NOT_RUN");
  });

  for (const extension of ["js", "jsx", "mjs"]) {
    it(`does not label ${extension} scope TypeScript-ready`, () => {
      const { code, result } = preflight(["implement component", "--stack", "typescript", "--scope", `src/component.${extension}`, "--require-binding"]);
      assert.equal(code, 2);
      assert.equal(result.status, "UNSUPPORTED");
      assert.equal(result.codeVerification, "NOT_RUN");
      assert.match(result.nextAction, /TypeScript|global|security/i);
      assert.ok(!result.scopeLanguages.includes("typescript"));
      if (extension !== "jsx") {
        assert.ok(result.globalSecurityDirectives.length > 0);
      }
    });
  }

  it("blocks zero-directive coverage even when a binding ID exists", () => {
    const { code, result } = preflight(["implement feature", "--stack", "typescript", "--scope", "README.md"]);
    assert.equal(code, 2);
    assert.equal(result.directivesCount, 0);
    assert.notEqual(result.status, "READY");
    assert.match(result.reason, /coverage|directive/i);
  });

  it("returns an inspectable selection binding for TypeScript without a code PASS claim", () => {
    const { code, result } = preflight(["implement service", "--stack", "typescript", "--scope", "src/service.ts"]);
    assert.equal(code, 0);
    assert.equal(result.status, "READY");
    assert.match(result.bindingId, /^binding-/);
    assert.match(result.bindingHash, /^sha256:/);
    assert.ok(result.directivesCount > 0);
    assert.equal(result.codeVerification, "NOT_RUN");
    assert.equal(result.scopeLanguages[0], "typescript");
  });

  it("blocks a mixed TypeScript and JavaScript material scope", () => {
    const { code, result } = preflight(["implement service", "--stack", "typescript", "--scope", "src/service.ts,src/helper.js"]);
    assert.equal(code, 2);
    assert.equal(result.status, "UNSUPPORTED");
    assert.ok(result.scopeLanguages.includes("typescript"));
    assert.ok(result.scopeLanguages.includes("javascript"));
  });

  it("the harness dispatcher has the same fail-closed exit and JSON status", () => {
    const { code, result } = preflight(["implement service", "--scope", "src/service.jsx"], harness);
    assert.equal(code, 2);
    assert.equal(result.status, "UNSUPPORTED");
  });
});
