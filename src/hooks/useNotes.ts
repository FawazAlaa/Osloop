import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/lib/interfaces/note";

async function fetchNotes(): Promise<Note[]> {
  const req = await fetch("/api/notes");
  if (!req.ok) throw new Error(await req.text());
  return (await req.json()) as Note[];
}

export function useNotes() {
  const queryClient = useQueryClient();
  const notesKey = ["notes"];

  const notesQuery = useQuery({
    queryKey: notesKey,
    queryFn: fetchNotes,
  });

  const createNote = useMutation({
    mutationFn: async (payload: Omit<Note, "id">) => {
      const req = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!req.ok) throw new Error(await req.text());
      return (await req.json()) as Note;
    },

    // optimistic create
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: notesKey });

      const previous = queryClient.getQueryData<Note[]>(notesKey) ?? [];

      const optimistic: Note = {
        id: Date.now(), // temp id
        ...payload,
      };

      queryClient.setQueryData<Note[]>(notesKey, (old = []) => [
        optimistic,
        ...old,
      ]);

      return { previous, optimisticId: optimistic.id };
    },

    onError: (_err, _payload, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(notesKey, ctx.previous);
    },

    onSuccess: (created, _payload, ctx) => {
      // replace temp id with real one
      if (!ctx) return;
      queryClient.setQueryData<Note[]>(notesKey, (old = []) =>
        old.map((n) => (n.id === ctx.optimisticId ? created : n))
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notesKey });
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<Note> }) => {
      const req = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!req.ok) throw new Error(await req.text());
      return (await req.json()) as Note;
    },

    // optimistic update both list + single
    onMutate: async ({ id, payload }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notesKey }),
        queryClient.cancelQueries({ queryKey: ["note", id] }),
      ]);

      const previousNotes = queryClient.getQueryData<Note[]>(notesKey) ?? [];
      const previousNote = queryClient.getQueryData<Note>(["note", id]) ?? null;

      queryClient.setQueryData<Note[]>(notesKey, (old = []) =>
        old.map((n) => (n.id === id ? { ...n, ...payload } as Note : n))
      );

      if (previousNote) {
        queryClient.setQueryData<Note>(["note", id], {
          ...previousNote,
          ...payload,
        } as Note);
      }

      return { previousNotes, previousNote, id };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(notesKey, ctx.previousNotes);
      if (ctx.previousNote) queryClient.setQueryData(["note", ctx.id], ctx.previousNote);
    },

    onSuccess: (updated) => {
      queryClient.setQueryData<Note[]>(notesKey, (old = []) =>
        old.map((n) => (n.id === updated.id ? updated : n))
      );
      queryClient.setQueryData(["note", updated.id], updated);
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: number) => {
      const req = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!req.ok) throw new Error(await req.text());
      return id;
    },

    onMutate: async (id) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notesKey }),
        queryClient.cancelQueries({ queryKey: ["note", id] }),
      ]);

      const previousNotes = queryClient.getQueryData<Note[]>(notesKey) ?? [];
      const previousNote = queryClient.getQueryData<Note>(["note", id]) ?? null;

      queryClient.setQueryData<Note[]>(notesKey, (old = []) =>
        old.filter((n) => n.id !== id)
      );

      // remove single note cache so if opened in another tab it becomes "not found"
      queryClient.removeQueries({ queryKey: ["note", id], exact: true });

      return { previousNotes, previousNote, id };
    },

    onError: (_err, _id, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(notesKey, ctx.previousNotes);
      if (ctx.previousNote) queryClient.setQueryData(["note", ctx.id], ctx.previousNote);
    },
  });

  return {
    notes: notesQuery.data ?? [],
    loading: notesQuery.isLoading,
    error: notesQuery.error,

    createNote,
    updateNote,
    deleteNote,
  };
}
