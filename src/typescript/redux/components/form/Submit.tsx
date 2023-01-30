import * as React from "react";
import { InjectedFormProps } from "redux-form";

const Submit: React.SFC<InjectedFormProps<unknown>> = (props) => {
  return (
    <button
      className="btn btn-primary"
      type="submit"
      disabled={props.submitting}
    >
      Submit
    </button>
  );
};

export default Submit;
