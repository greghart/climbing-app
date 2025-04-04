"use server";

import BoulderForm from "@/app/_components/boulders/BoulderForm";
import createBoulder from "@/app/api/_actions/createBoulder";
import getArea from "@/app/api/_actions/getArea";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ areaId: number }> }) {
  const params = await props.params;
  const area = await getArea(params.areaId);
  if (!area) notFound();

  return (
    <BoulderForm
      crag={area.crag!}
      area={area}
      action={createBoulder}
      meta={{ areaId: area.id! }}
    />
  );
}
