import { SnackbarProps } from "@mui/material";
type SnackbarPosition = {
  vertical?: "top" | "bottom";
  horizontal?: "left" | "center" | "right";
};

export type CustomSnackbarProps = {
  open?: boolean;
  autoHideDuration?: number;
  onClose?: SnackbarProps["onClose"];
  message?: string;
  action?: SnackbarProps["action"];
   position?: SnackbarPosition;
};