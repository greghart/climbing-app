
import * as React from 'react';
import { SFC, PropTypes } from 'react';
import { Marker } from 'react-leaflet';
import * as L from 'leaflet';
const DivIcon = require('react-leaflet-div-icon').default;

import { Boulder, Area } from './types';
import transformCoordinates from './transformCoordinates';

interface Props {
  area: Area;
}

const AreaBoulders: SFC<Props> = (props) => {
  console.log({ props }, 'AreaBoulders');
  return (
    <span>
      {(props.area.boulders || []).map((thisBoulder: Boulder) => {
        const [lat, lng] = thisBoulder.coordinates;
        return (
          <Marker
            key={thisBoulder.id}
            position={[
              parseFloat(lat.toString()),
              parseFloat(lng.toString())
            ]}
            icon={L.divIcon({
              html: '*',
              className: "null"
            })}
          >
            <DivIcon
              className='null'
              position={{
                lat: parseFloat(lat.toString()),
                lng: parseFloat(lng.toString())
              }}
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
