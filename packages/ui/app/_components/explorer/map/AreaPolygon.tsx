import { Area } from "models";
import React from "react";
import MyPolygon from "./MyPolygon";

type Props = Partial<React.ComponentProps<typeof MyPolygon>> & {
  area: Area;
};

export default function AreaPolygon(props: Props) {
  if (!props.area.polygon?.coordinates) {
    return false;
  }
  return <MyPolygon {...props} positions={props.area.polygon.coordinates} />;
}
