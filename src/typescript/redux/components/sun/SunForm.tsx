/**
 * We will allow the sun map to be configured by user
 */
import * as React from "react";
import * as SunCalc from "suncalc";
import { type InjectedFormProps, reduxForm, Field } from "redux-form";

import type { OnSubmit } from "../types.js";
import SliderField from "../form/SliderField.js";
import Coordinate from "../../../models/Coordinate.js";
import SunHoursField from "./SunHoursField.js";

interface Props {
  onSubmit: OnSubmit<FormData, Props>;
  coordinate: Coordinate;
}
interface FormData {
  givenHour: number;
}

const _SunForm: React.SFC<InjectedFormProps<FormData, Props> & Props> = (
  props
) => {
  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} className="m-3">
      <SunHoursField
        name="givenHour"
        className="mb-4"
        coordinate={props.coordinate}
      />
    </form>
  );
};

const SunForm = reduxForm<FormData, Props>({
  initialValues: {
    givenHour: new Date().getHours() * 4,
  },
  form: "sun-form",
})(_SunForm);

export default SunForm;
