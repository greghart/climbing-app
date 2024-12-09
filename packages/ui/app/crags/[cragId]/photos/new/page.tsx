"use server";
import CreatePhotoForm from "@/app/_components/photos/CreatePhotoForm";
import createPhoto from "@/app/api/_actions/createPhoto";
import getCragPhotos from "@/app/api/_actions/getCragPhotos";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ cragId: number }>;
}) {
  const params = await props.params;
  const photoable = await getCragPhotos(params.cragId);
  if (!photoable) notFound();

  return <CreatePhotoForm photoable={photoable} action={createPhoto} />;
}
