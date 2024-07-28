import AreaShowOverview from "@/app/_components/areas/AreaShowOverview";
import ShowLayout from "@/app/_components/show/ShowLayout";
import getArea from "@/app/api/_actions/getArea";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { areaId: string } }) {
  const area = await getArea(params.areaId);
  if (!area) notFound();

  return (
    <ShowLayout
      headerProps={{
        title: area.name,
        href: `/areas/${area.id}/explorer`,
      }}
      tabsProps={{
        basePath: `/areas/${area.id}`,
      }}
    >
      <AreaShowOverview area={area} />
    </ShowLayout>
  );
}
