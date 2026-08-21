import { readText } from "../../../scripts/context-core.mjs";
import { loadSchema, validateSchema } from "../../../orchestrator/validator.mjs";
import { badges, colors } from "../core/formatter.mjs";
import { handleLintCommand } from "./lint.mjs";

export async function handleValidateCommand(args = [], flags = {}) {
  const schemaName = flags.schema;
  const filePath = args[0] || flags.file;

  if (!schemaName || !filePath) {
    if (!schemaName && !filePath) {
      return handleLintCommand(args, flags);
    }
    throw new Error("Usage: context-cli validate <file-path> --schema <schema-name>");
  }

  let fileContent;
  try {
    fileContent = JSON.parse(await readText(filePath));
  } catch (err) {
    throw new Error(`Failed to parse target JSON file "${filePath}": ${err.message}`);
  }

  const schema = await loadSchema(schemaName);
  const result = validateSchema(fileContent, schema);

  if (flags.json) {
    console.log(JSON.stringify({ file: filePath, schema: schemaName, ...result }, null, 2));
    return result.valid ? 0 : 1;
  }

  if (result.valid) {
    console.log(`\n${badges.pass()} ${colors.green(filePath)} conforms to schema ${colors.cyan(schemaName)}\n`);
    return 0;
  }

  console.log(`\n${badges.fail()} ${colors.red(filePath)} failed schema validation for ${colors.cyan(schemaName)}:\n`);
  for (const err of result.errors) {
    console.error(`  - ${colors.yellow(err)}`);
  }
  console.log("");
  return 1;
}
