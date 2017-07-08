import * as React from 'react';
import { SFC, PropTypes } from 'react';

import AreaMap from './AreaMap';
import { Area } from './types';

interface Props {
  areas: Area[];
  selectedAreaId?: number;
  onAreaClick?: (areaId: number) => any;
}

const AreasMap: SFC<Props> = (props) => {
  console.log({ props }, 'AreasMap');
  return (
    <div>
      {props.areas.map((area) => {
        return (
          <AreaMap
            key={area.id}
            area={area}
            selected={props.selectedAreaId === area.id}
            onClick={props.onAreaClick}
          />
        );
      })}
    </div>
  );
};

export default AreasMap;
