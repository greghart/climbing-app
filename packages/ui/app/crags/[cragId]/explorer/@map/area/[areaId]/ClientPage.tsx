"use client";
import AreaMap from "@/app/_components/map/AreaMap";
import usePolygonFit from "@/app/_components/map/usePolygonFit";
import blockClicks from "@/app/_util/blockClicks";
import { IArea } from "models";

export default function ClientPage({ area }: { area: IArea }) {
  usePolygonFit(area.polygon);

  return (
    <AreaMap area={area} showBoulders tooltip={false} onClick={blockClicks} />
  );
}
