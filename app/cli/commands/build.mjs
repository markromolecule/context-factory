import { compileBundle } from "../core/bundler.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleBuildCommand(args = [], flags = {}) {
  const out = flags.out || args[0] || "dist/context-bundle.json";
  const minify = Boolean(flags.minify);
  const format = flags.format || "json";
  const isJson = Boolean(flags.json);

  const startTime = Date.now();
  const result = await compileBundle({ out, minify, format });
  const durationMs = Date.now() - startTime;

  if (isJson) {
    console.log(JSON.stringify({ ...result, durationMs }, null, 2));
    return 0;
  }

  console.log(`\n${badges.done()} Context Factory Bundle Compiled Successfully (${durationMs}ms)\n`);
  console.log(`  ${colors.bold("Destination:")}      ${colors.cyan(result.destination)}`);
  console.log(`  ${colors.bold("Context Version:")}  ${colors.white(result.contextVersion)}`);
  console.log(`  ${colors.bold("Lock Digest:")}      ${colors.dim(result.lockDigest.slice(0, 24))}...`);
  console.log(`  ${colors.bold("Bundle Digest:")}    ${colors.dim(result.bundleDigest.slice(0, 24))}...`);
  console.log(`  ${colors.bold("Bundle Size:")}      ${colors.yellow((result.bytes / 1024).toFixed(2) + " KB")}`);
  console.log(`  ${colors.bold("Estimated Tokens:")} ${colors.magenta("~" + result.estimatedTokens.toLocaleString())}`);
  console.log("");

  const headers = ["Category", "Count"];
  const rows = [
    ["Rules", String(result.counts.ruleCount)],
    ["Skills", String(result.counts.skillCount)],
    ["Workflows", String(result.counts.workflowCount)],
    ["Agents", String(result.counts.agentCount)],
    ["Knowledge Items", String(result.counts.knowledgeCount)],
    ["Schemas", String(result.counts.schemaCount)],
    ["Templates", String(result.counts.templateCount)],
    ["Decisions (ADRs)", String(result.counts.decisionCount)],
  ];

  console.log(table(headers, rows));
  console.log("");
  return 0;
}
