import Breadcrumbs from "@/app/_components/explorer/overlay/Breadcrumbs";
import Drawer from "@/app/_components/explorer/overlay/Drawer";
import getCrag from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";

async function Load(props: { cragId: string }) {
  const crag = await getCrag(props.cragId);
  if (!crag) notFound();

  return <Drawer crag={crag} title={<Breadcrumbs crag={crag} />}></Drawer>;
}
export default async function page({ params }: { params: { cragId: string } }) {
  return <Load cragId={params.cragId} />;
}
