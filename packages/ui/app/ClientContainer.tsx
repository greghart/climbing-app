"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiList: {
      defaultProps: {
        disablePadding: true,
        dense: true,
      },
      styleOverrides: {
        root: {
          width: "100%",
          maxWidth: "480px",
        },
      },
    },
    MuiListItem: {
      defaultProps: {
        disablePadding: true,
      },
    },
    MuiListItemButton: {
      defaultProps: {
        dense: true,
      },
    },
  },
});

interface Props {
  children: React.ReactNode;
}

export default function ClientContainer(props: Props) {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
