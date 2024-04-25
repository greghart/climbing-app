import Route from "@/app/_components/explorer/overlay/Route";
import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import getRoute from "@/app/api/_operations/getRoute";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({
  params,
}: {
  params: { routeId: string };
}) {
  const route = await getRoute(params.routeId);
  if (!route) notFound();

  return (
    <Drawer
      title={
        <Breadcrumbs
          crag={route.boulder!.area!.crag!}
          area={route.boulder!.area!}
          boulder={route.boulder!}
          route={route}
        />
      }
    >
      <Route route={route} />
    </Drawer>
  );
}
