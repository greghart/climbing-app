"use client";
import AreaMap from "@/app/_components/map/AreaMap";
import Boulders from "@/app/_components/map/Boulders";
import Layers from "@/app/_components/map/Layers";
import usePolygonFit from "@/app/_components/map/usePolygonFit";
import TrailPolyline from "@/app/_components/tracer/TrailPolyline";
import blockClicks from "@/app/_util/blockClicks";
import { IArea, ITrail } from "models";
import { LayerGroup } from "react-leaflet";

interface Props {
  area: IArea;
  trail?: ITrail;
}

export default function ClientPage(props: Props) {
  usePolygonFit(props.area.polygon);
  return (
    <Layers>
      {(Overlay) => (
        <>
          <Overlay checked name="Area Polygon">
            <LayerGroup>
              <AreaMap
                area={props.area}
                tooltip={false}
                onClick={blockClicks}
              />
            </LayerGroup>
          </Overlay>
          <Overlay checked name="Boulders">
            <LayerGroup>
              <Boulders
                boulders={props.area.boulders || []}
                onBoulderClick={(b, e) => blockClicks(e)}
              />
            </LayerGroup>
          </Overlay>
          {props.trail && (
            <Overlay checked name="Trails">
              <TrailPolyline lines={props.trail.lines} />
            </Overlay>
          )}
        </>
      )}
    </Layers>
  );
}
