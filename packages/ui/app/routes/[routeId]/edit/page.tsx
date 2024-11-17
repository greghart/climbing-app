"use server";

import RouteForm from "@/app/_components/routes/RouteForm";
import finderByID from "@/app/_util/finderByID";
import getRoute from "@/app/api/_actions/getRoute";
import updateRoute from "@/app/api/_actions/updateRoute";

const getter = finderByID(getRoute);
export default async function Page({
  params,
}: {
  params: { routeId: string };
}) {
  const route = await getter(params.routeId);

  return (
    <RouteForm route={route} action={updateRoute} meta={{ id: route.id! }} />
  );
}
