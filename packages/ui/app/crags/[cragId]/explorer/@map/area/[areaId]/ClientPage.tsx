"use client";
import blockClicks from "@/app/_components/blockClicks";
import AreaMap from "@/app/_components/explorer/map/AreaMap";
import { Area, IArea } from "models";
import React from "react";
import { useMap } from "react-leaflet";

export default function ClientPage({ area: _area }: { area: IArea }) {
  const area = new Area(_area);
  const map = useMap();
  React.useEffect(() => {
    if (!area.polygon?.coordinates) {
      return;
    }
    map.fitBounds(
      area.polygon.coordinates.map((c) => {
        return [c.lat, c.lng] as [number, number];
      })
    );
  }, [area.id]);

  return (
    <AreaMap area={area} showBoulders tooltip={false} onClick={blockClicks} />
  );
}
