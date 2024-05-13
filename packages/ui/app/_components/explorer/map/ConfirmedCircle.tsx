import * as React from "react";
import { Circle } from "react-leaflet";

type KnownProps = "color" | "fillColor" | "radius";
type ExpectedProps = Omit<React.ComponentProps<typeof Circle>, KnownProps> &
  Partial<Pick<React.ComponentProps<typeof Circle>, KnownProps>>;

const ConfirmedCircle = React.forwardRef<any, ExpectedProps>((props, ref) => {
  return (
    <Circle ref={ref} color="red" fillColor="#f03" radius={0.1} {...props} />
  );
});

export default ConfirmedCircle;
