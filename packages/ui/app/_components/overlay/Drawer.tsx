"use client";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid, IconButton, useMediaQuery } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import * as React from "react";

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

const drawerBleeding = 70;

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

/**
 * Overlay is a bottom anchored drawer that can be swiped up or down
 * A la google maps
 * Toggle button for desktop
 */
export default function ClientLayout(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [variant, setVariant] = React.useState<"temporary" | "persistent">(
    "temporary"
  );
  const bigEnough = useMediaQuery("(min-width:600px)");
  React.useEffect(() => {
    if (bigEnough) {
      setVariant("persistent");
    } else {
      setVariant("temporary");
    }
  }, [bigEnough]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        variant={variant}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            overflow: "visible",
            p: 2,
          },
        }}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
            minHeight: `${drawerBleeding}px`,
          }}
        >
          <Grid container justifyContent="center">
            <Grid item>
              <IconButton
                aria-label="expand"
                onClick={toggleDrawer(!open)}
                size="small"
              >
                {open ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </Grid>
          </Grid>
          <Box sx={{ px: 2 }}>{props.title}</Box>
        </StyledBox>
        <Box sx={{ p: 2 }}>{props.children}</Box>
      </SwipeableDrawer>
    </div>
  );
}
