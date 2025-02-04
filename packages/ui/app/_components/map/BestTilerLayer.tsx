import { TileLayer } from "react-leaflet";

// Define tile layers in an object
const tileLayers = {
  // Newer tiles
  Esri: "//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  // Classic world
  World:
    "//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  // Muted tiles
  Firefly:
    "//servicesbeta.arcgisonline.com/arcgis/rest/services/Firefly_World_Imagery/MapServer/tile/{z}/{y}/{x}",
  // Physical map
  Physical:
    "//server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
  // OpenStreetMap
  OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  // MapBox
  MapBox: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
  // Serve from our server
  Local: "/tiles/{x}/{y}/{z}.png",
};

/**
 * Component that is the best TileLayer for general purposes
 */
type Props = Omit<React.ComponentProps<typeof TileLayer>, "url"> & {
  layer?: keyof typeof tileLayers;
};

export default function BestTileLayer(props: Props) {
  return (
    <TileLayer
      {...props}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url={tileLayers[props.layer || "Local"]}
      maxNativeZoom={19}
      minNativeZoom={15}
      maxZoom={22}
    />
  );
}
