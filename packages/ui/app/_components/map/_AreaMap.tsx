import { type LeafletMouseEvent } from "leaflet";
import { IArea } from "models";
import { LayerGroup, Tooltip } from "react-leaflet";
import AreaPolygon from "./AreaPolygon";

type Props = {
  PolygonProps?: Partial<React.ComponentProps<typeof AreaPolygon>>;
  area: IArea;
  onClick?: (e: LeafletMouseEvent) => any;
  // Show the name tooltip of the area
  tooltip?: boolean;
};

export default function AreaMap({ tooltip = true, ...props }: Props) {
  if ((props.area.polygon?.coordinates?.length || 0) <= 0) {
    return <span />;
  }

  return (
    <LayerGroup>
      <AreaPolygon
        {...props.PolygonProps}
        key={`area-${props.area.id}-polygon`}
        eventHandlers={{
          ...(props.onClick ? { click: props.onClick } : {}),
        }}
        area={props.area}
      >
        {tooltip && (
          <Tooltip permanent={true} direction="center">
            {props.area.name}
          </Tooltip>
        )}
      </AreaPolygon>
    </LayerGroup>
  );
}
