/**
 * We will allow the sun map to be configured by user
 */
import * as React from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { OnSubmit } from '../types';
import MyField from '../form/MyField';

interface Props {
  onSubmit: OnSubmit<FormData, Props>;
}
interface FormData {
  atGivenTime: boolean;
  givenTime: Date;
}

const _BoulderSunForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} className="m-3">
      <MyField
        name="atGivenTime"
        type="checkbox"
        label="Specify a time?"
      />
      <MyField
        name="givenTime"
        label="Specified time"
      />
    </form>
  )
};

const BoulderSunForm = reduxForm({
  initialValues: {
    atGivenTime: false
  },
  form: 'boulder-sun-form'
})(_BoulderSunForm);

export default BoulderSunForm;
