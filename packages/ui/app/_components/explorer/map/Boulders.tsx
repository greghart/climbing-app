import BoulderIcon from "@/app/_components/explorer/map/BoulderIcon";
import type { LeafletMouseEvent } from "leaflet";
import { Area, Boulder } from "models";

interface Props {
  boulders: Boulder[];
  onBoulderClick?: (boulder: Boulder, e: LeafletMouseEvent) => unknown;
}

export default function Boulders(props: Props) {
  return (props.boulders || []).map((thisBoulder: Boulder) => (
    <BoulderIcon
      position={thisBoulder.coordinates}
      key={thisBoulder.id}
      eventHandlers={{
        click: (e) => {
          props.onBoulderClick && props.onBoulderClick(thisBoulder, e);
        },
      }}
    />
  ));
}
