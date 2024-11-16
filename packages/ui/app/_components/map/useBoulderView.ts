import { IBoulder } from "models";
import React from "react";
import { useMap } from "react-leaflet";

export default function useBoulderView(
  boulder: IBoulder,
  // Default offset keeps boulder intop half of screen if width is big enough
  { offset = 0.0002 }: { offset?: number } = {}
) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(
      // Keep route in top half to account for overlay
      [boulder.coordinates.lat - offset, boulder.coordinates.lng],
      20,
      { animate: true }
    );
  }, [boulder.id]);
}
