import "leaflet/dist/leaflet.css";

import * as Leaflet from "leaflet";
import { MapContainer } from "react-leaflet";
import { IBounds, Coordinate } from "models";
import React from "react";
import BestTileLayer from "./BestTilerLayer";

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
export default function Map(props: Props) {
  let bounds: Leaflet.LatLngBounds;
  if (props.bounds) {
    bounds = Leaflet.latLngBounds(
      Leaflet.latLng(props.bounds.topLeft),
      Leaflet.latLng(props.bounds.bottomRight)
    );
  } else if (props.center) {
    bounds = new Leaflet.LatLng(props.center.lat, props.center.lng).toBounds(
      8000
    );
  } else {
    return <>No center or bounds supplied</>;
  }

  return (
    <MapContainer
      style={{ height: "100%" }}
      minZoom={18}
      maxBounds={bounds}
      zoomControl={true}
      {...props}
      bounds={bounds}
    >
      <BestTileLayer />
      {props.children}
    </MapContainer>
  );
}
