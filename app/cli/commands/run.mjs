import { writeFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { executeRun } from "../../../orchestrator/runner.mjs";
import { root } from "../../../scripts/context-core.mjs";
import { badges, colors } from "../core/formatter.mjs";

export async function handleRunCommand(args = [], flags = {}) {
  const provider = flags.provider || "mock";
  const model = flags.model || (provider === "mock" ? "mock-v1" : undefined);
  const schema = flags.schema || null;
  const isJson = Boolean(flags.json);
  const outputPath = flags.output || flags.out || null;

  const request = args.join(" ").trim();
  if (!request) {
    throw new Error("Usage: context-cli run \"<prompt>\" [--provider <mock|openai|anthropic|gemini>] [--model <name>] [--schema <name>]");
  }

  const result = await executeRun({ request, provider, model, schema });

  if (outputPath) {
    const destination = isAbsolute(outputPath) ? outputPath : resolve(root, outputPath);
    await writeFile(destination, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  }

  if (isJson) {
    console.log(JSON.stringify(result, null, 2));
    return result.status === "success" ? 0 : 1;
  }

  const isSuccess = result.status === "success";
  const statusBadge = isSuccess ? badges.pass("SUCCESS") : badges.fail(result.status.toUpperCase());

  console.log(`\n${colors.bold("Context Execution Harness Result")}\n`);
  console.log(`  ${colors.bold("Run ID:")}     ${colors.cyan(result.runId)}`);
  console.log(`  ${colors.bold("Provider:")}   ${colors.magenta(result.provider)}`);
  console.log(`  ${colors.bold("Model:")}      ${colors.white(result.model)}`);
  console.log(`  ${colors.bold("Status:")}     ${statusBadge}`);
  console.log(`  ${colors.bold("Tokens:")}     Prompt: ${result.tokens.promptTokens} | Completion: ${result.tokens.completionTokens} | Total: ${result.tokens.totalTokens}`);
  console.log(`  ${colors.bold("Duration:")}   ${result.durationMs}ms`);
  console.log("");

  if (result.output) {
    console.log(`${colors.bold("Output:")}`);
    if (typeof result.output === "object") {
      console.log(JSON.stringify(result.output, null, 2));
    } else {
      console.log(result.output);
    }
    console.log("");
  }

  if (result.validationErrors?.length > 0) {
    console.log(`${colors.bold(colors.red("Validation Errors:"))}`);
    for (const err of result.validationErrors) {
      console.log(`  - ${colors.yellow(err)}`);
    }
    console.log("");
  }

  return isSuccess ? 0 : 1;
}
