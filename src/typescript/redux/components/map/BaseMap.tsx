import * as React from 'react';
import { Map } from 'react-leaflet';
import classNames = require('classnames');
import { ExtractProps } from '../../../externals';
import BestTileLayer from '../BestTileLayer';
import Coordinate from '../../../models/Coordinate';

type Props = ExtractProps<typeof Map> & {
  // Support supplying coordinates since that's what we work with a lot
  boundsCoordinates?: Coordinate[];
};
/**
 * Basic map for our uses
 *
 * Just sets basic zoom bounds, fits to bounds, and removes zoom control.
 * Also lets us set size in a more predictable fashion
 */
const BaseMap = React.forwardRef<Map, Props>((props, ref) => {
  return (
    <Map
      className={classNames('h-100 w-100', props.className)}
      zoomControl={false}
      zoom={18}
      minZoom={15}
      maxZoom={22}
      bounds={props.boundsCoordinates &&
        props.boundsCoordinates.map<[number, number]>((c) => [c.lat, c.lng])
      }
      ref={ref}
      {...props}
    >
      <BestTileLayer />
      {props.children}
    </Map>
  );
});

export default BaseMap;
