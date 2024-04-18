import React from "react";
import getCrag from "@/app/api/_operations/getCrag";
import { notFound } from "next/navigation";
import Drawer from "@/app/_components/overlay/Drawer";

export default async function page({ params }: { params: { cragId: string } }) {
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return <Drawer title={crag.name}>...</Drawer>;
}
