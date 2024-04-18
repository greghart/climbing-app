"use client";
import React from "react";
import { Area, IArea } from "models";
import { useMap } from "react-leaflet";
import AreaMap from "@/app/_components/explorer/AreaMap";
import blockClicks from "@/app/_components/blockClicks";

export default function ClientPage({ area: _area }: { area: IArea }) {
  const area = new Area(_area);
  const map = useMap();
  React.useEffect(() => {
    if (!area.polygon || area.polygon?.coordinates.length <= 0) {
      return;
    }
    map.fitBounds(
      area.polygon.coordinates.map((c) => {
        return [c.lat, c.lng] as [number, number];
      })
    );
  }, [area.id]);

  return <AreaMap area={area} boulders tooltip={false} onClick={blockClicks} />;
}
