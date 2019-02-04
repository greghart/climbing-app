import * as React from 'react';
import { polygon } from 'leaflet';
import { LayerGroup, Tooltip } from 'react-leaflet';

import AreaPolygon from './AreaPolygon';
import AreaBoulders from './AreaBoulders';
import Area from '../../../models/Area';

interface Props {
  area: Area;
  // Show the polygon of the area
  polygon?: boolean;
  // Show the name tooltip of the area
  tooltip?: boolean;
  // Show boulders of this area
  boulders?: boolean;
  onClick?: () => any;
}

const AreaMap: React.SFC<Props> = (props) => {
  if (props.area.coordinates.length === 0) {
    return <span />;
  }
  // We need the polygon to center tooltip, so we just hide it based on `polygon`
  const hidePolygonProps = props.polygon ? {} : {
    opacity: 0.0,
    fillOpacity: 0.0
  };
  return (
    <LayerGroup>
      <AreaPolygon
        key={`area-${props.area.id}-polygon`}
        area={props.area}
        onclick={props.onClick}
        {...hidePolygonProps}
      >
        {props.tooltip &&
          <Tooltip permanent={true} direction="center">
            {props.area.name}
          </Tooltip>
        }
      </AreaPolygon>
      {props.boulders &&
        <AreaBoulders
          key={`area-${props.area.id}-boulders`}
          area={props.area}
        />
      }
    </LayerGroup>
  );
};

AreaMap.defaultProps = {
  polygon: false,
  tooltip: true,
  boulders: false
}
export default AreaMap;
