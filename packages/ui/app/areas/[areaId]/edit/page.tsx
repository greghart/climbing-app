"use server";

import AreaForm from "@/app/_components/areas/AreaForm";
import getArea from "@/app/api/_actions/getArea";
import updateArea from "@/app/api/_actions/updateArea";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { areaId: string } }) {
  const area = await getArea(params.areaId);
  if (!area) notFound();

  return (
    <AreaForm
      area={area}
      crag={area.crag!}
      action={updateArea}
      meta={{ id: area.id! }}
    />
  );
}
