import * as React from "react";

import AreaMap from "./AreaMap.js";
// import { IArea } from "models";
import type { LeafletMouseEvent } from "leaflet";

interface Props {
  areas: Area[];
  // onAreaClick?: (area: Area, e: LeafletMouseEvent) => any;
}

export default function AreasMap(props: Props) {
  return (
    <div>
      {props.areas.map((area) => {
        return (
          <AreaMap
            key={area.name}
            {...props}
            area={area}
            onClick={props.onAreaClick && partial(props.onAreaClick, area)}
          />
        );
      })}
    </div>
  );
}
