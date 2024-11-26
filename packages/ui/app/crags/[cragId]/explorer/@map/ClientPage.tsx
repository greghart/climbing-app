"use client";
import AreasMap from "@/app/_components/map/AreasMap";
import Layers from "@/app/_components/map/Layers";
import TrailPolyline from "@/app/_components/tracer/TrailPolyline";
import { Crag, ICrag } from "models";
import { LayerGroup } from "react-leaflet";

export default function ClientPage({ crag }: { crag: ICrag }) {
  if (!crag) return null;

  return (
    <Layers>
      {(Overlay) => (
        <>
          <Overlay checked name="Tooltips">
            <LayerGroup>
              <AreasMap
                areas={new Crag(crag).areas!}
                AreaMapProps={{ tooltip: true, PolygonProps: { show: false } }}
              />
            </LayerGroup>
          </Overlay>
          <Overlay checked name="Areas">
            <LayerGroup>
              <AreasMap
                areas={new Crag(crag).areas!}
                AreaMapProps={{ tooltip: false }}
              />
            </LayerGroup>
          </Overlay>
          <Overlay checked name="Trails">
            {crag.trail && <TrailPolyline lines={crag.trail.lines} />}
          </Overlay>
        </>
      )}
    </Layers>
  );
}
