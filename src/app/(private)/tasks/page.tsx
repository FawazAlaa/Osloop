"use client";

import * as React from "react";
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
import AddIcon from "@mui/icons-material/Add";
import type { Task } from "@/lib/interfaces/task";
import { taskSchema } from "@/lib/services/taskSchema";
import { useState, useEffect, useMemo, useCallback } from "react";

import TasksTableView from "@/myComponents/TasksTableView";
import TasksKanbanView from "@/myComponents/TasksKanbanView";
import { useTasks } from "@/hooks/useTasks";
import CustomSnackbar from "@/myComponents/ui/snackbar";

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

export default function TasksPage() {
  const [view, setView] = useState<"table" | "kanban">("table");

  // lel Create  w el edit w el delete
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // lma agy a3mal form gdeda
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    createdAt: nowIso(),
    updatedAt: "",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { tasks, loading, error, createTask, updateTask, deleteTask } =
    useTasks();
   //7agat el sbnackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  //batcheck hna bel Zod validation
  function validateTaskPayload(payload: FormState): string | null {
    const result = taskSchema.safeParse(payload);
    if (result.success) return null;
    return result.error.issues[0]?.message ?? "Invalid task";
  }
  //Dool bas mogard handling tools for close and open forms delete/Edit
  //>>ya3ny helper Tools kolha useCallback For performance maximum effort <<<<
  // //tegeb bas mish el logic
  const onCreateClick = useCallback(() => {
    setMode("create");
    setEditingId(null);
    setForm({
      ...emptyForm,
      createdAt: new Date().toLocaleString("en-GB"),
      updatedAt: "",
    });
    setFormError(null);
    setOpenForm(true);
  }, []);
  const now = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleString() : "";
  const onEdit = useCallback((t: Task) => {
    setMode("edit");
    setEditingId(t.id);
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
  const closeForm = useCallback(() => {
    if (!saving) setOpenForm(false);
  }, [saving]);

  // Hna ba2a el logic kolo lel create/Edit/Delete
  const submitForm = useCallback(async () => {
    const payload: FormState = {
      ...form,
      createdAt: form.createdAt || new Date().toLocaleString("en-GB"),
      updatedAt: mode === "edit" ? new Date().toLocaleString("en-GB") : "", //LW edit yeb2a akeed update date
    };
    const err = validateTaskPayload(payload);
    setFormError(err);
    if (err) return;

    setSaving(true);
    try {
      if (mode === "create") {
        await createTask.mutateAsync(payload);
        setSnackbarMsg(`Task ${payload.title} created succesfully` );
      setSnackbarOpen(true); //3kshan hna de async
      } else {
        if (mode === "edit" && editingId) {
          await updateTask.mutateAsync({ id: editingId, payload });
               setSnackbarMsg(`Task ${payload.title} was edied succesfully` );
              setSnackbarOpen(true);
        }
      }
      setOpenForm(false);
    } finally {
      setSaving(false);
    }
  }, [editingId, form, mode, createTask, updateTask]);

  // Hna ba2a el logic kolo lel Delete inside another form
  const onDeleteRequest = useCallback((id: number) => {
    setDeletingId(id);
    setOpenDelete(true);
  }, []);
  const closeDelete = useCallback(() => {
    setOpenDelete(false);
    setDeletingId(null);
  }, []);
  const confirmDelete = useCallback(async () => {
    if (!deletingId) return;
    closeDelete();
    try {
      await deleteTask.mutateAsync(deletingId);
      setSnackbarMsg(`Task was deleted succesfully` );
      setSnackbarOpen(true);
      
    } catch {
      // setTasks(before); // rollback  bbadal mn hna momken a3mlo mn el useTask
    }
  }, [closeDelete, deletingId, deleteTask]);

  // ---------------------------------------------------------------

  return (
    <Box sx={{ p: 3 }}>
      <CustomSnackbar message={snackbarMsg} open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}/>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Stack>
          <Typography variant="h5" fontWeight={800}>
            Your Todo List
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Choose your preference: Table or Kanban
          </Typography>
        </Stack>


        <Stack direction="row" spacing={1} justifySelf="center">
          <Button
            variant={view === "table" ? "contained" : "outlined"}
            onClick={() => setView("table")}
          >
            Table
          </Button>
          <Button
            variant={view === "kanban" ? "contained" : "outlined"}
            onClick={() => setView("kanban")}
          >
            Kanban
          </Button>
        </Stack>

        <Box sx={{ justifySelf: "end" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateClick}
          >
            New
          </Button>
        </Box>
      </Box>

      {view === "table" ? (
        <TasksTableView
          tasks={tasks}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDeleteRequest}
        />
      ) : (
        <TasksKanbanView
          tasks={tasks}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDeleteRequest}
        />
      )}

      {/* Create/Edit Dialog (shared for both views) */}
      <Dialog open={openForm} onClose={closeForm} fullWidth maxWidth="sm">
        <DialogTitle>
          {mode === "create" ? "Create Task" : "Edit Task"}
        </DialogTitle>

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
