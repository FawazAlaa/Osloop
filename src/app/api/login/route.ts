import { NextResponse } from "next/server";
import { readDB } from "@/server/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const db = await readDB();

  const user = db.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({
    token: `fake-token-${user.id}`,
    user: { id: user.id, email: user.email }
  });
}