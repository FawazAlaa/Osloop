"use client";

import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Task } from "@/lib/interfaces/task";

type TaskPaperVariant = "detail" | "kanban";
// https://docs.desishub.com/programming-tutorials/nextjs/drag-n-drop
export function TaskPaper({
  task,
  variant = "detail",
  onEdit,
  onDelete,
  onClick,
}: {
  task: Task | null;
  variant?: TaskPaperVariant;
  onEdit?: (t: Task) => void;
  onDelete?: (id: number) => void;
  onClick?: () => void;
}) {
  const isDetail = variant === "detail";
  const now = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleString() : "";
  const statusLabel =
    task?.status === "in-progress"
      ? "In Progress"
      : task?.status === "done"
      ? "Done"
      : "To Do";

  const priorityLabel =
    task?.priority === "high"
      ? "High"
      : task?.priority === "low"
      ? "Low"
      : "Medium";

  return (
    <Paper
      elevation={isDetail ? 8 : 2}
      onClick={onClick}
      sx={{
        width: "100%",
        maxWidth: isDetail ? 560 : "100%",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFF8D4" : "#3A3420", // 3lshan CssThemeVariables
        //    ana hna bast5dm univeral theme provider asmo theme w enable css variable
        border: (theme) =>
          `1px solid ${
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.08)"
              : "rgba(255,255,255,0.10)"
          }`,
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
          {/* Header */}
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
                  Task Details
                </Typography>
              )}

              <Typography
                variant={isDetail ? "h5" : "subtitle1"}
                fontWeight={900}
                sx={{ wordBreak: "break-word" }}
              >
                {task?.title || "Loading..."}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <Chip
                size="small"
                label={statusLabel}
                sx={{
                  fontWeight: 700,
                  bgcolor:
                    task?.status === "done"
                      ? "rgba(46,125,50,0.12)"
                      : task?.status === "in-progress"
                      ? "rgba(2,136,209,0.12)"
                      : "rgba(97,97,97,0.12)",
                }}
              />
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            sx={{ opacity: 0.85, whiteSpace: "pre-wrap" }}
          >
            {task?.description?.trim()
              ? task.description
              : "— No description provided —"}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={`Priority: ${priorityLabel}`}
              sx={{
                fontWeight: 700,
                bgcolor:
                  task?.priority === "high"
                    ? "rgba(211,47,47,0.12)"
                    : task?.priority === "low"
                    ? "rgba(56,142,60,0.12)"
                    : "rgba(245,124,0,0.12)",
              }}
            />

            {isDetail && (
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {task?.createdAt
                  ? new Date(task.createdAt).toLocaleString()
                  : ""}
              </Typography>
            )}
          </Stack>
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
                {now(task?.createdAt) || "—"}
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
                {now(task?.updatedAt) || "—"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Footer actions */}
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
            {onEdit && task && (
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    
                    onEdit(task);
                  }}
                   onPointerDown={(e) => e.stopPropagation()}  //rahebbbaaaa 
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {onDelete && task && (
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                    
                  }}
                   onPointerDown={(e) => e.stopPropagation()}
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
