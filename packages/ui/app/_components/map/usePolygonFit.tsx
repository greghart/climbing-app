import { IPolygon } from "models";
import React from "react";
import { useMap } from "react-leaflet";

export default function usePolygonFit(polygon?: IPolygon) {
  const map = useMap();
  React.useEffect(() => {
    if (!polygon?.coordinates?.length) {
      return;
    }
    map.fitBounds(
      polygon.coordinates.map((c) => {
        return [c.lat, c.lng] as [number, number];
      }),
      { animate: true }
    );
  }, [polygon?.id]);
}
