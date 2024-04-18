"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Area, IArea } from "models";
import { useMap } from "react-leaflet";

export default function ClientPage({ area }: { area: IArea }) {
  // const AreasMap = useMemo(
  //   () =>
  //     dynamic(() => import("@/app/_components/explorer/AreasMap"), {
  //       loading: () => null,
  //       ssr: false,
  //     }),
  //   []
  // );
  // if (!crag) return null;
  // return <AreasMap areas={new Crag(crag).areas} />;
  const area2 = new Area(area);
  const map = useMap();
  React.useEffect(() => {
    if (!area2.polygon || area2.polygon?.coordinates.length <= 0) {
      return;
    }
    map.fitBounds(
      area2.polygon.coordinates.map((c) => {
        return [c.lat, c.lng] as [number, number];
      })
    );
  }, [area.id]);

  return false;
}
