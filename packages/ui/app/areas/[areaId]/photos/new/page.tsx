"use server";
import CreatePhotoForm from "@/app/_components/photos/CreatePhotoForm";
import createPhoto from "@/app/api/_actions/createPhoto";
import getAreaPhotos from "@/app/api/_actions/getAreaPhotos";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ areaId: number }>;
}) {
  const params = await props.params;
  const photoable = await getAreaPhotos(params.areaId);
  if (!photoable) notFound();

  return <CreatePhotoForm photoable={photoable} action={createPhoto} />;
}
