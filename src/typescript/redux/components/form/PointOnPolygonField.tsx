import * as React from 'react';
import { WrappedFieldsProps } from 'redux-form';
import get = require('lodash/get');

import PointOnPolygon from '../tracer/PointOnPolygon';
import { ExtractProps } from '../../../externals';
import BaseMap from '../map/BaseMap';
import MyPolygon from '../map/MyPolygon';
import ConfirmedCircle from '../tracer/ConfirmedCircle';
import Coordinate, { isValidCoordinate } from '../../../models/Coordinate';

interface PointOnPolygonFieldProps {
  // Polygon
  positions: ExtractProps<typeof PointOnPolygon>['positions'];
  // We will use the first two names as lat and lng properties respectively
  // The third name should be a flag to say we're updating or not
  names: [string, string, string];
  // Other layers to include on the map
  otherLayers?: (coordinate: Partial<Coordinate>) => React.ReactNode;
  // Additional props to tracer
  pointOnPolygonProps?: Partial<ExtractProps<typeof PointOnPolygon>>;
}

const PointOnPolygonField: React.ComponentType<WrappedFieldsProps & PointOnPolygonFieldProps> = (props) => {
  const lat = get(props, props.names[0]);
  const lng = get(props, props.names[1]);
  const isUpdating = get(props, props.names[2]);
  const coordinate: Partial<Coordinate> = {
    lat: lat.input.value as unknown as number,
    lng: lng.input.value as unknown as number
  };

  if (!props.positions) {
    return <span>Setup boulder first to setup route location</span>;
  }
  if (!isUpdating.input.value) {
    return (
      <div>
        <div className="row">
          <div className="col-8">
            {/** Show a boulder with current route position on it */}
            {isValidCoordinate(coordinate) ?
              <BaseMap bounds={props.positions} style={{ paddingBottom: '50%' }}>
                <MyPolygon positions={props.positions} />
                <ConfirmedCircle center={[coordinate.lat, coordinate.lng]} />}
              </BaseMap> :
              'None Provided'
            }
          </div>
        </div>
        <div className="btn btn-link" onClick={() => isUpdating.input.onChange(true)}>
          <small>
            Edit <i className="fa fa-edit ml-2"/>
          </small>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed-container fullscreen over-map bg-dark">
      <PointOnPolygon
        positions={props.positions}
        onSubmit={(newPosition) => {
          lat.input.onChange(newPosition[0]);
          lng.input.onChange(newPosition[1]);
          isUpdating.input.onChange(false);
        }}
        onCancel={() => isUpdating.input.onChange(false)}
      >
        {props.otherLayers(coordinate)}
      </PointOnPolygon>
    </div>
  )
};

export { PointOnPolygonFieldProps };
export default PointOnPolygonField;
