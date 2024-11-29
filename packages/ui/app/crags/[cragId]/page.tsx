import CragShowOverview from "@/app/_components/crags/CragShowOverview";
import ShowLayout from "@/app/_components/show/ShowLayout";
import getCrag from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ cragId: string }> }) {
  const params = await props.params;
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return (
    <ShowLayout
      headerProps={{
        title: crag.name,
        href: `/crags/${crag.id}/explorer`,
      }}
      tabsProps={{
        basePath: `/crags/${crag.id}`,
      }}
    >
      <CragShowOverview crag={crag} />
    </ShowLayout>
  );
}
