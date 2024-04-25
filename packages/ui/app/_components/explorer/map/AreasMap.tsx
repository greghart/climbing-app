import { Area } from "models";
import AreaMap from "@/app/_components/explorer/map/AreaMap";
import blockClicks from "@/app/_components/blockClicks";
import useRouteTo from "@/app/_components/useRouteTo";

interface Props {
  areas: Area[];
  // onAreaClick?: (area: Area, e: LeafletMouseEvent) => any;
}

export default function AreasMap(props: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true });
  return props.areas.map((area) => {
    return (
      <AreaMap
        key={area.name}
        {...props}
        area={area}
        onClick={(e) => {
          routeTo(`/area/${area.id}`);
          return blockClicks(e);
        }}
      />
    );
  });
}
