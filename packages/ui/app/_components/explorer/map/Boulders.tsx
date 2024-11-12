import BoulderIcon from "@/app/_components/explorer/map/BoulderIcon";
import type { LeafletMouseEvent } from "leaflet";
import { IBoulder } from "models";

interface Props {
  boulders: IBoulder[];
  onBoulderClick?: (boulder: IBoulder, e: LeafletMouseEvent) => unknown;
}

export default function Boulders(props: Props) {
  return (props.boulders || []).map((thisBoulder: IBoulder) => (
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
