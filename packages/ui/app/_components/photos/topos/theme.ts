import { createTheme, PaletteColor } from "@mui/material";

// Correspond to Mesa Rim difficulty colors, but can be used for anything
const _theme = createTheme({});
const theme = createTheme(_theme, {
  palette: {
    green: _theme.palette.augmentColor({
      color: {
        main: "#4caf50",
      },
      name: "green",
    }),
    blue: _theme.palette.augmentColor({
      color: {
        main: "#2196f3",
      },
      name: "blue",
    }),
    yellow: _theme.palette.augmentColor({
      color: {
        main: "#ffeb3b",
      },
      name: "yellow",
    }),
    red: _theme.palette.augmentColor({
      color: {
        main: "#f44336",
      },
      name: "red",
    }),
    purple: _theme.palette.augmentColor({
      color: {
        main: "#9c27b0",
      },
      name: "purple",
    }),
    black: _theme.palette.augmentColor({
      color: {
        main: "#000000",
      },
      name: "black",
    }),
  },
});
type MyTheme = typeof theme & {
  palette: typeof theme.palette & {
    green: PaletteColor;
    blue: PaletteColor;
    yellow: PaletteColor;
    red: PaletteColor;
    purple: PaletteColor;
    black: PaletteColor;
  };
};

export default theme as MyTheme;
