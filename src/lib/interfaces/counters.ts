export type Status = "todo" | "in-progress" | "done";

export type Counters = {
  totalTasks: number;
  tasksByStatus: Record<Status, number>;
  tasksByWeek: number;
  notesCount: number;
};