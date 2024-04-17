import { Area } from "models";
// import * as Leaflet from "leaflet";
import { LayerGroup, Tooltip } from "react-leaflet";

import AreaPolygon from "./AreaPolygon";
// import AreaBoulders from "./AreaBoulders.js";
// import useAreaMapNavigator from "./useAreaMapNavigator.js";

interface Props {
  area: Area;
  // onClick?: (e: Leaflet.LeafletMouseEvent) => any;
  // Show the polygon of the area
  polygon?: boolean;
  // Show the name tooltip of the area
  tooltip?: boolean;
  // Show boulders of this area
  boulders?: boolean;
  // onBoulderClick?: React.ComponentProps<typeof AreaBoulders>["onBoulderClick"];
}

export default function AreaMap({ tooltip = true, ...props }: Props) {
  if ((props.area.polygon?.coordinates?.length || 0) <= 0) {
    return <span />;
  }

  return (
    <LayerGroup>
      <AreaPolygon
        key={`area-${props.area.id}-polygon`}
        area={props.area}
        // onclick={props.onClick}
        show={props.polygon}
      >
        {tooltip && (
          <Tooltip permanent={true} direction="center">
            {props.area.name}
          </Tooltip>
        )}
      </AreaPolygon>
      {/* {props.boulders && (
        <AreaBoulders
          key={`area-${props.area.id}-boulders`}
          area={props.area}
          onBoulderClick={props.onBoulderClick}
        />
      )} */}
    </LayerGroup>
  );
}
