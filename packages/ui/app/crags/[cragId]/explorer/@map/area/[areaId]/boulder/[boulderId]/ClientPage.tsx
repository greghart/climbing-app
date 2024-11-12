"use client";
import BoulderMap from "@/app/_components/explorer/map/BoulderMap";
import blockClicks from "@/app/_util/blockClicks";
import { Boulder, IBoulder } from "models";
import React from "react";
import { useMap } from "react-leaflet";

export default function ClientPage({
  boulder: _boulder,
}: {
  boulder: IBoulder;
}) {
  const boulder = new Boulder(_boulder);
  const map = useMap();
  React.useEffect(() => {
    map.setView(
      // Keep boulder in top half to account for overlay
      [boulder.coordinates.lat - 0.0002, boulder.coordinates.lng],
      20,
      { animate: true }
    );
  }, [boulder.id]);

  return <BoulderMap boulder={boulder} onClick={blockClicks} />;
}
