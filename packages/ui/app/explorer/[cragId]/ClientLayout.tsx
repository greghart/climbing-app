"use client";
import React from "react";
import { ICrag } from "models";
import { Box } from "@mui/material";
import Drawer from "@/app/_components/explorer/Drawer";
import SearchGroup from "@/app/_components/search/SearchGroup";
import SearchInput from "@/app/_components/search/SearchInput";
import { type Props } from "./layout";

type ClientProps = Omit<Props, "params"> & { crag: ICrag };

export default function ClientLayout(props: ClientProps) {
  const navigateToSearch = React.useCallback(() => {
    console.warn("TODO: Navigate to search here");
  }, []);
  return (
    <Drawer title={props.crag.name} sidebarChildren={props.children}>
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
          {props.overlay}
          <Box sx={{ height: "100vh" }}>{props.map}</Box>
        </div>
      )}
    </Drawer>
  );
}
