"use client";
import React from "react";
import { Crag, ICrag } from "models";
import AreasMap from "@/app/_components/explorer/AreasMap";

export default function ClientPage({ crag }: { crag: ICrag }) {
  if (!crag) return null;

  return <AreasMap areas={new Crag(crag).areas} />;
}
