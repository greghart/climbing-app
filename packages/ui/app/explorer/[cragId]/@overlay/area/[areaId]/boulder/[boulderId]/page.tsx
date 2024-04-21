import React from "react";
import getBoulder from "@/app/api/_operations/getBoulder";
import { notFound } from "next/navigation";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import Boulder from "@/app/_components/explorer/overlay/Boulder";
import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import * as models from "models";

export default async function page({
  params,
}: {
  params: { boulderId: string };
}) {
  const boulder = await getBoulder(params.boulderId);
  if (!boulder) notFound();

  const boulder2 = new models.Boulder(boulder);
  return (
    <Drawer
      title={
        <Breadcrumbs
          crag={boulder2.area!.crag!}
          area={boulder2.area!}
          boulder={boulder2}
        />
      }
    >
      <Boulder boulder={boulder} />
    </Drawer>
  );
}
