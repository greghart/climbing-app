import { Area } from "models";
import { usePathname, useRouter } from "next/navigation";
import AreaMap from "@/app/_components/explorer/AreaMap";
import blockClicks from "@/app/_components/blockClicks";

interface Props {
  areas: Area[];
  // onAreaClick?: (area: Area, e: LeafletMouseEvent) => any;
}

export default function AreasMap(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  return props.areas.map((area) => {
    return (
      <AreaMap
        key={area.name}
        {...props}
        area={area}
        onClick={(e) => {
          router.push(`${pathname}/area/${area.id}`);
          return blockClicks(e);
        }}
      />
    );
  });
}
