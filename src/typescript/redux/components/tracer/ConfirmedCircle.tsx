import * as React from "react";
import { Circle } from "react-leaflet";
import type { ExtractProps } from "../../../externals";
import type { Omit } from "utility-types/dist/mapped-types";

type KnownProps = "color" | "fillColor" | "radius";
type ExpectedProps = Omit<ExtractProps<Circle>, KnownProps> &
  Partial<Pick<ExtractProps<Circle>, KnownProps>>;

const ConfirmedCircle = React.forwardRef<Circle, ExpectedProps>(
  (props, ref) => {
    return (
      <Circle ref={ref} color="red" fillColor="#f03" radius={0.1} {...props} />
    );
  }
);

export default ConfirmedCircle;
