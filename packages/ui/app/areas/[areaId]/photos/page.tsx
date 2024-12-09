"use server";

import ShowPhotos from "@/app/_components/photos/ShowPhotos";
import getAreaPhotos from "@/app/api/_actions/getAreaPhotos";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ areaId: number }>;
}) {
  const params = await props.params;
  const photoable = await getAreaPhotos(params.areaId);
  if (!photoable) notFound();

  return (
    <ShowPhotos
      newRoute={`/areas/${params.areaId}/photos/new`}
      photoable={photoable}
    />
  );
}
