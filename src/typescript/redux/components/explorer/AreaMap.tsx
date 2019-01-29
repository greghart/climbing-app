import * as React from 'react';
import { polygon, divIcon } from 'leaflet';
import { LayerGroup, Marker } from 'react-leaflet';

import AreaPolygon from './AreaPolygon';
import AreaBoulders from './AreaBoulders';
import Area from '../../../models/Area';
import Coordinate from '../../../models/Coordinate';

interface Props {
  area: Area;
  selected: boolean;
  onClick?: () => any;
}

const AreaMap: React.SFC<Props> = (props) => {
  if (props.area.coordinates.length === 0) {
    return <span />;
  }
  const myBounds = polygon(props.area.coordinates).getBounds();
  return (
    <LayerGroup>
      <Marker
        icon={divIcon({
          className: 'null',
          html: `
            <h5 style="transform: translate(-50%, 0); position: absolute; color: white">
              ${props.area.name}
            </h5>
          `
        })}
        position={{
          lat: (myBounds.getNorth() + myBounds.getCenter().lat) / 2.0,
          lng: myBounds.getCenter().lng
        }}
        onClick={props.onClick}
      >
      </Marker>
      {props.selected ?
      [
        <AreaPolygon
          key={`area-${props.area.id}-polygon`}
          area={props.area}
          onclick={props.onClick}
        />,
        <AreaBoulders
          key={`area-${props.area.id}-boulders`}
          area={props.area}
        />
      ] :
        <span />
      }
    </LayerGroup>
  );
};

export default AreaMap;
