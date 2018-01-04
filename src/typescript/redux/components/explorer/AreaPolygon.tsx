import * as React from 'react';
import { SFC, PropTypes } from 'react';
import { Polygon, PolygonProps } from 'react-leaflet';

import Area from '../../../models/Area';

type Props = Partial<PolygonProps> & {
  area: Area;
}

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

const AreaPolygon: SFC<Props> = (props) => {
  if (!props.area.coordinates) {
    return <span/>;
  }
  let polygonRef: Polygon;
  return (
    <Polygon
      {...props}
      positions={props.area.coordinates}
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

export { Props };
export default AreaPolygon;
