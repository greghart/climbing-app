import React from "react";
import getArea from "@/app/api/_operations/getArea";
import { notFound } from "next/navigation";
import Drawer from "@/app/_components/overlay/Drawer";

export default async function page({ params }: { params: { areaId: string } }) {
  const area = await getArea(params.areaId);
  if (!area) notFound();

  return <Drawer title={area.name}>AREA</Drawer>;
}
