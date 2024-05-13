import Boulder from "@/app/_components/explorer/overlay/Boulder";
import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import getBoulder from "@/app/api/_operations/getBoulder";
import { notFound } from "next/navigation";
import React from "react";

async function Load({ boulderId }: { boulderId: string }) {
  const boulder = await getBoulder(boulderId);
  if (!boulder) notFound();

  return (
    <Drawer
      crag={boulder.area!.crag!}
      title={
        <Breadcrumbs
          crag={boulder.area!.crag!}
          area={boulder.area!}
          boulder={boulder}
        />
      }
    >
      <Boulder boulder={boulder} />
    </Drawer>
  );
}
export default async function page({
  params,
}: {
  params: { boulderId: string };
}) {
  return (
    <React.Suspense fallback={<Drawer title="Loading...">Hello</Drawer>}>
      <Load boulderId={params.boulderId} />
    </React.Suspense>
  );
}
