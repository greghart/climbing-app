import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Boulder from "@/app/_components/explorer/overlay/Boulder";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import getBoulder from "@/app/api/_actions/getBoulder";
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
export default async function page(
  props: {
    params: Promise<{ boulderId: string }>;
  }
) {
  const params = await props.params;
  return (
    <React.Suspense fallback={<Drawer title="Loading...">Hello</Drawer>}>
      <Load boulderId={params.boulderId} />
    </React.Suspense>
  );
}
