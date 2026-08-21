/**
 * Minimal, robust argument parser for context-cli.
 * Supports flags (--flag, -f), key-values (--key val, --key=val),
 * boolean negation (--no-flag), multiple values, and positional arguments.
 */

export function parseArgs(rawArgs = []) {
  const flags = {};
  const positionals = [];

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];

    if (arg === "--") {
      positionals.push(...rawArgs.slice(i + 1));
      break;
    }

    if (arg.startsWith("--no-")) {
      const key = camelCase(arg.slice(5));
      flags[key] = false;
      continue;
    }

    if (arg.startsWith("--")) {
      const eqIndex = arg.indexOf("=");
      if (eqIndex >= 0) {
        const key = camelCase(arg.slice(2, eqIndex));
        const val = parseValue(arg.slice(eqIndex + 1));
        flags[key] = val;
      } else {
        const key = camelCase(arg.slice(2));
        const nextArg = rawArgs[i + 1];
        if (nextArg !== undefined && !nextArg.startsWith("-")) {
          flags[key] = parseValue(nextArg);
          i++;
        } else {
          flags[key] = true;
        }
      }
      continue;
    }

    if (arg.startsWith("-") && arg.length > 1) {
      const key = arg.slice(1);
      // Single short flag
      const nextArg = rawArgs[i + 1];
      if (nextArg !== undefined && !nextArg.startsWith("-")) {
        flags[key] = parseValue(nextArg);
        i++;
      } else {
        flags[key] = true;
      }
      continue;
    }

    positionals.push(arg);
  }

  return { command: positionals[0], args: positionals.slice(1), flags, positionals };
}

function camelCase(str) {
  return str.replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase());
}

function parseValue(val) {
  if (val === "true") return true;
  if (val === "false") return false;
  if (val === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val);
  return val;
}
