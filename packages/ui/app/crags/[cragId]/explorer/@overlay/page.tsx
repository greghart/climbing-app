import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import getCrag from "@/app/api/_operations/getCrag";
import { notFound } from "next/navigation";
import React from "react";

async function Load(props: { cragId: string }) {
  const crag = await getCrag(props.cragId);
  if (!crag) notFound();

  return <Drawer crag={crag} title={<Breadcrumbs crag={crag} />}></Drawer>;
}
export default async function page({ params }: { params: { cragId: string } }) {
  return (
    <React.Suspense fallback={<div>Loading crag...</div>}>
      <Load cragId={params.cragId} />
    </React.Suspense>
  );
}
