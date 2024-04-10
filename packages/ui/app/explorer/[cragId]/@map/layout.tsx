"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Crag as CragModel } from "models";

export default function Explorer({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { crag: string };
}) {
  const CragMap = useMemo(
    () =>
      dynamic(() => import("@/app/_components/explorer/CragMap"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  const crag = new CragModel({
    id: 1,
    name: params.crag,
    defaultZoom: 15,
    center: {
      lat: 32.85052,
      lng: -117.02223,
    },
    minZoom: 15,
    maxZoom: 18,
  });
  return <CragMap crag={crag}>{children}</CragMap>;
}
