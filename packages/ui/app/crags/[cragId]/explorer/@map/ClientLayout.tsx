"use client";
import CragMap from "@/app/_components/explorer/map/CragMap";
import { Crag, ICrag } from "models";
import React from "react";
export default function ClientLayout({
  children,
  crag,
}: {
  children: React.ReactNode;
  crag: ICrag;
}) {
  if (!crag) return null;
  return <CragMap crag={new Crag(crag)}>{children}</CragMap>;
}
