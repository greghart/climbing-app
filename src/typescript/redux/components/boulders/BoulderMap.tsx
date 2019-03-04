/**
 * An interactive map diagram of a boulder
 *
 * Includes:
 *   * Boulder polygon, if any
 *   * Route markers with popup/links
 */
import * as React from 'react';
import * as Leaflet from 'leaflet';

import Boulder from '../../../models/Boulder';
import MyPolygon from '../map/MyPolygon';
import RouteMarkers from './RouteMarkers';
import { ExtractProps } from '../../../externals';

interface Props {
  boulder: Boulder;
  onClick?: (e: Leaflet.LeafletMouseEvent) => unknown;
  showRoutes?: boolean;
  formulateUrl?: ExtractProps<typeof RouteMarkers>['formulateUrl'];
}

const BoulderMap: React.ComponentType<Props> = (props) => {
  return (
    <React.Fragment>
      {props.boulder.polygon &&
        <MyPolygon
          positions={props.boulder.polygon.coordinates}
          onclick={props.onClick}
          fillOpacity={0.1}
        />
      }
      {props.showRoutes && <RouteMarkers
        routes={props.boulder.routes}
        formulateUrl={props.formulateUrl}
      />}
    </React.Fragment>
  );
};
BoulderMap.defaultProps = {
  showRoutes: true,
};

export default BoulderMap;
