// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>✅ GET / POST /api/tasks<<<<<<<<<<<<<<<<<<<<<<<<<<


import { NextResponse } from "next/server";
import { readDB, writeDB, nowISO, findUser } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";

export async function GET(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json(user.tasks);
}

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const now = nowISO();
  const task = {
    id: db.counters.taskId++,
    title: body.title,
    description: body.description ?? "",
    priority: body.priority,
    status: body.status,
    createdAt: now,
    updatedAt: now,
    notes: []
  };

  user.tasks.unshift(task);
  await writeDB(db);

  return NextResponse.json(task, { status: 201 });
}