"use server";
import CreatePhotoForm from "@/app/_components/photos/CreatePhotoForm";
import createPhoto from "@/app/api/_actions/createPhoto";
import getBoulderPhotos from "@/app/api/_actions/getBoulderPhotos";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ boulderId: number }>;
}) {
  const params = await props.params;
  const photoable = await getBoulderPhotos(params.boulderId);
  if (!photoable) notFound();

  return <CreatePhotoForm photoable={photoable} action={createPhoto} />;
}
