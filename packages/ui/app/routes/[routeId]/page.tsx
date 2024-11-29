import RouteShowOverview from "@/app/_components/routes/RouteShowOverview";
import finderByID from "@/app/_util/finderByID";
import getRoute from "@/app/api/_actions/getRoute";

const getter = finderByID(getRoute);

export default async function Page(
  props: {
    params: Promise<{ routeId: string }>;
  }
) {
  const params = await props.params;
  const route = await getter(params.routeId)!;

  return <RouteShowOverview route={route} />;
}
