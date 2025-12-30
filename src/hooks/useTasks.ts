import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@/lib/interfaces/task";

// Replace with your real API layer later
async function fetchTasks(): Promise<Task[]> {
  const req = await fetch("/api/tasks");
  const response = await req.json();
  return response;

}

export function useTasks() {
  
  const queryClient = useQueryClient(); //Hna ana create el const queryClient=useQueryClient());
  const tasksKey = ["tasks"];


  const tasksQuery = useQuery({
    //hna ana basmy el taskquery lel useQuery beta5od asm el
    //queryKey and queryFn
    queryKey: tasksKey,
    queryFn: fetchTasks,
  });

  // CreateTask
  const createTask = useMutation({
    mutationFn: async (payload: Omit<Task, "id">) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        {
           console.error("API error:", res.status, await res.text());
          throw new Error(await res.text());
        } 
      return (await res.json()) as Task;
    },
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old = []) => [newTask, ...old]);
    },
  });

//     UPDATE
  const updateTask = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Omit<Task, "id">;
    }) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      return (await res.json());
    },
  //  hna ba2a mohema gedan rollback steps
  //  cancel outgoing refetches w bardo ba3mal snapshot lel
  //previous Values w ba3mal update optimistic (temprorary)
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: tasksKey });
      await queryClient.cancelQueries({ queryKey: ["task", id] });

      const previousTasks = queryClient.getQueryData<Task[]>(tasksKey);
      const previousTask = queryClient.getQueryData<Task>(["task", id]);
      //lel all tasks optimistic update
      queryClient.setQueryData<Task[]>(tasksKey, (old = []) =>
        old.map((t) =>
          t.id === id
            ? { ...t, ...payload, updatedAt: new Date().toISOString() }
            : t
        )
      );
         //lel single tasks optimistic update
      queryClient.setQueryData<Task>(["task", id], (old) =>
        old
          ? { ...old, ...payload, updatedAt: new Date().toISOString() }
          : ({ id, ...payload } as Task)
      );

      // mohemaaaaaaa fe 7ala en el update mat3mlsh rag3ly el context
      //previous values
      return { previousTasks, previousTask };
    },
    //>>>>>>>mohema 3lshan deh ba2a el error lo fe context ya3ny 
     // mara7sh lel onsuccess w 3aml error rag3aly el data zai mahia
    onError: (_err, { id }, context) => {
      // rollback
      if (context?.previousTasks) queryClient.setQueryData(tasksKey, context.previousTasks);
      if (context?.previousTask) queryClient.setQueryData(["task", id], context.previousTask);
    },
      //7ala el success
    onSuccess: (updated) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old = []) =>
        old.map((t) => (t.id === updated.id ? updated : t))
      );
      queryClient.setQueryData<Task>(["task", updated.id], updated);
    },

    onSettled: (_data, _err, { id }) => { //_ I DONT USE THEM JUST CLEAN
      //Gamda awiiii bet3mal refresh 3and awl forsa leha w fe nafs el 
      //wa2t mish bet3atl el ui VERY POWERFUL
      queryClient.invalidateQueries({ queryKey: tasksKey });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      return id;
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: tasksKey });
      await queryClient.cancelQueries({ queryKey: ["task", id] });

      const previousTasks = queryClient.getQueryData<Task[]>(tasksKey);
      const previousTask = queryClient.getQueryData<Task>(["task", id]);

      // optimistic remove from list
      queryClient.setQueryData<Task[]>(tasksKey, (old = []) =>
        old.filter((t) => t.id !== id)
      );
      //3lshan el sync 
      queryClient.removeQueries({ queryKey: ["task", id], exact: true });
      //7eta el exact deh bardo 7lwa la2nha bedwar  3la el exact 
      //key el esmha  task ,id mish ay 7aga betbda2 b task,id dah
      //fa 7lwa gedan lw 3andy kaza query 
      return { previousTasks, previousTask };
    },

    onError: (_err, id, ctx) => {
      if (ctx?.previousTasks) queryClient.setQueryData(tasksKey, ctx.previousTasks);
      if (ctx?.previousTask) queryClient.setQueryData(["task", id], ctx.previousTask);
    },

    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: tasksKey });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    loading: tasksQuery.isLoading,
    error: tasksQuery.error,

    createTask,
    updateTask,
    deleteTask,
  };
}

// de koll el 7agat el useQuery betrag3ha

// const {
//   data,          // the resolved data (or undefined)
//   isLoading,     // true on first load
//   isFetching,    // true on any refetch
//   error,         // Error | null
//   isError,       // boolean
//   isSuccess,     // boolean
//   refetch,       // function
// } = useQuery(...)