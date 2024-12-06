"use server";

import ShowPhotos from "@/app/_components/photos/ShowPhotos";
import getBoulderPhotos from "@/app/api/_actions/getBoulderPhotos";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ boulderId: number }>;
}) {
  const params = await props.params;
  const photoable = await getBoulderPhotos(params.boulderId);
  if (!photoable) notFound();

  return (
    <ShowPhotos
      newRoute={`/boulders/${params.boulderId}/photos/new`}
      photoable={photoable}
    />
  );
}
