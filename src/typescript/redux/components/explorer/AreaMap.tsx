import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map, LayerGroup, Tooltip } from 'react-leaflet';

import AreaPolygon from './AreaPolygon';
import AreaBoulders from './AreaBoulders';
import Area from '../../../models/Area';
import withArea from '../areas/withArea';

interface Props {
  area: Area;
  // Show the polygon of the area
  polygon?: boolean;
  // Show the name tooltip of the area
  tooltip?: boolean;
  // Show boulders of this area
  boulders?: boolean;
  onClick?: (e: Leaflet.LeafletMouseEvent) => any;
  // Optional ref to the map, allowing us to navigate to this area as an effect
  mapRef?: React.RefObject<Map>;
  mapFitBounds?: boolean;
}

const AreaMap: React.SFC<Props> = (props) => {
  console.warn({ props }, 'AreaMap');
  if (!props.area.polygon.coordinates || props.area.polygon.coordinates.length === 0) {
    return <span />;
  }
  React.useEffect(
    () => {
      if (props.mapRef && props.mapFitBounds) {
        props.mapRef.current.leafletElement.fitBounds(
          props.area.polygon.coordinates.map((c) => {
            return [c.lat, c.lng] as [number, number];
          })
        );
      }
    },
    [props.area.id]
  );
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
        />
      }
    </LayerGroup>
  );
};

AreaMap.defaultProps = {
  polygon: false,
  tooltip: true,
  boulders: false,
  mapFitBounds: false
};

const Connected = withArea(AreaMap);
export { Connected };
export default AreaMap;
