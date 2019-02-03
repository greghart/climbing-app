import * as React from 'react';
import { Map } from 'react-leaflet';
import { ExtractProps } from '../../../externals';
import BestTileLayer from '../BestTileLayer';
import classNames = require('classnames');

/**
 * Basic map for our uses
 *
 * Just sets basic zoom bounds, fits to bounds, and removes zoom control.
 * Also lets us set size in a more predictable fashion
 */
const BaseMap: React.ComponentType<ExtractProps<typeof Map>> = (props) => {
  return (
    <Map
      className={classNames("h-100 w-100", props.className)}
      zoomControl={false}
      zoom={18}
      minZoom={15}
      maxZoom={22}
      {...props}
    >
      <BestTileLayer />
      {props.children}
    </Map>
  );
}

export default BaseMap;
