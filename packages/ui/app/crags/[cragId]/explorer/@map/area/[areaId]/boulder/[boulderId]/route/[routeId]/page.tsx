import getRoute from "@/app/api/_actions/getRoute";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

export default async function page({
  params,
}: {
  params: { routeId: string };
}) {
  const route = await getRoute(params.routeId);
  if (!route) notFound();

  return <ClientPage route={route} />;
}
