"use client";
import React from "react";
import { Crag, ICrag } from "models";
import dynamic from "next/dynamic";

const DynamicCragMap = dynamic(
  () => import("@/app/_components/explorer/CragMap"),
  {
    ssr: false,
  }
);

export default function ClientLayout({
  children,
  crag,
}: {
  children: React.ReactNode;
  crag: ICrag;
}) {
  if (!crag) return null;
  return <DynamicCragMap crag={new Crag(crag)}>{children}</DynamicCragMap>;
}
