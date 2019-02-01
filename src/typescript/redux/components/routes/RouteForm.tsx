import * as React from 'react';
import { InjectedFormProps, FormErrors } from 'redux-form';
import { OnSubmit } from '../types';
import { MyField } from '../form/RenderField';
import Cancel from '../form/Cancel';
import Submit from '../form/Submit';

interface Props {
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
}

interface FormData {
  name?: string,
  gradeRaw?: string,
  length?: number,
  description?: string,
  firstAscent?: string,
}

const RouteForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
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
      <div>
        <Submit {...props} />
        <Cancel {...props} />
      </div>
    </form>
  );
};

export default RouteForm;
export { FormData, Props };
