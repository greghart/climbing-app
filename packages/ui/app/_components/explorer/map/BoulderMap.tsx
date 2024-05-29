/**
 * An interactive map diagram of a boulder
 *
 * Includes:
 *   * Boulder polygon, if any
 *   * Route markers with popup/links
 */
import Boulders from "@/app/_components/explorer/map/Boulders";
import MyPolygon from "@/app/_components/explorer/map/MyPolygon";
import RouteMarkers from "@/app/_components/explorer/map/RouteMarkers";
import * as Leaflet from "leaflet";
import { Boulder } from "models";
import * as React from "react";

interface Props {
  boulder: Boulder;
  onClick?: (e: Leaflet.LeafletMouseEvent) => unknown;
  showRoutes?: boolean;
  // formulateUrl?: React.ComponentProps<typeof RouteMarkers>["formulateUrl"];
}

const BoulderMap: React.ComponentType<Props> = (props) => {
  return (
    <React.Fragment>
      {props.boulder.polygon?.coordinates ? (
        <MyPolygon
          positions={props.boulder.polygon.coordinates}
          eventHandlers={{
            ...(props.onClick ? { click: props.onClick } : {}),
          }}
          fillOpacity={0.1}
        />
      ) : (
        <Boulders boulders={[props.boulder]} />
      )}
      {props.showRoutes && <RouteMarkers routes={props.boulder.routes || []} />}
    </React.Fragment>
  );
};

export default BoulderMap;
