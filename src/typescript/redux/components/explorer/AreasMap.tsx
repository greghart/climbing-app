import * as React from 'react';
import partial = require('lodash/partial');

import AreaMap from './AreaMap';
import Area from '../../../models/Area';
import { LeafletMouseEvent } from 'leaflet';

interface Props {
  areas: Area[];
  selectedAreaId?: string;
  // Whether to show all polygons. Note, we always show selected areas's polygon
  showPolygons?: boolean;
  onAreaClick?: (area: Area, e: LeafletMouseEvent) => any;
}

const AreasMap: React.SFC<Props> = (props) => {
  console.warn(props, 'AreasMap');
  return (
    <div>
      {props.areas.map((area) => {
        return (
          <AreaMap
            key={area.name}
            area={area}
            polygon={props.showPolygons || props.selectedAreaId === area.id.toString()}
            onClick={props.onAreaClick && partial(props.onAreaClick, area)}
          />
        );
      })}
    </div>
  );
};

export default AreasMap;
