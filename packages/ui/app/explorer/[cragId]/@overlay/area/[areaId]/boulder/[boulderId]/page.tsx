import Boulder from "@/app/_components/explorer/overlay/Boulder";
import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import { searchParamsCache } from "@/app/_components/explorer/searchParams";
import getBoulder from "@/app/api/_operations/getBoulder";
import * as models from "models";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({
  params,
  searchParams,
}: {
  params: { boulderId: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { overlay } = searchParamsCache.parse(searchParams);
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
          overlay={overlay}
        />
      }
    >
      <Boulder boulder={boulder} />
    </Drawer>
  );
}
