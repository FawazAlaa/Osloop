"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { Task } from "@/lib/interfaces/task";
import { TaskPaper } from "./paper";

// https://docs.desishub.com/programming-tutorials/nextjs/drag-n-drop
// as a refrence da be5ali el taskpaper component draggable da el haikl 
export function DragableTaskCard({
  task,
  onEdit,
  onDelete,
  onClick,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: number) => void;
  onClick: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskPaper
        task={task}
        variant="kanban"
        onEdit={onEdit}
        onDelete={onDelete}
        onClick={onClick}
      />
    </div>
  );
}
