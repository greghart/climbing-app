import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Polygon, PolygonProps } from 'react-leaflet';

import Area from '../../../models/Area';

/**
 * A nice looking polygon for displaying
 *
 * Transparent so it can be seen alongside other components
 */
type Props = PolygonProps;

const normalStyle = {
  weight: 1.0,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.2,
  fillColor: '#088da5'
};

const overStyle = {
  weight: 5,
  color: '#666',
  dashArray: '',
  fillOpacity: 0.2
};

const MyPolygon: React.SFC<Props> = (props) => {
  let polygonRef: Polygon;
  return (
    <Polygon
      {...props}
      {...normalStyle}
      ref={(polygon) => { polygonRef = polygon; }}
      onmouseover={() => {
        polygonRef.setStyle(overStyle);
      }}
      onmouseout={() => {
        polygonRef.setStyle(normalStyle);
      }}
    />
  );
};

export default MyPolygon;
