// Deliberate unvalidated boundary cast violation
export function handleIncomingRequest(req: { body: unknown }) {
  const user = req.body as { id: string; role: string };
  return user.id;
}
