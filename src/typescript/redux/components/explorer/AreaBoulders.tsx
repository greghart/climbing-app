import * as React from 'react';
import { LeafletMouseEvent } from 'leaflet';
import partial = require('lodash/partial');

import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';
import BoulderIcon from '../map/BoulderIcon';

interface Props {
  area: Area;
  onBoulderClick?: (boulder: Boulder, e: LeafletMouseEvent) => unknown;
}

const AreaBoulders: React.SFC<Props> = (props) => {
  return (
    <span>
      {(props.area.boulders || []).map((thisBoulder: Boulder) => {
        return (
          <BoulderIcon
            position={thisBoulder.coordinate}
            key={thisBoulder.id}
            onclick={(e) => {
              props.onBoulderClick(thisBoulder, e);
            }}
          />
        );
      })}
    </span>
  );
};

AreaBoulders.defaultProps = {
  onBoulderClick: (b, e) => {
    console.warn(`AreaBoulders.onBoulderClick ${b.id} clicked`);
  }
};

export default AreaBoulders;
