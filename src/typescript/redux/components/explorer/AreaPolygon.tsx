import * as React from "react";
import { sortBy } from "lodash-es";

import Area from "../../../models/Area.js";
import MyPolygon from "../map/MyPolygon.js";
import type { ExtractProps } from "../../../externals.js";

type Props = Partial<ExtractProps<typeof MyPolygon>> & {
  area: Area;
};

const AreaPolygon: React.SFC<Props> = (props) => {
  return (
    <MyPolygon
      {...props}
      positions={sortBy(props.area.polygon.coordinates, "order")}
    />
  );
};

export default AreaPolygon;
