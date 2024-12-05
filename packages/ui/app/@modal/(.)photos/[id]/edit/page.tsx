import PhotoDialog from "@/app/_components/photos/PhotoDialog";
import finderByID from "@/app/_util/finderByID";
import getPhoto from "@/app/api/_actions/getPhoto";
import { notFound } from "next/navigation";

const getter = finderByID(getPhoto);
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const photo = await getter((await props.params).id)!;
  if (!photo) notFound();

  return <PhotoDialog photo={photo} />;
}
