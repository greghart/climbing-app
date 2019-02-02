import * as React from 'react';
import { PolygonProps } from 'react-leaflet';
import sortBy = require('lodash/sortBy');

import Area from '../../../models/Area';
import MyPolygon from '../map/MyPolygon';

type Props = Partial<PolygonProps> & {
  area: Area;
};

const AreaPolygon: React.SFC<Props> = (props) => {
  return (
    <MyPolygon
      positions={sortBy(props.area.coordinates, 'id')}
    />
  );
};

export default AreaPolygon;
