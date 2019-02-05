import * as React from 'react';
import * as Leaflet from 'leaflet';
import get = require('lodash/get');
import { WrappedFieldsProps } from 'redux-form';
import PolygonTracer from '../tracer/PolygonTracer';
import BaseMap from '../map/BaseMap';
import MyPolygon from '../map/MyPolygon';
import sortBy = require('lodash/sortBy');

interface PolygonProps {
  // We will use the first name as the coordinates to polygon
  // The second name will be an updating flag
  names: [string, string];
  // Other layers to include on the map -- takes form level coords as an argument
  otherLayers?: (sortedCoordinates) => React.ReactNode;
}

const PolygonField: React.ComponentType<WrappedFieldsProps & PolygonProps> = (props) => {
  const coordinates = get(props, props.names[0]);
  const isUpdating = get(props, props.names[1]);

  const sortedCoordinates = sortBy(coordinates.input.value, 'order');

  if (!isUpdating.input.value) {
    return (
      <div>
        <div className="row">
          <div className="col-8">
            {/** TODO Handle new area as well */}
            <BaseMap bounds={sortedCoordinates} style={{ paddingBottom: '50%' }}>
              <MyPolygon positions={sortedCoordinates} />
            </BaseMap>
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
    <div className="fixed-container fullscreen">
      <PolygonTracer
        bounds={coordinates.input.value}
        onCancel={() => isUpdating.input.onChange(false)}
        onSubmit={(newCoordinates) => {
          coordinates.input.onChange(newCoordinates.map((thisC, i) => {
            return {
              ...thisC,
              order: i
            }
          }));
          isUpdating.input.onChange(false);
        }}
      >
        {props.otherLayers(sortedCoordinates)}
      </PolygonTracer>
    </div>
  );
};

export default PolygonField;
