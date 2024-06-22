import getArea from "@/app/api/_actions/getArea";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

export default async function page({ params }: { params: { areaId: string } }) {
  const area = await getArea(params.areaId);
  if (!area) notFound();

  return <ClientPage area={area} />;
}
