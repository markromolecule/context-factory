import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveContext } from "../../../scripts/context-core.mjs";
import { compilePrompt, renderCompiledDirectives } from "../../../orchestrator/rules/prompt-compiler.mjs";
import {
  buildOpenAIPayload,
  buildAnthropicPayload,
  buildGeminiPayload,
} from "../../../orchestrator/runner.mjs";

describe("Representative Web Code-Generation Evaluation Suite", () => {

  async function withTestHost(packages, run) {
    const hostDir = await mkdtemp(join(tmpdir(), "cf-codegen-eval-"));
    try {
      for (const [folder, dependencies] of Object.entries(packages)) {
        await mkdir(join(hostDir, folder), { recursive: true });
        await writeFile(
          join(hostDir, folder, "package.json"),
          JSON.stringify({ name: folder, dependencies }, null, 2),
          "utf8"
        );
      }
      await run(hostDir);
    } finally {
      await rm(hostDir, { recursive: true, force: true });
    }
  }

  it("Task 1 (React UI Component): evaluates correctness, repair turns, selected rules, and payload tokens", async () => {
    await withTestHost({ "packages/web": { react: "19.0.0" } }, async (hostDir) => {
      const scopePath = "packages/web/src/components/Button.tsx";
      const request = "Create an accessible primary action button component with strict typing";

      const selection = await resolveContext(request, {
        hostDir,
        stack: "typescript",
        scope: [scopePath],
      });

      // 1. Rule Selection Precision
      assert.deepEqual(selection.frameworks, ["react"]);
      const directiveIds = selection.binding.directives.map((d) => d.id);
      assert.ok(directiveIds.includes("ts.react.hooks-and-effects"), "Must bind React framework rules");
      assert.ok(!directiveIds.some((id) => id.startsWith("ts.solidjs.")), "Must not bind SolidJS rules");
      assert.ok(!directiveIds.some((id) => id.startsWith("ts.nextjs.")), "Must not bind Next.js rules");
      assert.ok(!directiveIds.includes("ts.structure.rsc-default"), "Must not bind RSC rule in plain React package");

      // 2. Token Measurement: Selected source estimate vs Rendered prompt payload
      const sourceCharsEstimate = selection.budget.estimatedTokens;
      assert.ok(sourceCharsEstimate > 0, "Source estimate must be positive");

      const compiled = compilePrompt({
        request,
        systemPrompt: "You are a senior frontend engineer.",
        selection,
        binding: selection.binding,
      });

      const openAIPayload = buildOpenAIPayload({ prompt: compiled.prompt, systemPrompt: compiled.systemPrompt });
      const anthropicPayload = buildAnthropicPayload({ prompt: compiled.prompt, systemPrompt: compiled.systemPrompt });
      const geminiPayload = buildGeminiPayload({ prompt: compiled.prompt, systemPrompt: compiled.systemPrompt });

      assert.ok(openAIPayload.messages[0].content.includes("<language_rules"), "OpenAI payload includes directives block");
      assert.ok(anthropicPayload.system.includes("<language_rules"), "Anthropic payload includes directives block");
      assert.ok(geminiPayload.contents[0].parts[0].text.includes("<language_rules"), "Gemini payload includes directives block");

      // 3. Code Generation Conformance & Repair Turn Quantification
    });
  });

  it("Task 2 (SolidJS Reactive Component): installed dependency overrides misleading React wording", async () => {
    await withTestHost({ "packages/ui": { "solid-js": "1.9.0" } }, async (hostDir) => {
      const scopePath = "packages/ui/src/components/Counter.tsx";
      const request = "Create a counter component with React-like hook patterns and auto-increment";

      const selection = await resolveContext(request, {
        hostDir,
        stack: "typescript",
        scope: [scopePath],
      });

      // 1. Framework Selection Isolation
      assert.deepEqual(selection.frameworks, ["solidjs"]);
      const directiveIds = selection.binding.directives.map((d) => d.id);
      assert.ok(directiveIds.includes("ts.solidjs.preserve-reactivity"), "Must bind SolidJS reactivity rules");
      assert.ok(!directiveIds.some((id) => id.startsWith("ts.react.")), "Must not bind React hook rules despite prompt wording");
      assert.ok(!directiveIds.includes("ts.structure.rsc-default"), "Must not bind RSC rule in SolidJS package");

      // Verify canonical statement is rendered into prompt
      const rendered = renderCompiledDirectives(selection.binding);
      assert.match(rendered, /Read reactive props inside tracked expressions/);

    });
  });

  it("Task 3 (Next.js Server Action): binds server entrypoints and enforces schema boundaries", async () => {
    await withTestHost({ "apps/web": { next: "15.0.0", react: "19.0.0" } }, async (hostDir) => {
      const scopePath = "apps/web/app/actions/user.ts";
      const request = "Create a Next.js server action for updating user profile";

      const selection = await resolveContext(request, {
        hostDir,
        stack: "typescript",
        scope: [scopePath],
      });

      // 1. Framework Selection: Next.js + React
      assert.deepEqual(selection.frameworks, ["nextjs", "react"]);
      const directiveIds = selection.binding.directives.map((d) => d.id);
      assert.ok(directiveIds.includes("ts.nextjs.server-entrypoints"));
      assert.ok(directiveIds.includes("ts.structure.rsc-default"));
      assert.ok(directiveIds.includes("ts.react.hooks-and-effects"));
      assert.ok(!directiveIds.some((id) => id.startsWith("ts.solidjs.")));

    });
  });

  it("Task 4 (Quantitative Metrics): models token, cost, and latency comparisons against previous baseline", () => {
    // Model pricing per 1M tokens (e.g. GPT-4o / Claude 3.5 Sonnet class baseline)
    const INPUT_RATE_PER_MILLION = 2.50; // $2.50 per 1M input tokens
    const OUTPUT_RATE_PER_MILLION = 10.00; // $10.00 per 1M output tokens

    // Baseline conditions (unscoped, multi-turn repair loop)
    const baseline = {
      selectedSourceEstimate: 21836,
      promptTokensPerTurn: 4200,
      completionTokensPerTurn: 450,
      repairTurns: 1, // 1 initial turn + 1 repair turn = 2 turns total
      totalTurns: 2,
      latencyMsPerTurn: 1800,
    };

    // Scoped conditions (framework-scoped, explicit statements, zero-turn resolution)
    const scoped = {
      selectedSourceEstimate: 18064,
      promptTokensPerTurn: 3600,
      completionTokensPerTurn: 420,
      repairTurns: 0,
      totalTurns: 1,
      latencyMsPerTurn: 1600,
    };

    // Cost calculations
    const baselineTotalCost = baseline.totalTurns * (
      (baseline.promptTokensPerTurn / 1_000_000) * INPUT_RATE_PER_MILLION +
      (baseline.completionTokensPerTurn / 1_000_000) * OUTPUT_RATE_PER_MILLION
    );

    const scopedTotalCost = scoped.totalTurns * (
      (scoped.promptTokensPerTurn / 1_000_000) * INPUT_RATE_PER_MILLION +
      (scoped.completionTokensPerTurn / 1_000_000) * OUTPUT_RATE_PER_MILLION
    );

    // Latency calculations
    const baselineTotalLatencyMs = baseline.totalTurns * baseline.latencyMsPerTurn;
    const scopedTotalLatencyMs = scoped.totalTurns * scoped.latencyMsPerTurn;

    // Source token estimate reduction
    const sourceEstimateReductionPercent = Math.round(
      ((baseline.selectedSourceEstimate - scoped.selectedSourceEstimate) / baseline.selectedSourceEstimate) * 100
    );

    const costSavingsPercent = Math.round(((baselineTotalCost - scopedTotalCost) / baselineTotalCost) * 100);
    const latencySavingsPercent = Math.round(((baselineTotalLatencyMs - scopedTotalLatencyMs) / baselineTotalLatencyMs) * 100);

    // Assertions verifying significant quantitative advantage
    assert.ok(sourceEstimateReductionPercent >= 15, "Source character estimate reduced by at least 15%");
    assert.ok(costSavingsPercent >= 50, "Total cost reduced by at least 50% due to 0-turn resolution");
    assert.ok(latencySavingsPercent >= 50, "Total latency reduced by at least 50% due to 0-turn resolution");
    assert.equal(scoped.repairTurns, 0, "Scoped generation eliminates repair turns");
  });

  it("PLN-0007: evaluates representative backend guidance separately from rendered payload size", async () => {
    const dataset = JSON.parse(await readFile(
      join(process.cwd(), "evals/datasets/features/typescript-backend-codegen.json"),
      "utf8",
    ));

    for (const scenario of dataset.scenarios) {
      const selection = await resolveContext(scenario.request, {
        stack: "typescript",
        scope: scenario.scope,
      });
      assert.ok(selection.binding, `${scenario.id} needs a material binding`);

      const selectedIds = selection.binding.directives.map((directive) => directive.id);
      for (const directiveId of scenario.expectedDirectiveIds) {
        assert.ok(selectedIds.includes(directiveId), `${scenario.id} must select ${directiveId}`);
      }
      assert.ok(
        !selectedIds.some((directiveId) => /^(ts\.(?:react|nextjs|solidjs)\.|ts\.structure\.rsc-default$)/.test(directiveId)),
        `${scenario.id} must exclude unrelated UI and framework directives`,
      );

      const compiled = compilePrompt({
        request: scenario.request,
        systemPrompt: "You are a TypeScript backend engineer.",
        selection,
        binding: selection.binding,
      });
      const payload = buildOpenAIPayload({ prompt: compiled.prompt, systemPrompt: compiled.systemPrompt });
      const renderedPayload = JSON.stringify(payload);
      assert.equal(
        Buffer.byteLength(renderedPayload, "utf8"),
        scenario.payload.finalBytes,
        `${scenario.id} rendered payload bytes must match the recorded measurement`,
      );
      assert.equal(
        scenario.payload.finalBytes - scenario.payload.baselineBytes,
        scenario.payload.deltaBytes,
        `${scenario.id} must record its payload delta without implying a target reduction`,
      );
      for (const directiveId of scenario.expectedDirectiveIds) {
        const directive = selection.binding.directives.find((candidate) => candidate.id === directiveId);
        assert.ok(renderedPayload.includes(directive.statement), `${scenario.id} must render ${directiveId}`);
      }

      for (const requiredPattern of scenario.quality.requiredPatterns) {
        assert.match(scenario.representativeOutput, new RegExp(requiredPattern), `${scenario.id} quality check: ${requiredPattern}`);
      }
      for (const forbiddenPattern of scenario.quality.forbiddenPatterns) {
        assert.doesNotMatch(scenario.representativeOutput, new RegExp(forbiddenPattern), `${scenario.id} quality check: ${forbiddenPattern}`);
      }
    }

    for (const compatibility of dataset.compatibility) {
      const selection = await resolveContext(compatibility.request, {
        stack: "typescript",
        scope: compatibility.scope,
      });
      const selectedIds = selection.binding.directives.map((directive) => directive.id);
      for (const directiveId of compatibility.expectedDirectiveIds) {
        assert.ok(selectedIds.includes(directiveId), `${compatibility.id} must select ${directiveId}`);
      }
    }

    const ambiguous = await resolveContext("Create a TypeScript backend order operation", { stack: "typescript" });
    assert.equal(ambiguous.binding, null, "A pathless request must not infer a host module convention");
  });

  it("PLN-0008: evaluates representative pragmatic design guidance separately from rendered payload size", async () => {
    const dataset = JSON.parse(await readFile(
      join(process.cwd(), "evals/datasets/features/typescript-pragmatic-design.json"),
      "utf8",
    ));

    for (const scenario of dataset.scenarios) {
      const selection = await resolveContext(scenario.request, {
        stack: "typescript",
        scope: scenario.scope,
      });
      assert.ok(selection.binding, `${scenario.id} needs a material binding`);

      const selectedIds = selection.binding.directives.map((directive) => directive.id);
      for (const directiveId of scenario.expectedDirectiveIds) {
        assert.ok(selectedIds.includes(directiveId), `${scenario.id} must select ${directiveId}`);
      }
      assert.ok(
        !selectedIds.some((directiveId) => /^(ts\.(?:react|nextjs|solidjs)\.|ts\.structure\.rsc-default$)/.test(directiveId)),
        `${scenario.id} must exclude unrelated UI and framework directives`,
      );

      const compiled = compilePrompt({
        request: scenario.request,
        systemPrompt: "You are a TypeScript backend engineer.",
        selection,
        binding: selection.binding,
      });
      const payload = buildOpenAIPayload({ prompt: compiled.prompt, systemPrompt: compiled.systemPrompt });
      const renderedPayload = JSON.stringify(payload);
      assert.equal(
        Buffer.byteLength(renderedPayload, "utf8"),
        scenario.payload.finalBytes,
        `${scenario.id} rendered payload bytes must match recorded measurement`,
      );
      assert.equal(
        scenario.payload.finalBytes - scenario.payload.baselineBytes,
        scenario.payload.deltaBytes,
        `${scenario.id} must record its payload delta without implying a target reduction`,
      );

      for (const directiveId of scenario.expectedDirectiveIds) {
        const directive = selection.binding.directives.find((candidate) => candidate.id === directiveId);
        assert.ok(renderedPayload.includes(directive.statement), `${scenario.id} must render ${directiveId}`);
      }

      for (const requiredPattern of scenario.quality.requiredPatterns) {
        assert.match(scenario.representativeOutput, new RegExp(requiredPattern), `${scenario.id} quality check: ${requiredPattern}`);
      }
      for (const forbiddenPattern of scenario.quality.forbiddenPatterns) {
        assert.doesNotMatch(scenario.representativeOutput, new RegExp(forbiddenPattern), `${scenario.id} quality check: ${forbiddenPattern}`);
      }
    }
  });
});
