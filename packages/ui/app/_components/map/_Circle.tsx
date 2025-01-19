import * as React from "react";
import { Circle as BaseCircle } from "react-leaflet";

type KnownProps = "color" | "fillColor" | "radius";
type ExpectedProps = Omit<React.ComponentProps<typeof BaseCircle>, KnownProps> &
  Partial<Pick<React.ComponentProps<typeof BaseCircle>, KnownProps>> & {
    style?: keyof typeof styles;
  };

const styles = {
  static: {
    // a static circle that isn't moving, red for stop
    color: "red",
    fillColor: "#f03",
  },
  pending: {
    // a circle that isn't yet committed, yellow for transience
    color: "yellow",
    fillColor: "#yellow",
    fillOpacity: 0.5,
  },
  dynamic: {
    // a dynamic circle on the move, green for go
    color: "green",
    fillColor: "green",
    fillOpacity: 0.5,
  },
};

/**
 * Basic style and presets for a circle on a map.
 * Useful for pinpoint selections.
 */
const Circle = React.forwardRef<any, ExpectedProps>(function ConfirmedCircle(
  props,
  ref
) {
  return (
    <BaseCircle
      ref={ref}
      {...styles[props.style || "static"]}
      radius={0.1}
      {...props}
    />
  );
});

export default Circle;
