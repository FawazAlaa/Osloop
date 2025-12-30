import { Task } from "./task"; 
import { Note } from "./note";
import { Counters } from "./counters";

export interface GlobalCounters {
  taskId: number;
  noteId: number;
}

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  tasks: Task[];
  notes: Note[];
  counters: Counters;
  globalCounters:GlobalCounters
};