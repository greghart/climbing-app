import * as React from 'react';
import { Polygon, PolygonProps } from 'react-leaflet';

import { pick } from 'lodash';

/**
 * A nice looking polygon for displaying
 *
 * Transparent so it can be seen alongside other components
 */
type Style = Pick<PolygonProps, 'weight' | 'opacity' | 'color' | 'dashArray' | 'fillOpacity' | 'fillColor'>;
type Props = PolygonProps & {
  normalStyle?: Style
  overStyle?: Style;
};

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
  // Direct styles should override objects
  const directStyles = pick(props, 'weight', 'opacity', 'color', 'dashArray', 'fillOpacity', 'fillColor');
  let polygonRef: Polygon;
  return (
    <Polygon
      {...normalStyle}
      {...props}
      ref={(polygon) => { polygonRef = polygon; }}
      onmouseover={() => {
        polygonRef.setStyle({
          ...props.overStyle,
          ...directStyles
        });
      }}
      onmouseout={() => {
        polygonRef.setStyle({
          ...props.normalStyle,
          ...directStyles
        });
      }}
    >
      {props.children}
    </Polygon>
  );
};

MyPolygon.defaultProps = {
  normalStyle,
  overStyle
}

export default MyPolygon;
