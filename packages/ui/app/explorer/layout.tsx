"use client";
import SearchGroup from "@/app/_components/search/SearchGroup";
import SearchInput from "@/app/_components/search/SearchInput";
import Box from "@mui/material/Box";
import React, { useMemo } from "react";
import Drawer from "@/app/_components/explorer/Drawer";

interface Props {
  children: React.ReactNode;
  map: React.ReactNode;
  overlay: React.ReactNode;
}

/**
 * Layout for explorer is setup with parallel routes.
 * * Has an un-used drawer
 * * Map routes
 * * Overlay detail routes
 */
export default function RootLayout(props: Props) {
  const navigateToSearch = React.useCallback(() => {
    console.warn("TODO: Navigate to search here");
  }, []);
  return (
    <>
      <Drawer title={"TODO crag"} sidebarChildren={null}>
        {(setOpen) => (
          <div className="h-100">
            <div className="fixed-container over-map">
              <div className="container">
                <div className="row no-gutters pt-3">
                  <div className="col">
                    <SearchGroup
                      onClickPrepend={() => setOpen(true)}
                      prepend={<i className="fa fa-bars" />}
                      input={<SearchInput onClick={navigateToSearch} />}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/** Sub-routes are injected as a fixed container over the map */}
            {/** Position them rooted at the bottom of the screen */}
            <div className="fixed-container h-100">
              <div className="container h-100">
                <div className="row h-100 no-gutters align-items-end">
                  <div className="col mb-3 over-map">{props.overlay}</div>
                </div>
              </div>
            </div>
            <Box sx={{ height: "100vh" }}>{props.map}</Box>
          </div>
        )}
      </Drawer>
    </>
  );
}
