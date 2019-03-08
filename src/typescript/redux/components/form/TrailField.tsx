import * as React from 'react';
import * as Leaflet from 'leaflet';
import { WrappedFieldsProps } from 'redux-form';
import get = require('lodash/get');
import sortBy = require('lodash/sortBy');

import TrailTracer from '../tracer/TrailTracer';
import BaseMap from '../map/BaseMap';
import { ExtractProps } from '../../../externals';

interface TrailProps {
  // We will use:
  //  [0] -- nodes
  //  [1] -- adjacency map
  //  [2] -- updating flag
  names: [string, string, string];
  // Other layers to include on the map -- takes form level coords as an argument
  otherLayers?: () => React.ReactNode;
  // TrailField supports there not being a trail already
  // In this case, supplied bounds will be used for framing the tracer
  bounds?: Leaflet.LatLngBoundsExpression;
  // Additional props to tracer
  tracerProps?: Partial<ExtractProps<typeof TrailTracer>>;
}

const TrailField: React.ComponentType<WrappedFieldsProps & TrailProps> = (props) => {
  const polygon = get(props, props.names[0]);
  const isUpdating = get(props, props.names[1]);

  const sortedCoordinates = []; // sortBy(polygon.input.value.coordinates || [], 'order');
  const boundsToUse = sortedCoordinates.length > 0 ? sortedCoordinates : props.bounds;

  if (false) { // !isUpdating.input.value) {
    return (
      <div>
        <div className="row">
          <div className="col-8">
            {/** TODO Handle new area as well */}
            TODO
            {/* <BaseMap bounds={boundsToUse} style={{ paddingBottom: '50%' }}>
              <MyTrail positions={sortedCoordinates} />
            </BaseMap> */}
          </div>
        </div>
        <div className="btn btn-link" onClick={() => isUpdating.input.onChange(true)}>
          <small>
            Edit <i className="fa fa-edit ml-2"/>
          </small>
          {polygon.meta.touched && polygon.meta.error && (
            <div className="invalid-feedback">
              {polygon.meta.error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed-container fullscreen over-map bg-dark">
      <TrailTracer
        {...props.tracerProps}
        bounds={boundsToUse}
        onCancel={() => true/*isUpdating.input.onChange(false)*/}
        onSubmit={(newCoordinates) => {
          // const value = polygon.input.value || {};
          // value.coordinates = newCoordinates.map((thisC, i) => {
          //   return {
          //     ...thisC,
          //     order: i,
          //   };
          // });
          // polygon.input.onChange(value);
          // isUpdating.input.onChange(false);
        }}
      >
        {props.otherLayers && props.otherLayers()}
      </TrailTracer>
    </div>
  );
};

export { TrailProps as TrailFieldProps };
export default TrailField;
