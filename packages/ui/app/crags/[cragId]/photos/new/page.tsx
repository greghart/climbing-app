"use server";
import PhotoForm from "@/app/_components/photos/PhotoForm";
import createPhoto from "@/app/api/_actions/createPhoto";
import getCragPhotos from "@/app/api/_actions/getCragPhotos";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ cragId: number }>;
}) {
  const params = await props.params;
  const photoable = await getCragPhotos(params.cragId);
  if (!photoable) notFound();

  return <PhotoForm photoable={photoable} action={createPhoto} />;
}
