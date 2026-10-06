import { assertValid, loadSchema } from "../validator.mjs";

/**
 * In-memory registry of registered conformance adapters.
 */
const adapterRegistry = new Map();

/**
 * Validates that an adapter satisfies the ConformanceAdapter contract (ISP / DIP).
 */
export function validateAdapterShape(adapter) {
  if (!adapter || typeof adapter !== "object") {
    throw new Error("Adapter registration failed: adapter must be a non-null object.");
  }
  if (typeof adapter.id !== "string" || !adapter.id.trim()) {
    throw new Error("Adapter registration failed: adapter must have a non-empty string 'id'.");
  }
  if (typeof adapter.stack !== "string" || !adapter.stack.trim()) {
    throw new Error("Adapter registration failed: adapter must have a non-empty string 'stack'.");
  }
  if (typeof adapter.canHandle !== "function") {
    throw new Error(`Adapter "${adapter.id}" must implement canHandle(binding) method.`);
  }
  if (typeof adapter.evaluate !== "function") {
    throw new Error(`Adapter "${adapter.id}" must implement evaluate(context) method.`);
  }
}

/**
 * Registers an adapter into the registry.
 */
export function registerAdapter(adapter) {
  validateAdapterShape(adapter);
  adapterRegistry.set(adapter.stack.toLowerCase(), adapter);
}

/**
 * Clears all registered adapters (useful for testing).
 */
export function clearAdapters() {
  adapterRegistry.clear();
}

/**
 * Finds registered adapter matching a stack name or binding.
 */
export function getAdapter(stackOrBinding) {
  if (!stackOrBinding) return null;
  const stack = typeof stackOrBinding === "string"
    ? stackOrBinding.toLowerCase()
    : stackOrBinding.stack?.toLowerCase();

  return adapterRegistry.get(stack) || null;
}

/**
 * Lists all registered adapters.
 */
export function listAdapters() {
  return Array.from(adapterRegistry.values());
}

/**
 * Validates a single conformance result object against the schema (LSP).
 */
export async function validateConformanceResult(result) {
  const schema = await loadSchema("conformance-result");
  assertValid(result, schema);
}
