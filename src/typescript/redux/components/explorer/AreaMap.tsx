import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map, LayerGroup, Tooltip } from 'react-leaflet';

import AreaPolygon from './AreaPolygon';
import AreaBoulders from './AreaBoulders';
import Area from '../../../models/Area';
import withArea from '../areas/withArea';
import { ExtractProps } from '../../../externals';
import useAreaMapNavigator from './useAreaMapNavigator';

interface Props {
  area: Area;
  onClick?: (e: Leaflet.LeafletMouseEvent) => any;
  // Show the polygon of the area
  polygon?: boolean;
  // Show the name tooltip of the area
  tooltip?: boolean;
  // Show boulders of this area
  boulders?: boolean;
  onBoulderClick?: ExtractProps<typeof AreaBoulders>['onBoulderClick'];
}

const AreaMap: React.SFC<Props> = (props) => {
  if (!props.area.polygon.coordinates || props.area.polygon.coordinates.length === 0) {
    return <span />;
  }
  return (
    <LayerGroup>
      <AreaPolygon
        key={`area-${props.area.id}-polygon`}
        area={props.area}
        onclick={props.onClick}
        show={props.polygon}
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
          onBoulderClick={props.onBoulderClick}
        />
      }
    </LayerGroup>
  );
};

AreaMap.defaultProps = {
  polygon: false,
  tooltip: true,
  boulders: false
};

const ConnectedAreaMap = withArea(AreaMap);
export { ConnectedAreaMap };
export default AreaMap;
