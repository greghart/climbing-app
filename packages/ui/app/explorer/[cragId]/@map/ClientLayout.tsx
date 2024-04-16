"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Crag, ICrag } from "models";

export default function ClientLayout({
  children,
  crag,
}: {
  children: React.ReactNode;
  crag: ICrag;
}) {
  const CragMap = useMemo(
    () =>
      dynamic(() => import("@/app/_components/explorer/CragMap"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  if (!crag) return null;
  return <CragMap crag={new Crag(crag)}>{children}</CragMap>;
}
