"use client";
import { searchParamsParsers } from "@/app/_components/explorer/searchParams";
import BestTileLayer from "@/app/_components/map/BestTilerLayer";
import useQueryState from "@/app/_util/useQueryState";
import reduce from "lodash-es/reduce";
import React from "react";
import { LayersControl, useMapEvents } from "react-leaflet";

type Props = Omit<React.ComponentProps<typeof LayersControl>, "children"> & {
  children?: (overlay: typeof LayersControl.Overlay) => React.ReactNode;
};

type Layer = NonNullable<React.ComponentProps<typeof BestTileLayer>["layer"]>;

const layerNames = {
  MapBox: "Mapbox Tiles",
  OpenStreetMap: "OSM Tiles",
  Local: "Local",
} as { [layer in Layer]: string };

const byName = reduce(
  layerNames,
  (acc, value, key) => {
    acc[value] = key as Layer;
    return acc;
  },
  {} as { [name: string]: Layer }
);

function Layer({ selected, layer }: { selected: Layer; layer: Layer }) {
  return (
    <LayersControl.BaseLayer
      checked={selected === layer}
      name={layerNames[layer] || "Unknown"}
    >
      <BestTileLayer layer={layer} />
    </LayersControl.BaseLayer>
  );
}

/**
 * LayersControl wrapper
 * * Next.js SSR support
 * * passes overlay component to children to make use a bit easier
 */
export default function Layers(props: Props) {
  const [selected, setSelected] = useQueryState(
    "tileLayer",
    searchParamsParsers.tileLayer
  );
  useMapEvents({
    baselayerchange: (e) => {
      console.warn(e);
      console.warn(byName);
      setSelected(byName[e.name]);
    },
  });
  return (
    <LayersControl collapsed={false} position="topright" {...props}>
      <Layer selected={selected as Layer} layer="OpenStreetMap" />
      <Layer selected={selected as Layer} layer="Local" />
      <Layer selected={selected as Layer} layer="MapBox" />
      {props.children?.(LayersControl.Overlay)}
    </LayersControl>
  );
}
