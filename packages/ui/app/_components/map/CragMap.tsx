import { Crag, ICrag } from "models";
import React from "react";
import Map from "./Map";

type Props = React.ComponentProps<typeof Map> & {
  crag: ICrag;
};

/**
 * CragMap is the base map for a crag.
 * * Bound to crag bounds
 * * Correct tiles and offsets for crag to line up
 *
 * This should almost always be used over Map directly, so that
 * components across a crag are consistent. Also allows proper bounding
 * by just passing crag around
 */
export default function CragMap(props: Props) {
  const crag = Crag.build(props.crag);
  return (
    <Map
      bounds={crag.bounds}
      center={crag.center}
      zoom={crag.defaultZoom}
      minZoom={crag.minZoom}
      maxZoom={crag.maxZoom}
      {...props}
    />
  );
}
