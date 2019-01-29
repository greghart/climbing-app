import * as React from 'react';
import { divIcon } from 'leaflet';
import { Marker } from 'react-leaflet';

import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';

interface Props {
  area: Area;
}

const AreaBoulders: React.SFC<Props> = (props) => {
  console.log({ props }, 'AreaBoulders');
  const icon = divIcon({
    className: 'null',
    html: '<span><i class="fa fa-tree fa-lg"/></span>'
  })
  return (
    <span>
      {(props.area.boulders || []).map((thisBoulder: Boulder) => {
        return (
          <Marker
            position={thisBoulder.coordinate}
            key={thisBoulder.id}
            icon={icon}
          />
        );
      })}
    </span>
  );
};

export default AreaBoulders;
