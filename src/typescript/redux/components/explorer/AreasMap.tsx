import * as React from 'react';
import partial = require('lodash/partial');

import AreaMap from './AreaMap';
import Area from '../../../models/Area';

interface Props {
  areas: Area[];
  isLoading?: boolean;
  selectedAreaId?: string;
  outlineAreas?: boolean;
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
            selected={props.selectedAreaId === area.name}
            outline={props.outlineAreas}
            onClick={props.onAreaClick && partial(props.onAreaClick, area)}
          />
        );
      })}
    </div>
  );
};

export default AreasMap;
