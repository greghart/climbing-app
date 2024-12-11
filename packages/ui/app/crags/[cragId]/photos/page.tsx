"use server";

import ShowPhotos from "@/app/_components/photos/ShowPhotos";
import getCragPhotos from "@/app/api/_actions/getCragPhotos";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ cragId: number }>;
}) {
  const params = await props.params;
  const photoable = await getCragPhotos(params.cragId);
  if (!photoable) notFound();

  return (
    <ShowPhotos
      newRoute={`/crags/${params.cragId}/photos/new`}
      photoable={photoable}
    />
  );
}
