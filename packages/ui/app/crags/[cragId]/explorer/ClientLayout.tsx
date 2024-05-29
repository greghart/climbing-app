"use client";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import { Box } from "@mui/material";
import { ICrag } from "models";
import React from "react";
import { type Props } from "./layout";

type ClientProps = Omit<Props, "params"> & { crag: ICrag };

export default function ClientLayout(props: ClientProps) {
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
