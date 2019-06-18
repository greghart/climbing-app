import * as React from 'react';
import { TileLayer, TileLayerProps } from 'react-leaflet';

// Newer tiles
// tslint:disable-next-line:max-line-length
const WGS84 = '//wi.maptiles.arcgis.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
// Classic world
// tslint:disable-next-line:max-line-length
const World = '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
// Muted tiles
// tslint:disable-next-line:max-line-length
const Firefly = '//servicesbeta.arcgisonline.com/arcgis/rest/services/Firefly_World_Imagery/MapServer/tile/{z}/{y}/{x}';
// Physical map
// tslint:disable-next-line:max-line-length
const Physical = '//server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}';
// MapBox
const accessToken = 'insert_mapbox_token_here';
// tslint:disable-next-line:max-line-length
const MapBox = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${accessToken}`;
// Serve from our server
const Mine = '/static/tiles/{x}/{y}/{z}.png';

/**
 * Component that is the best TileLayer for general purposes
 */
const BestTileLayer: React.SFC<Partial<TileLayerProps>> = (props) => {
  return (
    <TileLayer
      {...props}
      subdomains={['server', 'wi']}
      url={Mine}
      maxNativeZoom={19}
      minNativeZoom={14}
    />
  );
};

export default BestTileLayer;
