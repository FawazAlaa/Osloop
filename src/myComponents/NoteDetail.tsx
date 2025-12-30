"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Note } from "@/lib/interfaces/note";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { NotePaper } from "@/myComponents/ui/NotePaper";
import { useNotes } from "@/hooks/useNotes";
import { useNote } from "@/hooks/useNote";
import { debounce } from "@/myFuncs/DebounceValue"; // real debounce function
import { useEditor, EditorContent } from "@tiptap/react"; //>>>> useEditor feha extensions :[starterkit]
// https://tiptap.dev/docs/editor/getting-started/install/nextjs
//>>>>feha content, onUpdate
import StarterKit from "@tiptap/starter-kit";

function nowIso() {
  return new Date().toISOString();
}

export default function NoteDetail({ id }: { id: number }) {
  const router = useRouter();

  const { updateNote, deleteNote } = useNotes();
  const { data: note, isLoading, error } = useNote(id);

  //bafta7 w a2fel edit bas (optional)
  const [openEditor, setOpenEditor] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);

  //ana hna bas5tm el debounxe el ana 3amlha
  const debouncedSave = useMemo(
    () =>
      debounce((nextContent: string) => {
        updateNote.mutate({
          id,
          payload: { content: nextContent, updatedAt: nowIso() },
        });
      }, 800),
    [id, updateNote]
  );

  const editor = useEditor({
    immediatelyRender: false, // kan 3amly meshkelaaaaaa 3lshan ma3 en da use client bas utiptap needs to be explicit 3lshan
    //Next can still pre-render and then hydrate, and TipTap wants you to be explicit.
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      const next = editor.getText(); //testana wa2t la7d matgeeb el html w tyext hna 3lshan ana mish me7tag bold aw 7aga tania
      debouncedSave(next);
    },
    
    
  });

  // when note loads  w loa mafish vontent 
  useEffect(() => {
    if (!note?.content || !editor) return;
    //mai3otsh yreset nafs el content 
    const current = editor.getHTML();
    if (current !== note.content) {
      editor.commands.setContent(note.content, { emitUpdate: false }); //bet3mlhash anha fe loop
                                           //wde 3lshan dont rerender  //3lshanset content bet3mal infinite loop 
    }
  }, [note?.content, editor]);

  const onEdit = useCallback(() => {
    setOpenEditor(true);
  }, []);

  const onDeleteRequest = useCallback(() => {
    setOpenDelete(true);
  }, []);

  const closeDelete = useCallback(() => {
    setOpenDelete(false);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await deleteNote.mutateAsync(id);
      closeDelete();
      router.replace("/notes");
      router.refresh();
    } catch (err) {
      console.error("Delete failed", err);
    }
  }, [id, deleteNote, closeDelete, router]);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load note.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        p: { xs: 2, sm: 3 },
        display: "grid",
        placeItems: "center",
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 900 }}>
        <NotePaper
          note={note ?? null}
          variant="detail"
          onEdit={() => onEdit()}
          onDelete={() => onDeleteRequest()}
        />

        {/*  Tiptap editor area  */}
        {openEditor && (
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,1)",
              borderRadius: 2,
              p: 2,
              minHeight: 220,
            }}
          >
            {!editor ? (
              <Typography>Loading editor…</Typography>
            ) : (
              <>
                <Typography sx={{color:'red'}}>Edit Your task 3la tool ya basha</Typography>
                <EditorContent editor={editor} style={{border:"1px solid rgba(0,0,0,1)", }} />
              </>
            )}

            <Typography
              variant="caption"
              sx={{ opacity: 0.7, mt: 1, display: "block" }}
            >
              Autosave enabled (saves after you stop typing)
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {updateNote.isPending ? "Saving…" : "Saved"}
            </Typography>
          </Box>
        )}
      </Stack>

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
