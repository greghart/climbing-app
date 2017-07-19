import * as React from 'react';
import { SFC, PropTypes } from 'react';

import AreaPolygon from './AreaPolygon';
import AreaBoulders from './AreaBoulders';
import Area from '../../../models/Area';

interface Props {
  area: Area;
  selected: boolean;
  onClick?: () => any;
}

const AreaMap: SFC<any> = (props) => {
  console.log({ props }, 'AreaMap');
  return (
    <span>
      <AreaPolygon
        area={props.area}
        onclick={props.onClick}
      />
      {props.selected ?
        <AreaBoulders area={props.area} /> :
        <span />
      }
    </span>
  );
};

export default AreaMap;
