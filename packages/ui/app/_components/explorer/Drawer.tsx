"use client";
import React, { ReactNode } from "react";
import SearchGroup from "@/app/_components/search/SearchGroup";
import Box from "@mui/material/Box";
import MUIDrawer from "@mui/material/Drawer";

interface Props {
  title: ReactNode;
  sidebarChildren?: ReactNode;
  children: (setOpen: (open: boolean) => void) => ReactNode;
}
/**
 * Crag explorer sidebar
 * Attaches a MUI drawer with a closable hamburger menu and a search group title
 * TODO: Ok I had actually refactored this to overlay cards so there was nothing left in the drawer
 * Going to optionally keep it for now just in case, but should be able to be removed
 */
export default function Drawer(props: Props) {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (open: boolean) => {
    return (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };
  };

  return (
    <>
      {props.children(setOpen)}
      <MUIDrawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        className="over-map"
      >
        <Box p={2} className="h-100 bg-light" width="80vw">
          <SearchGroup
            onClickPrepend={toggleDrawer(false)}
            prepend={<i className="fa fa-bars" />}
            input={
              <div className="input-group-append flex-grow-up align-items-center text-center">
                {props.title}
              </div>
            }
          />
          {props.sidebarChildren}
        </Box>
      </MUIDrawer>
    </>
  );
}