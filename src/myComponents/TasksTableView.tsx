"use client";

import * as React from "react";
import type { Task } from "@/lib/interfaces/task";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NoteIcon from "@mui/icons-material/Note";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

export default function TasksTableView({
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

  const handleRowClick = (params: { id: string | number }) => {
    router.push(`/tasks/${params.id}`);
  };
  const now = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleString() : ""; //a3mlha function a7san w hia valueformater kda kda beta5od
  //callbackfunction feha el value bta3t el field
  const columns = useMemo<GridColDef<Task>[]>(
    () => [
      //7lwa awii tsearch belfield Goa el data w 3la assasha ela el actions
      { field: "title", headerName: "Title", flex: 1, minWidth: 160 },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 260,
      },
      { field: "priority", headerName: "Priority", width: 120 },
      { field: "status", headerName: "Status", width: 140 },
      {
        field: "createdAt",
        headerName: "Created",
        flex: 1,
        minWidth: 180,
        valueFormatter: now,
      },
      {
        field: "updatedAt",
        headerName: "Updated",
        flex: 1,
        minWidth: 180,
        valueFormatter: now,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 160,
        sortable: false,
        filterable: false,
        //
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit Task">
              <IconButton
                aria-label="edit"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(params.row);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Task">
              <IconButton
                aria-label="delete"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(params.row.id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Task Notes">
              <IconButton
                aria-label="notes"
                size="small"
                onClick={() => {
                  /* later */
                }}
              >
                <NoteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onDelete, onEdit]
  );
  // if (loading){
  //   return <h1>loading....... ya fawaz</h1> //skeleton loader
  // }
  // if (loading) return <Typography>Loading…</Typography>;
  if (!loading && tasks.length === 0) {
    return <Typography sx={{ opacity: 0.7 }}>No tasks yet.</Typography>;
  }

  return (
    <Box sx={{ height: 560, width: "100%" }}>
      <DataGrid
        rows={tasks}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        onRowClick={handleRowClick}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        showColumnVerticalBorder
        showCellVerticalBorder
        sx={{
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }}
      />
    </Box>
  );
}
