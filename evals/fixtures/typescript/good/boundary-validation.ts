export interface UserProfile {
  id: string;
  role: string;
}

export function parseUserProfile(input: unknown): UserProfile {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid payload");
  }
  const obj = input as Record<string, unknown>;
  if (typeof obj.id !== "string" || typeof obj.role !== "string") {
    throw new Error("Missing required fields");
  }
  return { id: obj.id, role: obj.role };
}
