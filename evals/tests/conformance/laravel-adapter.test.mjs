import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  discoverLaravelCapabilities,
  laravelAdapter,
  registerLaravelAdapter,
} from "../../../orchestrator/conformance/adapters/laravel.mjs";
import { clearAdapters, getAdapter } from "../../../orchestrator/conformance/adapter-contract.mjs";
import { evaluateConformance } from "../../../orchestrator/conformance/conformance-orchestrator.mjs";

const fixture = (name) => `evals/fixtures/laravel-conformance/${name}`;

const binding = {
  id: "bind-laravel-pilot",
  bindingHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  stack: "laravel",
  affectedScope: [],
  directives: [
    { id: "laravel.validation.form-request", mode: "automated-blocking", rulePath: "rules/laravel/http/requests-and-validation.md", contentHash: "sha256:1111111111111111111111111111111111111111111111111111111111111111" },
    { id: "laravel.authorization.policy", mode: "automated-blocking", rulePath: "rules/laravel/security/authorization.md", contentHash: "sha256:2222222222222222222222222222222222222222222222222222222222222222" },
    { id: "laravel.orm.no-unbounded-all", mode: "automated-blocking", rulePath: "rules/laravel/database/query-optimization.md", contentHash: "sha256:3333333333333333333333333333333333333333333333333333333333333333" },
    { id: "laravel.quality.phpstan", mode: "automated-blocking", rulePath: "rules/laravel/foundation/conventions.md", contentHash: "sha256:4444444444444444444444444444444444444444444444444444444444444444" },
  ],
};

const configuredCapabilities = {
  hasComposerJson: true,
  hasArtisan: true,
  scripts: { test: "php artisan test" },
  tools: { php: true, composer: true, pint: false, phpstan: true, psalm: false, pest: false, phpunit: true, architecture: false },
};

describe("Unit 06.01: Laravel conformance adapter", () => {
  beforeEach(() => {
    clearAdapters();
    registerLaravelAdapter();
  });

  it("registers through the shared adapter port and passes a conforming fixture", async () => {
    assert.equal(getAdapter("laravel"), laravelAdapter);

    const report = await evaluateConformance({
      binding,
      changedScope: [fixture("conforming/StoreOrderRequest.php")],
      capabilities: configuredCapabilities,
      options: { cwd: process.cwd() },
      commandService: async () => ({ exitCode: 0, stdout: "OK", stderr: "", timedOut: false, notFound: false }),
    });

    assert.equal(report.verdict, "PASS");
    assert.equal(report.summary.failed, 0);
  });

  it("maps validation, authorization, and ORM violations to shared FAIL results", async () => {
    const report = await evaluateConformance({
      binding,
      changedScope: [fixture("violating/UnsafeOrderController.php")],
      capabilities: configuredCapabilities,
      options: { cwd: process.cwd() },
      commandService: async () => ({ exitCode: 0, stdout: "OK", stderr: "", timedOut: false, notFound: false }),
    });

    assert.equal(report.verdict, "FAIL");
    for (const directiveId of ["laravel.validation.form-request", "laravel.authorization.policy", "laravel.orm.no-unbounded-all"]) {
      assert.equal(report.results.find((result) => result.directiveId === directiveId)?.status, "FAIL");
    }
  });

  it("reports configured but unavailable quality tooling as TOOL_UNAVAILABLE", async () => {
    const report = await evaluateConformance({
      binding,
      changedScope: [fixture("conforming/StoreOrderRequest.php")],
      capabilities: { ...configuredCapabilities, tools: { ...configuredCapabilities.tools, phpstan: false } },
      options: { cwd: process.cwd() },
    });

    assert.equal(report.verdict, "BLOCKED");
    assert.equal(report.results.find((result) => result.directiveId === "laravel.quality.phpstan")?.status, "TOOL_UNAVAILABLE");
  });

  it("preserves shared evidence-blocking semantics", async () => {
    const evidenceBinding = { ...binding, directives: [{ ...binding.directives[0], id: "laravel.architecture.boundary", mode: "evidence-blocking" }] };
    const blocked = await evaluateConformance({ binding: evidenceBinding, changedScope: [fixture("conforming/StoreOrderRequest.php")] });
    assert.equal(blocked.verdict, "BLOCKED");
    assert.equal(blocked.results[0].status, "NOT_AUTOMATABLE");

    const approved = await evaluateConformance({
      binding: evidenceBinding,
      changedScope: [fixture("conforming/StoreOrderRequest.php")],
      options: { humanEvidence: "Mark Joseph reviewed the Laravel adapter boundary." },
    });
    assert.equal(approved.verdict, "PASS");
    assert.equal(approved.results[0].evidence.humanEvidence, "Mark Joseph reviewed the Laravel adapter boundary.");
  });

  it("discovers Composer scripts and Laravel tool declarations without assuming host binaries", async () => {
    const files = new Map([
      [resolve("/host", "composer.json"), JSON.stringify({ require: { "laravel/framework": "^12.0" }, "require-dev": { "laravel/pint": "^1.0", "phpstan/phpstan": "^2.0", "pestphp/pest": "^3.0" }, scripts: { test: "pest" } })],
      [resolve("/host", "artisan"), "#!/usr/bin/env php"],
    ]);
    const capabilities = await discoverLaravelCapabilities("/host", {
      readTextFn: async (path) => {
        if (!files.has(path)) throw new Error("ENOENT");
        return files.get(path);
      },
    });

    assert.deepEqual(capabilities.scripts, { test: "pest" });
    assert.equal(capabilities.hasArtisan, true);
    assert.equal(capabilities.tools.pint, true);
    assert.equal(capabilities.tools.phpstan, true);
    assert.equal(capabilities.tools.pest, true);
    assert.equal(capabilities.tools.php, false);
  });
});

describe("Unit 06.01: Laravel adapter architecture and process safety", () => {
  it("keeps core conformance modules free of Laravel imports and conditionals", async () => {
    const coreFiles = ["adapter-contract.mjs", "conformance-orchestrator.mjs", "evidence-gate.mjs"];
    for (const file of coreFiles) {
      const content = await readFile(resolve(process.cwd(), "orchestrator/conformance", file), "utf8");
      assert.doesNotMatch(content, /laravel/i, `${file} must stay stack-neutral`);
    }
  });

  it("passes quality tool commands as argv arrays with a bounded timeout", async () => {
    let invocation;
    const results = await laravelAdapter.evaluate({
      binding: { ...binding, directives: [binding.directives[3]] },
      changedScope: [fixture("conforming/StoreOrderRequest.php")],
      capabilities: configuredCapabilities,
      options: { cwd: process.cwd() },
      commandService: async (input) => {
        invocation = input;
        return { exitCode: 0, stdout: "OK", stderr: "", timedOut: false, notFound: false };
      },
    });

    assert.equal(results[0].status, "PASS");
    assert.deepEqual(invocation.command, "vendor/bin/phpstan");
    assert.deepEqual(invocation.args, ["analyse", "--no-progress"]);
    assert.ok(invocation.timeoutMs > 0 && invocation.timeoutMs <= 30000);
  });
});
