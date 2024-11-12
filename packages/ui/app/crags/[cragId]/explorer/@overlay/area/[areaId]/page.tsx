import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Area from "@/app/_components/explorer/overlay/Area";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import finderByID from "@/app/_util/finderByID";
import getArea from "@/app/api/_actions/getArea";

const getter = finderByID(getArea);
export default async function page({ params }: { params: { areaId: string } }) {
  const area = await getter(params.areaId);

  return (
    <Drawer
      crag={area.crag!}
      title={<Breadcrumbs crag={area.crag!} area={area} />}
    >
      <Area area={area} />
    </Drawer>
  );
}
