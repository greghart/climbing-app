import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import Route from "@/app/_components/explorer/overlay/Route";
import getRoute from "@/app/api/_operations/getRoute";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: { routeId: string };
}) {
  const route = await getRoute(params.routeId);
  if (!route) notFound();

  return (
    <Drawer
      crag={route.boulder!.area!.crag!}
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