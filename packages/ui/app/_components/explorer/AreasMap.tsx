import { Area } from "models";
// import type { LeafletMouseEvent } from "leaflet";
import AreaMap from "@/app/_components/explorer/AreaMap";

interface Props {
  areas: Area[];
  // onAreaClick?: (area: Area, e: LeafletMouseEvent) => any;
}

export default function AreasMap(props: Props) {
  console.warn("Areas", props);
  return props.areas.map((area) => {
    return (
      <AreaMap
        key={area.name}
        {...props}
        area={area}
        // onClick={props.onAreaClick && partial(props.onAreaClick, area)}
      />
    );
  });
}
