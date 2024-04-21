/**
 * An interactive map diagram of a boulder
 *
 * Includes:
 *   * Boulder polygon, if any
 *   * Route markers with popup/links
 */
import * as React from "react";
import * as Leaflet from "leaflet";
import { IBoulder } from "models";
import MyPolygon from "@/app/_components/explorer/map/MyPolygon";

interface Props {
  boulder: IBoulder;
  onClick?: (e: Leaflet.LeafletMouseEvent) => unknown;
  showRoutes?: boolean;
  // formulateUrl?: React.ComponentProps<typeof RouteMarkers>["formulateUrl"];
}

const BoulderMap: React.ComponentType<Props> = (props) => {
  return (
    <React.Fragment>
      {props.boulder.polygon?.coordinates && (
        <MyPolygon
          positions={props.boulder.polygon.coordinates}
          eventHandlers={{
            ...(props.onClick ? { click: props.onClick } : {}),
          }}
          fillOpacity={0.1}
        />
      )}
      {/* {props.showRoutes && (
        <RouteMarkers
          routes={props.boulder.routes}
          formulateUrl={props.formulateUrl}
        />
      )} */}
    </React.Fragment>
  );
};

export default BoulderMap;
