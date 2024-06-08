import CragForm, { type FormData } from "@/app/_components/crags/CragForm";
import getCrag from "@/app/api/_operations/getCrag";
import updateCrag from "@/app/api/_operations/updateCrag";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { cragId: string } }) {
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  async function createCrag(data: FormData) {
    "use server";
    return updateCrag(crag!, data);
  }

  return <CragForm crag={crag} onValid={createCrag} />;
}
