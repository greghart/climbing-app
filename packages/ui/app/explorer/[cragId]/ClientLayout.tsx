"use client";
import React from "react";
import { ICrag } from "models";
import { Box } from "@mui/material";
import SearchGroup from "@/app/_components/search/SearchGroup";
import SearchInput from "@/app/_components/search/SearchInput";
import { type Props } from "./layout";
import Drawer from "@/app/_components/explorer/overlay/Drawer";

type ClientProps = Omit<Props, "params"> & { crag: ICrag };

export default function ClientLayout(props: ClientProps) {
  const navigateToSearch = React.useCallback(() => {
    console.warn("TODO: Navigate to search here");
  }, []);
  return (
    <>
      <div className="h-100">
        <React.Suspense fallback={<Drawer title="Loading overlay..." />}>
          {props.overlay}
        </React.Suspense>
        <Box sx={{ height: "100vh" }}>{props.map}</Box>
      </div>
    </>
  );
}
