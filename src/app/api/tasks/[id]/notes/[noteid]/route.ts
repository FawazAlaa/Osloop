// >>>>>>>>>>>>>>>>>>>>>>>>>✅ GET/PUT/DELETE /api/tasks/[taskId]/notes/[noteId]<<<<<<<<<<<<<<<<<<<<<<<

import { NextResponse } from "next/server";
import { readDB, writeDB, nowISO, findUser } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";

export async function GET(
  req: Request,
  { params }: { params: { taskId: string; noteId: string } }
) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const taskId = Number(params.taskId);
  const noteId = Number(params.noteId);

  const db = await readDB();
  const user = findUser(db, userId);
  const task = user?.tasks.find((t) => t.id === taskId);
  const note = task?.notes.find((n) => n.id === noteId);

  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
  if (!note) return NextResponse.json({ message: "Note not found" }, { status: 404 });

  return NextResponse.json(note);
}

export async function PUT(
  req: Request,
  { params }: { params: { taskId: string; noteId: string } }
) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const taskId = Number(params.taskId);
  const noteId = Number(params.noteId);
  const body = await req.json();

  const db = await readDB();
  const user = findUser(db, userId);
  const task = user?.tasks.find((t) => t.id === taskId);
  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

  const idx = task.notes.findIndex((n) => n.id === noteId);
  if (idx === -1) return NextResponse.json({ message: "Note not found" }, { status: 404 });

  task.notes[idx] = {
    ...task.notes[idx],
    ...body,
    updatedAt: nowISO()
  };

  task.updatedAt = nowISO(); // optional
  await writeDB(db);

  return NextResponse.json(task.notes[idx]);
}

export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string; noteId: string } }
) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const taskId = Number(params.taskId);
  const noteId = Number(params.noteId);

  const db = await readDB();
  const user = findUser(db, userId);
  const task = user?.tasks.find((t) => t.id === taskId);
  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

  const before = task.notes.length;
  task.notes = task.notes.filter((n) => n.id !== noteId);
  if (task.notes.length === before) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 });
  }

  task.updatedAt = nowISO(); // optional
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
