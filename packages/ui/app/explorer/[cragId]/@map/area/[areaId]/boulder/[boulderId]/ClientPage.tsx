"use client";
import React from "react";
import { Boulder, IBoulder } from "models";
import { useMap } from "react-leaflet";
import BoulderMap from "@/app/_components/explorer/map/BoulderMap";
import blockClicks from "@/app/_components/blockClicks";

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
