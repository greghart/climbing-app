import AreaShowOverview from "@/app/_components/areas/AreaShowOverview";
import finderByID from "@/app/_util/finderByID";
import getArea from "@/app/api/_actions/getArea";

const getter = finderByID(getArea);

export default async function Page(props: { params: Promise<{ areaId: string }> }) {
  const params = await props.params;
  const area = await getter(params.areaId)!;

  return <AreaShowOverview area={area} />;
}
