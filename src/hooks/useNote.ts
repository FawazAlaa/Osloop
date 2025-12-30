import { useQuery } from "@tanstack/react-query";
import type { Note } from "@/lib/interfaces/note";

async function fetchNotes(): Promise<Note[]> {
  const res = await fetch("/api/notes");
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Note[];
}

export function useNote(id: number) {
  return useQuery({
    queryKey: ["notes"], 
    queryFn: fetchNotes,
    enabled: Number.isFinite(id),
    select: (notes) => {
      const note = notes.find((n) => n.id === id);
      if (!note) throw new Error("Not found");
      return note;
    },
  });
}
