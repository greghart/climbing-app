"use server";

import AreaForm from "@/app/_components/areas/AreaForm";
import finderByID from "@/app/_util/finderByID";
import getArea from "@/app/api/_actions/getArea";
import updateArea from "@/app/api/_actions/updateArea";

const getter = finderByID(getArea);
export default async function Page(props: { params: Promise<{ areaId: string }> }) {
  const params = await props.params;
  const area = await getter(params.areaId);

  return (
    <AreaForm
      area={area}
      crag={area.crag!}
      action={updateArea}
      meta={{ id: area.id! }}
    />
  );
}
