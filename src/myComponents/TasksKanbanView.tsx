"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/lib/interfaces/task";
import { Paper, Stack, Typography, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core"; // DragOverEvent hna
import { SortableContext } from "@dnd-kit/sortable"; //arraymove hna
import { useTasks } from "@/hooks/useTasks";
import { DragableTaskCard } from "./ui/DragableTaskPaper";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const STATUS_COLUMNS: { key: Task["status"]; title: string }[] = [
  { key: "todo", title: "To Do" },
  { key: "in-progress", title: "In Progress" },
  { key: "done", title: "Done" },
]; //asamy el table el awl bel key el gi mn el backend
// https://docs.desishub.com/programming-tutorials/nextjs/drag-n-drop

type SortMode =
  | "none"
  | "createdAt_desc"
  | "createdAt_asc"
  | "priority_desc"
  | "priority_asc";

// de function ana 3mlha beta5od id beta3t target el column bet3mal
//el droppable zone setNodeRed 3lshane elemtn d=om w isover el hoa over.id dropend
export function DroppableColumn({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef} //el ref 3lshan na3mal el dropzone connect
      variant="outlined"
      sx={{
        minWidth: 340,
        width: 340,
        p: 1.5,
        borderRadius: 2,
        flexShrink: 0,
        outline: isOver ? "2px dashed rgba(25,118,210,0.9)" : "none", //sa3t el over hna
      }}
    >
      {children}
    </Paper>
  );
}

function priorityRank(p: Task["priority"]) {
  let result;
  switch (p) {
    case "high":
      result = 3;
      break;
    case "medium":
      result = 2;
      break;
    default:
      result = 1;
  }
  return result;
}

function dateMs(value: string) {
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
}

// https://docs.desishub.com/programming-tutorials/nextjs/drag-n-drop
export default function TasksKanbanView({
  tasks,
  loading,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  loading: boolean;
  onEdit: (t: Task) => void;
  onDelete: (id: number) => void;
}) {
  const router = useRouter();
  const { updateTask } = useTasks();

  // >>>>>>>Filter Options<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  const [priorityFilter, setPriorityFilter] = useState<
    "None" | Task["priority"]
  >("None");
  const [statusFilter, setStatusFilter] = useState<"None" | Task["status"]>(
    "None"
  );
  const [sortMode, setSortMode] = useState<SortMode>("none");

  const allowManualReorder = sortMode === "none"; // (we are NOT implementing reorder yet)

  // hna el yerga3li mn el filter w el sort
  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (priorityFilter !== "None" && t.priority !== priorityFilter)
        return false; //lw hia mish none /w el priotiy msh besawy el el ana 3ozo w zai el sort rag3ly false 3'er
      //kda rag3ly true
      if (statusFilter !== "None" && t.status !== statusFilter) return false;
      return true;
    });
  }, [tasks, priorityFilter, statusFilter]);

  // ✅ Then group by status
  const grouped = useMemo(() => {
    const map: Record<Task["status"], Task[]> = {
      todo: [],
      "in-progress": [],
      done: [],
    };
    for (const t of visibleTasks) map[t.status].push(t);
    return map;
  }, [visibleTasks]);

  // ✅ Sorting داخل كل column (keeps DnD simple)
  const groupedSorted = useMemo(() => {
    const copy: Record<Task["status"], Task[]> = {
      todo: [...grouped.todo],
      "in-progress": [...grouped["in-progress"]],
      done: [...grouped.done],
    };

    const sortList = (list: Task[]) => {
      if (sortMode === "none") return list; // keep current order from backend/cache

      if (sortMode === "createdAt_desc") {
        return list.sort((a, b) => dateMs(b.createdAt) - dateMs(a.createdAt));
      }
      if (sortMode === "createdAt_asc") {
        return list.sort((a, b) => dateMs(a.createdAt) - dateMs(b.createdAt));
      }
      if (sortMode === "priority_desc") {
        return list.sort(
          (a, b) => priorityRank(b.priority) - priorityRank(a.priority)
        );
      }
      if (sortMode === "priority_asc") {
        return list.sort(
          (a, b) => priorityRank(a.priority) - priorityRank(b.priority)
        );
      }

      return list;
    };

    copy.todo = sortList(copy.todo);
    copy["in-progress"] = sortList(copy["in-progress"]);
    copy.done = sortList(copy.done);

    return copy;
  }, [grouped, sortMode]);

  // ✅ Smooth DnD: ONLY update on drop (no onDragOver, no arrayMove)
  const onDragEnd = (event: DragEndEvent) => {
    const activeId = Number(event.active.id);
    const overId = event.over?.id;

    if (!Number.isFinite(activeId) || !overId) return;

    const dropTarget = String(overId);

    // we only accept dropping on columns
    const isStatusColumn = STATUS_COLUMNS.some((c) => c.key === dropTarget);
    if (!isStatusColumn) {
      // dropped on a card etc — we ignore in phase 1
      // and especially when sorting is enabled, we do NOTHING
      return;
    }

    const task = tasks.find((t) => t.id === activeId);
    if (!task) return;

    const toStatus = dropTarget as Task["status"];
    if (task.status === toStatus) return;

    updateTask.mutate({
      id: activeId,
      payload: {
        status: toStatus,
      } as any,
    });
  };

  // (optional) loading / empty states
  if (loading) {
    return (
      <Stack sx={{ p: 2 }}>
        <Typography>Loading…</Typography>
      </Stack>
    );
  }

  return (
    <>
      {/* ✅ Filter + Sort Bar (only for Kanban) */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            label="Priority"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as "None" | Task["priority"])
            }
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "None" | Task["status"])
            }
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            label="Sort"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
          >
            <MenuItem value="none">Manual (DnD reorder enabled)</MenuItem>
            <MenuItem value="createdAt_desc">CreatedAt: Newest</MenuItem>
            <MenuItem value="createdAt_asc">CreatedAt: Oldest</MenuItem>
            <MenuItem value="priority_desc">Priority: High → Low</MenuItem>
            <MenuItem value="priority_asc">Priority: Low → High</MenuItem>
          </Select>
        </FormControl>

        {!allowManualReorder && (
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Reordering is disabled while sorting is active. You can still drag
            between columns.
          </Typography>
        )}
      </Stack>

      <DndContext onDragEnd={onDragEnd}>
        <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>
          {STATUS_COLUMNS.map((col) => (
            <DroppableColumn key={col.key} id={col.key}>
              <Stack spacing={1}>
                <Typography fontWeight={800}>{col.title}</Typography>
                <Divider />

                {/* even if we don't reorder now, SortableContext is ok */}
                <SortableContext
                  items={groupedSorted[col.key].map((t) => t.id)}
                >
                  <Stack spacing={1}>
                    {groupedSorted[col.key].map((t) => (
                      <DragableTaskCard
                        key={t.id}
                        task={t}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onClick={() => router.push(`/tasks/${t.id}`)}
                      />
                    ))}

                    {groupedSorted[col.key].length === 0 ? (
                      <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        No tasks
                      </Typography>
                    ) : null}
                  </Stack>
                </SortableContext>
              </Stack>
            </DroppableColumn>
          ))}
        </Stack>
      </DndContext>
    </>
  );
}
