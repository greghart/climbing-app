import getBoulder from "@/app/api/_actions/getBoulder";
import { notFound } from "next/navigation";
import ClientPage from "./ClientPage";

export default async function page(
  props: {
    params: Promise<{ boulderId: string }>;
  }
) {
  const params = await props.params;
  const boulder = await getBoulder(params.boulderId);
  if (!boulder) notFound();

  return <ClientPage boulder={boulder} />;
}
