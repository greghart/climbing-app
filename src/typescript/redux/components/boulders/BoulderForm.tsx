import * as React from "react";
import { sortBy, get } from "lodash-es";
import {
  Fields,
  Field,
  type InjectedFormProps,
  type FormErrors,
  type WrappedFieldsProps,
} from "redux-form";

import type { OnSubmit } from "../types.js";
import Area from "../../../models/Area.js";
import Coordinate, { isValidCoordinate } from "../../../models/Coordinate.js";
import MyField from "../form/MyField.js";
import Cancel from "../form/Cancel.js";
import Submit from "../form/Submit.js";
import LocationField from "../form/LocationField.js";
import ErrorWrapper from "../form/ErrorWrapper.js";
import PolygonField, { type PolygonFieldProps } from "../form/PolygonField.js";
import MyPolygon from "../map/MyPolygon.js";
import BoulderIcon from "../map/BoulderIcon.js";

interface Props {
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
  // The area this boulder is in. Used to help set location
  area: Area;
}

interface FormData {
  name?: string;
  description?: string;
  lat?: number;
  lng?: number;
}

// Location icon that's connected to the form location.
// Used in polygon map.
type LocationIconProps = WrappedFieldsProps & { names: [string, string] };
const LocationIcon: React.ComponentType<LocationIconProps> = (props) => {
  const lat = get(props, props.names[0]);
  const lng = get(props, props.names[1]);
  const coordinate: Partial<Coordinate> = {
    lat: lat.input.value as unknown as number,
    lng: lng.input.value as unknown as number,
  };
  return isValidCoordinate(coordinate) && <BoulderIcon position={coordinate} />;
};
const BoulderForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
  console.warn({ props }, "BoulderForm");
  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} className="m-3">
      {props.error && <span className="text-danger">{props.error}</span>}
      <MyField name="name" label="Name" />
      <MyField
        name="description"
        label="Description"
        inputComponent="textarea"
        rows={3}
        normalize={(v) => (v === "" ? null : v)}
      />
      <div className="form-group">
        <label>Location</label>
        <Field name="coordinate" component={ErrorWrapper} />
        <div>
          <Fields
            names={["coordinate.lat", "coordinate.lng", "coord_is_updating"]}
            component={LocationField}
            positions={sortBy(props.area.polygon.coordinates, "order")}
            bounds={props.area.polygon.coordinates.map((c) => {
              return [c.lat, c.lng] as [number, number];
            })}
            isUpdating={true}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Polygon (Optional)</label>
        <div>
          <Fields<PolygonFieldProps>
            names={["polygon", "polygon_is_updating"]}
            component={PolygonField}
            bounds={props.area.polygon.coordinates.map<[number, number]>(
              (c) => [c.lat, c.lng]
            )}
            otherLayers={(sortedCoordinates) => (
              <React.Fragment>
                <Fields
                  names={["coordinate.lat", "coordinate.lng"]}
                  component={LocationIcon}
                />
                <MyPolygon
                  key="old-polygon"
                  positions={sortedCoordinates}
                  fillOpacity={0.1}
                  fillColor="#f41f5c"
                />
                {props.area.polygon && (
                  <MyPolygon positions={props.area.polygon.coordinates} />
                )}
              </React.Fragment>
            )}
            tracerProps={{
              title: "Trace the boulder",
              magnetSizeMeters: 1,
            }}
          />
        </div>
      </div>
      <div>
        <Submit {...props} />
        <Cancel {...props} />
      </div>
    </form>
  );
};

export default BoulderForm;
export type { FormData, Props };
