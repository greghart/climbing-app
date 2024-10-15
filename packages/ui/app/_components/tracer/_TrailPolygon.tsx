"use client";
import { ITrail } from "models";
import { Polyline } from "react-leaflet";

interface Props {
  trail?: ITrail;
}

export default function TrailPolygon(props: Props) {
  if (!props.trail) {
    return false;
  }
  return (props.trail.lines || []).map((l, i) => (
    <Polyline key={i} positions={[l.start, l.end]} color="green" />
  ));
}
