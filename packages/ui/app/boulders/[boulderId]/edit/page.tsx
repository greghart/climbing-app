"use server";

import BoulderForm from "@/app/_components/boulders/BoulderForm";
import finderByID from "@/app/_util/finderByID";
import getBoulder from "@/app/api/_actions/getBoulder";
import updateBoulder from "@/app/api/_actions/updateBoulder";

const getter = finderByID(getBoulder);
export default async function Page({
  params,
}: {
  params: { boulderId: string };
}) {
  const boulder = await getter(params.boulderId);

  return (
    <BoulderForm
      boulder={boulder}
      crag={boulder.area!.crag!}
      action={updateBoulder}
      meta={{ id: boulder.id! }}
    />
  );
}
