import * as React from "react";
import * as SunCalc from "suncalc";
import {
  Field,
  type GenericFieldHTMLAttributes,
  type BaseFieldProps,
} from "redux-form";

import Coordinate from "../../../models/Coordinate";
import SliderField from "../form/SliderField";

interface Props {
  coordinate: Coordinate;
}

type FieldType = React.ComponentType<
  (GenericFieldHTMLAttributes | BaseFieldProps) & Props
>;
const SunHoursField: FieldType = (props) => {
  const { coordinate, ...rest } = props;
  const times = SunCalc.getTimes(new Date(), coordinate.lat, coordinate.lng);
  const bottomHour = times.sunrise.getHours();
  const topHour = times.sunset.getHours();
  const numTicks = Math.floor(topHour) - Math.floor(bottomHour) + 1;
  const marks = Array(numTicks)
    .fill(0)
    .reduce((memo, any, i) => {
      const amPm = bottomHour + i >= 12 ? "PM" : "AM";
      const showAmPm = i === 0 || bottomHour + i === 12;
      memo[bottomHour * 4 + i * 4] = showAmPm
        ? bottomHour + i + amPm
        : (bottomHour + i) % 12;
      return memo;
    }, {});
  return (
    <Field<any>
      component={SliderField}
      marks={marks}
      min={bottomHour * 4}
      max={topHour * 4}
      step={4}
      {...rest}
    />
  );
};

export default SunHoursField;
