import * as React from "react";
import { type InjectedFormProps, type FormErrors, Field } from "redux-form";
import User from "../../../models/User";
import type { OnSubmit } from "../types";
import MyField from "../form/MyField";
import FileInput from "../form/FileInput";
import Submit from "../form/Submit";
import Cancel from "../form/Cancel";

interface Props {
  user: User;
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
}

// The mapping from redux-form to FormData is not strictly safe
// That is, we can't know <Fields> will be setup
// @todo Setup runtime boundary validation here?
interface FormData {
  text?: string;
}

const NewPhoto: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
  return (
    <form onSubmit={props.handleSubmit} className="m-3">
      {props.error && <span className="text-danger">{props.error}</span>}
      <MyField name="title" label="Title" />
      <MyField name="description" label="Description" />
      <div className="form-group">
        <label>Upload File</label>
        <div>
          <Field name="file" component={FileInput} />
        </div>
      </div>
      <div>
        <Submit {...props} />
        <Cancel {...props} />
      </div>
    </form>
  );
};

NewPhoto.defaultProps = {
  user: {
    id: 1,
    email: "greghartnewphoto",
    name: "Greg",
    photos: [],
  },
};

export default NewPhoto;
export type { FormData, Props };
