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
    <>
      <div className="h-100">
        {props.overlay}
        <Box sx={{ height: "100vh" }}>{props.map}</Box>
      </div>
    </>
  );
}
