// Deliberate floating promise violation
export function fireAndForget(userId: string): void {
  fetch(`/api/users/${userId}/ping`);
}
