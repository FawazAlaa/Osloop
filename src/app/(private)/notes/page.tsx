"use client";

import { useCallback, useState } from "react";
import type { Note } from "@/lib/interfaces/note";
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
import { useRouter } from "next/navigation";
import { useNotes } from "@/hooks/useNotes";
import { NotePaper } from "@/myComponents/ui/NotePaper";
import CustomSnackbar from "@/myComponents/ui/snackbar";

type FormState = Omit<Note, "id">;

function nowIso() {
  return new Date().toISOString();
}

const emptyForm: FormState = {
  content: "",
  createdAt: "",
  updatedAt: "",
};

export default function NotesPage() {
  const router = useRouter();
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    createdAt: nowIso(),
    updatedAt: "",
  });

  const onCreateClick = useCallback(() => {
    setMode("create");
    setEditingId(null);
    setForm({ ...emptyForm, createdAt: nowIso(), updatedAt: "" });
    setOpenForm(true);
  }, []);

  const onEdit = useCallback((n: Note) => {
    setMode("edit");
    setEditingId(n.id);
    setForm({
      content: n.content,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    });
    setOpenForm(true);
  }, []);

  const closeForm = useCallback(() => {
    if (!saving) setOpenForm(false);
  }, [saving]);

  const submitForm = useCallback(async () => {
    const payload: FormState = {
      ...form,
      createdAt: form.createdAt || nowIso(),
      updatedAt: mode === "edit" ? nowIso() : "",
    };

    setSaving(true);
    try {
      if (mode === "create") {
        await createNote.mutateAsync(payload);
      setSnackbarMsg(`${payload.content} was created successfully`);
      setSnackbarOpen(true);
        
      } else if (editingId) {
        await updateNote.mutateAsync({ id: editingId, payload });
         setSnackbarMsg(`${payload.content} was edited successfully`);
      setSnackbarOpen(true);
      }
      setOpenForm(false);
    } finally {
      setSaving(false);
    }
  }, [form, mode, editingId, createNote, updateNote]);

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
    await deleteNote.mutateAsync(deletingId);
      setSnackbarMsg(`Note was deleted succesfully` );
      setSnackbarOpen(true);
  }, [deletingId, deleteNote, closeDelete]);

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading…</Typography></Box>;
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load notes.</Typography>
        <Button variant="contained" onClick={() => router.refresh()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
          <CustomSnackbar message={snackbarMsg} open={snackbarOpen}
              autoHideDuration={4000}
              onClose={() => setSnackbarOpen(false)}/>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack>
          <Typography variant="h5" fontWeight={800}>Your Notes</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Create, edit, and open notes.
          </Typography>
        </Stack>

        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateClick}>
          New
        </Button>
      </Stack>

      <Stack spacing={1.5}>
        {notes.length === 0 ? (
          <Typography sx={{ opacity: 0.7 }}>No notes yet.</Typography>
        ) : (
          notes.map((n) => (
            <NotePaper
              key={n.id}
              note={n}
              variant="list"
              onEdit={onEdit}
              onDelete={onDeleteRequest}
              onClick={() => router.push(`/notes/${n.id}`)}
            />
          ))
        )}
      </Stack>

      {/* Create/Edit Dialog */}
      <Dialog open={openForm} onClose={closeForm} fullWidth maxWidth="sm">
        <DialogTitle>{mode === "create" ? "Create Note" : "Edit Note"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <TextField
              label="Content"
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              fullWidth
              multiline
              minRows={6}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={submitForm} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={openDelete} onClose={closeDelete}>
        <DialogTitle>Delete note?</DialogTitle>
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
