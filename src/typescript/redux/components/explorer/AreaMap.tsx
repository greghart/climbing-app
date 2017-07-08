import * as React from 'react';
import { SFC, PropTypes } from 'react';

import { Area } from './types';
import AreaPolygon from './AreaPolygon';

interface Props {
  area: Area;
  onClick?: (id: number) => any;
}

const AreaMap: SFC<any> = (props) => {
  console.log({ props }, 'AreaMap');
  return (
    <AreaPolygon
      area={props.area}
    />
  );
};

export default AreaMap;
