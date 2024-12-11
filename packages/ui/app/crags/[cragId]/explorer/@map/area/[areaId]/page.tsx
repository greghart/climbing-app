import finderByID from "@/app/_util/finderByID";
import getArea from "@/app/api/_actions/getArea";
import { resolveCragTrail } from "@/app/api/_actions/getCragTrail";
import ClientPage from "./ClientPage";

const getter = finderByID(getArea);
export default async function page(props: { params: Promise<{ areaId: string }> }) {
  const params = await props.params;
  const area = await getter(params.areaId);
  const trail = await resolveCragTrail(area.crag!);

  return <ClientPage area={area} trail={trail} />;
}
