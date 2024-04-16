"use client";
import * as React from "react";
import { ICrag } from "models";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Grid, IconButton, useMediaQuery } from "@mui/material";

interface Props {
  children: React.ReactNode;
  crag: ICrag;
}

const drawerBleeding = 70;

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  // position: "absolute",
  top: 8,
  margin: theme.spacing(1),
  // left: "calc(50% - 15px)",
  cursor: "grab",
}));

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
            height: `calc(50% - ${drawerBleeding}px)`,
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
          <Grid container alignItems="center" direction="column">
            <Grid item xs>
              <IconButton aria-label="expand" onClick={toggleDrawer(!open)}>
                {open ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </Grid>
            <Grid item xs>
              {props.crag.name || "..."}
            </Grid>
          </Grid>
        </StyledBox>
        {props.children}
      </SwipeableDrawer>
    </div>
  );
}
