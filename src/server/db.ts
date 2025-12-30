import fs from "fs/promises";
import path from "path";
import { User } from "@/lib/interfaces/user";

const DB_PATH = path.join(process.cwd(), "src/server/db.json");

export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";


export type DB = {
  users: User[];
};

export async function readDB(): Promise<DB> {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as DB;
}

export async function writeDB(db: DB) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function nowISO() {
  return new Date().toISOString();
}

export function findUser(db: DB, userId: number) {
  return db.users.find((u) => u.id === userId) ?? null;
}

/**
 * 7eta ziada 3lshan id bet3t el tasks w el notes w el global counters 
 * Ana banady el function deh fel create/update/delete on tasks or notes.
 * bt3ml 3 7agat
 * :1-status check
 * 2-betshoof el tasks bel esboo3
 * 3-betzabt el counters 3lshan el dashboard 
 */
export function recomputeCounters(user: User) {
  const tasks = user.tasks;
  const notes = user.notes;

  const tasksByStatus: Record<Status, number> = {
    todo: 0,
    "in-progress": 0,
    done: 0,
  };
  for (const t of tasks) tasksByStatus[t.status]++;

  const weekStart = startOfWeek(new Date());
  const tasksByWeek = tasks.filter((t) => new Date(t.createdAt) >= weekStart).length;

  user.counters = {
    totalTasks: tasks.length,
    tasksByStatus,
    tasksByWeek,
    notesCount: notes.length,
  };
}

function startOfWeek(date: Date) {
  const d = new Date(date);  //getDay() da el hoa  day of week (0–6)
                             //getDate() da el hoa day of month (1–31)
   const day = d.getDay(); //  hna betbda2 mn 0 Sun ...> 6 Sat   Mon  Tue  Wed  Thu  Fri  Sat  Sun we go bacj
                                                              // 1    2    3    4    5    6    0   3lshan kda negative
   d.setDate(d.getDate() - day); // babda2 mn sunday
   d.setHours(0, 0, 0, 0);
  return d;
}
