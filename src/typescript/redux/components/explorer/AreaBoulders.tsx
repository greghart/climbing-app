
import * as React from 'react';
const DivIcon = require('react-leaflet-div-icon').default;

import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';

interface Props {
  area: Area;
}

const AreaBoulders: React.SFC<Props> = (props) => {
  console.log({ props }, 'AreaBoulders');
  return (
    <span>
      {(props.area.boulders || []).map((thisBoulder: Boulder) => {
        return (
          <DivIcon
            className="null"
            position={thisBoulder.coordinate}
            key={thisBoulder.id}
          >
            <span>
              <img
                src="http://33.media.tumblr.com/avatar_ed8e84defa40_128.png"
                style={{
                  width: 12,
                  height: 12
                }}
              />
            </span>
          </DivIcon>
        );
      })}
    </span>
  );
};

export default AreaBoulders;
