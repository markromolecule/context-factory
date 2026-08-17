import { resolveContext, sha256 } from "../scripts/context-core.mjs";
import { assertValid, loadSchema, validateSchema } from "./validator.mjs";

export class ProviderError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "ProviderError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Mock Provider for offline, deterministic testing and golden dataset assertions.
 */
export async function mockProvider({ prompt, selection, fixture, model = "mock-v1" }) {
  if (fixture) {
    return {
      output: fixture.output ?? fixture,
      tokens: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
      model,
    };
  }

  // Generate deterministic synthetic response based on matched context
  const output = {
    workflow: selection.workflow?.path ?? null,
    rules: selection.rules.map((r) => r.path),
    skills: selection.skills.map((s) => s.path),
    summary: `Executed workflow for request: "${prompt}"`,
    status: "completed",
  };

  return {
    output,
    tokens: { promptTokens: 15, completionTokens: 25, totalTokens: 40 },
    model,
  };
}

/**
 * Native fetch OpenAI-compatible Provider
 */
export async function openAIProvider({ prompt, systemPrompt, model = "gpt-4o", apiKey, baseUrl = "https://api.openai.com/v1" }) {
  const key = apiKey ?? process.env.OPENAI_API_KEY;
  if (!key) throw new ProviderError("Missing OPENAI_API_KEY environment variable", 401);

  const messages = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ProviderError(`OpenAI API error (${response.status}): ${errorText}`, response.status);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content ?? "";
  let parsedOutput = rawContent;
  try {
    parsedOutput = JSON.parse(rawContent);
  } catch {
    // Keep as string if not JSON
  }

  return {
    output: parsedOutput,
    tokens: {
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
      totalTokens: data.usage?.total_tokens ?? 0,
    },
    model: data.model ?? model,
  };
}

/**
 * Native fetch Anthropic Provider
 */
export async function anthropicProvider({ prompt, systemPrompt, model = "claude-3-5-sonnet-20241022", apiKey, baseUrl = "https://api.anthropic.com/v1" }) {
  const key = apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!key) throw new ProviderError("Missing ANTHROPIC_API_KEY environment variable", 401);

  const response = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ProviderError(`Anthropic API error (${response.status}): ${errorText}`, response.status);
  }

  const data = await response.json();
  const rawContent = data.content?.[0]?.text ?? "";
  let parsedOutput = rawContent;
  try {
    parsedOutput = JSON.parse(rawContent);
  } catch {
    // Keep as string if not JSON
  }

  return {
    output: parsedOutput,
    tokens: {
      promptTokens: data.usage?.input_tokens ?? 0,
      completionTokens: data.usage?.output_tokens ?? 0,
      totalTokens: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
    },
    model: data.model ?? model,
  };
}

/**
 * Native fetch Gemini Provider
 */
export async function geminiProvider({ prompt, systemPrompt, model = "gemini-2.0-flash", apiKey, baseUrl = "https://generativelanguage.googleapis.com/v1beta" }) {
  const key = apiKey ?? process.env.GEMINI_API_KEY;
  if (!key) throw new ProviderError("Missing GEMINI_API_KEY environment variable", 401);

  const url = `${baseUrl}/models/${model}:generateContent?key=${key}`;
  const contents = [];
  if (systemPrompt) {
    contents.push({ role: "user", parts: [{ text: `System Instruction: ${systemPrompt}` }] });
  }
  contents.push({ role: "user", parts: [{ text: prompt }] });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ProviderError(`Gemini API error (${response.status}): ${errorText}`, response.status);
  }

  const data = await response.json();
  const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  let parsedOutput = rawContent;
  try {
    parsedOutput = JSON.parse(rawContent);
  } catch {
    // Keep as string if not JSON
  }

  const usage = data.usageMetadata ?? {};
  return {
    output: parsedOutput,
    tokens: {
      promptTokens: usage.promptTokenCount ?? 0,
      completionTokens: usage.candidatesTokenCount ?? 0,
      totalTokens: usage.totalTokenCount ?? 0,
    },
    model,
  };
}

const PROVIDERS = {
  mock: mockProvider,
  openai: openAIProvider,
  anthropic: anthropicProvider,
  gemini: geminiProvider,
};

/**
 * Execute a complete run with 3-stage lifecycle hooks, provider invocation, and schema validation.
 */
export async function executeRun({
  request,
  provider = "mock",
  model = "mock-v1",
  hooks = {},
  schema = null,
  fixture = null,
  apiKey = null,
  systemPrompt = "You are an AI developer following Context Factory orchestration guidelines.",
}) {
  const startTime = Date.now();
  const hooksExecuted = [];
  const runId = sha256(`${request}:${Date.now()}:${Math.random()}`).slice(0, 16);

  try {
    // Stage 1: beforeContext hook
    let processedRequest = request;
    if (typeof hooks.beforeContext === "function") {
      hooksExecuted.push("beforeContext");
      processedRequest = (await hooks.beforeContext({ request, runId })) ?? request;
    }

    // Resolve deterministic context
    const selection = await resolveContext(processedRequest);

    // Stage 2: onPromptPrepare hook
    let preparedPrompt = processedRequest;
    let preparedSystemPrompt = systemPrompt;
    if (typeof hooks.onPromptPrepare === "function") {
      hooksExecuted.push("onPromptPrepare");
      const prepResult = await hooks.onPromptPrepare({
        request: processedRequest,
        selection,
        systemPrompt,
        runId,
      });
      if (prepResult) {
        preparedPrompt = prepResult.prompt ?? preparedPrompt;
        preparedSystemPrompt = prepResult.systemPrompt ?? preparedSystemPrompt;
      }
    }

    // Model / Provider Dispatch
    const providerFn = typeof provider === "function" ? provider : PROVIDERS[provider];
    if (!providerFn) {
      throw new ProviderError(`Unsupported provider: ${provider}. Supported: mock, openai, anthropic, gemini`, 400);
    }

    const providerResult = await providerFn({
      prompt: preparedPrompt,
      systemPrompt: preparedSystemPrompt,
      selection,
      fixture,
      model,
      apiKey,
    });

    let finalOutput = providerResult.output;
    const validationErrors = [];

    // Stage 3: afterResponseValidate hook & schema validation
    if (schema) {
      const loadedSchema = typeof schema === "string" ? await loadSchema(schema) : schema;
      const valResult = validateSchema(finalOutput, loadedSchema);
      if (!valResult.valid) {
        validationErrors.push(...valResult.errors);
      }
    }

    if (typeof hooks.afterResponseValidate === "function") {
      hooksExecuted.push("afterResponseValidate");
      const hookResult = await hooks.afterResponseValidate({
        request: processedRequest,
        selection,
        output: finalOutput,
        validationErrors,
        runId,
      });
      if (hookResult?.output !== undefined) finalOutput = hookResult.output;
    }

    const status = validationErrors.length === 0 ? "success" : "rejected";
    const durationMs = Date.now() - startTime;

    const runResult = {
      runId,
      status,
      provider: typeof provider === "string" ? provider : "custom",
      model: providerResult.model ?? model,
      prompt: processedRequest,
      output: finalOutput,
      tokens: providerResult.tokens,
      durationMs,
      hooksExecuted,
      validationErrors,
      createdAt: new Date().toISOString(),
    };

    const runResultSchema = await loadSchema("run-result");
    assertValid(runResult, runResultSchema);

    return runResult;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    return {
      runId,
      status: "error",
      provider: typeof provider === "string" ? provider : "custom",
      model,
      prompt: request,
      output: { error: error.message, stack: error.stack },
      durationMs,
      hooksExecuted,
      validationErrors: [error.message],
      createdAt: new Date().toISOString(),
    };
  }
}
