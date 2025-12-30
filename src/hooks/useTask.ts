import { useQuery } from "@tanstack/react-query";
import type { Task } from "@/lib/interfaces/task";

async function fetchTask(id: number): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Task;
}

export function useTask(id: number) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTask(id),
  });
}