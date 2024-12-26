"use client";
import BoulderLayers from "@/app/_components/map/BoulderLayers";
import Layers from "@/app/_components/map/Layers";
import useBoulderView from "@/app/_components/map/useBoulderView";
import { IBoulder } from "models";

export default function ClientPage({ boulder }: { boulder: IBoulder }) {
  useBoulderView(boulder);
  return <Layers>{BoulderLayers.builder(boulder)}</Layers>;
}
