import Boulders from "@/app/_components/map/Boulders";
import MyPolygon from "@/app/_components/map/MyPolygon";
import RouteMarkers from "@/app/_components/map/RouteMarkers";
import blockMapClicks from "@/app/_util/blockMapClicks";
import { IBoulder, ITrail } from "models";
import React from "react";
import { type LayerGroup, type LayersControl } from "react-leaflet";

type LayerGroupType = typeof LayerGroup;

interface Props {
  boulder?: IBoulder;
  trail?: ITrail;
  Overlay: typeof LayersControl.Overlay;
  LayerGroup: LayerGroupType;
  // Layers
  boulderPolygonLayer?: React.ReactNode;
  boulderIconLayer?: React.ReactNode;
  routesLayer?: React.ReactNode;
}

export default function BoulderLayers({
  Overlay,
  LayerGroup,
  ...props
}: Props) {
  return (
    <>
      <Overlay checked name="Boulder Polygon">
        <LayerGroup>
          {props.boulderPolygonLayer ||
            (props.boulder?.polygon?.coordinates && (
              <MyPolygon
                positions={props.boulder.polygon.coordinates}
                eventHandlers={{
                  click: blockMapClicks,
                }}
                fillOpacity={0.1}
              />
            ))}
        </LayerGroup>
      </Overlay>
      <Overlay checked name="Boulder Icon">
        <LayerGroup>
          {props.boulderIconLayer ||
            (props.boulder && <Boulders boulders={[props.boulder]} />)}
        </LayerGroup>
      </Overlay>
      <Overlay checked name="Routes">
        <LayerGroup>
          {props.routesLayer ||
            (props.boulder?.routes && (
              <RouteMarkers routes={props.boulder.routes || []} />
            ))}
        </LayerGroup>
      </Overlay>
    </>
  );
}

BoulderLayers.builder =
  (boulder: IBoulder) => (Overlay: any, LayerGroup: any) =>
    (
      <BoulderLayers
        boulder={boulder}
        Overlay={Overlay}
        LayerGroup={LayerGroup}
      />
    );
