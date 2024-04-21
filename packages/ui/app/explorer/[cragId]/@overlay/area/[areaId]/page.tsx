import Area from "@/app/_components/explorer/overlay/Area";
import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import { searchParamsCache } from "@/app/_components/explorer/searchParams";
import getArea from "@/app/api/_operations/getArea";
import * as models from "models";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({
  params,
  searchParams,
}: {
  params: { areaId: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { overlay } = searchParamsCache.parse(searchParams);
  const area = await getArea(params.areaId);
  if (!area) notFound();

  const crag = new models.Area(area).crag!;
  return (
    <Drawer
      title={
        <Breadcrumbs
          crag={crag}
          area={new models.Area(area)}
          overlay={overlay}
        />
      }
    >
      <Area area={area} />
    </Drawer>
  );
}
