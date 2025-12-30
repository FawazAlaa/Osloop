"use client";

import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Note } from "@/lib/interfaces/note";

type NotePaperVariant = "list" | "detail";

export function NotePaper({
  note,
  variant = "list",
  onEdit,
  onDelete,
  onClick,
}: {
  note: Note | null;
  variant?: NotePaperVariant;
  onEdit?: (n: Note) => void;
  onDelete?: (id: number) => void;
  onClick?: () => void;
}) {
  const isDetail = variant === "detail";
  const now = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleString() : "";

  const preview = note?.content?.trim()
    ? note.content.length > 120 && !isDetail
      ? note.content.slice(0, 120) + "…"
      : note.content
    : "— Empty note —";

  return (
    <Paper
      elevation={isDetail ? 8 : 2}
      onClick={onClick}
      sx={{
        width: "100%",
        maxWidth: isDetail ? 680 : "100%",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        bgcolor: (theme) =>   //gamda gedan
          theme.palette.mode === "light" ? "#FFF8D4" : "#3A3420", // close dark version
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: isDetail
          ? "0 10px 30px rgba(0,0,0,0.12)"
          : "0 4px 10px rgba(0,0,0,0.08)",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? { boxShadow: "0 8px 20px rgba(0,0,0,0.14)" }
          : undefined,
      }}
    >
      {/* notebook lines */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.35,
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "100% 34px",
        }}
      />

      <Box sx={{ position: "relative", p: isDetail ? 3 : 2 }}>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={1}
          >
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
              {isDetail && (
                <Typography
                  variant="overline"
                  sx={{ opacity: 0.8, letterSpacing: 1.2 }}
                >
                  Note Details
                </Typography>
              )}

              <Typography
                variant={isDetail ? "h6" : "subtitle1"}
                fontWeight={900}
              >
                Note #{note?.id ?? "…"}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            sx={{ opacity: 0.9, whiteSpace: "pre-wrap" }}
          >
            {preview}
          </Typography>

          <Divider sx={{ my: 0.5 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ pt: 0.5 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ opacity: 0.75, fontWeight: 700 }}
              >
                Created At
              </Typography>
              <Typography sx={{ mt: 0.25 }}>
                {now(note?.createdAt) || "—"}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ opacity: 0.75, fontWeight: 700 }}
              >
                Updated At
              </Typography>
              <Typography sx={{ mt: 0.25 }}>
                {now(note?.updatedAt) || "—"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {(onEdit || onDelete) && (
        <>
          <Divider />
          <Box
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "flex-end",
              gap: 0.5,
              bgcolor: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(6px)",
            }}
          >
            {onEdit && note && (
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {onDelete && note && (
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
}
