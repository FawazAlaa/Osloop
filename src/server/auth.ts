export function getUserIdFromRequest(req: Request): number | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  const parts = auth.split(" ");
  if (parts.length !== 2) return null;

  const token = parts[1];
  if (!token.startsWith("fake-token-")) return null;

  const userId = Number(token.replace("fake-token-", ""));
  return Number.isFinite(userId) ? userId : null;
}