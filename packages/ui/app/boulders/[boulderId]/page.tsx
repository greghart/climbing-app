import BoulderShowOverview from "@/app/_components/boulders/BoulderShowOverview";
import finderByID from "@/app/_util/finderByID";
import getBoulder from "@/app/api/_actions/getBoulder";

const getter = finderByID(getBoulder);

export default async function Page({
  params,
}: {
  params: { boulderId: string };
}) {
  const boulder = await getter(params.boulderId)!;

  return <BoulderShowOverview boulder={boulder} />;
}
