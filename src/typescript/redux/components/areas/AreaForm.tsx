import * as React from 'react';
import { InjectedFormProps, FormErrors, Fields } from 'redux-form';
import { OnSubmit } from '../types';
import MyField from '../form/MyField';
import Cancel from '../form/Cancel';
import Submit from '../form/Submit';
import PolygonField from '../form/PolygonField';

interface Props {
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
  __coordinates: any;
}

interface FormData {
  name?: string,
  description?: string
}

const AreaForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
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
      />
      <div className="form-group">
        <label>
          Location
        </label>
        <div>
          <Fields
            names={['coordinates', 'coordinates_is_updating']}
            component={PolygonField}
            bounds={props.__coordinates.map((c) => {
              return [c.lat, c.lng] as [number, number];
            })}
            isUpdating={true}
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

export default AreaForm;
export { FormData, Props };

