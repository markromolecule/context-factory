export interface User {
  id: string;
  name: string;
}

export function parseUser(input: unknown): User {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid user payload");
  }
  const record = input as Record<string, unknown>;
  if (typeof record.id !== "string" || typeof record.name !== "string") {
    throw new Error("Missing user fields");
  }
  return { id: record.id, name: record.name };
}
