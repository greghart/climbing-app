import { type LeafletMouseEvent } from "leaflet";
import { IArea } from "models";
import { LayerGroup, Tooltip } from "react-leaflet";
import AreaPolygon from "./AreaPolygon";
import Boulders from "./Boulders";

interface Props {
  area: IArea;
  onClick?: (e: LeafletMouseEvent) => any;
  // Show the polygon of the area
  polygon?: boolean;
  // Show the name tooltip of the area
  tooltip?: boolean;
  // Show boulders of this area
  showBoulders?: boolean;
  onBoulderClick?: React.ComponentProps<typeof Boulders>["onBoulderClick"];
}

export default function AreaMap({ tooltip = true, ...props }: Props) {
  if ((props.area.polygon?.coordinates?.length || 0) <= 0) {
    return <span />;
  }

  return (
    <LayerGroup>
      <AreaPolygon
        key={`area-${props.area.id}-polygon`}
        eventHandlers={{
          ...(props.onClick ? { click: props.onClick } : {}),
        }}
        area={props.area}
        show={props.polygon}
      >
        {tooltip && (
          <Tooltip permanent={true} direction="center">
            {props.area.name}
          </Tooltip>
        )}
      </AreaPolygon>
      <Boulders
        key={`area-${props.area.id}-boulders`}
        boulders={props.area.boulders || []}
        onBoulderClick={props.onBoulderClick}
      />
    </LayerGroup>
  );
}
