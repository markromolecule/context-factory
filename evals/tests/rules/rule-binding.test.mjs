import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { compileRuleBinding } from "../../../orchestrator/rules/binding-compiler.mjs";
import { loadSchema, validateSchema } from "../../../orchestrator/validator.mjs";
import { resolveContext } from "../../../scripts/context-core.mjs";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { renderCompiledDirectives } from "../../../orchestrator/rules/prompt-compiler.mjs";

describe("Framework-specific TypeScript rules", () => {
  async function withHost(packages, run) {
    const hostDir = await mkdtemp(join(tmpdir(), "cf-frameworks-"));
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

  it("uses installed SolidJS despite React wording and includes actual rule statements", async () => {
    await withHost({ ".": { "solid-js": "1.9.0" } }, async (hostDir) => {
      const result = await resolveContext("Fix component using a React-like pattern", {
        hostDir, stack: "typescript", scope: ["src/components/Counter.tsx"],
      });
      const ids = result.binding.directives.map((d) => d.id);
      assert.ok(ids.includes("ts.solidjs.preserve-reactivity"));
      assert.ok(!ids.some((id) => id.startsWith("ts.react.") || id.startsWith("ts.nextjs.")));
      assert.ok(!ids.includes("ts.structure.rsc-default"));
      assert.ok(!result.rules.some((r) => /backend\/|database\/|next-react/.test(r.path)));
      assert.match(renderCompiledDirectives(result.binding), /Read reactive props inside tracked expressions/);
    });
  });

  it("loads React alone for React and React plus Next.js for Next.js", async () => {
    for (const dependencies of [{ react: "19.0.0" }, { next: "15.0.0", react: "19.0.0" }]) {
      await withHost({ ".": dependencies }, async (hostDir) => {
        const result = await resolveContext("Update component", { hostDir, stack: "typescript", scope: ["src/components/Button.tsx"] });
        const ids = result.binding.directives.map((d) => d.id);
        assert.ok(ids.includes("ts.react.hooks-and-effects"));
        assert.equal(ids.includes("ts.structure.rsc-default"), Boolean(dependencies.next));
        assert.ok(!ids.some((id) => id.startsWith("ts.solidjs.")));
      });
    }
  });

  it("uses each monorepo package and never binds framework rules to another package's files", async () => {
    await withHost({ ".": {}, "apps/web": { react: "19.0.0" }, "apps/dashboard": { "solid-js": "1.9.0" } }, async (hostDir) => {
      const result = await resolveContext("Update component and shared utility", {
        hostDir, stack: "typescript", scope: ["apps/web/src/utils.ts", "apps/dashboard/src/components/Counter.tsx"],
      });
      assert.ok(result.binding.directives.some((d) => d.id === "ts.solidjs.preserve-reactivity"));
      assert.ok(!result.binding.directives.some((d) => d.id === "ts.react.hooks-and-effects"));
      assert.ok(result.binding.directives.some((d) => d.id === "ts.forms.visible-labels-required"));
    });
  });

  it("does not guess a host framework from the prompt when the package declares none", async () => {
    await withHost({ ".": {} }, async (hostDir) => {
      const result = await resolveContext("Use React or SolidJS for this change", { hostDir, stack: "typescript", scope: ["src/Component.tsx"] });
      assert.deepEqual(result.frameworks, []);
      assert.ok(!result.binding.directives.some((d) => /frameworks\//.test(d.rulePath)));
    });
  });

  it("surfaces invalid package metadata instead of silently guessing framework rules", async () => {
    await withHost({ ".": { react: "19.0.0" } }, async (hostDir) => {
      await writeFile(join(hostDir, "package.json"), "{invalid");
      await assert.rejects(resolveContext("Fix React component", { hostDir, stack: "typescript", scope: ["src/Component.tsx"] }), SyntaxError);
    });
  });
});

describe("Unit 02.01: Rule Binding Compiler and Artifact-Aware Resolver", () => {
  const sampleDescriptors = [
    {
      id: "cf-rule-ts-type-safety",
      rulePath: "rules/typescript/common/type-safety.md",
      title: "Type Safety",
      stack: "typescript",
      sourceHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      directives: [
        {
          id: "ts.type-safety.ban-any",
          title: "Ban any",
          mode: "automated-blocking",
          statement: "Ban any. Use unknown when incoming data types are indeterminate.",
          contentHash: "sha256:1111111111111111111111111111111111111111111111111111111111111111",
          verifier: { type: "typechecker" },
          applicability: { paths: ["**/*.ts", "**/*.tsx"], layers: ["common", "services"] }
        }
      ]
    },
    {
      id: "cf-rule-laravel-orm",
      rulePath: "rules/laravel/common/orm.md",
      title: "Laravel ORM",
      stack: "laravel",
      sourceHash: "sha256:2222222222222222222222222222222222222222222222222222222222222222",
      directives: [
        {
          id: "laravel.orm.no-n-plus-one",
          title: "No N+1 queries",
          mode: "automated-blocking",
          statement: "Eager load relationships.",
          contentHash: "sha256:3333333333333333333333333333333333333333333333333333333333333333",
          verifier: { type: "test" },
          applicability: { paths: ["app/**/*.php"] }
        }
      ]
    },
    {
      id: "cf-rule-global-arch",
      rulePath: "rules/global/architecture-conformance.md",
      title: "Architecture Conformance",
      stack: "global",
      sourceHash: "sha256:4444444444444444444444444444444444444444444444444444444444444444",
      directives: [
        {
          id: "cf.arch.solid",
          title: "SOLID Principles",
          mode: "automated-blocking",
          statement: "Enforce SRP, OCP, LSP, ISP, and DIP.",
          contentHash: "sha256:5555555555555555555555555555555555555555555555555555555555555555",
          verifier: { type: "linter" },
          applicability: { paths: ["**/*"] }
        }
      ]
    }
  ];

  describe("Deterministic Compilation & Schema Conformance", () => {
    it("compiles valid binding matching declared stack and paths", async () => {
      const result = compileRuleBinding({
        taskId: "0001",
        phase: "02",
        unit: "02.01",
        stack: "typescript",
        workflow: "feature-delivery",
        affectedScope: ["src/services/user.ts"],
        descriptors: sampleDescriptors
      });

      assert.equal(result.diagnostics.length, 0);
      assert.ok(result.binding);
      assert.equal(result.binding.stack, "typescript");
      assert.equal(result.binding.affectedScope[0], "src/services/user.ts");

      // Directives should include ts.type-safety.ban-any and cf.arch.solid (global)
      // and exclude laravel.orm.no-n-plus-one
      const directiveIds = result.binding.directives.map((d) => d.id);
      assert.ok(directiveIds.includes("ts.type-safety.ban-any"));
      assert.ok(directiveIds.includes("cf.arch.solid"));
      assert.equal(directiveIds.includes("laravel.orm.no-n-plus-one"), false);

      // Validate schema
      const schema = await loadSchema("rule-binding.schema.json");
      const validation = validateSchema(result.binding, schema);
      assert.equal(validation.valid, true, `Binding schema validation errors: ${validation.errors.join(", ")}`);
    });

    it("produces identical binding hash on repeat runs (deterministic)", () => {
      const run1 = compileRuleBinding({
        taskId: "0001",
        phase: "02",
        unit: "02.01",
        stack: "typescript",
        workflow: "feature-delivery",
        affectedScope: ["src/services/user.ts"],
        descriptors: sampleDescriptors
      });

      const run2 = compileRuleBinding({
        taskId: "0001",
        phase: "02",
        unit: "02.01",
        stack: "typescript",
        workflow: "feature-delivery",
        affectedScope: ["src/services/user.ts"],
        descriptors: sampleDescriptors
      });

      assert.equal(run1.binding.bindingHash, run2.binding.bindingHash);
      assert.deepEqual(run1.binding.directives, run2.binding.directives);
    });

    it("records explicit reasons for inclusion and exclusion", () => {
      const result = compileRuleBinding({
        taskId: "0001",
        phase: "02",
        unit: "02.01",
        stack: "typescript",
        workflow: "feature-delivery",
        affectedScope: ["src/services/user.ts"],
        descriptors: sampleDescriptors
      });

      const laravelExcluded = result.excluded.find((e) => e.directiveId === "laravel.orm.no-n-plus-one");
      assert.ok(laravelExcluded, "Expected laravel directive to be excluded");
      assert.match(laravelExcluded.reason, /stack/i);

      const tsSelected = result.selected.find((s) => s.directiveId === "ts.type-safety.ban-any");
      assert.ok(tsSelected, "Expected typescript directive to be selected");
      assert.match(tsSelected.reason, /matched/i);
    });
  });

  describe("Ambiguity and Scope Rejection", () => {
    it("rejects material binding when affectedScope is empty or missing", () => {
      const result = compileRuleBinding({
        taskId: "0001",
        phase: "02",
        unit: "02.01",
        stack: "typescript",
        workflow: "feature-delivery",
        affectedScope: [],
        descriptors: sampleDescriptors
      });

      assert.equal(result.binding, null);
      assert.ok(result.diagnostics.some((d) => /scope/i.test(d.message)));
    });

    it("rejects material binding when stack is empty or missing", () => {
      const result = compileRuleBinding({
        taskId: "0001",
        phase: "02",
        unit: "02.01",
        workflow: "feature-delivery",
        affectedScope: ["src/index.ts"],
        descriptors: sampleDescriptors
      });

      assert.equal(result.binding, null);
      assert.ok(result.diagnostics.some((d) => /stack/i.test(d.message)));
    });
  });

  describe("Waiver Scope Attachment", () => {
    it("attaches active matching waiver and excludes expired waiver", () => {
      const activeWaiver = {
        id: "waiver-001",
        directiveId: "ts.type-safety.ban-any",
        scope: ["src/services/user.ts"],
        authorizedBy: "architect",
        status: "active"
      };
      const expiredWaiver = {
        id: "waiver-002",
        directiveId: "cf.arch.solid",
        scope: ["src/services/user.ts"],
        authorizedBy: "architect",
        status: "expired"
      };

      const result = compileRuleBinding({
        taskId: "0001",
        phase: "02",
        unit: "02.01",
        stack: "typescript",
        workflow: "feature-delivery",
        affectedScope: ["src/services/user.ts"],
        descriptors: sampleDescriptors,
        waivers: [activeWaiver, expiredWaiver]
      });

      assert.ok(result.binding.waivers.includes("waiver-001"));
      assert.equal(result.binding.waivers.includes("waiver-002"), false);
    });
  });

  describe("Artifact-Aware Context Resolution Integration", () => {
    it("exposes binding when stack and scope are provided in resolveContext", async () => {
      const res = await resolveContext("Build user authentication service", {
        stack: "typescript",
        scope: ["src/auth/service.ts"],
        workflow: "feature-delivery"
      });

      assert.ok(res.binding, "Expected enforceable binding in resolveContext result");
      assert.equal(res.binding.stack, "typescript");
      assert.ok(Array.isArray(res.rules), "Legacy rules selection array preserved");
    });

    it("returns null binding for ambiguous request without scope while preserving legacy rules", async () => {
      const res = await resolveContext("Build something", {});
      assert.equal(res.binding, null, "Ambiguous request must not synthesize an enforceable binding");
      assert.ok(Array.isArray(res.rules), "Legacy informational rules array is preserved");
    });
  });
});
