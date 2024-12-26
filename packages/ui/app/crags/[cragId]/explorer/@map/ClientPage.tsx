"use client";
import CragLayers from "@/app/_components/map/CragLayers";
import Layers from "@/app/_components/map/Layers";
import { ICrag } from "models";

export default function ClientPage({ crag }: { crag: ICrag }) {
  if (!crag) return null;

  return <Layers>{CragLayers.builder(crag)}</Layers>;
}
