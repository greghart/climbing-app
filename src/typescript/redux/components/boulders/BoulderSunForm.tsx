/**
 * We will allow the sun map to be configured by user
 */
import * as React from 'react';
import * as SunCalc from 'suncalc';
import { InjectedFormProps, reduxForm, Field } from 'redux-form';

import { OnSubmit } from '../types';
import SliderField from '../form/SliderField';
import Boulder from '../../../models/Boulder';

interface Props {
  onSubmit: OnSubmit<FormData, Props>;
  boulder: Boulder;
}
interface FormData {
  givenHour: number;
}

const _BoulderSunForm: React.SFC<InjectedFormProps<FormData, Props> & Props> = (props) => {
  const times = SunCalc.getTimes(
    new Date(),
    props.boulder.coordinate.lat,
    props.boulder.coordinate.lng
  );
  const bottomHour = times.sunrise.getHours();
  const topHour = times.sunset.getHours();
  const numTicks = Math.floor(topHour) - Math.floor(bottomHour) + 1;
  const marks = Array(numTicks).fill(0).reduce(
    (memo, any, i) => {
      const amPm = bottomHour + i >= 12 ? 'PM' : 'AM';
      const showAmPm = i == 0 || bottomHour + i == 12;
      memo[bottomHour*4 + i*4] = showAmPm ?
        bottomHour + i + amPm :
        ((bottomHour + i) % 12);
      return memo;
    },
    {}
  )
  console.warn({
    marks,
    topHour,
    bottomHour
  }, 'BoulderSunForm');
  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} className="m-3">
      <Field
        component={SliderField}
        marks={marks}
        min={bottomHour * 4}
        max={topHour * 4}
        step={4}
        name="givenHour"
        label="At what hour?"
        className="mb-4"
      />
    </form>
  )
};

const BoulderSunForm = reduxForm<FormData, Props>({
  initialValues: {
    givenHour: new Date().getHours() * 4
  },
  form: 'boulder-sun-form'
})(_BoulderSunForm);

export default BoulderSunForm;
