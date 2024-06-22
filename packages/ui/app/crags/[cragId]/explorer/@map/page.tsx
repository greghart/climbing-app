import getCrag from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

export default async function Page({ params }: { params: { cragId: string } }) {
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  return <ClientPage crag={crag} />;
}
