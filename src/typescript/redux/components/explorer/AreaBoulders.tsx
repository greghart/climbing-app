
import * as React from 'react';
import { SFC, PropTypes } from 'react';
import { Marker } from 'react-leaflet';
import * as L from 'leaflet';
const DivIcon = require('react-leaflet-div-icon').default;

import transformCoordinates from './transformCoordinates';
import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';

interface Props {
  area: Area;
}

const AreaBoulders: SFC<Props> = (props) => {
  console.log({ props }, 'AreaBoulders');
  return (
    <span>
      {(props.area.boulders || []).map((thisBoulder: Boulder) => {
        return (
          <Marker
            key={thisBoulder.id}
            position={thisBoulder.coordinate.literal}
            icon={L.divIcon({
              html: '*',
              className: "null"
            })}
          >
            <DivIcon
              className='null'
              position={thisBoulder.coordinate.literal}
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
          </Marker>
        );
      })}
    </span>
  );
};

export default AreaBoulders;
