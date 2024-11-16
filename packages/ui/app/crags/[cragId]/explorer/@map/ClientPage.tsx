"use client";
import AreasMap from "@/app/_components/map/AreasMap";
import { Crag, ICrag } from "models";

export default function ClientPage({ crag }: { crag: ICrag }) {
  if (!crag) return null;

  return <AreasMap areas={new Crag(crag).areas!} />;
}
