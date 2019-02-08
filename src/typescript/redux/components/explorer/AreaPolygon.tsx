import * as React from 'react';
import sortBy = require('lodash/sortBy');

import Area from '../../../models/Area';
import MyPolygon from '../map/MyPolygon';
import { ExtractProps } from '../../../externals';

type Props = Partial<ExtractProps<typeof MyPolygon>> & {
  area: Area;
};

const AreaPolygon: React.SFC<Props> = (props) => {
  return (
    <MyPolygon
      {...props}
      positions={sortBy(props.area.polygon.coordinates, 'order')}
    />
  );
};

export default AreaPolygon;
