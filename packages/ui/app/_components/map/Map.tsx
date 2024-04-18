import * as Leaflet from "leaflet";
import { Coordinate, IBounds } from "models";
import React, { Suspense, useMemo } from "react";
import { MapContainer } from "react-leaflet";
import BestTileLayer from "./BestTilerLayer";

// Spaces to avoid auto sort, order here matters
import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import "leaflet-defaulticon-compatibility";

interface Props
  extends Omit<React.ComponentProps<typeof MapContainer>, "bounds" | "center"> {
  bounds?: IBounds;
  center?: Coordinate;
}

/**
 * A Map for climbing app:
 *  * handles our domain bounds and coordinate
 *  * sane defaults
 *  * best tile layer
 *  * No zooming! Helps us keep map drift to a minimum
 */
export default function Map({ bounds, center, ...props }: Props) {
  let resolvedBounds: Leaflet.LatLngBounds;
  if (bounds) {
    resolvedBounds = Leaflet.latLngBounds(
      Leaflet.latLng(bounds.topLeft),
      Leaflet.latLng(bounds.bottomRight)
    );
  } else if (center) {
    resolvedBounds = new Leaflet.LatLng(center.lat, center.lng).toBounds(8000);
  } else {
    return <>No center or bounds supplied</>;
  }

  return (
    <MapContainer
      key="static-map"
      preferCanvas={true}
      style={{ height: "100%" }}
      minZoom={15}
      maxBounds={resolvedBounds}
      zoomControl={true}
      {...props}
      bounds={resolvedBounds}
    >
      <BestTileLayer />
      {props.children}
    </MapContainer>
  );
}
