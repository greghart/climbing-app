import { TileLayer, type TileLayerProps } from "react-leaflet";

// Newer tiles
// tslint:disable-next-line:max-line-length
const WGS84 =
  "//wi.maptiles.arcgis.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
// Classic world
// tslint:disable-next-line:max-line-length
const World =
  "//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
// Muted tiles
// tslint:disable-next-line:max-line-length
const Firefly =
  "//servicesbeta.arcgisonline.com/arcgis/rest/services/Firefly_World_Imagery/MapServer/tile/{z}/{y}/{x}";
// Physical map
// tslint:disable-next-line:max-line-length
const Physical =
  "//server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}";
// MapBox
const accessToken =
  "pk.eyJ1IjoiZWxjaG9jb2xhdG8iLCJhIjoiY2pzcWZ3ZXlxMGMyZjQzcnplZjR3Zmp1MSJ9.6xK9xxEQfavcSmfFEohQXA";
// tslint:disable-next-line:max-line-length
const MapBox = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${accessToken}`;
// Serve from our server
const Mine = "/static/tiles/{x}/{y}/{z}.png";

/**
 * Component that is the best TileLayer for general purposes
 */
type Props = TileLayerProps | Partial<Pick<TileLayerProps, "url">>;
export default function BestTileLayer(props: Props) {
  return (
    <TileLayer
      {...props}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      url={MapBox}
      maxNativeZoom={18}
      minNativeZoom={15}
      maxZoom={22}
    />
  );
}
