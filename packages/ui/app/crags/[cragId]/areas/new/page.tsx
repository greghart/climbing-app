"use server";

import AreaForm from "@/app/_components/areas/AreaForm";
import createArea from "@/app/api/_actions/createArea";
import getCrag from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ cragId: string }>;
}) {
  const params = await props.params;
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return (
    <AreaForm crag={crag} action={createArea} meta={{ cragId: crag.id! }} />
  );
}
