"use server";
import CreatePhotoForm from "@/app/_components/photos/CreatePhotoForm";
import createPhoto from "@/app/api/_actions/createPhoto";
import getRoutePhotos from "@/app/api/_actions/getRoutePhotos";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ routeId: number }>;
}) {
  const params = await props.params;
  const photoable = await getRoutePhotos(params.routeId);
  if (!photoable) notFound();

  return <CreatePhotoForm photoable={photoable} action={createPhoto} />;
}
