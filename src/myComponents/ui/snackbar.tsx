import { Snackbar } from "@mui/material";
import { CustomSnackbarProps } from "@/lib/interfaces/customesnackbarProps";

export default function CustomSnackbar({
  open = false, //el state bet3tha
  autoHideDuration = 3000, //el time
  onClose, //when to close
  message,
  action, //lw feha action component
  position = { vertical: "top", horizontal: "center" },
}: CustomSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      message={message}
      action={action}
      anchorOrigin={{
        vertical: position.vertical ?? "top",
        horizontal: position.horizontal ?? "center",
      }}
       sx={{
        "& .MuiSnackbarContent-root": {
          width: 360,              
          backgroundColor: "#424242", 
          color: "#fff",
          borderRadius: "8px",
          fontSize: "0.9rem",
          fontWeight: 500,
          border:1,
          borderColor:"red"
        },
      }}
    />
  );
}
