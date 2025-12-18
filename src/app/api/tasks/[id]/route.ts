// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>✅ GET / PUT / DELETE /api/tasks/:id<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
import { NextResponse } from "next/server";
import { readDB, writeDB, nowISO, findUser } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const taskId = Number(params.id);
  const db = await readDB();
  const user = findUser(db, userId);
  const task = user?.tasks.find((t) => t.id === taskId);

  if (!task) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const taskId = Number(params.id);
  const body = await req.json();
  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const idx = user.tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });

  user.tasks[idx] = {
    ...user.tasks[idx],
    ...body,
    updatedAt: nowISO()
  };

  await writeDB(db);
  return NextResponse.json(user.tasks[idx]);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const taskId = Number(params.id);
  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const before = user.tasks.length;
  user.tasks = user.tasks.filter((t) => t.id !== taskId);

  if (user.tasks.length === before) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await writeDB(db);
  return NextResponse.json({ ok: true });
}
