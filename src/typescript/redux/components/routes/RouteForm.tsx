import * as React from 'react';
import { InjectedFormProps, FormErrors, Fields } from 'redux-form';
import get from 'lodash/get';

import { OnSubmit } from '../types';
import MyField from '../form/MyField';
import Cancel from '../form/Cancel';
import Submit from '../form/Submit';
import Route from '../../../models/Route';
import Boulder from '../../../models/Boulder';
import { isValidCoordinate } from '../../../models/Coordinate';
import PointOnPolygonField from '../form/PointOnPolygonField';
import ConfirmedCircle from '../tracer/ConfirmedCircle';
import BoulderMap from '../boulders/BoulderMap';

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
  console.warn(props, 'RouteForm');
  return (
    <form onSubmit={props.handleSubmit} className="m-3">
      {props.error &&
        <span className="text-danger">{props.error}</span>
      }
      <MyField
        name="name"
        label="Name"
      />
      <MyField
        name="description"
        label="Description"
        inputComponent="textarea"
        rows={3}
      />
      {/* TODO Add grades dropdown */}
      <MyField
        name="gradeRaw"
        label="V Grade"
      />
      <MyField
        name="length"
        label="Length of route (in feet)"
        type="number"
      />
      <MyField
        name="firstAscent"
        label="First Ascent"
        placeholder="John Long, 1979"
      />
      <div className="form-group">
        <label>
          Location
        </label>
        <Fields<any>
          names={['coordinate.lat', 'coordinate.lng', 'isUpdating']}
          component={PointOnPolygonField}
          positions={get(props, 'boulder.polygon.coordinates', []).map((c) => [c.lat, c.lng])}
          otherLayers={(coordinate) => (
            <React.Fragment>
              <BoulderMap boulder={props.boulder} />
              {isValidCoordinate(coordinate) &&
                <ConfirmedCircle
                  key="old-polygon"
                  center={[coordinate.lat, coordinate.lng]}
                  color="blue"
                  fillColor="blue"
                />
              }
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
export { FormData, Props };
