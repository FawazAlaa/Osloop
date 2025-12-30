import { NextResponse } from "next/server";
import { readDB, findUser } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";

export async function GET() {
  const userId =await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json(user.globalCounters);
}
