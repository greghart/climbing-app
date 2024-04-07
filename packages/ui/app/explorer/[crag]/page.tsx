"use client";
import Crag from "@/app/_components/explorer/Crag";
import { Crag as CragModel } from "models";

export default function Explorer({ params }: { params: { crag: string } }) {
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
  return <Crag crag={crag} />;
}
