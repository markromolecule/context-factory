import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { parseRuleDescriptor } from "../../../orchestrator/rules/descriptor-parser.mjs";
import { compileRuleBinding } from "../../../orchestrator/rules/binding-compiler.mjs";
import { resolveContext } from "../../../scripts/context-core.mjs";

const repoRoot = process.cwd();

async function read(path) {
  return readFile(join(repoRoot, path), "utf8");
}

async function getDescriptor(path) {
  const content = await read(path);
  const result = parseRuleDescriptor(content, path);
  const errors = result.diagnostics.filter((diagnostic) => diagnostic.level === "error");
  assert.deepEqual(errors, [], `Rule descriptor errors in ${path}: ${errors.map((error) => error.message).join("; ")}`);
  return { content, descriptor: result.descriptor };
}

function findDirective(rule, id) {
  const found = rule.directives.find((candidate) => candidate.id === id);
  assert.ok(found, `Expected directive ${id} in rule ${rule.id}`);
  return found;
}

async function withHost(packages, run) {
  const hostDir = await mkdtemp(join(tmpdir(), "cf-backend-ui-"));
  try {
    for (const [folder, dependencies] of Object.entries(packages)) {
      await mkdir(join(hostDir, folder), { recursive: true });
      await writeFile(join(hostDir, folder, "package.json"), JSON.stringify({ dependencies }));
    }
    await run(hostDir);
  } finally {
    await rm(hostDir, { recursive: true, force: true });
  }
}

describe("Pragmatic backend, UI, and global TypeScript scope alignment (Unit 03.02)", () => {
  it("verifies simple reads permit direct controller-to-data access while tenant/policy-bearing reads mandate trusted service boundaries", async () => {
    const { descriptor: serviceRule } = await getDescriptor("rules/typescript/backend/service-layer.md");
    const { descriptor: controllerRule } = await getDescriptor("rules/typescript/backend/controllers-and-routes.md");

    const coord = findDirective(serviceRule, "ts.service.create-for-coordination");
    const policyBearing = findDirective(serviceRule, "ts.service.policy-bearing-operations");
    const authBoundary = findDirective(serviceRule, "ts.service.enforce-auth-boundary");
    const directRead = findDirective(controllerRule, "ts.controllers.direct-data-for-simple-read");

    // Simple read permitted without pass-through service
    assert.match(coord.statement, /simple read without policy/i);
    assert.match(coord.statement, /controller-to-data directly/i);
    assert.match(coord.statement, /do not add a pass-through service/i);

    // Direct read in controller rule explicitly fences simple reads
    assert.match(directRead.statement, /simple read with no business policy/i);
    assert.match(directRead.statement, /policy-bearing read uses a trusted service or policy boundary/i);
    assert.equal(directRead.mode, "evidence-blocking");

    // Policy-bearing operations mandate service or policy boundary
    assert.match(policyBearing.statement, /commands and policy-bearing reads/i);
    assert.match(policyBearing.statement, /tenant and authorization decisions must not be bypassed/i);
    assert.equal(policyBearing.mode, "evidence-blocking");
    assert.equal(authBoundary.mode, "evidence-blocking");
  });

  it("preserves ADR 0037 operation-first default and established-host layer folder compatibility", async () => {
    const { content, descriptor: moduleRule } = await getDescriptor("rules/typescript/backend/module-architecture.md");
    const layout = findDirective(moduleRule, "ts.module.operation-first-layout");

    assert.equal(layout.mode, "evidence-blocking");
    assert.deepEqual(layout.applicability.paths, ["src/modules/**/*.ts", "src/features/**/*.ts"]);

    // Default layout is operation-first
    assert.match(content, /src\/modules\/<feature>\/<operation>\//);
    assert.match(content, /Default layout: operation-first/i);

    // Established host layer-based alternative is explicitly retained
    assert.match(content, /Layer-based alternative/i);
    assert.match(content, /established host convention/i);

    // Rejects empty placeholder files or artificial splitting
    assert.match(content, /do not add placeholder files/i);
    assert.match(content, /do not create empty files/i);
  });

  it("validates legitimate DTO mapping, schema parsing, and serialization as explicit Demeter/tell-don't-ask exceptions", async () => {
    const { descriptor: dtoRule } = await getDescriptor("rules/typescript/backend/dto-and-serialization.md");
    const { descriptor: pragmaticRule } = await getDescriptor("rules/typescript/common/pragmatic-design.md");

    const domainSeparation = findDirective(dtoRule, "ts.dto.domain-persistence-separation");
    const whitelist = findDirective(dtoRule, "ts.dto.public-response-whitelist");
    const demeter = findDirective(pragmaticRule, "ts.pragmatic.demeter-tell-dont-ask");

    // DTO boundary requires explicit mapping
    assert.match(domainSeparation.statement, /explicitly map validated request DTO values/i);
    assert.match(whitelist.statement, /named whitelist of fields/i);

    // Combined Demeter / tell-don't-ask explicitly excepts DTOs, parsing, serialization, and transformations
    assert.match(demeter.statement, /data[\s-]transfer objects \(DTOs\)/i);
    assert.match(demeter.statement, /validation/i);
    assert.match(demeter.statement, /serialization/i);
    assert.match(demeter.statement, /pure data transformations/i);
  });

  it("aligns UI code organization with cohesive modules and framework-native composition without forced hook splits", async () => {
    const { descriptor: uiRule } = await getDescriptor("rules/typescript/ui/code-organization.md");
    const { descriptor: solidRule } = await getDescriptor("rules/solid/single-responsibility.md");

    const reuse = findDirective(uiRule, "ts.ui.promote-shared-on-reuse");
    const cohesive = findDirective(uiRule, "ts.ui.cohesive-modules");
    const direction = findDirective(uiRule, "ts.ui.enforce-dependency-direction");
    const hooks = findDirective(solidRule, "cf.solid.srp-extract-async-hooks");

    // Reusable only on multiple consumers (YAGNI)
    assert.match(reuse.statement, /multiple real consumers/i);

    // Cohesion preferred over file-per-symbol (KISS)
    assert.match(cohesive.statement, /cohesive modules over one-file-per-symbol/i);

    // Dependency direction respects framework tree-shaking
    assert.match(direction.statement, /direction/i);
    assert.match(direction.statement, /selected framework/i);

    // Hooks rule allows simple local state without forced extraction
    assert.match(hooks.statement, /simple local state or single-use component queries do not require forced hook decomposition/i);
  });

  it("binds pragmatic rules to TypeScript while excluding plain JavaScript from TypeScript-specific directives", async () => {
    const { descriptor: pragmaticRule } = await getDescriptor("rules/typescript/common/pragmatic-design.md");
    const { descriptor: serviceRule } = await getDescriptor("rules/typescript/backend/service-layer.md");
    const { descriptor: qualityRule } = await getDescriptor("rules/global/code-quality.md");
    const { descriptor: archRule } = await getDescriptor("rules/global/architecture-conformance.md");

    const sampleDescriptors = [pragmaticRule, serviceRule, qualityRule, archRule];

    // JavaScript scope compilation
    const jsResult = compileRuleBinding({
      taskId: "PLN-0008",
      phase: "03",
      unit: "03.02",
      stack: "javascript",
      workflow: "feature-delivery",
      affectedScope: ["legacy/service.js"],
      descriptors: sampleDescriptors,
    });

    assert.ok(jsResult.binding, "Expected binding for JavaScript");
    const jsDirectives = jsResult.binding.directives.map((d) => d.id);

    // Global directives bind to JavaScript
    assert.ok(jsDirectives.includes("cf.quality.solid-compliance"));
    assert.ok(jsDirectives.includes("cf.arch.solid"));

    // TypeScript-specific pragmatic directives do NOT bind to JavaScript
    assert.ok(!jsDirectives.some((id) => id.startsWith("ts.pragmatic.")));
    assert.ok(!jsDirectives.some((id) => id.startsWith("ts.service.")));

    // Verify exclusions reason
    const pragmaticExcluded = jsResult.excluded.filter((e) => e.directiveId.startsWith("ts.pragmatic."));
    assert.equal(pragmaticExcluded.length, 4);
    assert.ok(pragmaticExcluded.every((e) => e.reason.includes("wrong-stack")));

    // TypeScript scope compilation
    const tsResult = compileRuleBinding({
      taskId: "PLN-0008",
      phase: "03",
      unit: "03.02",
      stack: "typescript",
      workflow: "feature-delivery",
      affectedScope: ["src/modules/orders/get-order/get-order.service.ts"],
      descriptors: sampleDescriptors,
    });

    assert.ok(tsResult.binding, "Expected binding for TypeScript");
    const tsDirectives = tsResult.binding.directives.map((d) => d.id);

    // TypeScript binds pragmatic rules
    assert.ok(tsDirectives.includes("ts.pragmatic.yagni-present-need"));
    assert.ok(tsDirectives.includes("ts.pragmatic.kiss-minimal-implementation"));
    assert.ok(tsDirectives.includes("ts.pragmatic.composition-over-inheritance"));
    assert.ok(tsDirectives.includes("ts.pragmatic.demeter-tell-dont-ask"));
    assert.ok(tsDirectives.includes("ts.service.policy-bearing-operations"));
  });

  it("scopes framework-specific additions strictly by nearest package metadata", async () => {
    await withHost({ ".": { "solid-js": "1.9.0" } }, async (hostDir) => {
      const result = await resolveContext("Add modern responsive card component", {
        hostDir,
        stack: "typescript",
        scope: ["src/components/Card.tsx"],
      });
      const ids = result.binding.directives.map((d) => d.id);
      assert.ok(ids.includes("ts.solidjs.preserve-reactivity"));
      assert.ok(!ids.some((id) => id.startsWith("ts.react.") || id.startsWith("ts.nextjs.")));
    });

    await withHost({ ".": { react: "19.0.0" } }, async (hostDir) => {
      const result = await resolveContext("Add modern responsive card component", {
        hostDir,
        stack: "typescript",
        scope: ["src/components/Card.tsx"],
      });
      const ids = result.binding.directives.map((d) => d.id);
      assert.ok(ids.includes("ts.react.hooks-and-effects"));
      assert.ok(!ids.some((id) => id.startsWith("ts.solidjs.")));
    });

    await withHost({ ".": {} }, async (hostDir) => {
      const result = await resolveContext("Implement React component", {
        hostDir,
        stack: "typescript",
        scope: ["src/components/Card.tsx"],
      });
      assert.deepEqual(result.frameworks, []);
      const ids = result.binding.directives.map((d) => d.id);
      assert.ok(!ids.some((id) => id.startsWith("ts.react.") || id.startsWith("ts.solidjs.")));
    });
  });
});
