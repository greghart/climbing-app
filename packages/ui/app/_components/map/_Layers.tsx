import BestTileLayer from "@/app/_components/map/BestTilerLayer";
import React from "react";
import { LayersControl } from "react-leaflet";

type Props = Omit<React.ComponentProps<typeof LayersControl>, "children"> & {
  children?: (overlay: typeof LayersControl.Overlay) => React.ReactNode;
};

/**
 * LayersControl wrapper
 * * Next.js SSR support
 * * passes overlay component to children to make use a bit easier
 */
export default function Layers(props: Props) {
  return (
    <LayersControl collapsed={false} position="topright" {...props}>
      <LayersControl.BaseLayer checked name="Mapbox Tiles">
        <BestTileLayer />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OSM Tiles">
        <BestTileLayer layer="OpenStreetMap" />
      </LayersControl.BaseLayer>
      {props.children?.(LayersControl.Overlay)}
    </LayersControl>
  );
}
