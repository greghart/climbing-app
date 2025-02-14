"use server";

import ParkingForm from "@/app/_components/crags/ParkingForm";
import getCrag from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ cragId: string }>;
}) {
  const params = await props.params;
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return <ParkingForm crag={crag} meta={{ cragId: crag.id! }} />;
}
