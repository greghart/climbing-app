"use client";

import { Alert, Snackbar } from "@mui/material";
import React from "react";

// Specifically handles ApiResponse format
interface Props {
  kee?: number; // Let parent key out messages through props
  message?: string;
  errors?: string[];
  SnackbarProps?: React.ComponentProps<typeof Snackbar>;
  AlertProps?: Omit<React.ComponentProps<typeof Alert>, "severity">;
}

export interface SnackbarMessage {
  message: string;
  severity: React.ComponentProps<typeof Alert>["severity"];
  key: number;
}

export default function SubmitSnack(props: Props) {
  // snack pack example taken from MUI for consecutive snacks
  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>(
    []
  );
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<
    SnackbarMessage | undefined
  >(undefined);
  // Consume off the snack pack
  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);
  // Let props add to snack pack on init/change
  React.useEffect(() => {
    const msg = props.message; // Closure
    if (msg) {
      setSnackPack((prev) => [
        ...prev,
        { message: msg, key: new Date().getTime(), severity: "success" },
      ]);
    }
    const err = props.errors?.join(", ");
    if (err) {
      setSnackPack((prev) => [
        ...prev,
        { message: err, key: new Date().getTime(), severity: "error" },
      ]);
    }
  }, [props.kee]);
  // Handle closing/transitions
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <Snackbar
      key={messageInfo ? messageInfo.key : undefined}
      autoHideDuration={5000}
      open={open}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      {...props.SnackbarProps}
    >
      <Alert severity={messageInfo?.severity} {...props.AlertProps}>
        {messageInfo ? messageInfo.message : undefined}
      </Alert>
    </Snackbar>
  );
}
