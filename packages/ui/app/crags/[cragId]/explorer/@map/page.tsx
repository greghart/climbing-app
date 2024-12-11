import getCrag from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

export default async function Page(props: { params: Promise<{ cragId: string }> }) {
  const params = await props.params;
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return <ClientPage crag={crag} />;
}
