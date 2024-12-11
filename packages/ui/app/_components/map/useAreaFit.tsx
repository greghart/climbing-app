import { Area, IArea } from "models";
import React from "react";
import { useMap } from "react-leaflet";

export default function useAreaFit(_area: IArea) {
  const area = Area.build(_area);
  const map = useMap();
  React.useEffect(() => {
    if (!area.polygon?.coordinates?.length) {
      return;
    }
    map.fitBounds(
      area.polygon.coordinates.map((c) => {
        return [c.lat, c.lng] as [number, number];
      })
    );
  }, [area.id]);
}
