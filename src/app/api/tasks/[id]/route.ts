// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> GET / PUT / DELETE /api/tasks/:id<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
import { NextResponse,NextRequest } from "next/server";
import { readDB, writeDB, nowISO, findUser, recomputeCounters } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";

type Context = { params: Promise<{ id: string }> }; //3slahn vercel maiz3lsh
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId =await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;            // Mohema GEDANNNNN el id da async
  const taskId = Number(id);

  if (!Number.isFinite(taskId)) {
    return NextResponse.json({ message: `Invalid id: ${id}` }, { status: 400 });
  }
  const db = await readDB();
  
  console.log("DB USERS:", db.users.map(u => u.id));
  console.log("userId:", userId, "taskId:", taskId);
  console.log("user tasks:", db.users.find(u => u.id === userId)?.tasks.map(t => t.id));
  const user = findUser(db, userId);
  const task = user?.tasks.find((t) => t.id === taskId);

  if (!task) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PUT(req: NextRequest, { params }: Context) {
  const userId =await getUserIdFromRequest();  
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

   const { id } = await params;            // Mohema GEDANNNNN el id da async
  const taskId = Number(id);

  if (!Number.isFinite(taskId)) {
    return NextResponse.json({ message: `Invalid id: ${id}` }, { status: 400 });
  }
  const body = await req.json();
  const db = await readDB();

  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const idx = user.tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });

  user.tasks[idx] = { ...user.tasks[idx], ...body, updatedAt: nowISO() };
  recomputeCounters(user);
  await writeDB(db);

  return NextResponse.json(user.tasks[idx]);
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const userId =await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

   const { id } = await params;           // Mohema GEDANNNNN el id da async 
  const taskId = Number(id);

  if (!Number.isFinite(taskId)) {
    return NextResponse.json({ message: `Invalid id: ${id}` }, { status: 400 });
  }
  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const before = user.tasks.length;
  user.tasks = user.tasks.filter((t) => t.id !== taskId);

  if (user.tasks.length === before) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  recomputeCounters(user);
  await writeDB(db);

  return NextResponse.json({ ok: true });
}
