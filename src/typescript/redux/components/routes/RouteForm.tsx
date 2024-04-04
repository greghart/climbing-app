import * as React from "react";
import { type InjectedFormProps, type FormErrors, Fields } from "redux-form";
import { get } from "lodash-es";

import type { OnSubmit } from "../types.js";
import MyField from "../form/MyField.js";
import Cancel from "../form/Cancel.js";
import Submit from "../form/Submit.js";
import Route from "../../../models/Route.js";
import Boulder from "../../../models/Boulder.js";
import { isValidCoordinate } from "../../../models/Coordinate.js";
import PointOnPolygonField from "../form/PointOnPolygonField.js";
import ConfirmedCircle from "../tracer/ConfirmedCircle.js";
import BoulderMap from "../boulders/BoulderMap.js";

interface Props {
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
  myRoute: Route;
  boulder: Boulder;
}

interface FormData {
  name?: string;
  gradeRaw?: string;
  length?: number;
  description?: string;
  firstAscent?: string;
}

const RouteForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
  console.warn(props, "RouteForm");
  return (
    <form onSubmit={props.handleSubmit} className="m-3">
      {props.error && <span className="text-danger">{props.error}</span>}
      <MyField name="name" label="Name" />
      <MyField
        name="description"
        label="Description"
        inputComponent="textarea"
        rows={3}
      />
      {/* TODO Add grades dropdown */}
      <MyField name="gradeRaw" label="V Grade" />
      <MyField name="length" label="Length of route (in feet)" type="number" />
      <MyField
        name="firstAscent"
        label="First Ascent"
        placeholder="John Long, 1979"
      />
      <div className="form-group">
        <label>Location</label>
        <Fields<any>
          names={["coordinate.lat", "coordinate.lng", "isUpdating"]}
          component={PointOnPolygonField}
          positions={get(props, "boulder.polygon.coordinates", []).map((c) => [
            c.lat,
            c.lng,
          ])}
          otherLayers={(coordinate) => (
            <React.Fragment>
              <BoulderMap boulder={props.boulder} />
              {isValidCoordinate(coordinate) && (
                <ConfirmedCircle
                  key="old-polygon"
                  center={[coordinate.lat, coordinate.lng]}
                  color="blue"
                  fillColor="blue"
                />
              )}
            </React.Fragment>
          )}
        />
      </div>
      <div>
        <Submit {...props} />
        <Cancel {...props} />
      </div>
    </form>
  );
};

export default RouteForm;
export type { FormData, Props };
