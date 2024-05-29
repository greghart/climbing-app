import CragShowOverview from "@/app/_components/crags/CragShowOverview";
import ShowLayout from "@/app/_components/show/ShowLayout";
import getCrag from "@/app/api/_operations/getCrag";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { cragId: string } }) {
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return (
    <ShowLayout
      headerProps={{
        title: crag.name,
        linkTo: `/crags/${crag.id}/explorer`,
      }}
      tabsProps={{
        basePath: `/crags/${crag.id}`,
      }}
    >
      <CragShowOverview crag={crag} />
    </ShowLayout>
  );
}
