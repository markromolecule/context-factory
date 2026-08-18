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

/**
 * Pure ESM Schema Validator supporting JSON Schema draft-07 subsets:
 * type, required, properties, items, enum, format (date, date-time), minItems, minimum.
 */
export function validateSchema(data, schema, path = "#") {
  const errors = [];

  if (!schema || typeof schema !== "object") {
    return { valid: true, errors: [] };
  }

  // Type check
  if (schema.type) {
    const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actualType = getType(data);

    let typeMatch = false;
    for (const exp of expectedTypes) {
      if (exp === "number" && (actualType === "number" || actualType === "integer")) {
        typeMatch = true;
        break;
      }
      if (exp === actualType) {
        typeMatch = true;
        break;
      }
    }

    if (!typeMatch) {
      errors.push(`${path}: expected type "${expectedTypes.join(" | ")}", got "${actualType}"`);
      return { valid: false, errors };
    }
  }

  // Enum check
  if (schema.enum && Array.isArray(schema.enum)) {
    if (!schema.enum.includes(data)) {
      errors.push(`${path}: value ${JSON.stringify(data)} not in enum [${schema.enum.map((e) => JSON.stringify(e)).join(", ")}]`);
    }
  }

  // String format check
  if (schema.type === "string" && schema.format) {
    if (schema.format === "date" && !isValidDate(data)) {
      errors.push(`${path}: "${data}" is not a valid ISO date (YYYY-MM-DD)`);
    } else if (schema.format === "date-time" && !isValidDateTime(data)) {
      errors.push(`${path}: "${data}" is not a valid ISO date-time`);
    }
  }

  // Numeric minimum
  if ((typeof data === "number") && typeof schema.minimum === "number" && data < schema.minimum) {
    errors.push(`${path}: value ${data} is less than minimum ${schema.minimum}`);
  }

  // Object checks
  if (getType(data) === "object") {
    if (Array.isArray(schema.required)) {
      for (const req of schema.required) {
        if (data[req] === undefined) {
          errors.push(`${path}: missing required property "${req}"`);
        }
      }
    }

    if (schema.properties && typeof schema.properties === "object") {
      for (const [propKey, propSchema] of Object.entries(schema.properties)) {
        if (data[propKey] !== undefined) {
          const res = validateSchema(data[propKey], propSchema, `${path}/${propKey}`);
          errors.push(...res.errors);
        }
      }
    }
  }

  // Array checks
  if (Array.isArray(data)) {
    if (typeof schema.minItems === "number" && data.length < schema.minItems) {
      errors.push(`${path}: array length ${data.length} is less than minItems ${schema.minItems}`);
    }

    if (schema.items) {
      for (let i = 0; i < data.length; i++) {
        const res = validateSchema(data[i], schema.items, `${path}/${i}`);
        errors.push(...res.errors);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function assertValid(data, schema, name = "Data") {
  const result = validateSchema(data, schema);
  if (!result.valid) {
    throw new ValidationError(`${name} validation failed:\n- ${result.errors.join("\n- ")}`, result.errors);
  }
  return true;
}

export async function loadSchema(schemaName) {
  const cleanName = schemaName.endsWith(".schema.json")
    ? schemaName
    : (schemaName.endsWith(".json") ? schemaName : `${schemaName}.schema.json`);
  const schemaPath = join(root, "schemas", cleanName);
  const content = await readFile(schemaPath, "utf8");
  return JSON.parse(content);
}
