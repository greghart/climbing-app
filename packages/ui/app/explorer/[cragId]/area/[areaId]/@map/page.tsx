import React from "react";
import getArea from "@/app/api/_operations/getArea";
import { notFound } from "next/navigation";
import ClientPage from "@/app/explorer/[cragId]/area/[areaId]/@map/ClientPage";

export default async function page({ params }: { params: { areaId: string } }) {
  const area = await getArea(params.areaId);
  if (!area) notFound();

  return <ClientPage area={area} />;
}
