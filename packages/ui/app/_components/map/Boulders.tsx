import BoulderIcon from "@/app/_components/map/BoulderIcon";
import type { LeafletMouseEvent } from "leaflet";
import { IBoulder } from "models";
import { Tooltip } from "react-leaflet";

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
    >
      <Tooltip direction="center">{thisBoulder.name}</Tooltip>
    </BoulderIcon>
  ));
}
