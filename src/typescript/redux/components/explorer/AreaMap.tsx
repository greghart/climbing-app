import * as React from 'react';
import { polygon } from 'leaflet';
import { LayerGroup } from 'react-leaflet';
const DivIcon = require('react-leaflet-div-icon').default;

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
      <DivIcon
        className="null"
        position={{
          lat: (myBounds.getNorth() + myBounds.getCenter().lat) / 2.0,
          lng: myBounds.getCenter().lng
        }}
        onClick={props.onClick}
      >
        <h5
          style={{
            transform: 'translate(-50%, 0)',
            position: 'absolute',
            color: 'white'
          }}
        >
          {props.area.name}
        </h5>
      </DivIcon>
      {props.selected ?
      [
        <AreaPolygon
            area={props.area}
            onclick={props.onClick}
          />,
        <AreaBoulders area={props.area} />
      ] :
        <span />
      }
    </LayerGroup>
  );
};

export default AreaMap;
