// >>>>>>>>>>>>>>>>>>>>>>>>> GET / POST /api/notes<<<<<<<<<<<<<<<<<<<<<<<<<<

import { NextResponse,NextRequest } from "next/server";
import { readDB, writeDB, nowISO, findUser, recomputeCounters } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";

export async function GET() {
  const userId =await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json(user.notes);
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await readDB();
  const user =findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const now = nowISO();
  const note = {
    id: user.globalCounters.noteId++,
    content: body.content,
    createdAt: now,
    updatedAt: now
  };

  user.notes.unshift(note);
  recomputeCounters(user);
  await writeDB(db);

  return NextResponse.json(note, { status: 201 });
}
