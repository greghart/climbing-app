import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Crag from "@/app/_components/explorer/overlay/Crag";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import getCrag from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";

async function Load(props: { cragId: string }) {}

export default async function page(props: {
  params: Promise<{ cragId: string }>;
}) {
  const params = await props.params;
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return (
    <Drawer crag={crag} title={<Breadcrumbs crag={crag} />}>
      <Crag crag={crag} />
    </Drawer>
  );
}
