import React from "react";
import getArea from "@/app/api/_operations/getArea";
import { notFound } from "next/navigation";
import Drawer from "@/app/_components/overlay/Drawer";
import Area from "@/app/_components/overlay/Area";
import Breadcrumbs from "@/app/_components/overlay/Breadcrumbs";
import * as models from "models";

export default async function page({ params }: { params: { areaId: string } }) {
  const area = await getArea(params.areaId);
  if (!area) notFound();

  const crag = new models.Area(area).crag!;
  return (
    <Drawer title={<Breadcrumbs crag={crag} area={new models.Area(area)} />}>
      <Area area={area} crag={crag} />
    </Drawer>
  );
}
