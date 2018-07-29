import * as React from 'react';
import partial = require('lodash/partial');

import AreaMap from './AreaMap';
import Area from '../../../models/Area';

interface Props {
  areas: Area[];
  selectedAreaId?: string;
  onAreaClick?: (area: Area) => any;
}

const AreasMap: React.SFC<Props> = (props) => {
  console.log({ props }, 'AreasMap');
  return (
    <div>
      {props.areas.map((area) => {
        return (
          <AreaMap
            key={area.name}
            area={area}
            selected={props.selectedAreaId === area.name}
            onClick={partial(props.onAreaClick, area)}
          />
        );
      })}
    </div>
  );
};

export default AreasMap;
