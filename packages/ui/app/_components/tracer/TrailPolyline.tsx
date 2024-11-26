"use client";
import { ILine } from "models";
import React from "react";
import { Polyline } from "react-leaflet";

type Props = Omit<React.ComponentProps<typeof Polyline>, "positions"> & {
  lines?: ILine[];
};

export default function TrailPolyline(props: Props) {
  if (!props.lines) {
    return false;
  }
  return (
    <Polyline
      color="green"
      positions={props.lines.map((l) => [l.start, l.end])}
      {...props}
    />
  );
}
