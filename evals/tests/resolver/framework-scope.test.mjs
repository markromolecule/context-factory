import { before, after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discoverFrameworkScope } from "../../../scripts/framework-scope.mjs";
import { resolveContext } from "../../../scripts/context-core.mjs";

const rootPage = "src/app/page.tsx";
const reactView = "packages/react/src/Widget.tsx";
const reactHook = "packages/react/src/hooks/useClock.ts";
const solidView = "packages/solid/src/Counter.tsx";
const nestedNextPage = "packages/react/apps/next/src/app/page.tsx";
const plainView = "packages/plain/src/Widget.tsx";
const reactJsx = "packages/react/src/Legacy.jsx";
const solidJs = "packages/solid/src/legacy.js";

describe("Unit 02.02: package and language scope", () => {
  let hostDir;

  before(async () => {
    hostDir = await mkdtemp(join(tmpdir(), "context-framework-scope-"));
    const packages = [
      ["", { dependencies: { next: "15.0.0" } }],
      ["packages/react", { dependencies: { react: "19.0.0" } }],
      ["packages/solid", { dependencies: { "solid-js": "1.0.0" } }],
      ["packages/react/apps/next", { dependencies: { next: "15.0.0" } }],
      ["packages/plain", { dependencies: {} }],
    ];
    for (const [directory, pkg] of packages) {
      const target = join(hostDir, directory);
      await mkdir(target, { recursive: true });
      await writeFile(join(target, "package.json"), JSON.stringify(pkg));
    }
  });

  after(async () => {
    if (hostDir) await rm(hostDir, { recursive: true, force: true });
  });

  it("records the owning package for root, sibling, and nested frameworks", async () => {
    const scope = [rootPage, reactView, solidView, nestedNextPage, plainView];
    const found = await discoverFrameworkScope({ hostDir, scope, request: "React Next Solid" });
    assert.deepEqual(found.byPath[rootPage], ["nextjs", "react"]);
    assert.deepEqual(found.byPath[reactView], ["react"]);
    assert.deepEqual(found.byPath[solidView], ["solidjs"]);
    assert.deepEqual(found.byPath[nestedNextPage], ["nextjs", "react"]);
    assert.deepEqual(found.byPath[plainView], []);
    assert.equal(found.packageByPath[rootPage], "package.json");
    assert.equal(found.packageByPath[reactView], "packages/react/package.json");
    assert.equal(found.packageByPath[solidView], "packages/solid/package.json");
    assert.equal(found.packageByPath[nestedNextPage], "packages/react/apps/next/package.json");
    assert.equal(found.packageByPath[plainView], "packages/plain/package.json");
    assert.ok(scope.every((path) => found.sourceByPath[path] === "package"));
  });

  it("uses the affected package instead of framework words or sibling dependencies", async () => {
    const react = await resolveContext("Implement a Solid and Next component in React", {
      hostDir, stack: "typescript", scope: [reactView],
    });
    const reactRules = react.rules.map((rule) => rule.path);
    assert.ok(reactRules.includes("rules/typescript/frameworks/react.md"));
    assert.ok(!reactRules.includes("rules/typescript/frameworks/nextjs.md"));
    assert.ok(!reactRules.includes("rules/typescript/frameworks/solidjs.md"));
    assert.equal(react.coverage.status, "SUPPORTED");
    assert.equal(react.frameworkPackages[reactView], "packages/react/package.json");
    assert.equal(react.frameworkSources[reactView], "package");

    const solid = await resolveContext("Implement a React and Next component in Solid", {
      hostDir, stack: "typescript", scope: [solidView],
    });
    const solidRules = solid.rules.map((rule) => rule.path);
    assert.ok(solidRules.includes("rules/typescript/frameworks/solidjs.md"));
    assert.ok(!solidRules.includes("rules/typescript/frameworks/react.md"));
    assert.ok(!solidRules.includes("rules/typescript/frameworks/nextjs.md"));

    const plain = await resolveContext("Implement a React component in this plain package", {
      hostDir, stack: "typescript", scope: [plainView],
    });
    assert.ok(!plain.rules.some((rule) => rule.path.startsWith("rules/typescript/frameworks/")));
  });

  it("applies React hook guidance to a TypeScript file in its owning package", async () => {
    const selection = await resolveContext("Implement a React hook", {
      hostDir, stack: "typescript", scope: [reactHook],
    });
    assert.ok(selection.rules.some((rule) => rule.path === "rules/typescript/hooks/custom-hooks.md"));
    assert.ok(!selection.rules.some((rule) => rule.path === "rules/typescript/frameworks/solidjs.md"));
    assert.equal(selection.coverage.paths[0].language, "typescript");
    assert.equal(selection.coverage.status, "SUPPORTED");
  });

  it("does not infer a framework from a scoped material prompt without package evidence", async () => {
    const found = await discoverFrameworkScope({ scope: ["unregistered/Widget.tsx"], request: "Implement a React component" });
    assert.deepEqual(found.byPath["unregistered/Widget.tsx"], []);
    assert.equal(found.packageByPath["unregistered/Widget.tsx"], "package.json");
    assert.equal(found.sourceByPath["unregistered/Widget.tsx"], "package");
  });

  it("labels unscoped prompt hints as provisional rather than package evidence", async () => {
    const found = await discoverFrameworkScope({ hostDir, request: "Discuss Solid components" });
    assert.deepEqual(found.byPath[""], ["nextjs", "react"]);
    assert.equal(found.sourceByPath[""], "package");

    const noScope = await discoverFrameworkScope({ request: "Discuss React components" });
    assert.deepEqual(noScope.byPath[""], ["react"]);
    assert.equal(noScope.sourceByPath[""], "request-hint");
  });

  it("keeps applicable global and security rules for JavaScript while excluding TypeScript directives", async () => {
    const selection = await resolveContext("Fix authorization bug in React legacy view", {
      hostDir, stack: "typescript", scope: [solidJs],
    });
    const rulePaths = selection.rules.map((rule) => rule.path);
    assert.ok(rulePaths.includes("rules/global/evidence-and-claims.md"));
    assert.ok(rulePaths.includes("rules/global/security-guardrails.md"));
    assert.ok(!rulePaths.some((path) => path.startsWith("rules/typescript/")));
    assert.equal(selection.coverage.status, "UNSUPPORTED");
    assert.deepEqual(selection.coverage.paths.map((item) => [item.path, item.language, item.status]), [
      [solidJs, "javascript", "UNSUPPORTED"],
    ]);
  });

  it("does not select TypeScript rules for JSX even in a React package", async () => {
    const selection = await resolveContext("Update React legacy view", {
      hostDir, stack: "typescript", scope: [reactJsx],
    });
    assert.ok(!selection.rules.some((rule) => rule.path.startsWith("rules/typescript/")));
    assert.equal(selection.coverage.paths[0].language, "javascript");
    assert.equal(selection.coverage.paths[0].status, "UNSUPPORTED");
  });

  it("reports mixed TSX and JavaScript scope without labelling JavaScript as TypeScript", async () => {
    const selection = await resolveContext("Fix authorization bug in Solid views", {
      hostDir, stack: "typescript", scope: [solidView, solidJs],
    });
    assert.equal(selection.coverage.status, "UNSUPPORTED");
    assert.deepEqual(selection.coverage.paths.map((item) => [item.path, item.language, item.status]), [
      [solidView, "typescript", "SUPPORTED"],
      [solidJs, "javascript", "UNSUPPORTED"],
    ]);
    assert.ok(selection.rules.some((rule) => rule.path === "rules/typescript/frameworks/solidjs.md"));
    assert.ok(selection.rules.some((rule) => rule.path === "rules/global/security-guardrails.md"));
  });

  it("reports unsupported TypeScript coverage when no TypeScript rule matches the path", async () => {
    const selection = await resolveContext("Update a TypeScript module", {
      hostDir, stack: "typescript", scope: ["packages/plain/src/entry.mts"],
    });
    assert.equal(selection.coverage.status, "UNSUPPORTED");
    assert.deepEqual(selection.coverage.paths[0].typescriptRulePaths, []);
    assert.ok(selection.coverage.paths[0].reason.includes("No TypeScript rule"));
  });
});
