// >>>>>>>>>>>>>>>>>>> PUT / DELETE /api/notes/[id]<<<<<<<<<<<<<<<<<<<<<<<

import { NextResponse,NextRequest } from "next/server";
import { readDB, writeDB, nowISO, findUser, recomputeCounters } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";
type Context = { params: Promise<{ id: string }> }; //3slahn vercel maiz3lsh
export async function PUT(req: NextRequest, { params }: Context) {
  const userId = await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
  const { id } = await params; 
  const noteId = Number(id);
  
  const body = await req.json();
  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const idx = user.notes.findIndex((n) => n.id === noteId);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });

  user.notes[idx] = { ...user.notes[idx], ...body, updatedAt: nowISO() };
  recomputeCounters(user);
  await writeDB(db);

  return NextResponse.json(user.notes[idx]);
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const userId =await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params; 
  const noteId = Number(id);
  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const before = user.notes.length;
  user.notes = user.notes.filter((n) => n.id !== noteId);

  if (user.notes.length === before) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  recomputeCounters(user);
  await writeDB(db);

  return NextResponse.json({ ok: true });
}
