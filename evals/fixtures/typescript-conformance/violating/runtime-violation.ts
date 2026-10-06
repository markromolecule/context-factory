// Deliberate runtime boundary violation: raw casting without schema validation
export function handleRequest(req: { body: unknown }) {
  const user = req.body as { id: string; role: string };
  return user.id;
}
