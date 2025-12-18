// >>>>>>>>>>>>>>>>>>>>✅ GET/POST /api/tasks/[taskId]/notes<<<<<<<<<<<<<

import { NextResponse } from "next/server";
import { readDB, writeDB, nowISO, findUser } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";

export async function GET(req: Request, { params }: { params: { taskId: string } }) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const taskId = Number(params.taskId);
  const db = await readDB();
  const user = findUser(db, userId);
  const task = user?.tasks.find((t) => t.id === taskId);

  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
  return NextResponse.json(task.notes);
}

export async function POST(req: Request, { params }: { params: { taskId: string } }) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const taskId = Number(params.taskId);
  const body = await req.json();
  const db = await readDB();
  const user = findUser(db, userId);
  const task = user?.tasks.find((t) => t.id === taskId);

  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

  const now = nowISO();
  const note = {
    id: db.counters.noteId++,
    content: body.content, // tiptap JSON
    createdAt: now,
    updatedAt: now
  };

  task.notes.unshift(note);
  task.updatedAt = now; // optional: bump task when note changes
  await writeDB(db);

  return NextResponse.json(note, { status: 201 });
}
