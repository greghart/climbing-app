import { Boulder } from "models";
import React from "react";
import { useMap } from "react-leaflet";

export default function useBoulderView(boulder: Boulder) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(
      // Keep route in top half to account for overlay
      [boulder.coordinates.lat - 0.0002, boulder.coordinates.lng],
      20,
      { animate: true }
    );
  }, [boulder.id]);
}
