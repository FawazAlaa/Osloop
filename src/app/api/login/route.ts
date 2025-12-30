import { NextResponse } from "next/server";
import { readDB } from "@/server/db";
 //https://nextjs.org/docs/app/api-reference/functions/cookies
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const db = await readDB();

  const user = db.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = `fawaz-token-${user.id}`;

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name } // token NOT returned to client
  });
 
  res.cookies.set("auth_token", token, {
    httpOnly: true,  //mohamea gedan lel securtiy  cookie cannot be accessed by JavaScript (document.cookie).
    sameSite: "lax", //hna deh 3lshan Cookie is sent on top-level navigation zai clicking a link) mish fetch pst 
    secure: process.env.NODE_ENV === "production", //In production → true (HTTPS only) |In development → false (allows http://localhost)
    path: "/", //Scope of the cookie koll el routes 3andy
    maxAge: 60 * 60 * 24 * 30  //bel seconds 
  });

  return res;
}
