import BoulderIcon from "@/app/_components/map/BoulderIcon";
import type { LeafletMouseEvent } from "leaflet";
import { Area, Boulder } from "models";

interface Props {
  area: Area;
  onBoulderClick?: (boulder: Boulder, e: LeafletMouseEvent) => unknown;
}

export default function AreaBoulders(props: Props) {
  return (
    <span>
      {(props.area.boulders || []).map((thisBoulder: Boulder) => {
        return (
          <BoulderIcon
            position={thisBoulder.coordinates}
            key={thisBoulder.id}
            eventHandlers={{
              click: (e) => {
                props.onBoulderClick && props.onBoulderClick(thisBoulder, e);
              },
            }}
          />
        );
      })}
    </span>
  );
}
