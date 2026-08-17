import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

function getType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number") return Number.isInteger(value) ? "integer" : "number";
  return typeof value;
}

function isValidDate(str) {
  if (typeof str !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(`${str}T00:00:00Z`);
  return !Number.isNaN(d.getTime());
}

function isValidDateTime(str) {
  if (typeof str !== "string") return false;
  const d = new Date(str);
  return !Number.isNaN(d.getTime());
}

export function validateSchema(data, schema, path = "root") {
  const errors = [];

  if (!schema || typeof schema !== "object") {
    return { valid: true, errors: [] };
  }

  // Type check
  if (schema.type) {
    const actualType = getType(data);
    const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];

    const matchesType = expectedTypes.some((exp) => {
      if (exp === "number" && actualType === "integer") return true;
      return exp === actualType;
    });

    if (!matchesType) {
      errors.push(`${path}: expected type ${expectedTypes.join("|")}, got ${actualType}`);
      return { valid: false, errors };
    }
  }

  // Enum check
  if (Array.isArray(schema.enum)) {
    if (!schema.enum.includes(data)) {
      errors.push(`${path}: value ${JSON.stringify(data)} not in enum [${schema.enum.map((e) => JSON.stringify(e)).join(", ")}]`);
    }
  }

  // String constraints
  if (typeof data === "string") {
    if (typeof schema.minLength === "number" && data.length < schema.minLength) {
      errors.push(`${path}: string length ${data.length} < minLength ${schema.minLength}`);
    }
    if (typeof schema.maxLength === "number" && data.length > schema.maxLength) {
      errors.push(`${path}: string length ${data.length} > maxLength ${schema.maxLength}`);
    }
    if (schema.pattern) {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(data)) {
        errors.push(`${path}: "${data}" does not match pattern ${schema.pattern}`);
      }
    }
    if (schema.format === "date" && !isValidDate(data)) {
      errors.push(`${path}: "${data}" is not a valid YYYY-MM-DD date`);
    }
    if (schema.format === "date-time" && !isValidDateTime(data)) {
      errors.push(`${path}: "${data}" is not a valid ISO date-time`);
    }
  }

  // Number constraints
  if (typeof data === "number") {
    if (typeof schema.minimum === "number" && data < schema.minimum) {
      errors.push(`${path}: number ${data} < minimum ${schema.minimum}`);
    }
    if (typeof schema.maximum === "number" && data > schema.maximum) {
      errors.push(`${path}: number ${data} > maximum ${schema.maximum}`);
    }
  }

  // Array constraints
  if (Array.isArray(data)) {
    if (typeof schema.minItems === "number" && data.length < schema.minItems) {
      errors.push(`${path}: array length ${data.length} < minItems ${schema.minItems}`);
    }
    if (typeof schema.maxItems === "number" && data.length > schema.maxItems) {
      errors.push(`${path}: array length ${data.length} > maxItems ${schema.maxItems}`);
    }
    if (schema.items) {
      data.forEach((item, index) => {
        const itemRes = validateSchema(item, schema.items, `${path}[${index}]`);
        errors.push(...itemRes.errors);
      });
    }
  }

  // Object constraints
  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (Array.isArray(schema.required)) {
      for (const reqKey of schema.required) {
        if (!(reqKey in data) || data[reqKey] === undefined) {
          errors.push(`${path}: missing required property "${reqKey}"`);
        }
      }
    }

    if (schema.properties) {
      for (const [propKey, propVal] of Object.entries(data)) {
        if (schema.properties[propKey]) {
          const propRes = validateSchema(propVal, schema.properties[propKey], `${path}.${propKey}`);
          errors.push(...propRes.errors);
        } else if (schema.additionalProperties === false) {
          errors.push(`${path}: unexpected property "${propKey}" not allowed`);
        }
      }
    } else if (schema.additionalProperties === false) {
      const keys = Object.keys(data);
      if (keys.length > 0) {
        errors.push(`${path}: unexpected properties [${keys.join(", ")}]`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function assertValid(data, schema, path = "root") {
  const result = validateSchema(data, schema, path);
  if (!result.valid) {
    throw new ValidationError(`Schema validation failed with ${result.errors.length} error(s):\n  - ${result.errors.join("\n  - ")}`, result.errors);
  }
  return true;
}

export async function loadSchema(schemaNameOrPath) {
  const target = schemaNameOrPath.endsWith(".schema.json")
    ? schemaNameOrPath
    : `${schemaNameOrPath}.schema.json`;
  const fullPath = target.startsWith("schemas/")
    ? join(root, target)
    : join(root, "schemas", target);
  return JSON.parse(await readFile(fullPath, "utf8"));
}
