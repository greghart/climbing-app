import * as React from 'react';

import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';
import BoulderIcon from '../map/BoulderIcon';

interface Props {
  area: Area;
}

const AreaBoulders: React.SFC<Props> = (props) => {
  console.log({ props }, 'AreaBoulders');
  return (
    <span>
      {(props.area.boulders || []).map((thisBoulder: Boulder) => {
        return (
          <BoulderIcon
            position={thisBoulder.coordinate}
            key={thisBoulder.id}
          />
        );
      })}
    </span>
  );
};

export default AreaBoulders;
