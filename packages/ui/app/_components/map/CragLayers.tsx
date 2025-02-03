import useRouteTo from "@/app/_components/explorer/useRouteTo";
import AreasMap from "@/app/_components/map/AreasMap";
import Boulders from "@/app/_components/map/Boulders";
import TrailPolyline from "@/app/_components/tracer/TrailPolyline";
import blockMapClicks from "@/app/_util/blockMapClicks";
import { Crag, IBoulder, ICrag } from "models";
import React from "react";
import { type LayerGroup, type LayersControl } from "react-leaflet";

type LayerGroupType = typeof LayerGroup;

interface Props {
  crag: ICrag;
  Overlay: typeof LayersControl.Overlay;
  LayerGroup: LayerGroupType;
  // Layers
  tooltipsLayer?: React.ReactNode;
  areasLayer?: React.ReactNode;
  bouldersLayer?: React.ReactNode;
  trailsLayer?: React.ReactNode;
}

export default function CragLayers({ Overlay, LayerGroup, ...props }: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true });
  const crag = React.useMemo(() => Crag.build(props.crag), [props.crag]);
  const boulders = React.useMemo(() => {
    return crag.areas.reduce<IBoulder[]>((acc, area) => {
      acc.push(...(area.boulders || []));
      return acc;
    }, []);
  }, [props.crag]);
  return (
    <>
      <Overlay checked name="Tooltips">
        <LayerGroup>
          {props.tooltipsLayer || (
            <AreasMap
              areas={crag.areas!}
              AreaMapProps={{ tooltip: true, PolygonProps: { show: false } }}
            />
          )}
        </LayerGroup>
      </Overlay>
      <Overlay checked name="Areas">
        <LayerGroup>
          {props.areasLayer || (
            <AreasMap areas={crag.areas!} AreaMapProps={{ tooltip: false }} />
          )}
        </LayerGroup>
      </Overlay>
      <Overlay checked name="Boulders">
        <LayerGroup>
          {props.bouldersLayer || (
            <Boulders
              boulders={boulders}
              onBoulderClick={(b, e) => {
                routeTo("boulder")(b.id);
                blockMapClicks(e);
              }}
            />
          )}
        </LayerGroup>
      </Overlay>
      <Overlay checked name="Trails">
        {props.trailsLayer ||
          (crag.trail && <TrailPolyline lines={crag.trail.lines} />)}
      </Overlay>
    </>
  );
}

CragLayers.builder = (crag: ICrag) => (Overlay: any, LayerGroup: any) =>
  <CragLayers crag={crag} Overlay={Overlay} LayerGroup={LayerGroup} />;
