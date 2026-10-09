export function processInput(input: unknown): string {
  if (typeof input === "string") {
    return input.trim();
  }
  return String(input);
}
