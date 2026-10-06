import { resolveContext } from "../../../scripts/context-core.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleResolveCommand(args = [], flags = {}) {
  const request = args.join(" ").trim();
  if (!request) {
    throw new Error("Usage: context-cli resolve \"<task description or request prompt>\"");
  }

  const resolveOptions = {};
  if (flags.stack) resolveOptions.stack = flags.stack;
  if (flags.stacks) resolveOptions.stacks = Array.isArray(flags.stacks) ? flags.stacks : String(flags.stacks).split(",");
  if (flags.scope) {
    resolveOptions.scope = Array.isArray(flags.scope) ? flags.scope : String(flags.scope).split(",").map((s) => s.trim());
  } else if (flags.paths) {
    resolveOptions.scope = Array.isArray(flags.paths) ? flags.paths : String(flags.paths).split(",").map((s) => s.trim());
  }
  if (flags.workflow) resolveOptions.workflow = flags.workflow;

  const selection = await resolveContext(request, resolveOptions);

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
    console.log(`${colors.bold(`Informational Rules (${selection.rules.length}):`)}`);
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

  if (selection.binding) {
    console.log(`${colors.bold(`Enforceable Rule Binding (${selection.binding.directives.length} directives):`)}`);
    console.log(`  ${colors.bold("Binding ID:")}    ${colors.cyan(selection.binding.id)}`);
    console.log(`  ${colors.bold("Binding Hash:")}  ${colors.dim(selection.binding.bindingHash)}`);
    console.log(`  ${colors.bold("Stack:")}         ${colors.green(selection.binding.stack)}`);
    console.log(`  ${colors.bold("Scope:")}         ${selection.binding.affectedScope.join(", ")}`);
    if (selection.binding.waivers.length > 0) {
      console.log(`  ${colors.bold("Waivers:")}       ${colors.yellow(selection.binding.waivers.join(", "))}`);
    }
    const dirHeaders = ["Directive ID", "Rule File", "Mode"];
    const dirRows = selection.binding.directives.map((d) => [colors.cyan(d.id), colors.dim(d.rulePath), colors.yellow(d.mode)]);
    console.log(table(dirHeaders, dirRows));
    console.log("");
  } else {
    console.log(`  ${colors.dim("Notice: Informational selection only. No enforceable binding compiled (pass --stack and --scope to compile).")}\n`);
  }

  console.log(`  ${badges.info()} Total resolved context paths: ${colors.bold(String(selection.selectedPaths.length))}\n`);
  return 0;
}
