"use client";
import getRectangle from "@/app/_components/tracer/getRectangle";
import { IBounds } from "models";
import { Polyline } from "react-leaflet";

interface Props {
  bounds: IBounds;
}

export default function BoundsPolygon(props: Props) {
  return <Polyline positions={getRectangle(props.bounds)} color="green" />;
}
