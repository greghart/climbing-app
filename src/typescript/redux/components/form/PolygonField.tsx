import * as React from "react";
import * as Leaflet from "leaflet";
import type { WrappedFieldsProps } from "redux-form";
import { get, sortBy } from "lodash";

import PolygonTracer from "../tracer/PolygonTracer.js";
import BaseMap from "../map/BaseMap.js";
import MyPolygon from "../map/MyPolygon.js";
import type { ExtractProps } from "../../../externals.js";

interface PolygonProps {
  // We will use the first name as the coordinates to polygon
  // The second name will be an updating flag
  names: [string, string];
  // Other layers to include on the map -- takes form level coords as an argument
  otherLayers?: (sortedCoordinates) => React.ReactNode;
  // PolygonField supports there not being coordinates already
  // In this case, supplied bounds will be used for framing the tracer
  bounds?: Leaflet.LatLngBoundsExpression;
  // Additional props to tracer
  tracerProps?: Partial<ExtractProps<typeof PolygonTracer>>;
}

const PolygonField: React.ComponentType<WrappedFieldsProps & PolygonProps> = (
  props
) => {
  const polygon = get(props, props.names[0]);
  const isUpdating = get(props, props.names[1]);

  const sortedCoordinates = sortBy(
    polygon.input.value.coordinates || [],
    "order"
  );
  const boundsToUse =
    sortedCoordinates.length > 0 ? sortedCoordinates : props.bounds;

  if (!isUpdating.input.value) {
    return (
      <div>
        <div className="row">
          <div className="col-8">
            {/** TODO Handle new area as well */}
            <BaseMap bounds={boundsToUse} style={{ paddingBottom: "50%" }}>
              <MyPolygon positions={sortedCoordinates} />
            </BaseMap>
          </div>
        </div>
        <div
          className="btn btn-link"
          onClick={() => isUpdating.input.onChange(true)}
        >
          <small>
            Edit <i className="fa fa-edit ml-2" />
          </small>
        </div>
        {polygon.meta.touched && polygon.meta.error && (
          <div className="invalid-feedback">
            {polygon.meta.error.coordinates}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed-container fullscreen over-map bg-dark">
      <PolygonTracer
        {...props.tracerProps}
        bounds={boundsToUse}
        onCancel={() => isUpdating.input.onChange(false)}
        onSubmit={(newCoordinates) => {
          const value = polygon.input.value || {};
          value.coordinates = newCoordinates.map((thisC, i) => {
            return {
              ...thisC,
              order: i,
            };
          });
          polygon.input.onChange(value);
          isUpdating.input.onChange(false);
        }}
      >
        {props.otherLayers(sortedCoordinates)}
      </PolygonTracer>
    </div>
  );
};

export type { PolygonProps as PolygonFieldProps };
export default PolygonField;
