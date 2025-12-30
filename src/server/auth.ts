import { cookies } from "next/headers";
//lazm hna await 3lshan cookie async funnction Ay 7aga 7ats5dmha lazm te7ot await MOHEMAAAA
// kol mra 7nadeha 3lshan ataked 1) seecurity check  2)ageeb el id
export async function getUserIdFromRequest(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  if (!token.startsWith("fawaz-token-")) return null;

  const userId = Number(token.replace("fawaz-token-", ""));
  return Number.isFinite(userId) ? userId : null;
}
