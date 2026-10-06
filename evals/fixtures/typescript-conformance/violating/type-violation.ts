// Deliberate type safety violation (ban-any)
export function handleData(payload: any) {
  const result = payload as any;
  return result;
}
