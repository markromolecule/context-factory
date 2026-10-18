import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Standard validation error holding diagnostics list.
 */
export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

/**
 * Resolves precise JSON Schema primitive type.
 */
function getType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number") return Number.isInteger(value) ? "integer" : "number";
  return typeof value;
}

/**
 * ISO 8601 calendar date validator (YYYY-MM-DD).
 */
function isValidDate(str) {
  if (typeof str !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(`${str}T00:00:00Z`);
  return !Number.isNaN(d.getTime());
}

/**
 * ISO 8601 timestamp validator.
 */
function isValidDateTime(str) {
  if (typeof str !== "string") return false;
  const d = new Date(str);
  return !Number.isNaN(d.getTime());
}

/**
 * Pure ESM Draft-07 JSON Schema Validator.
 * Zero external dependencies, exact path-level diagnostics.
 */
export function validateSchema(data, schema, path = "#") {
  const errors = [];

  if (!schema || typeof schema !== "object") {
    return { valid: true, errors: [] };
  }

  // 1. Type check
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

  // 2. Const check
  if (schema.const !== undefined) {
    if (JSON.stringify(data) !== JSON.stringify(schema.const)) {
      errors.push(`${path}: value ${JSON.stringify(data)} does not match const ${JSON.stringify(schema.const)}`);
    }
  }

  // 3. Enum check
  if (schema.enum && Array.isArray(schema.enum)) {
    if (!schema.enum.includes(data)) {
      errors.push(`${path}: value ${JSON.stringify(data)} not in enum [${schema.enum.map((e) => JSON.stringify(e)).join(", ")}]`);
    }
  }

  // 4. String constraints
  if (typeof data === "string") {
    if (typeof schema.minLength === "number" && data.length < schema.minLength) {
      errors.push(`${path}: string length ${data.length} is less than minLength ${schema.minLength}`);
    }
    if (typeof schema.maxLength === "number" && data.length > schema.maxLength) {
      errors.push(`${path}: string length ${data.length} is greater than maxLength ${schema.maxLength}`);
    }
    if (typeof schema.pattern === "string") {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(data)) {
        errors.push(`${path}: "${data}" does not match pattern "${schema.pattern}"`);
      }
    }
    if (schema.format === "date" && !isValidDate(data)) {
      errors.push(`${path}: "${data}" is not a valid ISO date (YYYY-MM-DD)`);
    } else if (schema.format === "date-time" && !isValidDateTime(data)) {
      errors.push(`${path}: "${data}" is not a valid ISO date-time`);
    }
  }

  // 5. Numeric constraints
  if (typeof data === "number") {
    if (typeof schema.minimum === "number" && data < schema.minimum) {
      errors.push(`${path}: value ${data} is less than minimum ${schema.minimum}`);
    }
    if (typeof schema.maximum === "number" && data > schema.maximum) {
      errors.push(`${path}: value ${data} is greater than maximum ${schema.maximum}`);
    }
  }

  // 6. Object constraints
  if (getType(data) === "object") {
    if (Array.isArray(schema.required)) {
      for (const req of schema.required) {
        if (data[req] === undefined) {
          errors.push(`${path}: missing required property "${req}"`);
        }
      }
    }

    const definedProperties = schema.properties && typeof schema.properties === "object" ? schema.properties : {};

    for (const [propKey, propSchema] of Object.entries(definedProperties)) {
      if (data[propKey] !== undefined) {
        const res = validateSchema(data[propKey], propSchema, `${path}/${propKey}`);
        errors.push(...res.errors);
      }
    }

    if (schema.additionalProperties === false) {
      for (const dataKey of Object.keys(data)) {
        if (definedProperties[dataKey] === undefined) {
          errors.push(`${path}: additional property "${dataKey}" is not allowed`);
        }
      }
    } else if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
      for (const dataKey of Object.keys(data)) {
        if (definedProperties[dataKey] === undefined) {
          const res = validateSchema(data[dataKey], schema.additionalProperties, `${path}/${dataKey}`);
          errors.push(...res.errors);
        }
      }
    }
  }

  // 7. Array constraints
  if (Array.isArray(data)) {
    if (typeof schema.minItems === "number" && data.length < schema.minItems) {
      errors.push(`${path}: array length ${data.length} is less than minItems ${schema.minItems}`);
    }
    if (typeof schema.maxItems === "number" && data.length > schema.maxItems) {
      errors.push(`${path}: array length ${data.length} is greater than maxItems ${schema.maxItems}`);
    }

    if (schema.uniqueItems === true) {
      const seen = new Set();
      for (let i = 0; i < data.length; i++) {
        const serialized = JSON.stringify(data[i]);
        if (seen.has(serialized)) {
          errors.push(`${path}: array items must be unique, duplicate found at index ${i}`);
          break;
        }
        seen.add(serialized);
      }
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

/**
 * Asserts data is valid according to schema or throws detailed ValidationError.
 */
export function assertValid(data, schema, name = "Data") {
  const result = validateSchema(data, schema);
  if (!result.valid) {
    throw new ValidationError(`${name} validation failed:\n- ${result.errors.join("\n- ")}`, result.errors);
  }
  return true;
}

/**
 * Loads a schema by canonical or clean name from schemas/ directory.
 */
export async function loadSchema(schemaName) {
  const cleanName = schemaName.endsWith(".schema.json")
    ? schemaName
    : (schemaName.endsWith(".json") ? schemaName : `${schemaName}.schema.json`);
  const schemaPath = join(root, "schemas", cleanName);
  const content = await readFile(schemaPath, "utf8");
  return JSON.parse(content);
}
