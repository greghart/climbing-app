import { Box } from "@mui/material";

// Breaks out and sets up a full sized div above map layer at 0,0
/**
 * Fullscreen breaks out of whatever container it's in and sets up a full sized div
 * Note: default 1000 z index is over the map layer, but under the controls layer
 */
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
