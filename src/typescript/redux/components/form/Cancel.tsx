import * as React from 'react';
import { InjectedFormProps } from "redux-form";

import withGoBack from '../../decorators/withGoBack';

const _Cancel: React.SFC<InjectedFormProps<unknown> & { goBack: () => unknown }> = (props) => {
  return (
    <button
      className="btn btn-secondary ml-2"
      type="button"
      disabled={props.submitting}
      onClick={() => {
        props.reset();
        props.goBack();
      }}
    >
      Cancel
    </button>
  );
}
const Cancel = withGoBack(_Cancel);

export default Cancel;
