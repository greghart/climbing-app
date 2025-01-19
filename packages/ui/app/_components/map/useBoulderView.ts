"use client";
import { IBoulder } from "models";
import React from "react";
import { useMap } from "react-leaflet";

export default function useBoulderView(
  boulder: IBoulder,
  // Default offset keeps boulder intop half of screen if width is big enough
  { offset = 0.0, zoom = 20 }: { offset?: number; zoom?: number } = {}
) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(
      // Keep route in top half to account for overlay
      [boulder.coordinates.lat - offset, boulder.coordinates.lng],
      zoom,
      { animate: true }
    );
  }, [boulder.id]);
}
