"use server";

import BoulderForm from "@/app/_components/boulders/BoulderForm";
import finderByID from "@/app/_util/finderByID";
import getArea from "@/app/api/_actions/getArea";
import getBoulder from "@/app/api/_actions/getBoulder";
import updateBoulder from "@/app/api/_actions/updateBoulder";

const getter = finderByID(getBoulder);
export default async function Page(props: {
  params: Promise<{ boulderId: string }>;
}) {
  const params = await props.params;
  const boulder = await getter(params.boulderId);
  const area = await getArea(boulder.area!.id!);

  return (
    <BoulderForm
      boulder={boulder}
      area={area!}
      crag={area!.crag!}
      action={updateBoulder}
      meta={{ id: boulder.id! }}
    />
  );
}
