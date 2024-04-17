"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Crag, ICrag } from "models";

export default function ClientPage({ crag }: { crag: ICrag }) {
  const AreasMap = useMemo(
    () =>
      dynamic(() => import("@/app/_components/explorer/AreasMap"), {
        loading: () => null,
        ssr: false,
      }),
    []
  );
  if (!crag) return null;

  return <AreasMap areas={new Crag(crag).areas} />;
}
