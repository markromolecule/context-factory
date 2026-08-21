import { resolveContext } from "../../../scripts/context-core.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleResolveCommand(args = [], flags = {}) {
  const request = args.join(" ").trim();
  if (!request) {
    throw new Error("Usage: context-cli resolve \"<task description or request prompt>\"");
  }

  const selection = await resolveContext(request);

  if (flags.json) {
    console.log(JSON.stringify(selection, null, 2));
    return 0;
  }

  console.log(`\n${colors.bold("Context Factory Resolution")}\n`);
  console.log(`  ${colors.bold("Request:")}  "${colors.white(request)}"`);
  console.log(`  ${colors.bold("Version:")}  v${selection.contextVersion}`);
  console.log(`  ${colors.bold("Workflow:")} ${selection.workflow ? colors.bold(colors.green(selection.workflow.path)) : colors.dim("none (general assistance)")}`);
  if (selection.workflow) {
    console.log(`            ${colors.dim("Reason: " + selection.workflow.reason)}`);
  }
  console.log("");

  if (selection.rules.length > 0) {
    console.log(`${colors.bold(`Applicable Rules (${selection.rules.length}):`)}`);
    const ruleHeaders = ["Rule File", "Reason"];
    const ruleRows = selection.rules.map((r) => [colors.cyan(r.path), colors.dim(r.reason)]);
    console.log(table(ruleHeaders, ruleRows));
    console.log("");
  }

  if (selection.skills.length > 0) {
    console.log(`${colors.bold(`Applicable Skills (${selection.skills.length}):`)}`);
    const skillHeaders = ["Skill File", "Reason"];
    const skillRows = selection.skills.map((s) => [colors.magenta(s.path), colors.dim(s.reason)]);
    console.log(table(skillHeaders, skillRows));
    console.log("");
  }

  console.log(`  ${badges.info()} Total resolved context paths: ${colors.bold(String(selection.selectedPaths.length))}\n`);
  return 0;
}
