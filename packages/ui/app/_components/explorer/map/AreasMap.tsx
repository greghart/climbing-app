import blockClicks from "@/app/_components/blockClicks";
import AreaMap from "@/app/_components/explorer/map/AreaMap";
import useRouteTo from "@/app/_components/useRouteTo";
import { Area } from "models";

interface Props {
  areas: Area[];
  AreaMapProps?: Omit<React.ComponentProps<typeof AreaMap>, "area">;
  // onAreaClick?: (area: Area, e: LeafletMouseEvent) => any;
}

export default function AreasMap(props: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true });
  return props.areas.map((area) => {
    return (
      <AreaMap
        key={area.name}
        area={area}
        onClick={(e) => {
          routeTo(`/area/${area.id}`);
          return blockClicks(e);
        }}
        {...props.AreaMapProps}
      />
    );
  });
}
