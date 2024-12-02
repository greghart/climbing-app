import getRoute from "@/app/api/_actions/getRoute";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

export default async function page(
  props: {
    params: Promise<{ routeId: string }>;
  }
) {
  const params = await props.params;
  const route = await getRoute(params.routeId);
  if (!route) notFound();

  return <ClientPage route={route} />;
}
