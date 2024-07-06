import { Box } from "@mui/material";

// Breaks out and sets up a full sized div above map layer at 0,0
export default function FullScreen({
  children,
  zIndex = 1000,
}: {
  children: React.ReactNode;
  zIndex?: number;
}) {
  return (
    <Box
      sx={{
        zIndex,
        position: "absolute!important",
        left: "0!important",
        margin: "0!important",
        top: "0!important",
        width: "100vw",
      }}
    >
      {children}
    </Box>
  );
}
