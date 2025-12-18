import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src/server/db.json");

export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";

export type Note = {
  id: number;
  content: any; // tiptap JSON
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
};

export type User = {
  id: number;
  email: string;
  password: string;
  tasks: Task[];
};

export type DB = {
  users: User[];
  counters: { userId: number; taskId: number; noteId: number };
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

export function findTask(user: User, taskId: number) {
  return user.tasks.find((t) => t.id === taskId) ?? null;
}
