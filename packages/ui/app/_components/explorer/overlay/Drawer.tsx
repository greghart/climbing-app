"use client";
import { searchParamsParsers } from "@/app/_components/explorer/searchParams";
import FullScreen from "@/app/_components/layouts/OverMap";
import PageLayout from "@/app/_components/layouts/PageLayout";
import SearchInput from "@/app/_components/search/SearchInput";
import useRouteTo from "@/app/_components/useRouteTo";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid, IconButton, useMediaQuery } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { ICrag } from "models";
import { useQueryState } from "nuqs";
import * as React from "react";

interface Props {
  title: React.ReactNode;
  children?: React.ReactNode;
  crag?: ICrag;
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
export default function Drawer(props: Props) {
  // TODO: Refactor to a re-usable hook and a prop to enable
  // Problem is components like google charts defer height calculation till they're actually
  // showing, so hard to figure out height now
  const children = props.children;
  // const [height, setHeight] = React.useState(0);
  // const childRef = React.useCallback(
  //   (node: any) => {
  //     // Give node some time for any asynchronous renders
  //     setTimeout(() => {
  //       if (node !== null) {
  //         setHeight(node.getBoundingClientRect().height);
  //       }
  //     }, 1500);
  //   },
  //   [props.children]
  // );
  const [open, setOpen] = useQueryState("overlay", searchParamsParsers.overlay);
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
  const routeTo = useRouteTo({ relative: false });

  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div>
      <FullScreen>
        <PageLayout
          header={
            <SearchInput
              onClick={() =>
                props.crag && routeTo(`/crags/${props.crag.id}/search`)
              }
            />
          }
        ></PageLayout>
      </FullScreen>
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
            // minHeight: `calc(${height}px - 32px - ${drawerBleeding}px)`,
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
        <Box sx={{ p: 2, overflowY: "scroll" }}>{children}</Box>
      </SwipeableDrawer>
    </div>
  );
}
