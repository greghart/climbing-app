import { IBounds, ICoordinateLiteral } from "models";
import React from "react";
import { MapContainer, ZoomControl } from "react-leaflet";
import BestTileLayer from "../explorer/map/BestTilerLayer";

// Spaces to avoid auto sort, order here matters
import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import resolveBounds from "@/app/_util/resolveBounds";
import "leaflet-defaulticon-compatibility";

interface Props
  extends Omit<React.ComponentProps<typeof MapContainer>, "bounds" | "center"> {
  bounds?: IBounds;
  center?: ICoordinateLiteral;
}

/**
 * A Map for climbing app:
 *  * handles our domain bounds and coordinate
 *  * sane defaults
 *  * best tile layer
 * TODO: Persist map state in URL so transitions keep things in place
 */
export default function Map({ bounds, center, ...props }: Props) {
  const resolvedBounds = resolveBounds(bounds, center);
  if (!resolvedBounds) {
    return <>No center or bounds supplied</>;
  }

  return (
    <MapContainer
      key="static-map"
      preferCanvas={true}
      style={{ height: "100%" }}
      minZoom={15}
      maxBounds={resolvedBounds}
      zoomControl={false}
      {...props}
      bounds={resolvedBounds}
    >
      <BestTileLayer />
      <ZoomControl position="topright" />
      {props.children}
    </MapContainer>
  );
}
