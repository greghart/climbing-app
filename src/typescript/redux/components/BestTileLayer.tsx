import * as React from 'react';
import { SFC, PropTypes } from 'react';
import { TileLayer, TileLayerProps } from 'react-leaflet';

/**
 * Component that is the best TileLayer for general purposes
 */
const BestTileLayer: SFC<Partial<TileLayerProps>> = (props) => {
  return (
    <TileLayer
      {...props}
      url='//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      maxZoom={22}
      maxNativeZoom={18}
    />
  );
};

export default BestTileLayer
