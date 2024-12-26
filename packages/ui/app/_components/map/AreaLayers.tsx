import useRouteTo from "@/app/_components/explorer/useRouteTo";
import AreaMap from "@/app/_components/map/AreaMap";
import Boulders from "@/app/_components/map/Boulders";
import TrailPolyline from "@/app/_components/tracer/TrailPolyline";
import blockClicks from "@/app/_util/blockClicks";
import { IArea, ITrail } from "models";
import React from "react";
import { type LayerGroup, type LayersControl } from "react-leaflet";

type LayerGroupType = typeof LayerGroup;

interface Props {
  area?: IArea;
  trail?: ITrail;
  Overlay: typeof LayersControl.Overlay;
  LayerGroup: LayerGroupType;
  // Layers
  areaLayer?: React.ReactNode;
  boulderLayer?: React.ReactNode;
  trailLayer?: React.ReactNode;
}

export default function AreaLayers({ Overlay, LayerGroup, ...props }: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true });
  return (
    <>
      <Overlay checked name="Area Polygon">
        <LayerGroup>
          {props.areaLayer ||
            (props.area && (
              <AreaMap
                area={props.area}
                tooltip={false}
                onClick={blockClicks}
              />
            ))}
        </LayerGroup>
      </Overlay>
      <Overlay checked name="Boulders">
        <LayerGroup>
          {props.boulderLayer ||
            (props.area?.boulders && (
              <Boulders
                boulders={props.area.boulders || []}
                onBoulderClick={(b, e) => {
                  routeTo("boulder")(b.id);
                  blockClicks(e);
                }}
              />
            ))}
        </LayerGroup>
      </Overlay>
      <Overlay checked name="Trails">
        <LayerGroup>
          {props.trailLayer ||
            (props.trail && <TrailPolyline lines={props.trail.lines} />)}
        </LayerGroup>
      </Overlay>
    </>
  );
}
