import Area from "@/app/_components/explorer/overlay/Area";
import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import getArea from "@/app/api/_operations/getArea";
import * as models from "models";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({ params }: { params: { areaId: string } }) {
  const area = await getArea(params.areaId);
  if (!area) notFound();

  return (
    <Drawer title={<Breadcrumbs crag={area.crag!} area={area} />}>
      <Area area={area} />
    </Drawer>
  );
}
