import AreaMap from "@/app/_components/map/AreaMap";
import blockMapClicks from "@/app/_util/blockMapClicks";
import useRouteTo from "@/app/_util/useRouteTo";
import { IArea } from "models";

interface Props {
  areas: IArea[];
  AreaMapProps?: Omit<React.ComponentProps<typeof AreaMap>, "area">;
}

/**
 * Map of all areas. Clicking on an area will route to that area by default
 */
export default function AreasMap(props: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true });
  return props.areas.map((area) => {
    return (
      <AreaMap
        key={area.name}
        area={area}
        onClick={(e) => {
          routeTo(`/area/${area.id}`);
          return blockMapClicks(e);
        }}
        {...props.AreaMapProps}
      />
    );
  });
}
