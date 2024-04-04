import * as React from "react";
import * as Leaflet from "leaflet";
import { get } from "lodash-es";
import type { WrappedFieldsProps } from "redux-form";

import MyPolygon from "../map/MyPolygon.js";
import Coordinate, { isValidCoordinate } from "../../../models/Coordinate.js";
import BoulderLocationSetterContainer from "../boulders/BoulderLocationSetterContainer.js";
import BoulderIcon from "../map/BoulderIcon.js";
import BaseMap from "../map/BaseMap.js";

interface LocationProps {
  // We will use the first two names as lat and lng properties respectively
  // The third name should be a flag to say we're updating or not
  names: [string, string, string];
  // The bounds we care about, to zoom map to
  bounds: Leaflet.LatLngBoundsExpression;
  // The positions of the area we care about, to draw a polygon
  positions?: Leaflet.LatLngExpression[];
}

const LocationField: React.ComponentType<WrappedFieldsProps & LocationProps> = (
  props
) => {
  const lat = get(props, props.names[0]);
  const lng = get(props, props.names[1]);
  const isUpdating = get(props, props.names[2]);
  const coordinate: Partial<Coordinate> = {
    lat: lat.input.value as unknown as number,
    lng: lng.input.value as unknown as number,
  };

  if (!isUpdating.input.value) {
    return (
      <div>
        <div className="row">
          <div className="col-8">
            {isValidCoordinate(coordinate) ? (
              <BaseMap center={coordinate} style={{ paddingBottom: "50%" }}>
                <BoulderIcon position={coordinate} />
              </BaseMap>
            ) : (
              <span>None provided</span>
            )}
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
      </div>
    );
  }
  return (
    <div className="fixed-container fullscreen over-map bg-dark">
      <BoulderLocationSetterContainer
        bounds={props.bounds}
        defaultCurrent={isValidCoordinate(coordinate) ? coordinate : undefined}
        onCancel={() => isUpdating.input.onChange(false)}
        onSubmit={(newCoordinate: Coordinate) => {
          lat.input.onChange(newCoordinate.lat);
          lng.input.onChange(newCoordinate.lng);
          isUpdating.input.onChange(false);
        }}
      >
        {props.positions && <MyPolygon positions={props.positions} />}
      </BoulderLocationSetterContainer>
    </div>
  );
};

export default LocationField;
