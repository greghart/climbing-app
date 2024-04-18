import React from "react";
import { Area } from "models";
import { sortBy } from "lodash-es";
import MyPolygon from "../map/MyPolygon";

type Props = Partial<React.ComponentProps<typeof MyPolygon>> & {
  area: Area;
};

export default function AreaPolygon(props: Props) {
  if (!props.area.polygon || props.area.polygon.coordinates.length === 0) {
    return false;
  }
  return <MyPolygon {...props} positions={props.area.polygon.coordinates} />;
}
