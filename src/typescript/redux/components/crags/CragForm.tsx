import * as React from 'react';
import * as Leaflet from 'leaflet';
import { InjectedFormProps, FormErrors, Fields } from 'redux-form';
import { OnSubmit } from '../types';
import MyField from '../form/MyField';
import Cancel from '../form/Cancel';
import Submit from '../form/Submit';
import BoundsField, { BoundsFieldProps } from '../form/BoundsField';
import Crag from '../../../models/Crag';

interface Props {
  crag: Crag;
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
}

interface FormData {
  name?: string;
  description?: string;
}

const CragForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
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
      <div className="form-group">
        <label>
          Bounds
        </label>
        <Fields<BoundsFieldProps>
          names={['bounds', 'bounds_is_updating']}
          backupBounds={Leaflet.latLngBounds(
            Leaflet.latLng(props.crag.bounds.topLeft),
            Leaflet.latLng(props.crag.bounds.bottomRight)
          )}
          component={BoundsField}
        />
      </div>
      <div>
        <Submit {...props} />
        <Cancel {...props} />
      </div>
    </form>
  );
};

export default CragForm;
export { FormData, Props };
