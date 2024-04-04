import * as React from "react";
import { partial } from "lodash-es";

import AreaMap from "./AreaMap.js";
import Area from "../../../models/Area.js";
import type { LeafletMouseEvent } from "leaflet";

interface Props {
  areas: Area[];
  onAreaClick?: (area: Area, e: LeafletMouseEvent) => any;
}

const AreasMap: React.SFC<Props> = (props) => {
  console.warn(props, "AreasMap");
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
};

export default AreasMap;
