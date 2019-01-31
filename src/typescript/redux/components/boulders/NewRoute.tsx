import * as React from 'react';
import { Field, InjectedFormProps, FormErrors } from 'redux-form';
import User from '../../../models/User';
import { OnSubmit } from '../types';
import { MyField } from '../form/RenderField';

interface Props {
  user: User;
  // Hook into meta enter submit
  handleCustomSubmit: (e: any) => any;
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

const NewRoute: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
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
        <button className="btn btn-primary" type="submit" disabled={props.submitting}>
          Submit
        </button>
        <button className="btn btn-secondary ml-2" type="button" disabled={props.pristine || props.submitting} onClick={props.reset}>
          Clear Values
        </button>
      </div>
    </form>
  );
};

NewRoute.defaultProps = {
  user: {
    id: 1,
    email: 'greghartnewcomment',
    name: "Greg",
    comments: []
  }
}

export default NewRoute;
export { FormData, Props };


