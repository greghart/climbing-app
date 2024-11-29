"use server";

import TrailForm from "@/app/_components/crags/TrailForm";
import getCrag from "@/app/api/_actions/getCrag";
import updateCrag from "@/app/api/_actions/updateCrag";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ cragId: string }> }) {
  const params = await props.params;
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return (
    <TrailForm crag={crag} action={updateCrag} meta={{ cragId: crag.id! }} />
  );
}
