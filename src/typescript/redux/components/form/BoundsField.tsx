import * as React from "react";
import * as Leaflet from "leaflet";
import type { WrappedFieldsProps } from "redux-form";
import { get } from "lodash";

// import BoundsTracer from '../tracer/BoundsTracer.js';
import BaseMap from "../map/BaseMap.js";
// import MyBounds from '../map/MyBounds.js';
import type { ExtractProps } from "../../../externals.js";
import BoundsTracer from "../tracer/BoundsTracer.js";

interface BoundsProps {
  // We will use the first name as the bounds
  // The second name will be an updating flag
  names: [string, string];
  // BoundsField supports there not being bounds already
  backupBounds?: Leaflet.LatLngBoundsExpression;
  // Additional props to tracer
  tracerProps?: Partial<ExtractProps<typeof BoundsTracer>>;
}

const BoundsField: React.ComponentType<WrappedFieldsProps & BoundsProps> = (
  props
) => {
  const bounds = get(props, props.names[0]);
  const isUpdating = get(props, props.names[1]);

  const currentBounds =
    bounds.input.value &&
    Leaflet.latLngBounds(
      Leaflet.latLng(bounds.input.value.topLeft),
      Leaflet.latLng(bounds.input.value.bottomRight)
    );
  const boundsToUse = currentBounds || props.backupBounds;

  if (!isUpdating.input.value) {
    return (
      <div>
        <div className="row">
          <div className="col-8">
            {/** TODO Handle new area as well */}
            <BaseMap bounds={boundsToUse} style={{ paddingBottom: "50%" }}>
              {null}
              {/* <MyBounds positions={sortedCoordinates} /> */}
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
          {bounds.meta.touched && bounds.meta.error && (
            <div className="invalid-feedback">{bounds.meta.error}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed-container fullscreen over-map bg-dark">
      <BoundsTracer
        {...props.tracerProps}
        bounds={boundsToUse}
        onCancel={() => isUpdating.input.onChange(false)}
        onSubmit={(topLeft, bottomRight) => {
          bounds.input.onChange({
            topLeft,
            bottomRight,
          });
          isUpdating.input.onChange(false);
        }}
      />
    </div>
  );
};

export type { BoundsProps as BoundsFieldProps };
export default BoundsField;
