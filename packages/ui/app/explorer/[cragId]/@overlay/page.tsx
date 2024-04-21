import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import { searchParamsCache } from "@/app/_components/explorer/searchParams";
import getCrag from "@/app/api/_operations/getCrag";
import { Crag } from "models";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({
  params,
  searchParams,
}: {
  params: { cragId: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { overlay } = searchParamsCache.parse(searchParams);
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return (
    <Drawer title={<Breadcrumbs crag={new Crag(crag)} overlay={overlay} />}>
      <div>...</div>
    </Drawer>
  );
}
