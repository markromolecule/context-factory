export async function syncUserData(userId: string): Promise<void> {
  await fetch(`/api/users/${userId}/sync`);
}

export function loadUserData(userId: string): Promise<Response> {
  return fetch(`/api/users/${userId}`);
}
