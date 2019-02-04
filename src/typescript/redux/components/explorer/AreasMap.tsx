import * as React from 'react';
import partial = require('lodash/partial');

import AreaMap from './AreaMap';
import Area from '../../../models/Area';

interface Props {
  areas: Area[];
  isLoading?: boolean;
  selectedAreaId?: string;
  // Whether to show all polygons. Note, we always show selected areas's polygon
  showPolygons?: boolean;
  onAreaClick?: (area: Area) => any;
}

const AreasMap: React.SFC<Props> = (props) => {
  return (
    <div>
      {props.areas.map((area) => {
        return (
          <AreaMap
            key={area.name}
            area={area}
            polygon={props.showPolygons || props.selectedAreaId === area.name}
            onClick={props.onAreaClick && partial(props.onAreaClick, area)}
          />
        );
      })}
    </div>
  );
};

export default AreasMap;
