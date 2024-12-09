"use server";

import ShowPhotos from "@/app/_components/photos/ShowPhotos";
import getRoutePhotos from "@/app/api/_actions/getRoutePhotos";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ routeId: number }>;
}) {
  const params = await props.params;
  const photoable = await getRoutePhotos(params.routeId);
  if (!photoable) notFound();

  return (
    <ShowPhotos
      newRoute={`/routes/${params.routeId}/photos/new`}
      photoable={photoable}
    />
  );
}
