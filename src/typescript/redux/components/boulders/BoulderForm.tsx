import * as React from 'react';
import { InjectedFormProps, FormErrors, Field, WrappedFieldProps, Fields } from 'redux-form';
import { OnSubmit } from '../types';
import MyField from '../form/MyField';
import Cancel from '../form/Cancel';
import Submit from '../form/Submit';
import Area from '../../../models/Area';
import LocationField from '../form/LocationField';
import { ExtractProps } from '../../../externals';

interface Props {
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
  // The area this boulder is in. Used to help set location
  area: Area
}

interface FormData {
  name?: string,
  description?: string,
  lat?: number,
  lng?: number,
}

const BoulderForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
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
        rows="3"
        normalize={(v) => v == '' ? null : v }
      />
      <div className="form-group">
        <label>
          Location
        </label>
        <div>
          {props.area.name} /
          <Fields
            names={['lat', 'lng']}
            component={LocationField}
            bounds={props.area.coordinates.map((c) => {
              return [c.lat, c.lng] as [number, number];
            })}
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
export { FormData, Props };

