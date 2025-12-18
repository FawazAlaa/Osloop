import { NextResponse } from "next/server";
import { readDB, findUser } from "@/server/db";
import { getUserIdFromRequest } from "@/server/auth";

function startOfWeekISO(date = new Date()) {
  // Monday as start of week
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = (day === 0 ? -6 : 1) - day; // shift back to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const db = await readDB();
  const user = findUser(db, userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const tasks = user.tasks;

  // Total tasks
  const totalTasks = tasks.length;

  // Tasks by status
  const tasksByStatus = {
    todo: 0,
    "in-progress": 0,
    done: 0,
  } as Record<"todo" | "in-progress" | "done", number>;

  for (const t of tasks) tasksByStatus[t.status]++;

  // Notes count
  const notesCount = tasks.reduce((sum, t) => sum + (t.notes?.length ?? 0), 0);

  // Tasks created this week
  const weekStart = startOfWeekISO();
  const tasksCreatedThisWeek = tasks.filter((t) => {
    const created = new Date(t.createdAt);
    return created >= weekStart;
  }).length;

  // Chart-ready: tasks created per day (Mon..Sun)
  // output example: [{ date: "2025-12-15", count: 3 }, ...]
  const seriesMap = new Map<string, number>();

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    seriesMap.set(key, 0);
  }

  for (const t of tasks) {
    const created = new Date(t.createdAt);
    if (created >= weekStart) {
      const key = created.toISOString().slice(0, 10);
      if (seriesMap.has(key)) {
        seriesMap.set(key, (seriesMap.get(key) ?? 0) + 1);
      }
    }
  }

  const tasksCreatedSeries = Array.from(seriesMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  return NextResponse.json({
    totalTasks,
    tasksByStatus,
    tasksCreatedThisWeek,
    notesCount,
    tasksCreatedSeries, // chart-ready
  });
}
