"use client";
import SearchGroup from "@/app/_components/search/SearchGroup";
import SearchInput from "@/app/_components/search/SearchInput";
import Box from "@mui/material/Box";
import { Crag as CragModel } from "models";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import Drawer from "./Drawer";

/**
 * Main component for exploring a crag.
 *
 * Sets up a basic sidebar layout.
 * - Sidebar (crag title + sidebarChildren)
 * - Main crag map
 *   - Search bar
 *   - Action to open sidebar
 *   - Overlaid detail
 */
interface Props {
  crag: CragModel;
  cragId?: string;
  // onAreaClick: (area: Area) => any;
  onCloseSidebar?: () => unknown;
  onOpenSidebar?: () => unknown;
  onOpenSearch?: () => any;
  fetchCrag?: (id: any) => unknown;
  sidebarChildren?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Crag(props: Props) {
  const CragMap = useMemo(
    () =>
      dynamic(() => import("@/app/_components/explorer/CragMap"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  return (
    <>
      <Drawer
        title={props.crag?.name || "Unknown crag"}
        sidebarChildren={props.sidebarChildren}
      >
        {(setOpen) => (
          <div className="h-100">
            <div className="fixed-container over-map">
              <div className="container">
                <div className="row no-gutters pt-3">
                  <div className="col">
                    <SearchGroup
                      onClickPrepend={() => setOpen(true)}
                      prepend={<i className="fa fa-bars" />}
                      input={<SearchInput onClick={props.onOpenSearch} />}
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
                  <div className="col mb-3 over-map">{props.children}</div>
                </div>
              </div>
            </div>
            <Box sx={{ height: "100vh" }}>
              {/** TODO: On the map itself is a parallel routing mechanism I think */}
              {/** A lot of this is layout, can be refactored to MUI, and moved to `layout`s */}
              <CragMap crag={props.crag}>{null}</CragMap>
            </Box>
          </div>
        )}
      </Drawer>
    </>
  );
}
