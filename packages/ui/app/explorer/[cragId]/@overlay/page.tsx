import Breadcrumbs from "@/app/_components/overlay/Breadcrumbs";
import Drawer from "@/app/_components/overlay/Drawer";
import getCrag from "@/app/api/_operations/getCrag";
import { Crag } from "models";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({ params }: { params: { cragId: string } }) {
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return (
    <Drawer title={<Breadcrumbs crag={new Crag(crag)} />}>
      <div>...</div>
    </Drawer>
  );
}
