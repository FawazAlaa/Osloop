"use client";

import { useCallback, useEffect, useState } from "react";
import type { Task } from "@/lib/interfaces/task";
import { taskSchema } from "@/lib/services/taskSchema";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TaskPaper } from "./ui/paper";
import { useTasks } from "@/hooks/useTasks";
import { useTask } from "@/hooks/useTask";

type FormState = Omit<Task, "id">;
const emptyForm: FormState = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  createdAt: "",
  updatedAt: "",
};
function nowIso() {
  return new Date().toISOString();
}

export default function TaskDetail({ id }: { id: number }) {
  //queries takes hna
  const { loading, updateTask, deleteTask, error } = useTasks();
  const { data: task, isLoading } = useTask(id);
  /////////Form options/////
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    createdAt: nowIso(),
    updatedAt: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function validateTaskPayload(payload: FormState): string | null {
    const result = taskSchema.safeParse(payload);
    if (result.success) return null;
    return result.error.issues[0]?.message ?? "Invalid task";
  }
  const closeForm = useCallback(() => {
    if (!saving) setOpenForm(false);
  }, [saving]);
  const now = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleString() : "";
  /////////////////////////////////////////////////////
  const onEdit = useCallback((t: Task) => {
    setForm({
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      createdAt: now(t.createdAt),
      updatedAt: now(t.updatedAt),
    });
    setFormError(null);
    setOpenForm(true);
  }, []);
  const submitForm = useCallback(async () => {
    const payload: FormState = {
      ...form,
      createdAt: form.createdAt, //|| new Date().toLocaleString('en-GB'),edit bas hna
      updatedAt: new Date().toISOString(), //LW edit yeb2a akeed update date
    };
    const err = validateTaskPayload(payload);
    setFormError(err);
    if (err) return;
    setSaving(true);

    try {
      await updateTask.mutateAsync({ id, payload }); //3kshan hna de async
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setOpenForm(false);
      setSaving(false);
    }
  }, [id, form, updateTask]);

  // Hna ba2a el logic kolo lel Delete inside another form
  //  //////////////Logic el delete
  const [openDelete, setOpenDelete] = useState(false);
  const closeDelete = useCallback(() => {
    setOpenDelete(false);
  }, []);
  const onDeleteRequest = useCallback(() => {
    setOpenDelete(true);
  }, []);
  const confirmDelete = useCallback(async () => {
    try {
      await deleteTask.mutateAsync(id);
      closeDelete();
    } catch (err) {
      console.error("Delete failed", err);
    }
  }, [id, deleteTask, closeDelete]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        p: { xs: 2, sm: 3 },
        display: "grid",
        placeItems: "center",
        bgcolor: (t) => t.palette.grey[50],
      }}
    >
      <TaskPaper
        task={task ?? null}   //lazm aro7 ab3tha as task mn el usetask
        variant="detail"
        onEdit={onEdit}
        onDelete={(taskId) => {
          onDeleteRequest();
        }}
      />

      {/* Edit Dialog bas<<<<<<<<<<<<<<<<<<<<<*/}
      <Dialog open={openForm} onClose={closeForm} fullWidth maxWidth="sm">
        <DialogTitle>Edit Task</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5}>
            {formError ? (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            ) : null}

            <TextField
              label="Title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              fullWidth
              autoFocus
            />

            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              fullWidth
              multiline
              minRows={3}
            />

            <TextField
              label="Priority"
              value={form.priority}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  priority: (e.target.value as Task["priority"]) || "medium",
                }))
              }
              fullWidth
              select
              SelectProps={{ native: true }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </TextField>

            <TextField
              label="Status"
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  status: (e.target.value as Task["status"]) || "todo",
                }))
              }
              fullWidth
              select
              SelectProps={{ native: true }}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </TextField>

            <TextField
              label="Created At"
              value={form.createdAt}
              fullWidth
              disabled
            />
            <TextField
              label={
                form.updatedAt ? form.updatedAt : "New task no updates yet"
              }
              fullWidth
              disabled
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeForm} disabled={saving}>
            Cancel
          </Button>
          {/* hna el submit */}
          <Button variant="contained" onClick={submitForm} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog (shared for both views) */}
      <Dialog open={openDelete} onClose={closeDelete}>
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">This action can’t be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

